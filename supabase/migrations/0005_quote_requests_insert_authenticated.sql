-- =====================================================================
-- Migración 0005: Permitir que usuarios autenticados también envíen
-- solicitudes de cotización públicas
-- =====================================================================
-- La política original "quote_requests_insert_public" solo cubre el rol
-- anon. Si un visitante llega a /cotizar con una sesión activa (por
-- ejemplo, staff logueado probando el formulario, o un cliente que
-- también tiene cuenta), el insert se bloqueaba por RLS aunque el
-- formulario no requiere autenticación.
-- =====================================================================

drop policy if exists "quote_requests_insert_public" on quote_requests;

create policy "quote_requests_insert_public" on quote_requests for insert
  to anon, authenticated
  with check (true);
