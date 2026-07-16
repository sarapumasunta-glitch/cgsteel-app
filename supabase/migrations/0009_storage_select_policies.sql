-- =====================================================================
-- Migración 0009: Políticas de SELECT faltantes en storage.objects
-- =====================================================================
-- Bug encontrado al verificar el módulo de proyectos: storage.remove()
-- necesita poder "ver" (SELECT) el objeto antes de poder borrarlo bajo
-- la sesión real de un usuario (no con la service role key, que
-- siempre bypassea RLS). Los buckets "products", "hero-banner" y
-- "projects" solo tenían policies de insert/update/delete — sin una
-- policy de select para admin/staff, remove() no encontraba ninguna
-- fila que borrar y fallaba en silencio (sin error, 0 filas afectadas).
-- =====================================================================

create policy "products_bucket_select_staff" on storage.objects for select
  using (bucket_id = 'products' and is_staff());

create policy "hero_banner_bucket_select_admin" on storage.objects for select
  using (bucket_id = 'hero-banner' and is_admin());

create policy "projects_bucket_select_admin" on storage.objects for select
  using (bucket_id = 'projects' and is_admin());
