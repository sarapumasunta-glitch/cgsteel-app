import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditProjectForm from "./EditProjectForm";
import ProjectPhotoGallery from "./ProjectPhotoGallery";
import AddPhotosForm from "./AddPhotosForm";

export default async function EditarProyectoPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!project) {
    notFound();
  }

  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", params.id)
    .order("display_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-industrial-blue">
        {project.name}
      </h1>

      <div className="max-w-2xl">
        <EditProjectForm project={project} />
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold text-industrial-blue mb-4">
          Fotos del proyecto
        </h2>
        <ProjectPhotoGallery projectId={project.id} images={images ?? []} />
      </div>

      <div className="bg-white rounded shadow p-6 max-w-2xl">
        <h2 className="font-bold text-industrial-blue mb-4">
          Agregar más fotos
        </h2>
        <AddPhotosForm projectId={project.id} />
      </div>
    </div>
  );
}
