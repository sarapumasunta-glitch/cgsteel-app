"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatus } from "@/lib/projects";

export async function toggleProjectStatus(projectId: string, newStatus: ProjectStatus) {
  const supabase = createClient();

  const { error } = await supabase
    .from("projects")
    .update({ status: newStatus })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath("/");
  return { success: true };
}

export async function toggleProjectActive(projectId: string, active: boolean) {
  const supabase = createClient();

  const { error } = await supabase
    .from("projects")
    .update({ active })
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath("/");
  return { success: true };
}

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/projects/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function deleteProject(projectId: string) {
  const supabase = createClient();

  // Borra primero los archivos del bucket (la fila de project_images se
  // elimina sola por el ON DELETE CASCADE al borrar el proyecto, pero los
  // objetos de Storage no están gobernados por esa cascada de Postgres).
  // Se leen las rutas exactas desde project_images en vez de usar
  // storage.list(), que requeriría una policy de SELECT adicional sobre
  // storage.objects que no existe (solo insert/update/delete admin).
  const { data: images } = await supabase
    .from("project_images")
    .select("image_url")
    .eq("project_id", projectId);

  const paths = (images ?? [])
    .map((img) => storagePathFromPublicUrl(img.image_url))
    .filter((path): path is string => path !== null);

  if (paths.length > 0) {
    await supabase.storage.from("projects").remove(paths);
  }

  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath("/");
  return { success: true };
}
