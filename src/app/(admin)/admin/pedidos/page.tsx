import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PedidosFilters from "./PedidosFilters";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_BADGE_CLASSES,
  ORDER_CHANNEL_LABELS,
  formatCurrency,
  formatDate,
  type OrderStatus,
  type OrderChannel,
} from "@/lib/orders";

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: { estado?: string; canal?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("orders")
    .select("*, clients(contact_name, company_name)")
    .order("entry_date", { ascending: false });

  if (searchParams.estado) {
    query = query.eq("status", searchParams.estado as OrderStatus);
  }
  if (searchParams.canal) {
    query = query.eq("channel", searchParams.canal as OrderChannel);
  }

  const { data: orders } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">Pedidos</h1>
        <Link
          href="/admin/pedidos/nuevo"
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
        >
          Nuevo pedido
        </Link>
      </div>

      <div className="mt-4">
        <PedidosFilters />
      </div>

      <div className="mt-4 bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Canal</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Ingreso</th>
              <th className="px-4 py-3">Entrega estimada</th>
              <th className="px-4 py-3">Valor estimado</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr
                key={order.id}
                className="border-b last:border-0 hover:bg-off-white cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-carbon-black">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="block"
                  >
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/pedidos/${order.id}`} className="block">
                    {order.clients?.contact_name ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/pedidos/${order.id}`} className="block">
                    {ORDER_CHANNEL_LABELS[order.channel as OrderChannel]}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${order.id}`} className="block">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        ORDER_STATUS_BADGE_CLASSES[order.status as OrderStatus]
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/pedidos/${order.id}`} className="block">
                    {formatDate(order.entry_date)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/pedidos/${order.id}`} className="block">
                    {formatDate(order.estimated_delivery_date)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/pedidos/${order.id}`} className="block">
                    {formatCurrency(order.estimated_value)}
                  </Link>
                </td>
              </tr>
            ))}
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-steel-gray">
                  No hay pedidos que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
