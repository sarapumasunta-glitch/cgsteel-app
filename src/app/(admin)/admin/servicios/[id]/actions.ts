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
  const video = formData.get("video") as File | null;
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
    .select("video_url")
    .eq("id", serviceId)
    .single();

  const updates: {
    name: string;
    description: string | null;
    active: boolean;
    display_order: number;
    video_url?: string | null;
  } = {
    name,
    description: emptyToNull(formData.get("description")),
    active,
    display_order: displayOrder,
  };

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

export async function addServiceImages(serviceId: string, formData: FormData) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("service_images")
    .select("display_order")
    .eq("service_id", serviceId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextOrder = existing ? existing.display_order + 1 : 0;

  const files = (formData.getAll("images") as File[]).filter(
    (file) => file && file.size > 0
  );
  if (files.length === 0) {
    return { error: "Selecciona al menos una foto." };
  }

  const uploadErrors: string[] = [];

  for (const file of files) {
    const path = `${serviceId}/gallery-${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("services")
      .upload(path, file);

    if (uploadError) {
      uploadErrors.push(uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from("services")
      .getPublicUrl(path);

    await supabase.from("service_images").insert({
      service_id: serviceId,
      image_url: publicUrlData.publicUrl,
      display_order: nextOrder++,
    });
  }

  revalidatePath(`/admin/servicios/${serviceId}`);
  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
  revalidatePath("/");

  if (uploadErrors.length > 0) {
    return { error: `Algunas fotos no se pudieron subir: ${uploadErrors.join(", ")}` };
  }
  return { success: true };
}

export async function deleteServiceImage(serviceId: string, imageId: string) {
  const supabase = createClient();

  const { data: image } = await supabase
    .from("service_images")
    .select("image_url")
    .eq("id", imageId)
    .single();

  const { error } = await supabase.from("service_images").delete().eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  const path = storagePathFromPublicUrl(image?.image_url ?? null);
  if (path) {
    await supabase.storage.from("services").remove([path]);
  }

  revalidatePath(`/admin/servicios/${serviceId}`);
  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
  revalidatePath("/");
  return { success: true };
}

export async function toggleServiceImageActive(
  serviceId: string,
  imageId: string,
  active: boolean
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("service_images")
    .update({ active })
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/servicios/${serviceId}`);
  revalidatePath("/servicios");
  revalidatePath("/");
  return { success: true };
}

export async function moveServiceImage(
  serviceId: string,
  imageId: string,
  direction: "up" | "down"
) {
  const supabase = createClient();

  const { data: images } = await supabase
    .from("service_images")
    .select("id, display_order")
    .eq("service_id", serviceId)
    .order("display_order");

  if (!images) {
    return { error: "No se pudo cargar el orden actual." };
  }

  const index = images.findIndex((img) => img.id === imageId);
  if (index === -1) {
    return { error: "Foto no encontrada." };
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= images.length) {
    return { success: true };
  }

  const current = images[index];
  const swapWith = images[swapIndex];

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase
      .from("service_images")
      .update({ display_order: swapWith.display_order })
      .eq("id", current.id),
    supabase
      .from("service_images")
      .update({ display_order: current.display_order })
      .eq("id", swapWith.id),
  ]);

  if (error1 || error2) {
    return { error: error1?.message ?? error2?.message };
  }

  revalidatePath(`/admin/servicios/${serviceId}`);
  revalidatePath("/servicios");
  revalidatePath("/");
  return { success: true };
}
