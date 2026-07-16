"use client";

import { useState } from "react";
import { updateProject } from "./actions";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/projects";
import type { Tables } from "@/lib/types/database.types";

type Project = Tables<"projects">;

export default function EditProjectForm({ project }: { project: Project }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await updateProject(project.id, formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar el proyecto."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Nombre *
          </label>
          <input
            name="name"
            required
            defaultValue={project.name}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Estado
          </label>
          <select
            name="status"
            defaultValue={project.status}
            className="border rounded px-3 py-2 text-sm w-full"
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {PROJECT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Orden
          </label>
          <input
            type="number"
            name="display_order"
            defaultValue={project.display_order}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Descripción / detalles
          </label>
          <textarea
            name="description"
            defaultValue={project.description ?? ""}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            id="active"
            defaultChecked={project.active}
          />
          <label htmlFor="active" className="text-sm text-steel-gray">
            Activo
          </label>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
