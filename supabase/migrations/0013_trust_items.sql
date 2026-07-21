-- =====================================================================
-- Migración 0013: Sección "Confían en nosotros" (página Nosotros)
-- =====================================================================
-- Tabla nueva para mostrar clientes/marcas/personas que confían en
-- Cg Steel Design en la página pública /nosotros. Mismo patrón de RLS
-- que hero_banner_items/projects/services (migraciones 0007, 0008,
-- 0010): solo admin escribe, público solo lee lo activo.
-- =====================================================================

create table trust_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_or_photo_url text,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_trust_items_active on trust_items (active);
create index idx_trust_items_display_order on trust_items (display_order);

alter table trust_items enable row level security;

create policy "trust_items_all_admin" on trust_items for all
  using (is_admin()) with check (is_admin());

-- El público (anon) solo ve items activos.
create policy "trust_items_select_public" on trust_items for select
  to anon
  using (active = true);

-- ---------------------------------------------------------------------
-- Storage: bucket "trust-items" (logos/fotos de clientes que confían)
-- ---------------------------------------------------------------------
-- Se incluye la policy de SELECT desde el inicio (igual que "services"
-- en la migración 0010): sin ella, storage.remove() no puede "ver" el
-- objeto para borrarlo bajo la sesión real de un usuario admin.
insert into storage.buckets (id, name, public)
values ('trust-items', 'trust-items', true)
on conflict (id) do nothing;

create policy "trust_items_bucket_select_admin" on storage.objects for select
  using (bucket_id = 'trust-items' and is_admin());

create policy "trust_items_bucket_insert_admin" on storage.objects for insert
  with check (bucket_id = 'trust-items' and is_admin());

create policy "trust_items_bucket_update_admin" on storage.objects for update
  using (bucket_id = 'trust-items' and is_admin());

create policy "trust_items_bucket_delete_admin" on storage.objects for delete
  using (bucket_id = 'trust-items' and is_admin());
