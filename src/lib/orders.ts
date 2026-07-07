import { Constants } from "@/lib/types/database.types";

export type OrderStatus = (typeof Constants.public.Enums.order_status)[number];
export type OrderChannel = (typeof Constants.public.Enums.order_channel)[number];
export type FileKind = (typeof Constants.public.Enums.file_kind)[number];

export const ORDER_STATUSES = Constants.public.Enums.order_status;
export const ORDER_CHANNELS = Constants.public.Enums.order_channel;
export const FILE_KINDS = Constants.public.Enums.file_kind;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  diseno: "Diseño",
  cotizado: "Cotizado",
  aprobado: "Aprobado",
  en_fabricacion: "En fabricación",
  pintura: "Pintura",
  control_calidad: "Control de calidad",
  listo_entrega: "Listo para entrega",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pendiente: "bg-steel-gray/20 text-steel-gray",
  diseno: "bg-blue-100 text-blue-700",
  cotizado: "bg-purple-100 text-purple-700",
  aprobado: "bg-teal-100 text-teal-700",
  en_fabricacion: "bg-industrial-orange/20 text-industrial-orange",
  pintura: "bg-amber-100 text-amber-700",
  control_calidad: "bg-indigo-100 text-indigo-700",
  listo_entrega: "bg-cyan-100 text-cyan-700",
  entregado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

export const ORDER_CHANNEL_LABELS: Record<OrderChannel, string> = {
  pagina_web: "Página web",
  whatsapp: "WhatsApp",
  llamada: "Llamada",
  referido: "Referido",
  cliente_frecuente: "Cliente frecuente",
  correo: "Correo",
  visita_comercial: "Visita comercial",
};

export const FILE_KIND_LABELS: Record<FileKind, string> = {
  cotizacion: "Cotización",
  plano: "Plano",
  foto_antes: "Foto antes",
  foto_avance: "Foto avance",
  foto_despues: "Foto después",
  orden_compra: "Orden de compra",
  factura: "Factura",
  comprobante: "Comprobante",
  certificado: "Certificado",
  otro: "Otro",
};

export function formatCurrency(value: number | string | null) {
  return Number(value ?? 0).toLocaleString("es-EC", {
    style: "currency",
    currency: "USD",
  });
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-EC", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
