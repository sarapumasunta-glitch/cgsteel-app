import type { createClient } from "@/lib/supabase/server";
import type { ProjectGalleryItem } from "@/components/ProjectGalleryGrid";

export type ProjectStatus = "published" | "repository";

export const PROJECT_STATUSES: ProjectStatus[] = ["published", "repository"];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  published: "Publicado",
  repository: "Repositorio",
};

export const PROJECT_STATUS_BADGE_CLASSES: Record<ProjectStatus, string> = {
  published: "bg-green-100 text-green-700",
  repository: "bg-steel-gray/20 text-steel-gray",
};

// Reutilizado por /proyectos y por el resumen de "Proyectos destacados"
// del home, para no duplicar el fetch + transformación de
// projects/project_images en dos lugares.
export async function getPublishedProjectItems(
  supabase: ReturnType<typeof createClient>
): Promise<ProjectGalleryItem[]> {
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, project_images(id, image_url, width, height, display_order)")
    .eq("status", "published")
    .eq("active", true)
    .order("display_order");

  return (projects ?? [])
    .map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      images: [...(project.project_images ?? [])]
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => ({
          id: img.id,
          image_url: img.image_url,
          width: img.width,
          height: img.height,
        })),
    }))
    .filter((project) => project.images.length > 0);
}
