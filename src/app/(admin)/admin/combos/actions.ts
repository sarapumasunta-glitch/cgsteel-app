"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/combos/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function toggleComboActive(comboId: string, active: boolean) {
  const supabase = createClient();

  const { error } = await supabase.from("combos").update({ active }).eq("id", comboId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/combos");
  revalidatePath("/catalogo");
  return { success: true };
}

export async function deleteCombo(comboId: string) {
  const supabase = createClient();

  const { data: combo } = await supabase
    .from("combos")
    .select("image_url")
    .eq("id", comboId)
    .single();

  // combo_items se borra solo por el ON DELETE CASCADE de la FK a
  // combos; los productos referenciados NO se tocan (on delete restrict
  // solo aplica en la dirección product -> combo_items).
  const { error } = await supabase.from("combos").delete().eq("id", comboId);

  if (error) {
    return { error: error.message };
  }

  const path = storagePathFromPublicUrl(combo?.image_url ?? null);
  if (path) {
    await supabase.storage.from("combos").remove([path]);
  }

  revalidatePath("/admin/combos");
  revalidatePath("/catalogo");
  return { success: true };
}

export async function moveCombo(comboId: string, direction: "up" | "down") {
  const supabase = createClient();

  const { data: combos } = await supabase
    .from("combos")
    .select("id, display_order")
    .order("display_order");

  if (!combos) {
    return { error: "No se pudo cargar el orden actual." };
  }

  const index = combos.findIndex((combo) => combo.id === comboId);
  if (index === -1) {
    return { error: "Combo no encontrado." };
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= combos.length) {
    return { success: true };
  }

  const current = combos[index];
  const swapWith = combos[swapIndex];

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase
      .from("combos")
      .update({ display_order: swapWith.display_order })
      .eq("id", current.id),
    supabase
      .from("combos")
      .update({ display_order: current.display_order })
      .eq("id", swapWith.id),
  ]);

  if (error1 || error2) {
    return { error: error1?.message ?? error2?.message };
  }

  revalidatePath("/admin/combos");
  revalidatePath("/catalogo");
  return { success: true };
}
