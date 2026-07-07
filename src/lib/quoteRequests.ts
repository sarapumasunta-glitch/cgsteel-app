export type QuoteRequestStatus = "nuevo" | "contactado" | "convertido" | "descartado";

export const QUOTE_REQUEST_STATUSES: QuoteRequestStatus[] = [
  "nuevo",
  "contactado",
  "convertido",
  "descartado",
];

export const QUOTE_REQUEST_STATUS_LABELS: Record<QuoteRequestStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  convertido: "Convertido",
  descartado: "Descartado",
};

export const QUOTE_REQUEST_STATUS_BADGE_CLASSES: Record<QuoteRequestStatus, string> = {
  nuevo: "bg-industrial-orange/20 text-industrial-orange",
  contactado: "bg-blue-100 text-blue-700",
  convertido: "bg-green-100 text-green-700",
  descartado: "bg-steel-gray/20 text-steel-gray",
};
