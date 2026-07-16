import { Constants } from "@/lib/types/database.types";

export type ProductCategory = (typeof Constants.public.Enums.product_category)[number];

export const PRODUCT_CATEGORIES = Constants.public.Enums.product_category;

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  arquitectura: "Arquitectura & Estructuras Metálicas",
  publicidad: "Publicidad & Señalización",
  decoracion: "Decoración & Mobiliario en Metal",
  eventos: "Eventos & Espacios Temporales",
};

export type DiscountType = "percentage" | "fixed";

export const DISCOUNT_TYPES: DiscountType[] = ["percentage", "fixed"];

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  percentage: "Porcentaje",
  fixed: "Monto fijo",
};

export function calculateDiscountedPrice(
  basePrice: number,
  discountType: DiscountType,
  discountValue: number
): number {
  const raw =
    discountType === "percentage"
      ? basePrice * (1 - discountValue / 100)
      : basePrice - discountValue;
  return Math.max(0, Math.round(raw * 100) / 100);
}

export function formatPrice(value: number) {
  return `$${value.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
