"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { toggleProjectStatus, toggleProjectActive, deleteProject } from "./actions";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_BADGE_CLASSES,
  type ProjectStatus,
} from "@/lib/projects";
import type { Tables } from "@/lib/types/database.types";

type Project = Tables<"projects">;

export default function ProjectRow({
  project,
  thumbnailUrl,
}: {
  project: Project;
  thumbnailUrl: string | null;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status = project.status as ProjectStatus;

  async function handleToggleStatus() {
    setPending(true);
    setError(null);
    const nextStatus: ProjectStatus = status === "published" ? "repository" : "published";
    const result = await toggleProjectStatus(project.id, nextStatus);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleToggleActive() {
    setPending(true);
    setError(null);
    const result = await toggleProjectActive(project.id, !project.active);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleDelete() {
    if (
      !confirm(
        `¿Eliminar el proyecto "${project.name}"? Esto borra también todas sus fotos del almacenamiento. Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    const result = await deleteProject(project.id);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3">
        <div className="relative w-14 h-14 bg-off-white rounded overflow-hidden flex items-center justify-center">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={project.name}
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-xs text-steel-gray">Sin foto</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-carbon-black">
        <Link href={`/admin/proyectos/${project.id}`} className="hover:underline">
          {project.name}
        </Link>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={pending}
          className={`inline-block px-2 py-1 rounded text-xs font-semibold disabled:opacity-60 ${PROJECT_STATUS_BADGE_CLASSES[status]}`}
        >
          {PROJECT_STATUS_LABELS[status]}
        </button>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={handleToggleActive}
          disabled={pending}
          className={`inline-block px-2 py-1 rounded text-xs font-semibold disabled:opacity-60 ${
            project.active
              ? "bg-green-100 text-green-700"
              : "bg-steel-gray/20 text-steel-gray"
          }`}
        >
          {project.active ? "Activo" : "Inactivo"}
        </button>
      </td>
      <td className="px-4 py-3 text-steel-gray">{project.display_order}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/proyectos/${project.id}`}
            className="text-sm font-semibold text-industrial-blue hover:underline"
          >
            Editar
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            aria-label="Eliminar"
            className="text-steel-gray hover:text-red-600 disabled:opacity-30"
          >
            <Trash2 size={18} />
          </button>
        </div>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </td>
    </tr>
  );
}
