"use client";

import { useState } from "react";
import Image from "next/image";
import { updateService } from "./actions";
import type { Tables } from "@/lib/types/database.types";

type Service = Tables<"services">;

export default function EditServiceForm({ service }: { service: Service }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);
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
            Foto
          </label>
          {service.photo_url && !removePhoto && (
            <div className="mb-2 flex items-center gap-3">
              <div className="relative w-20 h-20 bg-off-white rounded overflow-hidden">
                <Image
                  src={service.photo_url}
                  alt={service.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                type="button"
                onClick={() => setRemovePhoto(true)}
                className="text-xs text-red-600 hover:underline"
              >
                Eliminar foto
              </button>
            </div>
          )}
          {removePhoto && (
            <div className="mb-2 flex items-center gap-3">
              <span className="text-xs text-steel-gray">
                Se eliminará la foto actual al guardar.
              </span>
              <button
                type="button"
                onClick={() => setRemovePhoto(false)}
                className="text-xs text-industrial-blue hover:underline"
              >
                Deshacer
              </button>
            </div>
          )}
          <input
            type="hidden"
            name="remove_photo"
            value={removePhoto ? "1" : ""}
          />
          <input type="file" name="photo" accept="image/*" className="text-sm w-full" />
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
