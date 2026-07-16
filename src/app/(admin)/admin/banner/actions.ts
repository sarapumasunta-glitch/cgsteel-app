"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/hero-banner/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function toggleBannerItemActive(itemId: string, active: boolean) {
  const supabase = createClient();

  const { error } = await supabase
    .from("hero_banner_items")
    .update({ active })
    .eq("id", itemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/banner");
  revalidatePath("/");
  return { success: true };
}

export async function deleteBannerItem(itemId: string) {
  const supabase = createClient();

  const { data: item } = await supabase
    .from("hero_banner_items")
    .select("media_url")
    .eq("id", itemId)
    .single();

  const { error } = await supabase
    .from("hero_banner_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    return { error: error.message };
  }

  const path = storagePathFromPublicUrl(item?.media_url ?? null);
  if (path) {
    await supabase.storage.from("hero-banner").remove([path]);
  }

  revalidatePath("/admin/banner");
  revalidatePath("/");
  return { success: true };
}

export async function moveBannerItem(itemId: string, direction: "up" | "down") {
  const supabase = createClient();

  const { data: items } = await supabase
    .from("hero_banner_items")
    .select("id, display_order")
    .order("display_order");

  if (!items) {
    return { error: "No se pudo cargar el orden actual." };
  }

  const index = items.findIndex((item) => item.id === itemId);
  if (index === -1) {
    return { error: "Item no encontrado." };
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= items.length) {
    return { success: true };
  }

  const current = items[index];
  const swapWith = items[swapIndex];

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase
      .from("hero_banner_items")
      .update({ display_order: swapWith.display_order })
      .eq("id", current.id),
    supabase
      .from("hero_banner_items")
      .update({ display_order: current.display_order })
      .eq("id", swapWith.id),
  ]);

  if (error1 || error2) {
    return { error: error1?.message ?? error2?.message };
  }

  revalidatePath("/admin/banner");
  revalidatePath("/");
  return { success: true };
}
