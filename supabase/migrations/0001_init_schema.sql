-- =====================================================================
-- CG STEEL DESIGN — Sistema de Gestión Comercial y Operativa
-- Migración 0001: Esquema inicial
-- =====================================================================
-- Convenciones:
--   - Todas las tablas usan uuid como PK (gen_random_uuid())
--   - created_at / updated_at en toda tabla operativa
--   - Enums para estados controlados (evita strings sueltos)
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- PERFILES (preparado para multi-rol futuro sin romper nada)
-- ---------------------------------------------------------------------
create type user_role as enum ('admin', 'ventas', 'produccion', 'contabilidad', 'supervisor');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'admin',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CRM DE CLIENTES
-- ---------------------------------------------------------------------
create table clients (
  id uuid primary key default gen_random_uuid(),
  company_name text,
  contact_name text not null,
  ruc text,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_clients_contact_name on clients (contact_name);
create index idx_clients_ruc on clients (ruc);

-- ---------------------------------------------------------------------
-- COTIZACIONES
-- ---------------------------------------------------------------------
create type quote_status as enum ('borrador', 'enviada', 'aprobada', 'rechazada', 'vencida');

create table quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,          -- ej: COT-2026-0001
  client_id uuid not null references clients(id) on delete restrict,
  status quote_status not null default 'borrador',
  valid_until date,
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  pdf_url text,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  subtotal numeric(12,2) generated always as (quantity * unit_price) stored,
  sort_order int not null default 0
);

create index idx_quote_items_quote_id on quote_items (quote_id);

-- ---------------------------------------------------------------------
-- PEDIDOS (módulo principal)
-- ---------------------------------------------------------------------
create type order_channel as enum (
  'pagina_web', 'whatsapp', 'llamada', 'referido',
  'cliente_frecuente', 'correo', 'visita_comercial'
);

create type order_status as enum (
  'pendiente', 'diseno', 'cotizado', 'aprobado', 'en_fabricacion',
  'pintura', 'control_calidad', 'listo_entrega', 'entregado', 'cancelado'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,          -- ej: PED-2026-0001
  client_id uuid not null references clients(id) on delete restrict,
  quote_id uuid references quotes(id) on delete set null,
  channel order_channel not null,
  status order_status not null default 'pendiente',

  description text not null,
  estimated_value numeric(12,2) not null default 0,   -- lo que se cobra
  estimated_cost numeric(12,2) not null default 0,    -- costo estimado
  expected_profit numeric(12,2) generated always as (estimated_value - estimated_cost) stored,

  responsible text,
  entry_date date not null default current_date,
  estimated_delivery_date date,
  actual_delivery_date date,

  -- acceso del cliente sin cuenta: token único no adivinable
  tracking_token text not null unique default encode(extensions.gen_random_bytes(16), 'hex'),

  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_client_id on orders (client_id);
create index idx_orders_status on orders (status);
create index idx_orders_channel on orders (channel);
create index idx_orders_tracking_token on orders (tracking_token);

-- Historial de avances (se registra automáticamente en cada cambio de estado)
create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status order_status not null,
  note text,
  progress_percent int check (progress_percent between 0 and 100),
  visible_to_client boolean not null default true,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index idx_order_status_history_order_id on order_status_history (order_id);

-- Expediente del proyecto: cotización, planos, fotos, facturas, certificados, etc.
create type file_kind as enum (
  'cotizacion', 'plano', 'foto_antes', 'foto_avance', 'foto_despues',
  'orden_compra', 'factura', 'comprobante', 'certificado', 'otro'
);

create table order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status_history_id uuid references order_status_history(id) on delete set null,
  file_kind file_kind not null default 'otro',
  file_url text not null,           -- ruta en Supabase Storage
  file_name text not null,
  description text,
  visible_to_client boolean not null default false,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index idx_order_files_order_id on order_files (order_id);

-- ---------------------------------------------------------------------
-- COMPRAS (para dashboard de costos)
-- ---------------------------------------------------------------------
create table purchases (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete set null,
  supplier_name text not null,
  material text not null,
  amount numeric(12,2) not null,
  purchase_date date not null default current_date,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index idx_purchases_order_id on purchases (order_id);
create index idx_purchases_date on purchases (purchase_date);

-- ---------------------------------------------------------------------
-- FINANZAS (ingresos/egresos simplificado para flujo de caja)
-- ---------------------------------------------------------------------
create type transaction_type as enum ('ingreso', 'egreso');

create table transactions (
  id uuid primary key default gen_random_uuid(),
  type transaction_type not null,
  category text not null,              -- ej: 'venta', 'material', 'nomina', 'servicios'
  amount numeric(12,2) not null,
  order_id uuid references orders(id) on delete set null,
  transaction_date date not null default current_date,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index idx_transactions_date on transactions (transaction_date);
create index idx_transactions_order_id on transactions (order_id);

-- ---------------------------------------------------------------------
-- SOLICITUDES PÚBLICAS DE COTIZACIÓN (formulario web, sin exponer tablas internas)
-- ---------------------------------------------------------------------
create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text,
  email text,
  phone text,
  description text not null,
  status text not null default 'nuevo',   -- 'nuevo' | 'contactado' | 'convertido'
  converted_client_id uuid references clients(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Trigger genérico para updated_at
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_clients_updated_at before update on clients
  for each row execute function set_updated_at();
create trigger trg_quotes_updated_at before update on quotes
  for each row execute function set_updated_at();
create trigger trg_orders_updated_at before update on orders
  for each row execute function set_updated_at();

-- Registrar automáticamente en el historial cada vez que cambia el estado de un pedido
create or replace function log_order_status_change()
returns trigger as $$
begin
  if (tg_op = 'INSERT') or (new.status is distinct from old.status) then
    insert into order_status_history (order_id, status, created_by)
    values (new.id, new.status, new.created_by);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_orders_status_history
  after insert or update of status on orders
  for each row execute function log_order_status_change();
