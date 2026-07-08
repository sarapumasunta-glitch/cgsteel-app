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

export async function updateProduct(productId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "") as ProductCategory;

  if (!name || !category) {
    return { error: "Nombre y categoría son obligatorios." };
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
