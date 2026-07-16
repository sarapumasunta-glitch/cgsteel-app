import { createClient } from "@/lib/supabase/server";
import GalleryGrid from "@/components/GalleryGrid";
import ProjectGalleryGrid from "@/components/ProjectGalleryGrid";
import { GALLERY_IMAGES } from "@/lib/gallery";
import { getPublishedProjectItems } from "@/lib/projects";

export default async function Page() {
  const supabase = createClient();

  const projectItems = await getPublishedProjectItems(supabase);
  const hasDynamicProjects = projectItems.length > 0;

  return (
    <main className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Proyectos</h1>
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
