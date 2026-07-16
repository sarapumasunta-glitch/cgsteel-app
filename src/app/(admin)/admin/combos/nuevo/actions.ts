"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

export async function createCombo(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const active = formData.get("active") === "on";
  const comboPriceRaw = String(formData.get("combo_price") ?? "").trim();
  const comboPrice = Number(comboPriceRaw);
  const displayOrderRaw = String(formData.get("display_order") ?? "").trim();
  const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);
  const file = formData.get("image") as File | null;

  let items: { product_id: string; quantity: number }[] = [];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    items = [];
  }

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }
  if (comboPriceRaw === "" || isNaN(comboPrice)) {
    return { error: "El precio del combo es obligatorio y debe ser un número." };
  }
  if (isNaN(displayOrder)) {
    return { error: "El orden debe ser un número." };
  }
  if (items.length === 0) {
    return { error: "Selecciona al menos un producto para el combo." };
  }

  const supabase = createClient();

  let imageUrl: string | null = null;
  if (file && file.size > 0) {
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("combos")
      .upload(path, file);

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage.from("combos").getPublicUrl(path);
    imageUrl = publicUrlData.publicUrl;
  }

  const { data: combo, error: insertError } = await supabase
    .from("combos")
    .insert({
      name,
      description: emptyToNull(formData.get("description")),
      combo_price: comboPrice,
      image_url: imageUrl,
      active,
      display_order: displayOrder,
    })
    .select("id")
    .single();

  if (insertError || !combo) {
    return { error: insertError?.message ?? "No se pudo crear el combo." };
  }

  const { error: itemsError } = await supabase.from("combo_items").insert(
    items.map((item) => ({
      combo_id: combo.id,
      product_id: item.product_id,
      quantity: item.quantity,
    }))
  );

  if (itemsError) {
    return { error: itemsError.message };
  }

  redirect("/admin/combos");
}
