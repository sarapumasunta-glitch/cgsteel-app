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

  const { data: images } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", productId);

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  const paths = [product?.image_url ?? null, ...(images ?? []).map((img) => img.image_url)]
    .map(storagePathFromPublicUrl)
    .filter((path): path is string => path !== null);

  if (paths.length > 0) {
    await supabase.storage.from("products").remove(paths);
  }

  redirect("/admin/catalogo");
}

export async function addProductImages(productId: string, formData: FormData) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("product_images")
    .select("display_order")
    .eq("product_id", productId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextOrder = existing ? existing.display_order + 1 : 0;

  const files = (formData.getAll("images") as File[]).filter(
    (file) => file && file.size > 0
  );
  if (files.length === 0) {
    return { error: "Selecciona al menos una foto." };
  }

  const uploadErrors: string[] = [];

  for (const file of files) {
    const path = `${productId}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(path, file);

    if (uploadError) {
      uploadErrors.push(uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(path);

    await supabase.from("product_images").insert({
      product_id: productId,
      image_url: publicUrlData.publicUrl,
      display_order: nextOrder++,
    });
  }

  revalidatePath(`/admin/catalogo/${productId}`);
  revalidatePath("/admin/catalogo");
  revalidatePath("/catalogo");
  revalidatePath("/");

  if (uploadErrors.length > 0) {
    return { error: `Algunas fotos no se pudieron subir: ${uploadErrors.join(", ")}` };
  }
  return { success: true };
}

export async function deleteProductImage(productId: string, imageId: string) {
  const supabase = createClient();

  const { data: image } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("id", imageId)
    .single();

  const { error } = await supabase.from("product_images").delete().eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  const path = storagePathFromPublicUrl(image?.image_url ?? null);
  if (path) {
    await supabase.storage.from("products").remove([path]);
  }

  revalidatePath(`/admin/catalogo/${productId}`);
  revalidatePath("/admin/catalogo");
  revalidatePath("/catalogo");
  revalidatePath("/");
  return { success: true };
}

export async function toggleProductImageActive(
  productId: string,
  imageId: string,
  active: boolean
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("product_images")
    .update({ active })
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/catalogo/${productId}`);
  revalidatePath("/catalogo");
  revalidatePath("/");
  return { success: true };
}

export async function moveProductImage(
  productId: string,
  imageId: string,
  direction: "up" | "down"
) {
  const supabase = createClient();

  const { data: images } = await supabase
    .from("product_images")
    .select("id, display_order")
    .eq("product_id", productId)
    .order("display_order");

  if (!images) {
    return { error: "No se pudo cargar el orden actual." };
  }

  const index = images.findIndex((img) => img.id === imageId);
  if (index === -1) {
    return { error: "Foto no encontrada." };
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= images.length) {
    return { success: true };
  }

  const current = images[index];
  const swapWith = images[swapIndex];

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase
      .from("product_images")
      .update({ display_order: swapWith.display_order })
      .eq("id", current.id),
    supabase
      .from("product_images")
      .update({ display_order: current.display_order })
      .eq("id", swapWith.id),
  ]);

  if (error1 || error2) {
    return { error: error1?.message ?? error2?.message };
  }

  revalidatePath(`/admin/catalogo/${productId}`);
  revalidatePath("/catalogo");
  revalidatePath("/");
  return { success: true };
}
