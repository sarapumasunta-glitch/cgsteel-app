"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/services/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function updateService(serviceId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const active = formData.get("active") === "on";
  const displayOrderRaw = String(formData.get("display_order") ?? "").trim();
  const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);
  const photo = formData.get("photo") as File | null;
  const video = formData.get("video") as File | null;
  const removePhoto = formData.get("remove_photo") === "1";
  const removeVideo = formData.get("remove_video") === "1";

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }
  if (isNaN(displayOrder)) {
    return { error: "El orden debe ser un número." };
  }

  const supabase = createClient();

  const { data: current } = await supabase
    .from("services")
    .select("photo_url, video_url")
    .eq("id", serviceId)
    .single();

  const updates: {
    name: string;
    description: string | null;
    active: boolean;
    display_order: number;
    photo_url?: string | null;
    video_url?: string | null;
  } = {
    name,
    description: emptyToNull(formData.get("description")),
    active,
    display_order: displayOrder,
  };

  if (photo && photo.size > 0) {
    const oldPath = storagePathFromPublicUrl(current?.photo_url ?? null);
    if (oldPath) {
      await supabase.storage.from("services").remove([oldPath]);
    }
    const path = `${serviceId}/photo-${crypto.randomUUID()}-${photo.name}`;
    const { error: uploadError } = await supabase.storage
      .from("services")
      .upload(path, photo);
    if (uploadError) {
      return { error: uploadError.message };
    }
    const { data } = supabase.storage.from("services").getPublicUrl(path);
    updates.photo_url = data.publicUrl;
  } else if (removePhoto) {
    const oldPath = storagePathFromPublicUrl(current?.photo_url ?? null);
    if (oldPath) {
      await supabase.storage.from("services").remove([oldPath]);
    }
    updates.photo_url = null;
  }

  if (video && video.size > 0) {
    const oldPath = storagePathFromPublicUrl(current?.video_url ?? null);
    if (oldPath) {
      await supabase.storage.from("services").remove([oldPath]);
    }
    const path = `${serviceId}/video-${crypto.randomUUID()}-${video.name}`;
    const { error: uploadError } = await supabase.storage
      .from("services")
      .upload(path, video);
    if (uploadError) {
      return { error: uploadError.message };
    }
    const { data } = supabase.storage.from("services").getPublicUrl(path);
    updates.video_url = data.publicUrl;
  } else if (removeVideo) {
    const oldPath = storagePathFromPublicUrl(current?.video_url ?? null);
    if (oldPath) {
      await supabase.storage.from("services").remove([oldPath]);
    }
    updates.video_url = null;
  }

  const { error } = await supabase.from("services").update(updates).eq("id", serviceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/servicios");
  revalidatePath(`/admin/servicios/${serviceId}`);
  revalidatePath("/servicios");
  return { success: true };
}
