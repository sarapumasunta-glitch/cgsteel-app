"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { HeroBannerType } from "@/lib/heroBanner";

export async function createBannerItem(formData: FormData) {
  const type = String(formData.get("type") ?? "") as HeroBannerType;
  const displayOrderRaw = String(formData.get("display_order") ?? "").trim();
  const file = formData.get("media") as File | null;

  if (!type) {
    return { error: "Selecciona un tipo (foto o video)." };
  }
  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo." };
  }

  const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);
  if (isNaN(displayOrder)) {
    return { error: "El orden debe ser un número." };
  }

  const supabase = createClient();

  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("hero-banner")
    .upload(path, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from("hero-banner")
    .getPublicUrl(path);

  const { error: insertError } = await supabase.from("hero_banner_items").insert({
    type,
    media_url: publicUrlData.publicUrl,
    display_order: displayOrder,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  redirect("/admin/banner");
}
