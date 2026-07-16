"use client";

import { useState } from "react";
import { createBannerItem } from "./actions";
import { HERO_BANNER_TYPES, HERO_BANNER_TYPE_LABELS } from "@/lib/heroBanner";

function isRedirectError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default function NewBannerItemForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await createBannerItem(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
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
            Tipo *
          </label>
          <select
            name="type"
            required
            defaultValue="image"
            className="border rounded px-3 py-2 text-sm w-full"
          >
            {HERO_BANNER_TYPES.map((type) => (
              <option key={type} value={type}>
                {HERO_BANNER_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Archivo (foto o video) *
          </label>
          <input
            type="file"
            name="media"
            accept="image/*,video/*"
            required
            className="text-sm w-full"
          />
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
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
      >
        {pending ? "Subiendo..." : "Agregar al banner"}
      </button>
    </form>
  );
}
