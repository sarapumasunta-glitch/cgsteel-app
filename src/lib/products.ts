import { Constants } from "@/lib/types/database.types";

export type ProductCategory = (typeof Constants.public.Enums.product_category)[number];

export const PRODUCT_CATEGORIES = Constants.public.Enums.product_category;

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  arquitectura: "Arquitectura & Estructuras Metálicas",
  publicidad: "Publicidad & Señalización",
  decoracion: "Decoración & Mobiliario en Metal",
  eventos: "Eventos & Espacios Temporales",
};
