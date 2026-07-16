"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatus } from "@/lib/projects";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/projects/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function updateProject(projectId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const status = String(formData.get("status") ?? "repository") as ProjectStatus;
  const active = formData.get("active") === "on";
  const displayOrderRaw = String(formData.get("display_order") ?? "").trim();
  const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }
  if (isNaN(displayOrder)) {
    return { error: "El orden debe ser un número." };
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      description: emptyToNull(formData.get("description")),
      status,
      active,
      display_order: displayOrder,
    })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/proyectos`);
  revalidatePath(`/admin/proyectos/${projectId}`);
  revalidatePath("/proyectos");
  revalidatePath("/");
  return { success: true };
}

export async function addProjectImages(projectId: string, formData: FormData) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("project_images")
    .select("display_order")
    .eq("project_id", projectId)
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

  let dimensions: { width: number; height: number }[] = [];
  try {
    dimensions = JSON.parse(String(formData.get("dimensions") ?? "[]"));
  } catch {
    dimensions = [];
  }

  const uploadErrors: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const path = `${projectId}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("projects")
      .upload(path, file);

    if (uploadError) {
      uploadErrors.push(uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from("projects")
      .getPublicUrl(path);

    const dim = dimensions[i];

    await supabase.from("project_images").insert({
      project_id: projectId,
      image_url: publicUrlData.publicUrl,
      width: dim?.width || null,
      height: dim?.height || null,
      display_order: nextOrder++,
    });
  }

  revalidatePath(`/admin/proyectos/${projectId}`);
  revalidatePath("/proyectos");
  revalidatePath("/");

  if (uploadErrors.length > 0) {
    return { error: `Algunas fotos no se pudieron subir: ${uploadErrors.join(", ")}` };
  }
  return { success: true };
}

export async function deleteProjectImage(projectId: string, imageId: string) {
  const supabase = createClient();

  const { data: image } = await supabase
    .from("project_images")
    .select("image_url")
    .eq("id", imageId)
    .single();

  const { error } = await supabase
    .from("project_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  const path = storagePathFromPublicUrl(image?.image_url ?? null);
  if (path) {
    await supabase.storage.from("projects").remove([path]);
  }

  revalidatePath(`/admin/proyectos/${projectId}`);
  revalidatePath("/proyectos");
  revalidatePath("/");
  return { success: true };
}

export async function moveProjectImage(
  projectId: string,
  imageId: string,
  direction: "up" | "down"
) {
  const supabase = createClient();

  const { data: images } = await supabase
    .from("project_images")
    .select("id, display_order")
    .eq("project_id", projectId)
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
      .from("project_images")
      .update({ display_order: swapWith.display_order })
      .eq("id", current.id),
    supabase
      .from("project_images")
      .update({ display_order: current.display_order })
      .eq("id", swapWith.id),
  ]);

  if (error1 || error2) {
    return { error: error1?.message ?? error2?.message };
  }

  revalidatePath(`/admin/proyectos/${projectId}`);
  revalidatePath("/proyectos");
  revalidatePath("/");
  return { success: true };
}
