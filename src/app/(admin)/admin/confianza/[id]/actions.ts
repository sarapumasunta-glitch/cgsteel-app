"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/trust-items/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function updateTrustItem(itemId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const active = formData.get("active") === "on";
  const displayOrderRaw = String(formData.get("display_order") ?? "").trim();
  const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);
  const photo = formData.get("photo") as File | null;
  const removePhoto = formData.get("remove_photo") === "1";

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }
  if (isNaN(displayOrder)) {
    return { error: "El orden debe ser un número." };
  }

  const supabase = createClient();

  const { data: current } = await supabase
    .from("trust_items")
    .select("icon_or_photo_url")
    .eq("id", itemId)
    .single();

  const updates: {
    name: string;
    active: boolean;
    display_order: number;
    icon_or_photo_url?: string | null;
  } = {
    name: emptyToNull(formData.get("name")) ?? name,
    active,
    display_order: displayOrder,
  };

  if (photo && photo.size > 0) {
    const oldPath = storagePathFromPublicUrl(current?.icon_or_photo_url ?? null);
    if (oldPath) {
      await supabase.storage.from("trust-items").remove([oldPath]);
    }
    const path = `${crypto.randomUUID()}-${photo.name}`;
    const { error: uploadError } = await supabase.storage
      .from("trust-items")
      .upload(path, photo);
    if (uploadError) {
      return { error: uploadError.message };
    }
    const { data } = supabase.storage.from("trust-items").getPublicUrl(path);
    updates.icon_or_photo_url = data.publicUrl;
  } else if (removePhoto) {
    const oldPath = storagePathFromPublicUrl(current?.icon_or_photo_url ?? null);
    if (oldPath) {
      await supabase.storage.from("trust-items").remove([oldPath]);
    }
    updates.icon_or_photo_url = null;
  }

  const { error } = await supabase.from("trust_items").update(updates).eq("id", itemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/confianza");
  revalidatePath(`/admin/confianza/${itemId}`);
  revalidatePath("/nosotros");
  return { success: true };
}
