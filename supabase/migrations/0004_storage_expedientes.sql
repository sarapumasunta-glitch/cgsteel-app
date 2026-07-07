-- =====================================================================
-- Migración 0004: Storage — expediente de pedidos
-- =====================================================================
-- Bucket público: la URL de un archivo es solo accesible si se conoce
-- (mismo modelo de "acceso por token no adivinable" que ya usa
-- tracking_token en orders). Solo el staff puede subir/editar/borrar
-- objetos; el portal público de seguimiento solo llega a los archivos
-- marcados visible_to_client = true a través de get_order_by_tracking.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('expedientes', 'expedientes', true)
on conflict (id) do nothing;

create policy "expedientes_select_staff" on storage.objects for select
  using (bucket_id = 'expedientes' and is_staff());

create policy "expedientes_insert_staff" on storage.objects for insert
  with check (bucket_id = 'expedientes' and is_staff());

create policy "expedientes_update_staff" on storage.objects for update
  using (bucket_id = 'expedientes' and is_staff());

create policy "expedientes_delete_staff" on storage.objects for delete
  using (bucket_id = 'expedientes' and is_staff());
