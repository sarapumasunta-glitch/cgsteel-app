export const WHATSAPP_NUMBER = "593983842395";
export const WHATSAPP_DISPLAY = "+593 98 384 2395";

export function buildWhatsAppUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
