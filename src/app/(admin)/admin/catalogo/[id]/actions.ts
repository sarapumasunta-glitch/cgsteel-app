"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/lib/products";
import type { TablesUpdate } from "@/lib/types/database.types";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/products/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

function toNullableNumber(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  if (str === "") return null;
  const num = Number(str);
  return isNaN(num) ? null : num;
}

export async function updateProduct(productId: string, formData: FormData) {
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

  const update: TablesUpdate<"products"> = {
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
  };

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(path, file);

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(path);
    update.image_url = publicUrlData.publicUrl;
  }

  const { error: updateError } = await supabase
    .from("products")
    .update(update)
    .eq("id", productId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/admin/catalogo");
  redirect(`/admin/catalogo/${productId}`);
}

export async function deleteProduct(productId: string) {
  const supabase = createClient();

  const { data: comboItems } = await supabase
    .from("combo_items")
    .select("combo_id")
    .eq("product_id", productId);

  const comboIds = [...new Set((comboItems ?? []).map((item) => item.combo_id))];

  if (comboIds.length > 0) {
    const { data: combos } = await supabase
      .from("combos")
      .select("name")
      .in("id", comboIds);
    const comboNames = (combos ?? []).map((combo) => combo.name);
    return {
      error: `No se puede eliminar: este producto está incluido en ${
        comboNames.length > 1 ? "los combos" : "el combo"
      } "${comboNames.join('", "')}". Quítalo del combo primero.`,
    };
  }

  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", productId)
    .single();

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  const path = storagePathFromPublicUrl(product?.image_url ?? null);
  if (path) {
    await supabase.storage.from("products").remove([path]);
  }

  redirect("/admin/catalogo");
}
