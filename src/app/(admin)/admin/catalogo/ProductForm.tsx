"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from "@/lib/products";
import type { Tables } from "@/lib/types/database.types";

type Product = Tables<"products">;

function isRedirectError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default function ProductForm({
  product,
  action,
  submitLabel,
}: {
  product?: Product;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  submitLabel: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar el producto."
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
            defaultValue={product?.name}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Categoría *
          </label>
          <select
            name="category"
            required
            defaultValue={product?.category ?? ""}
            className="border rounded px-3 py-2 text-sm w-full"
          >
            <option value="" disabled>
              Selecciona...
            </option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {PRODUCT_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Precio (opcional)
          </label>
          <input
            name="price_range"
            placeholder='Ej. "Desde $120"'
            defaultValue={product?.price_range ?? ""}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Detalle técnico
          </label>
          <textarea
            name="technical_details"
            defaultValue={product?.technical_details ?? ""}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Foto {product ? "(deja vacío para conservar la actual)" : ""}
          </label>
          {product?.image_url && (
            <div className="relative w-24 h-24 mb-2 bg-off-white rounded overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.name}
                width={96}
                height={96}
                className="object-contain w-full h-full"
              />
            </div>
          )}
          <input type="file" name="image" accept="image/*" className="text-sm w-full" />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_featured"
            id="is_featured"
            defaultChecked={product?.is_featured ?? false}
          />
          <label htmlFor="is_featured" className="text-sm text-steel-gray">
            Destacado (aparece en la home)
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            defaultChecked={product?.is_active ?? true}
          />
          <label htmlFor="is_active" className="text-sm text-steel-gray">
            Activo (visible en el catálogo público)
          </label>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
      >
        {pending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
