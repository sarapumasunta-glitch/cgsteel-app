"use client";

import { useState } from "react";
import Image from "next/image";
import { updateTrustItem } from "./actions";
import type { Tables } from "@/lib/types/database.types";

type TrustItem = Tables<"trust_items">;

export default function EditTrustItemForm({ item }: { item: TrustItem }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await updateTrustItem(item.id, formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar el item."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded shadow p-6 max-w-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Nombre *
          </label>
          <input
            name="name"
            required
            defaultValue={item.name}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Ícono, logo o foto (opcional)
          </label>
          {item.icon_or_photo_url && !removePhoto && (
            <div className="mb-2 flex items-center gap-3">
              <div className="relative w-20 h-20 bg-off-white rounded overflow-hidden">
                <Image
                  src={item.icon_or_photo_url}
                  alt={item.name}
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
          <input type="hidden" name="remove_photo" value={removePhoto ? "1" : ""} />
          <input type="file" name="photo" accept="image/*" className="text-sm w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Orden
          </label>
          <input
            type="number"
            name="display_order"
            defaultValue={item.display_order}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            id="active"
            defaultChecked={item.active}
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
