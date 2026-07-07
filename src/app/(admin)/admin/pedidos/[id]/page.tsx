import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StatusChangeForm from "./StatusChangeForm";
import ExpedienteUpload from "./ExpedienteUpload";
import TrackingLink from "./TrackingLink";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_BADGE_CLASSES,
  ORDER_CHANNEL_LABELS,
  FILE_KIND_LABELS,
  formatCurrency,
  formatDate,
  type OrderStatus,
  type OrderChannel,
  type FileKind,
} from "@/lib/orders";

export default async function PedidoDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, clients(*)")
    .eq("id", params.id)
    .single();

  if (!order) {
    notFound();
  }

  const [{ data: history }, { data: files }] = await Promise.all([
    supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", params.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("order_files")
      .select("*")
      .eq("order_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/seguimiento/${order.tracking_token}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-industrial-blue">
            {order.order_number}
          </h1>
          <p className="mt-1 text-steel-gray">{order.description}</p>
        </div>
        <span
          className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
            ORDER_STATUS_BADGE_CLASSES[order.status as OrderStatus]
          }`}
        >
          {ORDER_STATUS_LABELS[order.status as OrderStatus]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="font-bold text-industrial-blue mb-4">
            Datos del pedido
          </h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-steel-gray">Canal</dt>
            <dd>{ORDER_CHANNEL_LABELS[order.channel as OrderChannel]}</dd>

            <dt className="text-steel-gray">Responsable</dt>
            <dd>{order.responsible ?? "—"}</dd>

            <dt className="text-steel-gray">Fecha de ingreso</dt>
            <dd>{formatDate(order.entry_date)}</dd>

            <dt className="text-steel-gray">Entrega estimada</dt>
            <dd>{formatDate(order.estimated_delivery_date)}</dd>

            <dt className="text-steel-gray">Entrega real</dt>
            <dd>{formatDate(order.actual_delivery_date)}</dd>

            <dt className="text-steel-gray">Valor estimado</dt>
            <dd>{formatCurrency(order.estimated_value)}</dd>

            <dt className="text-steel-gray">Costo estimado</dt>
            <dd>{formatCurrency(order.estimated_cost)}</dd>

            <dt className="text-steel-gray">Utilidad esperada</dt>
            <dd className="font-semibold">
              {formatCurrency(order.expected_profit)}
            </dd>

            {order.notes && (
              <>
                <dt className="text-steel-gray">Notas</dt>
                <dd>{order.notes}</dd>
              </>
            )}
          </dl>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="font-bold text-industrial-blue mb-4">Cliente</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-steel-gray">Contacto</dt>
            <dd>{order.clients?.contact_name ?? "—"}</dd>

            <dt className="text-steel-gray">Empresa</dt>
            <dd>{order.clients?.company_name ?? "—"}</dd>

            <dt className="text-steel-gray">RUC</dt>
            <dd>{order.clients?.ruc ?? "—"}</dd>

            <dt className="text-steel-gray">Teléfono</dt>
            <dd>{order.clients?.phone ?? "—"}</dd>

            <dt className="text-steel-gray">Email</dt>
            <dd>{order.clients?.email ?? "—"}</dd>

            <dt className="text-steel-gray">Dirección</dt>
            <dd>{order.clients?.address ?? "—"}</dd>
          </dl>
        </div>
      </div>

      <StatusChangeForm orderId={order.id} currentStatus={order.status as OrderStatus} />

      <div className="bg-white rounded shadow p-6">
        <TrackingLink url={trackingUrl} />
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold text-industrial-blue mb-4">
          Historial de avances
        </h2>
        <ul className="space-y-4">
          {(history ?? []).map((h) => (
            <li key={h.id} className="border-l-2 border-industrial-orange pl-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-carbon-black">
                  {ORDER_STATUS_LABELS[h.status as OrderStatus]}
                </span>
                {h.progress_percent !== null && (
                  <span className="text-xs bg-off-white px-2 py-0.5 rounded text-steel-gray">
                    {h.progress_percent}% de avance
                  </span>
                )}
              </div>
              {h.note && <p className="text-sm text-steel-gray mt-1">{h.note}</p>}
              <p className="text-xs text-steel-gray mt-1">
                {new Date(h.created_at).toLocaleString("es-EC")}
              </p>
            </li>
          ))}
          {(history ?? []).length === 0 && (
            <p className="text-steel-gray text-sm">Sin historial todavía.</p>
          )}
        </ul>
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold text-industrial-blue mb-4">Expediente</h2>
        <ExpedienteUpload orderId={order.id} />

        <ul className="mt-6 divide-y">
          {(files ?? []).map((f) => (
            <li key={f.id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <a
                  href={f.file_url}
                  target="_blank"
                  className="text-industrial-blue underline font-medium"
                >
                  {f.file_name}
                </a>
                <p className="text-xs text-steel-gray mt-0.5">
                  {FILE_KIND_LABELS[f.file_kind as FileKind]}
                  {f.description ? ` — ${f.description}` : ""}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded font-semibold ${
                  f.visible_to_client
                    ? "bg-green-100 text-green-700"
                    : "bg-steel-gray/20 text-steel-gray"
                }`}
              >
                {f.visible_to_client ? "Visible al cliente" : "Solo interno"}
              </span>
            </li>
          ))}
          {(files ?? []).length === 0 && (
            <p className="text-steel-gray text-sm py-3">
              No hay archivos en el expediente todavía.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
