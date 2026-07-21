-- =====================================================================
-- Migración 0012: Fotos múltiples para productos y servicios
-- =====================================================================
-- Bug reportado: products.image_url y services.photo_url son un solo
-- campo, así que subir una foto nueva reemplaza la anterior en vez de
-- agregarse. Se replica el mismo patrón de projects/project_images
-- (migración 0008): una tabla de fotos por entidad, con su propio
-- active/display_order. Los campos viejos (image_url/photo_url) se
-- dejan sin usar por ahora, se limpian en otra sesión una vez
-- confirmado que todo funciona.
-- =====================================================================

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table service_images (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_product_images_product_id on product_images (product_id);
create index idx_product_images_display_order on product_images (display_order);
create index idx_service_images_service_id on service_images (service_id);
create index idx_service_images_display_order on service_images (display_order);

alter table product_images enable row level security;
alter table service_images enable row level security;

-- product_images sigue el mismo nivel de permiso que products (0006):
-- cualquier staff gestiona el catálogo, incluyendo fotos inactivas.
create policy "product_images_all_staff" on product_images for all
  using (is_staff()) with check (is_staff());

-- El público (anon) ve las fotos activas de productos activos.
create policy "product_images_select_public" on product_images for select
  to anon
  using (
    active = true
    and exists (
      select 1 from products
      where products.id = product_images.product_id
        and products.is_active = true
    )
  );

-- service_images sigue el mismo nivel de permiso que services (0010):
-- restringido a admin.
create policy "service_images_all_admin" on service_images for all
  using (is_admin()) with check (is_admin());

-- El público (anon) ve las fotos activas de servicios activos.
create policy "service_images_select_public" on service_images for select
  to anon
  using (
    active = true
    and exists (
      select 1 from services
      where services.id = service_images.service_id
        and services.active = true
    )
  );

-- ---------------------------------------------------------------------
-- Backfill: migra las fotos ya cargadas en image_url/photo_url a la
-- tabla nueva, para no perder lo que ya está subido.
-- ---------------------------------------------------------------------
insert into product_images (product_id, image_url, display_order, active)
select id, image_url, 0, true
from products
where image_url is not null;

insert into service_images (service_id, image_url, display_order, active)
select id, photo_url, 0, true
from services
where photo_url is not null;

-- ---------------------------------------------------------------------
-- Storage: reutiliza los buckets "products" (migración 0006) y
-- "services" (migración 0010), que ya tienen policies de
-- select/insert/update/delete para staff/admin respectivamente. No se
-- crea un bucket nuevo.
-- ---------------------------------------------------------------------
