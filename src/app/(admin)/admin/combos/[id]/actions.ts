"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/combos/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function updateCombo(comboId: string, formData: FormData) {
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

  const update: {
    name: string;
    description: string | null;
    combo_price: number;
    active: boolean;
    display_order: number;
    image_url?: string;
  } = {
    name,
    description: emptyToNull(formData.get("description")),
    combo_price: comboPrice,
    active,
    display_order: displayOrder,
  };

  if (file && file.size > 0) {
    const { data: current } = await supabase
      .from("combos")
      .select("image_url")
      .eq("id", comboId)
      .single();

    const oldPath = storagePathFromPublicUrl(current?.image_url ?? null);
    if (oldPath) {
      await supabase.storage.from("combos").remove([oldPath]);
    }

    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("combos")
      .upload(path, file);

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage.from("combos").getPublicUrl(path);
    update.image_url = publicUrlData.publicUrl;
  }

  const { error: updateError } = await supabase.from("combos").update(update).eq("id", comboId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Reconcilia combo_items: se borran todos y se reinsertan según lo
  // seleccionado en el formulario. Es una tabla de relación sin
  // historial propio, así que borrar+reinsertar es más simple y
  // suficientemente seguro que diffear.
  const { error: deleteItemsError } = await supabase
    .from("combo_items")
    .delete()
    .eq("combo_id", comboId);

  if (deleteItemsError) {
    return { error: deleteItemsError.message };
  }

  const { error: itemsError } = await supabase.from("combo_items").insert(
    items.map((item) => ({
      combo_id: comboId,
      product_id: item.product_id,
      quantity: item.quantity,
    }))
  );

  if (itemsError) {
    return { error: itemsError.message };
  }

  revalidatePath("/admin/combos");
  revalidatePath(`/admin/combos/${comboId}`);
  revalidatePath("/catalogo");
  redirect("/admin/combos");
}
