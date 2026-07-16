import { createClient } from "@/lib/supabase/server";
import GalleryGrid from "@/components/GalleryGrid";
import ProjectGalleryGrid from "@/components/ProjectGalleryGrid";
import { GALLERY_IMAGES } from "@/lib/gallery";

export default async function Page() {
  const supabase = createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, project_images(id, image_url, width, height, display_order)")
    .eq("status", "published")
    .eq("active", true)
    .order("display_order");

  const projectItems = (projects ?? [])
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

  const hasDynamicProjects = projectItems.length > 0;

  return (
    <main className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Galería</h1>
      <p className="mt-4 text-brand-medium max-w-2xl">
        Un vistazo a nuestro taller y a los proyectos que hemos fabricado.
        Haz clic en cualquier {hasDynamicProjects ? "proyecto" : "foto"} para
        ampliarla.
      </p>

      <div className="mt-10">
        {hasDynamicProjects ? (
          <ProjectGalleryGrid projects={projectItems} />
        ) : (
          <GalleryGrid images={GALLERY_IMAGES} />
        )}
      </div>
    </main>
  );
}
