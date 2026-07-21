"use client";

import { useState } from "react";
import { updateService } from "./actions";
import type { Tables } from "@/lib/types/database.types";

type Service = Tables<"services">;

export default function EditServiceForm({ service }: { service: Service }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await updateService(service.id, formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar el servicio."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded shadow p-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Nombre *
          </label>
          <input
            name="name"
            required
            defaultValue={service.name}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Orden
          </label>
          <input
            type="number"
            name="display_order"
            defaultValue={service.display_order}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            id="active"
            defaultChecked={service.active}
          />
          <label htmlFor="active" className="text-sm text-steel-gray">
            Activo
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            defaultValue={service.description ?? ""}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Video
          </label>
          {service.video_url && !removeVideo && (
            <div className="mb-2 flex items-center gap-3">
              <span className="text-xs text-steel-gray">Hay un video cargado.</span>
              <button
                type="button"
                onClick={() => setRemoveVideo(true)}
                className="text-xs text-red-600 hover:underline"
              >
                Eliminar video
              </button>
            </div>
          )}
          {removeVideo && (
            <div className="mb-2 flex items-center gap-3">
              <span className="text-xs text-steel-gray">
                Se eliminará el video actual al guardar.
              </span>
              <button
                type="button"
                onClick={() => setRemoveVideo(false)}
                className="text-xs text-industrial-blue hover:underline"
              >
                Deshacer
              </button>
            </div>
          )}
          <input
            type="hidden"
            name="remove_video"
            value={removeVideo ? "1" : ""}
          />
          <input type="file" name="video" accept="video/*" className="text-sm w-full" />
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
