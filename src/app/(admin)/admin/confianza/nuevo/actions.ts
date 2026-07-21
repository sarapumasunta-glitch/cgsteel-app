"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTrustItem(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const active = formData.get("active") === "on";
  const displayOrderRaw = String(formData.get("display_order") ?? "").trim();
  const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);
  const photo = formData.get("photo") as File | null;

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }
  if (isNaN(displayOrder)) {
    return { error: "El orden debe ser un número." };
  }

  const supabase = createClient();

  let iconOrPhotoUrl: string | null = null;
  if (photo && photo.size > 0) {
    const path = `${crypto.randomUUID()}-${photo.name}`;
    const { error: uploadError } = await supabase.storage
      .from("trust-items")
      .upload(path, photo);

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data } = supabase.storage.from("trust-items").getPublicUrl(path);
    iconOrPhotoUrl = data.publicUrl;
  }

  const { error: insertError } = await supabase.from("trust_items").insert({
    name,
    icon_or_photo_url: iconOrPhotoUrl,
    active,
    display_order: displayOrder,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  redirect("/admin/confianza");
}
