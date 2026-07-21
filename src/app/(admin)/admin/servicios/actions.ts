"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/services/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function toggleServiceActive(serviceId: string, active: boolean) {
  const supabase = createClient();

  const { error } = await supabase
    .from("services")
    .update({ active })
    .eq("id", serviceId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
  return { success: true };
}

export async function deleteService(serviceId: string) {
  const supabase = createClient();

  const { data: service } = await supabase
    .from("services")
    .select("photo_url, video_url")
    .eq("id", serviceId)
    .single();

  const { data: images } = await supabase
    .from("service_images")
    .select("image_url")
    .eq("service_id", serviceId);

  const { error } = await supabase.from("services").delete().eq("id", serviceId);

  if (error) {
    return { error: error.message };
  }

  const paths = [
    service?.photo_url ?? null,
    service?.video_url ?? null,
    ...(images ?? []).map((img) => img.image_url),
  ]
    .map(storagePathFromPublicUrl)
    .filter((path): path is string => path !== null);

  if (paths.length > 0) {
    await supabase.storage.from("services").remove(paths);
  }

  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
  return { success: true };
}

export async function moveService(serviceId: string, direction: "up" | "down") {
  const supabase = createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id, display_order")
    .order("display_order");

  if (!services) {
    return { error: "No se pudo cargar el orden actual." };
  }

  const index = services.findIndex((service) => service.id === serviceId);
  if (index === -1) {
    return { error: "Servicio no encontrado." };
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= services.length) {
    return { success: true };
  }

  const current = services[index];
  const swapWith = services[swapIndex];

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase
      .from("services")
      .update({ display_order: swapWith.display_order })
      .eq("id", current.id),
    supabase
      .from("services")
      .update({ display_order: current.display_order })
      .eq("id", swapWith.id),
  ]);

  if (error1 || error2) {
    return { error: error1?.message ?? error2?.message };
  }

  revalidatePath("/admin/servicios");
  revalidatePath("/servicios");
  return { success: true };
}
