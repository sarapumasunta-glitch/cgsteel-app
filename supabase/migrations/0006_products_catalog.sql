-- =====================================================================
-- Migración 0006: Catálogo de productos administrable
-- =====================================================================
-- Reemplaza el contenido estático de /catalogo por una tabla real,
-- editable desde el panel admin. Lectura pública limitada a productos
-- activos (is_active = true) para que el sitio público funcione sin
-- sesión, igual que ya hace quote_requests con su política "to anon".
-- =====================================================================

create type product_category as enum ('arquitectura', 'publicidad', 'decoracion', 'eventos');

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category product_category not null,
  description text,
  technical_details text,
  price_range text,
  image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on products (category);
create index idx_products_is_active on products (is_active);
create index idx_products_is_featured on products (is_featured);

create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

alter table products enable row level security;

-- Staff (tabla profiles) gestiona todo el catálogo, incluyendo productos inactivos.
create policy "products_all_staff" on products for all
  using (is_staff()) with check (is_staff());

-- El público (anon) solo ve productos activos.
create policy "products_select_public" on products for select
  to anon
  using (is_active = true);

-- ---------------------------------------------------------------------
-- Storage: bucket "products" (fotos del catálogo)
-- ---------------------------------------------------------------------
-- Bucket público (igual que "expedientes"): la URL pública del archivo
-- es accesible directamente sin pasar por RLS. Las políticas de
-- storage.objects de abajo solo gobiernan la API de Storage
-- (subir/editar/borrar), que queda restringida a staff.
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "products_bucket_insert_staff" on storage.objects for insert
  with check (bucket_id = 'products' and is_staff());

create policy "products_bucket_update_staff" on storage.objects for update
  using (bucket_id = 'products' and is_staff());

create policy "products_bucket_delete_staff" on storage.objects for delete
  using (bucket_id = 'products' and is_staff());
