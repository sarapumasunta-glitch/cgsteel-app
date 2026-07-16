-- =====================================================================
-- Migración 0011: Ofertas/descuentos por producto + combos
-- =====================================================================
-- Cambio aditivo sobre el catálogo existente. No toca quotes/quote_items:
-- esa tabla no tiene ninguna relación con products (los ítems de una
-- cotización son texto libre + precio manual, ver 0001_init_schema.sql),
-- así que nada de esto puede afectar el flujo de cotizaciones.
--
-- products no tenía ningún precio numérico (price_range es texto libre,
-- ej. "Desde $120", y hoy está en null en los 18 productos reales), así
-- que se agrega base_price como precio numérico opcional, separado de
-- price_range (que sigue igual, sin tocarse). El descuento se calcula
-- siempre en el momento de mostrarlo a partir de base_price — nunca se
-- sobreescribe ningún precio existente.
-- =====================================================================

alter table products
  add column base_price numeric,
  add column discount_type text check (discount_type in ('percentage', 'fixed')),
  add column discount_value numeric,
  add column discount_active boolean not null default false,
  add column discount_label text;

-- ---------------------------------------------------------------------
-- Combos (paquetes de varios productos a un precio fijo definido por
-- el admin, no calculado automáticamente de la suma de sus productos)
-- ---------------------------------------------------------------------
create table combos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  combo_price numeric not null,
  image_url text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_combos_active on combos (active);

create trigger trg_combos_updated_at before update on combos
  for each row execute function set_updated_at();

alter table combos enable row level security;

-- combos es una extensión directa del catálogo (products), gestionado
-- por el mismo staff que administra products (is_staff(), no is_admin():
-- ver comentario en 0007_hero_banner.sql sobre por qué el banner es más
-- restrictivo — combos no es contenido de marca, es catálogo comercial).
create policy "combos_all_staff" on combos for all
  using (is_staff()) with check (is_staff());

create policy "combos_select_public" on combos for select
  to anon
  using (active = true);

-- ---------------------------------------------------------------------
-- combo_items: qué productos y en qué cantidad componen cada combo.
-- on delete restrict en product_id: un producto que está dentro de
-- cualquier combo no se puede borrar directamente desde /admin/catalogo
-- (evita combos rotos). El admin debe quitarlo del combo primero. La
-- app además revisa esto antes de intentar el delete para mostrar un
-- mensaje claro con el nombre del combo, en vez de dejar que falle el
-- constraint con un error crudo de Postgres.
-- ---------------------------------------------------------------------
create table combo_items (
  id uuid primary key default gen_random_uuid(),
  combo_id uuid not null references combos(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  quantity int not null default 1
);

create index idx_combo_items_combo_id on combo_items (combo_id);
create index idx_combo_items_product_id on combo_items (product_id);

alter table combo_items enable row level security;

create policy "combo_items_all_staff" on combo_items for all
  using (is_staff()) with check (is_staff());

-- Lectura pública: solo ítems de combos activos (join implícito vía
-- subconsulta, ya que combo_items no tiene columna active propia).
create policy "combo_items_select_public" on combo_items for select
  to anon
  using (
    exists (
      select 1 from combos where combos.id = combo_items.combo_id and combos.active = true
    )
  );

-- ---------------------------------------------------------------------
-- Storage: bucket "combos" (fotos de los paquetes). Bucket separado del
-- de products, como pidió el negocio. Se incluye la policy de SELECT
-- desde el inicio (a diferencia de products/hero-banner/projects, que
-- la necesitaron agregar después en la migración 0009): sin ella,
-- storage.remove() no puede "ver" el objeto para borrarlo bajo la
-- sesión real de un usuario staff.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('combos', 'combos', true)
on conflict (id) do nothing;

create policy "combos_bucket_select_staff" on storage.objects for select
  using (bucket_id = 'combos' and is_staff());

create policy "combos_bucket_insert_staff" on storage.objects for insert
  with check (bucket_id = 'combos' and is_staff());

create policy "combos_bucket_update_staff" on storage.objects for update
  using (bucket_id = 'combos' and is_staff());

create policy "combos_bucket_delete_staff" on storage.objects for delete
  using (bucket_id = 'combos' and is_staff());
