import { createClient } from "@/lib/supabase/server";
import SolicitudesFilters from "./SolicitudesFilters";
import SolicitudRowActions from "./SolicitudRowActions";
import {
  QUOTE_REQUEST_STATUS_LABELS,
  QUOTE_REQUEST_STATUS_BADGE_CLASSES,
  type QuoteRequestStatus,
} from "@/lib/quoteRequests";
import { formatDate } from "@/lib/orders";

export default async function SolicitudesPage({
  searchParams,
}: {
  searchParams: { estado?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchParams.estado) {
    query = query.eq("status", searchParams.estado);
  }

  const { data: requests } = await query;

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">
        Solicitudes de cotización
      </h1>
      <p className="mt-1 text-steel-gray text-sm">
        Solicitudes enviadas desde el formulario público de cotización.
      </p>

      <div className="mt-4">
        <SolicitudesFilters />
      </div>

      <div className="mt-4 bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(requests ?? []).map((r) => (
              <tr key={r.id} className="border-b last:border-0 align-top">
                <td className="px-4 py-3 font-medium text-carbon-black">
                  {r.full_name}
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  {r.company_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <div>{r.email ?? "—"}</div>
                  <div>{r.phone ?? "—"}</div>
                </td>
                <td className="px-4 py-3 text-steel-gray max-w-xs">
                  {r.description}
                </td>
                <td className="px-4 py-3 text-steel-gray whitespace-nowrap">
                  {formatDate(r.created_at)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      QUOTE_REQUEST_STATUS_BADGE_CLASSES[r.status as QuoteRequestStatus]
                    }`}
                  >
                    {QUOTE_REQUEST_STATUS_LABELS[r.status as QuoteRequestStatus]}
                  </span>
                </td>
                <td className="px-4 py-3 min-w-[220px]">
                  <SolicitudRowActions
                    requestId={r.id}
                    status={r.status as QuoteRequestStatus}
                  />
                </td>
              </tr>
            ))}
            {(requests ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-steel-gray">
                  No hay solicitudes que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
