"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

export async function createService(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const active = formData.get("active") === "on";
  const displayOrderRaw = String(formData.get("display_order") ?? "").trim();
  const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);
  const photo = formData.get("photo") as File | null;
  const video = formData.get("video") as File | null;

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }
  if (isNaN(displayOrder)) {
    return { error: "El orden debe ser un número." };
  }

  const supabase = createClient();

  const { data: service, error: insertError } = await supabase
    .from("services")
    .insert({
      name,
      description: emptyToNull(formData.get("description")),
      active,
      display_order: displayOrder,
    })
    .select("id")
    .single();

  if (insertError || !service) {
    return { error: insertError?.message ?? "No se pudo crear el servicio." };
  }

  const updates: { photo_url?: string; video_url?: string } = {};

  if (photo && photo.size > 0) {
    const path = `${service.id}/photo-${crypto.randomUUID()}-${photo.name}`;
    const { error: uploadError } = await supabase.storage
      .from("services")
      .upload(path, photo);
    if (!uploadError) {
      const { data } = supabase.storage.from("services").getPublicUrl(path);
      updates.photo_url = data.publicUrl;
    }
  }

  if (video && video.size > 0) {
    const path = `${service.id}/video-${crypto.randomUUID()}-${video.name}`;
    const { error: uploadError } = await supabase.storage
      .from("services")
      .upload(path, video);
    if (!uploadError) {
      const { data } = supabase.storage.from("services").getPublicUrl(path);
      updates.video_url = data.publicUrl;
    }
  }

  if (Object.keys(updates).length > 0) {
    await supabase.from("services").update(updates).eq("id", service.id);
  }

  redirect("/admin/servicios");
}
