-- =====================================================================
-- Migración 0010: Sección "Servicios" administrable (sitio público)
-- =====================================================================
-- Tabla nueva e independiente para el contenido de la página pública
-- /servicios. No toca products, quotes, orders ni el enum
-- product_category — esas 4 líneas de negocio (business_line) siguen
-- exactamente igual en catálogo, cotizaciones y admin de productos.
-- Mismo patrón de RLS que hero_banner_items/projects (migraciones 0007
-- y 0008): solo admin escribe, público solo lee lo activo.
-- =====================================================================

create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  photo_url text,
  video_url text,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_services_active on services (active);
create index idx_services_display_order on services (display_order);

create trigger trg_services_updated_at before update on services
  for each row execute function set_updated_at();

alter table services enable row level security;

-- Solo admin gestiona servicios (is_admin() ya existe desde la
-- migración 0007_hero_banner.sql).
create policy "services_all_admin" on services for all
  using (is_admin()) with check (is_admin());

-- El público (anon) solo ve servicios activos.
create policy "services_select_public" on services for select
  to anon
  using (active = true);

-- ---------------------------------------------------------------------
-- Storage: bucket "services" (fotos/videos de la sección Servicios)
-- ---------------------------------------------------------------------
-- Se incluye la policy de SELECT desde el inicio (a diferencia de
-- products/hero-banner/projects, que la necesitaron agregar después en
-- la migración 0009): sin ella, storage.remove() no puede "ver" el
-- objeto para borrarlo bajo la sesión real de un usuario admin.
insert into storage.buckets (id, name, public)
values ('services', 'services', true)
on conflict (id) do nothing;

create policy "services_bucket_select_admin" on storage.objects for select
  using (bucket_id = 'services' and is_admin());

create policy "services_bucket_insert_admin" on storage.objects for insert
  with check (bucket_id = 'services' and is_admin());

create policy "services_bucket_update_admin" on storage.objects for update
  using (bucket_id = 'services' and is_admin());

create policy "services_bucket_delete_admin" on storage.objects for delete
  using (bucket_id = 'services' and is_admin());

-- ---------------------------------------------------------------------
-- Seed inicial: las 8 categorías de servicios
-- ---------------------------------------------------------------------
insert into services (name, description, display_order, active) values
  ('Mantenimiento Preventivo y Correctivo', 'Reparación de portones, cambio de techos dañados, soldadura de estructuras desgastadas y pintura de protección industrial.', 1, true),
  ('Mobiliario para Locales Comerciales', null, 2, true),
  ('Decoración y Arte en Metal', null, 3, true),
  ('Soldadura MIG (GMAW) y con Electrodo Revestido (SMAW)', null, 4, true),
  ('Diseño y Modelado en 3D', null, 5, true),
  ('Modelado de Estructuras y Planos Técnicos', null, 6, true),
  ('Montaje de Estructuras y Entrepisos', null, 7, true),
  ('Estructuras de Cubiertas y Cerchas', null, 8, true);
