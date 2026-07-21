"use client";

import { useState } from "react";
import { createTrustItem } from "./actions";

function isRedirectError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default function NewTrustItemForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await createTrustItem(formData);
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
            Nombre *
          </label>
          <input
            name="name"
            required
            placeholder="Nombre de la persona o empresa"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Ícono, logo o foto (opcional)
          </label>
          <p className="text-xs text-steel-gray mb-2">
            Si no subes nada, se muestra un ícono genérico o las iniciales del
            nombre en el sitio público.
          </p>
          <input type="file" name="photo" accept="image/*" className="text-sm w-full" />
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

        <div className="flex items-center gap-2">
          <input type="checkbox" name="active" id="active" defaultChecked />
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
        {pending ? "Guardando..." : "Crear"}
      </button>
    </form>
  );
}
