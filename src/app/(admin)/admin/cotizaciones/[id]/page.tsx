import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuoteStatusForm from "./QuoteStatusForm";
import ConvertToOrderButton from "./ConvertToOrderButton";
import { formatCurrency, formatDate } from "@/lib/orders";
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_BADGE_CLASSES,
  type QuoteStatus,
} from "@/lib/quotes";

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

  const { data: items } = await supabase
    .from("quote_items")
    .select("*")
    .eq("quote_id", params.id)
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-industrial-blue">
            {quote.quote_number}
          </h1>
          <p className="mt-1 text-steel-gray">
            Cliente: {quote.clients?.contact_name ?? "—"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
              QUOTE_STATUS_BADGE_CLASSES[quote.status as QuoteStatus]
            }`}
          >
            {QUOTE_STATUS_LABELS[quote.status as QuoteStatus]}
          </span>
          <a
            href={`/api/cotizaciones/${quote.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
          >
            Generar PDF
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="font-bold text-industrial-blue mb-4">
            Datos de la cotización
          </h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-steel-gray">Fecha</dt>
            <dd>{formatDate(quote.created_at)}</dd>

            <dt className="text-steel-gray">Válida hasta</dt>
            <dd>{formatDate(quote.valid_until)}</dd>

            <dt className="text-steel-gray">Subtotal</dt>
            <dd>{formatCurrency(quote.subtotal)}</dd>

            <dt className="text-steel-gray">IVA</dt>
            <dd>{formatCurrency(quote.tax)}</dd>

            <dt className="text-steel-gray">Total</dt>
            <dd className="font-semibold">{formatCurrency(quote.total)}</dd>

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

            <dt className="text-steel-gray">RUC</dt>
            <dd>{quote.clients?.ruc ?? "—"}</dd>

            <dt className="text-steel-gray">Teléfono</dt>
            <dd>{quote.clients?.phone ?? "—"}</dd>

            <dt className="text-steel-gray">Email</dt>
            <dd>{quote.clients?.email ?? "—"}</dd>
          </dl>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold text-industrial-blue mb-4">Ítems</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="pb-2">Descripción</th>
              <th className="pb-2 text-right">Cant.</th>
              <th className="pb-2 text-right">P. Unitario</th>
              <th className="pb-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-2">{item.description}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.unit_price)}</td>
                <td className="py-2 text-right">
                  {formatCurrency(item.subtotal ?? item.quantity * item.unit_price)}
                </td>
              </tr>
            ))}
            {(items ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-steel-gray">
                  Sin ítems registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <QuoteStatusForm quoteId={quote.id} currentStatus={quote.status as QuoteStatus} />

      {quote.status === "aprobada" && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="font-bold text-industrial-blue mb-4">Convertir en pedido</h2>
          <p className="text-sm text-steel-gray mb-4">
            Esta cotización está aprobada. Puedes generar un pedido vinculado
            a partir de sus datos.
          </p>
          <ConvertToOrderButton quoteId={quote.id} />
        </div>
      )}
    </div>
  );
}
