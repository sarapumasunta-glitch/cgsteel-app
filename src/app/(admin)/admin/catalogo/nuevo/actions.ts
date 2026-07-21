"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/lib/products";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

function toNullableNumber(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  if (str === "") return null;
  const num = Number(str);
  return isNaN(num) ? null : num;
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "") as ProductCategory;
  const discountActive = formData.get("discount_active") === "on";
  const basePrice = toNullableNumber(formData.get("base_price"));
  const discountValue = toNullableNumber(formData.get("discount_value"));

  if (!name || !category) {
    return { error: "Nombre y categoría son obligatorios." };
  }
  if (discountActive && (basePrice === null || discountValue === null)) {
    return { error: "Para activar el descuento, ingresa precio base y valor del descuento." };
  }

  const supabase = createClient();

  const { data: product, error: insertError } = await supabase
    .from("products")
    .insert({
      name,
      category,
      description: emptyToNull(formData.get("description")),
      technical_details: emptyToNull(formData.get("technical_details")),
      price_range: emptyToNull(formData.get("price_range")),
      is_featured: formData.get("is_featured") === "on",
      is_active: formData.get("is_active") === "on",
      base_price: basePrice,
      discount_active: discountActive,
      discount_type: discountActive ? String(formData.get("discount_type") ?? "percentage") : null,
      discount_value: discountActive ? discountValue : null,
      discount_label: discountActive ? emptyToNull(formData.get("discount_label")) : null,
    })
    .select("id")
    .single();

  if (insertError || !product) {
    return { error: insertError?.message ?? "No se pudo crear el producto." };
  }

  redirect(`/admin/catalogo/${product.id}`);
}
