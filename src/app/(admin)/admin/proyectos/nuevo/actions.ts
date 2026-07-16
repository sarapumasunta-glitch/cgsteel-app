"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatus } from "@/lib/projects";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

export async function createProject(formData: FormData) {
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

  const { data: project, error: insertError } = await supabase
    .from("projects")
    .insert({
      name,
      description: emptyToNull(formData.get("description")),
      status,
      active,
      display_order: displayOrder,
    })
    .select("id")
    .single();

  if (insertError || !project) {
    return { error: insertError?.message ?? "No se pudo crear el proyecto." };
  }

  const files = formData.getAll("images") as File[];
  let dimensions: { width: number; height: number }[] = [];
  try {
    dimensions = JSON.parse(String(formData.get("dimensions") ?? "[]"));
  } catch {
    dimensions = [];
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file || file.size === 0) continue;

    const path = `${project.id}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("projects")
      .upload(path, file);

    if (uploadError) continue;

    const { data: publicUrlData } = supabase.storage
      .from("projects")
      .getPublicUrl(path);

    const dim = dimensions[i];

    await supabase.from("project_images").insert({
      project_id: project.id,
      image_url: publicUrlData.publicUrl,
      width: dim?.width || null,
      height: dim?.height || null,
      display_order: i,
    });
  }

  redirect(`/admin/proyectos/${project.id}`);
}
