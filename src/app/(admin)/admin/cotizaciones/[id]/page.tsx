import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/orders";
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_BADGE_CLASSES,
  type QuoteStatus,
} from "@/lib/quotes";
import QuoteStatusForm from "./QuoteStatusForm";

export default async function CotizacionDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("*, clients(*)")
    .eq("id", params.id)
    .single();

  if (!quote) {
    notFound();
  }

  const [{ data: items }, { data: linkedOrder }] = await Promise.all([
    supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", params.id)
      .order("sort_order"),
    supabase
      .from("orders")
      .select("id, order_number")
      .eq("quote_id", params.id)
      .maybeSingle(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-industrial-blue">
            {quote.quote_number}
          </h1>
          <p className="mt-1 text-steel-gray">
            {quote.clients?.contact_name}
            {quote.clients?.company_name ? ` — ${quote.clients.company_name}` : ""}
          </p>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
            QUOTE_STATUS_BADGE_CLASSES[quote.status as QuoteStatus]
          }`}
        >
          {QUOTE_STATUS_LABELS[quote.status as QuoteStatus]}
        </span>
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold text-industrial-blue mb-4">Ítems</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="py-2">Descripción</th>
              <th className="py-2 text-right">Cantidad</th>
              <th className="py-2 text-right">Precio unit.</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-2">{item.description}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.unit_price)}</td>
                <td className="py-2 text-right">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <dl className="text-sm space-y-1 w-56">
            <div className="flex justify-between">
              <dt className="text-steel-gray">Subtotal</dt>
              <dd>{formatCurrency(quote.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel-gray">IVA</dt>
              <dd>{formatCurrency(quote.tax)}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt>Total</dt>
              <dd>{formatCurrency(quote.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="font-bold text-industrial-blue mb-4">Datos de la cotización</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-steel-gray">Válida hasta</dt>
            <dd>{formatDate(quote.valid_until)}</dd>

            <dt className="text-steel-gray">Creada</dt>
            <dd>{formatDate(quote.created_at)}</dd>

            {quote.notes && (
              <>
                <dt className="text-steel-gray">Notas</dt>
                <dd>{quote.notes}</dd>
              </>
            )}
          </dl>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="font-bold text-industrial-blue mb-4">Cliente</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-steel-gray">Contacto</dt>
            <dd>{quote.clients?.contact_name ?? "—"}</dd>

            <dt className="text-steel-gray">Empresa</dt>
            <dd>{quote.clients?.company_name ?? "—"}</dd>

            <dt className="text-steel-gray">Teléfono</dt>
            <dd>{quote.clients?.phone ?? "—"}</dd>

            <dt className="text-steel-gray">Email</dt>
            <dd>{quote.clients?.email ?? "—"}</dd>
          </dl>
        </div>
      </div>

      <QuoteStatusForm quoteId={quote.id} currentStatus={quote.status as QuoteStatus} />

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold text-industrial-blue mb-4">Pedido</h2>
        {linkedOrder ? (
          <p className="text-sm">
            Esta cotización ya generó el pedido{" "}
            <Link
              href={`/admin/pedidos/${linkedOrder.id}`}
              className="text-industrial-blue underline font-medium"
            >
              {linkedOrder.order_number}
            </Link>
            .
          </p>
        ) : quote.status === "aprobada" ? (
          <div>
            <p className="text-sm text-steel-gray mb-3">
              La cotización está aprobada. Puedes convertirla en un pedido.
            </p>
            <Link
              href={`/admin/pedidos/nuevo?client_id=${quote.client_id}&quote_id=${quote.id}`}
              className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded inline-block"
            >
              Convertir a pedido
            </Link>
          </div>
        ) : (
          <p className="text-sm text-steel-gray">
            La cotización debe estar aprobada para poder convertirla en pedido.
          </p>
        )}
      </div>
    </div>
  );
}
