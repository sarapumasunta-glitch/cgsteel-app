-- =====================================================================
-- Migración 0003: Portal de seguimiento del cliente
-- =====================================================================
-- El cliente NUNCA accede directamente a la tabla `orders` (está
-- protegida por RLS solo-staff). En su lugar, usa esta función
-- SECURITY DEFINER: recibe el tracking_token del enlace/código que le
-- dieron y devuelve únicamente los campos que debe ver, más el
-- historial y archivos marcados como visible_to_client = true.
--
-- Uso desde el frontend (anon key):
--   supabase.rpc('get_order_by_tracking', { p_token: '...' })
-- =====================================================================

create or replace function get_order_by_tracking(p_token text)
returns json as $$
declare
  v_order orders%rowtype;
  v_result json;
begin
  select * into v_order from orders where tracking_token = p_token;

  if not found then
    return json_build_object('error', 'not_found');
  end if;

  select json_build_object(
    'order_number', v_order.order_number,
    'description', v_order.description,
    'status', v_order.status,
    'entry_date', v_order.entry_date,
    'estimated_delivery_date', v_order.estimated_delivery_date,
    'actual_delivery_date', v_order.actual_delivery_date,
    'responsible', v_order.responsible,
    'history', (
      select coalesce(json_agg(h order by h.created_at), '[]'::json)
      from (
        select status, note, progress_percent, created_at
        from order_status_history
        where order_id = v_order.id and visible_to_client = true
        order by created_at
      ) h
    ),
    'files', (
      select coalesce(json_agg(f order by f.created_at), '[]'::json)
      from (
        select file_kind, file_url, file_name, description, created_at
        from order_files
        where order_id = v_order.id and visible_to_client = true
        order by created_at
      ) f
    )
  ) into v_result;

  return v_result;
end;
$$ language plpgsql security definer;

-- Permitir que usuarios anónimos (público del portal de seguimiento) ejecuten esta función
grant execute on function get_order_by_tracking(text) to anon;
