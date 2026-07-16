import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectRow from "./ProjectRow";

export default async function ProyectosAdminPage() {
  const supabase = createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*, project_images(image_url, display_order)")
    .order("display_order");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">
          Proyectos realizados
        </h1>
        <Link
          href="/admin/proyectos/nuevo"
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
        >
          Nuevo proyecto
        </Link>
      </div>
      <p className="mt-2 text-sm text-steel-gray max-w-2xl">
        Solo los proyectos en estado &quot;Publicado&quot; y activos aparecen
        en /proyectos. &quot;Repositorio&quot; guarda las fotos sin mostrarlas
        todavía.
      </p>

      <div className="mt-6 bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Visible</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(projects ?? []).map((project) => {
              const images = [...(project.project_images ?? [])].sort(
                (a, b) => a.display_order - b.display_order
              );
              return (
                <ProjectRow
                  key={project.id}
                  project={project}
                  thumbnailUrl={images[0]?.image_url ?? null}
                />
              );
            })}
            {(projects ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-steel-gray">
                  No hay proyectos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
