import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/orders";
import CotizacionesFilters from "./CotizacionesFilters";
import {
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_BADGE_CLASSES,
  type QuoteStatus,
} from "@/lib/quotes";

export default async function CotizacionesPage({
  searchParams,
}: {
  searchParams: { estado?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("quotes")
    .select("*, clients(contact_name, company_name)")
    .order("created_at", { ascending: false });

  if (searchParams.estado) {
    query = query.eq("status", searchParams.estado as QuoteStatus);
  }

  const { data: quotes } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">Cotizaciones</h1>
        <Link
          href="/admin/cotizaciones/nueva"
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
        >
          Nueva cotización
        </Link>
      </div>

      <div className="mt-4">
        <CotizacionesFilters />
      </div>

      <div className="mt-4 bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="px-4 py-3">Cotización</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {(quotes ?? []).map((quote) => (
              <tr
                key={quote.id}
                className="border-b last:border-0 hover:bg-off-white cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-carbon-black">
                  <Link href={`/admin/cotizaciones/${quote.id}`} className="block">
                    {quote.quote_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/cotizaciones/${quote.id}`} className="block">
                    {quote.clients?.contact_name ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/cotizaciones/${quote.id}`} className="block">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        QUOTE_STATUS_BADGE_CLASSES[quote.status as QuoteStatus]
                      }`}
                    >
                      {QUOTE_STATUS_LABELS[quote.status as QuoteStatus]}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/cotizaciones/${quote.id}`} className="block">
                    {formatCurrency(quote.total)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/cotizaciones/${quote.id}`} className="block">
                    {formatDate(quote.created_at)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/cotizaciones/${quote.id}`} className="block">
                    {formatDate(quote.valid_until)}
                  </Link>
                </td>
              </tr>
            ))}
            {(quotes ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-steel-gray">
                  No hay cotizaciones que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
