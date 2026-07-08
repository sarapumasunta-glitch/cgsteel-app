"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/lib/products";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "") as ProductCategory;

  if (!name || !category) {
    return { error: "Nombre y categoría son obligatorios." };
  }

  const supabase = createClient();

  let imageUrl: string | null = null;
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
    imageUrl = publicUrlData.publicUrl;
  }

  const { error: insertError } = await supabase.from("products").insert({
    name,
    category,
    description: emptyToNull(formData.get("description")),
    technical_details: emptyToNull(formData.get("technical_details")),
    price_range: emptyToNull(formData.get("price_range")),
    image_url: imageUrl,
    is_featured: formData.get("is_featured") === "on",
    is_active: formData.get("is_active") === "on",
  });

  if (insertError) {
    return { error: insertError.message };
  }

  redirect("/admin/catalogo");
}
