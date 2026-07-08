import { Constants } from "@/lib/types/database.types";

export type QuoteStatus = (typeof Constants.public.Enums.quote_status)[number];

export const QUOTE_STATUSES = Constants.public.Enums.quote_status;

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  vencida: "Vencida",
};

export const QUOTE_STATUS_BADGE_CLASSES: Record<QuoteStatus, string> = {
  borrador: "bg-steel-gray/20 text-steel-gray",
  enviada: "bg-blue-100 text-blue-700",
  aprobada: "bg-green-100 text-green-700",
  rechazada: "bg-red-100 text-red-700",
  vencida: "bg-amber-100 text-amber-700",
};

export const QUOTE_TAX_RATE = 0.15;
