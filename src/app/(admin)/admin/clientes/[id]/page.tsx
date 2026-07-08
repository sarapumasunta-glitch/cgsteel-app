import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  formatCurrency,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_BADGE_CLASSES,
  type OrderStatus,
} from "@/lib/orders";
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_BADGE_CLASSES,
  type QuoteStatus,
} from "@/lib/quotes";
import EditClientForm from "./EditClientForm";

export default async function ClienteDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!client) {
    notFound();
  }

  const [{ data: quotes }, { data: orders }] = await Promise.all([
    supabase
      .from("quotes")
      .select("id, quote_number, status, total, created_at")
      .eq("client_id", params.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("id, order_number, status, estimated_value, entry_date")
      .eq("client_id", params.id)
      .order("entry_date", { ascending: false }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-industrial-blue">
          {client.contact_name}
        </h1>
        {client.company_name && (
          <p className="mt-1 text-steel-gray">{client.company_name}</p>
        )}
      </div>

      <EditClientForm client={client} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-industrial-blue">Cotizaciones</h2>
            <Link
              href={`/admin/cotizaciones/nueva?client_id=${client.id}`}
              className="text-sm text-industrial-blue underline"
            >
              + Nueva cotización
            </Link>
          </div>
          <ul className="divide-y">
            {(quotes ?? []).map((quote) => (
              <li key={quote.id} className="py-3 flex items-center justify-between gap-4">
                <Link
                  href={`/admin/cotizaciones/${quote.id}`}
                  className="text-industrial-blue underline font-medium"
                >
                  {quote.quote_number}
                </Link>
                <span
                  className={`text-xs px-2 py-1 rounded font-semibold ${
                    QUOTE_STATUS_BADGE_CLASSES[quote.status as QuoteStatus]
                  }`}
                >
                  {QUOTE_STATUS_LABELS[quote.status as QuoteStatus]}
                </span>
                <span className="text-sm text-steel-gray">
                  {formatCurrency(quote.total)}
                </span>
              </li>
            ))}
            {(quotes ?? []).length === 0 && (
              <p className="text-sm text-steel-gray py-3">
                Este cliente no tiene cotizaciones todavía.
              </p>
            )}
          </ul>
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-industrial-blue">Pedidos</h2>
            <Link
              href={`/admin/pedidos/nuevo?client_id=${client.id}`}
              className="text-sm text-industrial-blue underline"
            >
              + Nuevo pedido
            </Link>
          </div>
          <ul className="divide-y">
            {(orders ?? []).map((order) => (
              <li key={order.id} className="py-3 flex items-center justify-between gap-4">
                <Link
                  href={`/admin/pedidos/${order.id}`}
                  className="text-industrial-blue underline font-medium"
                >
                  {order.order_number}
                </Link>
                <span
                  className={`text-xs px-2 py-1 rounded font-semibold ${
                    ORDER_STATUS_BADGE_CLASSES[order.status as OrderStatus]
                  }`}
                >
                  {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                </span>
                <span className="text-sm text-steel-gray">
                  {formatCurrency(order.estimated_value)}
                </span>
              </li>
            ))}
            {(orders ?? []).length === 0 && (
              <p className="text-sm text-steel-gray py-3">
                Este cliente no tiene pedidos todavía.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
