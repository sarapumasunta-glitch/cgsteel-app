-- =====================================================================
-- Migración 0002: Row Level Security
-- =====================================================================
-- Principio: por defecto TODO cerrado. Solo usuarios autenticados con
-- perfil (profiles) pueden operar el panel interno. El público (anon)
-- solo puede: insertar en quote_requests, y leer datos de un pedido
-- a través de la función segura get_order_by_tracking (migración 0003),
-- nunca directamente sobre la tabla orders.
-- =====================================================================

alter table profiles enable row level security;
alter table clients enable row level security;
alter table quotes enable row level security;
alter table quote_items enable row level security;
alter table orders enable row level security;
alter table order_status_history enable row level security;
alter table order_files enable row level security;
alter table purchases enable row level security;
alter table transactions enable row level security;
alter table quote_requests enable row level security;

-- Helper: ¿el usuario autenticado tiene perfil (es staff interno)?
create or replace function is_staff()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid());
$$ language sql stable security definer;

-- profiles: cada quien ve/edita su propio perfil; todo el staff puede leer la lista
create policy "profiles_select_staff" on profiles for select
  using (is_staff());
create policy "profiles_update_self" on profiles for update
  using (id = auth.uid());

-- Tablas internas: solo staff (primera versión = solo admin, pero ya
-- queda listo para 'ventas', 'produccion', etc. sin tocar políticas)
create policy "clients_all_staff" on clients for all
  using (is_staff()) with check (is_staff());

create policy "quotes_all_staff" on quotes for all
  using (is_staff()) with check (is_staff());

create policy "quote_items_all_staff" on quote_items for all
  using (is_staff()) with check (is_staff());

create policy "orders_all_staff" on orders for all
  using (is_staff()) with check (is_staff());

create policy "order_status_history_all_staff" on order_status_history for all
  using (is_staff()) with check (is_staff());

create policy "order_files_all_staff" on order_files for all
  using (is_staff()) with check (is_staff());

create policy "purchases_all_staff" on purchases for all
  using (is_staff()) with check (is_staff());

create policy "transactions_all_staff" on transactions for all
  using (is_staff()) with check (is_staff());

-- quote_requests: el público (anon) puede INSERTAR (formulario web),
-- pero solo el staff puede leer/gestionar las solicitudes
create policy "quote_requests_insert_public" on quote_requests for insert
  to anon
  with check (true);

create policy "quote_requests_select_staff" on quote_requests for select
  using (is_staff());

create policy "quote_requests_update_staff" on quote_requests for update
  using (is_staff());
