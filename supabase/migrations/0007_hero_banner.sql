-- =====================================================================
-- Migración 0007: Banner superior administrable (hero)
-- =====================================================================
-- Reemplaza el hero de texto fijo del home por un banner administrable:
-- el staff sube fotos (carrusel) o un video desde el panel admin. Lectura
-- pública solo de items activos, mismo patrón que products (migración 0006).
-- =====================================================================

create table hero_banner_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('video', 'image')),
  media_url text not null,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_hero_banner_items_active on hero_banner_items (active);
create index idx_hero_banner_items_display_order on hero_banner_items (display_order);

alter table hero_banner_items enable row level security;

-- Helper: ¿el usuario autenticado tiene rol admin? El banner del home es
-- un elemento sensible de marca, así que a diferencia de products (donde
-- cualquier staff puede editar), aquí se restringe explícitamente a admin.
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- Solo admin gestiona el banner, incluyendo items inactivos.
create policy "hero_banner_items_all_admin" on hero_banner_items for all
  using (is_admin()) with check (is_admin());

-- El público (anon) solo ve items activos.
create policy "hero_banner_items_select_public" on hero_banner_items for select
  to anon
  using (active = true);

-- ---------------------------------------------------------------------
-- Storage: bucket "hero-banner" (fotos/videos del banner superior)
-- ---------------------------------------------------------------------
-- Bucket público (mismo modelo que "products" y "expedientes"): la URL
-- pública del archivo es accesible directamente sin pasar por RLS. Las
-- políticas de storage.objects de abajo solo gobiernan la API de Storage
-- (subir/editar/borrar), restringida a staff.
insert into storage.buckets (id, name, public)
values ('hero-banner', 'hero-banner', true)
on conflict (id) do nothing;

create policy "hero_banner_bucket_insert_admin" on storage.objects for insert
  with check (bucket_id = 'hero-banner' and is_admin());

create policy "hero_banner_bucket_update_admin" on storage.objects for update
  using (bucket_id = 'hero-banner' and is_admin());

create policy "hero_banner_bucket_delete_admin" on storage.objects for delete
  using (bucket_id = 'hero-banner' and is_admin());
