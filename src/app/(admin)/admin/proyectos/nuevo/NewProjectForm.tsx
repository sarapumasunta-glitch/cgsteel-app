"use client";

import { useState } from "react";
import { createProject } from "./actions";
import MultiImageDropzone, {
  readImageDimensions,
  type PendingImage,
} from "../MultiImageDropzone";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/projects";

function isRedirectError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default function NewProjectForm() {
  const [images, setImages] = useState<PendingImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const formEl = e.currentTarget;
      const formData = new FormData(formEl);

      const dimensions = await Promise.all(
        images.map((img) => readImageDimensions(img.file))
      );
      images.forEach((img) => formData.append("images", img.file));
      formData.set("dimensions", JSON.stringify(dimensions));

      const result = await createProject(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al crear el proyecto."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Nombre *
          </label>
          <input
            name="name"
            required
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Estado
          </label>
          <select
            name="status"
            defaultValue="repository"
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
            defaultValue={0}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Descripción / detalles
          </label>
          <textarea
            name="description"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="active" id="active" defaultChecked />
          <label htmlFor="active" className="text-sm text-steel-gray">
            Activo
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-2">
            Fotos
          </label>
          <MultiImageDropzone images={images} onChange={setImages} />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Crear proyecto"}
      </button>
    </form>
  );
}
