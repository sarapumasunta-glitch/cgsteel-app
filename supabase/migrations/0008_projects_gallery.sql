-- =====================================================================
-- Migración 0008: Proyectos realizados (galería administrable)
-- =====================================================================
-- Reemplaza las 32 fotos estáticas de /galeria por proyectos reales
-- administrables desde el panel admin, cada uno con varias fotos.
-- Mismo patrón de RLS que hero_banner_items (migración 0007): solo
-- admin escribe, público solo lee proyectos publicados y activos.
-- =====================================================================

create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text not null default 'repository' check (status in ('published', 'repository')),
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  -- width/height (no pedidos explícitamente en el requerimiento): se
  -- capturan en el navegador al momento de subir la foto y se guardan
  -- aquí para que el lightbox público pueda mostrar cada imagen con su
  -- proporción real sin deformarla, igual que ya hace GALLERY_IMAGES
  -- para las fotos estáticas actuales.
  width int,
  height int,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_projects_status on projects (status);
create index idx_projects_active on projects (active);
create index idx_project_images_project_id on project_images (project_id);
create index idx_project_images_display_order on project_images (display_order);

create trigger trg_projects_updated_at before update on projects
  for each row execute function set_updated_at();

alter table projects enable row level security;
alter table project_images enable row level security;

-- Solo admin gestiona proyectos y fotos (is_admin() ya existe desde la
-- migración 0007_hero_banner.sql).
create policy "projects_all_admin" on projects for all
  using (is_admin()) with check (is_admin());

create policy "project_images_all_admin" on project_images for all
  using (is_admin()) with check (is_admin());

-- El público (anon) solo ve proyectos publicados y activos.
create policy "projects_select_public" on projects for select
  to anon
  using (status = 'published' and active = true);

-- El público (anon) ve las fotos de esos proyectos (espejo de la policy
-- de arriba, vía join con projects).
create policy "project_images_select_public" on project_images for select
  to anon
  using (
    exists (
      select 1 from projects
      where projects.id = project_images.project_id
        and projects.status = 'published'
        and projects.active = true
    )
  );

-- ---------------------------------------------------------------------
-- Storage: bucket "projects" (fotos de proyectos realizados)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('projects', 'projects', true)
on conflict (id) do nothing;

create policy "projects_bucket_insert_admin" on storage.objects for insert
  with check (bucket_id = 'projects' and is_admin());

create policy "projects_bucket_update_admin" on storage.objects for update
  using (bucket_id = 'projects' and is_admin());

create policy "projects_bucket_delete_admin" on storage.objects for delete
  using (bucket_id = 'projects' and is_admin());
