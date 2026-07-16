"use client";

import { useState } from "react";
import Image from "next/image";
import type { Tables } from "@/lib/types/database.types";

type Combo = Tables<"combos">;
type Product = Pick<Tables<"products">, "id" | "name" | "image_url" | "category">;

function isRedirectError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default function ComboForm({
  combo,
  allProducts,
  initialItems,
  action,
  submitLabel,
}: {
  combo?: Combo;
  allProducts: Product[];
  initialItems: { product_id: string; quantity: number }[];
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  submitLabel: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(initialItems.map((item) => [item.product_id, item.quantity]))
  );

  function toggleProduct(productId: string, checked: boolean) {
    setQuantities((prev) => {
      const next = { ...prev };
      if (checked) {
        next[productId] = next[productId] ?? 1;
      } else {
        delete next[productId];
      }
      return next;
    });
  }

  function setQuantity(productId: string, quantity: number) {
    setQuantities((prev) => ({ ...prev, [productId]: quantity }));
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const items = Object.entries(quantities).map(([product_id, quantity]) => ({
        product_id,
        quantity,
      }));
      if (items.length === 0) {
        setError("Selecciona al menos un producto para el combo.");
        setPending(false);
        return;
      }
      formData.set("items", JSON.stringify(items));
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar el combo."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded shadow p-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Nombre *
          </label>
          <input
            name="name"
            required
            defaultValue={combo?.name}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Precio del combo *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="combo_price"
            required
            defaultValue={combo?.combo_price ?? ""}
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
            defaultValue={combo?.display_order ?? 0}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            defaultValue={combo?.description ?? ""}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Foto {combo ? "(deja vacío para conservar la actual)" : ""}
          </label>
          {combo?.image_url && (
            <div className="relative w-24 h-24 mb-2 bg-off-white rounded overflow-hidden">
              <Image
                src={combo.image_url}
                alt={combo.name}
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
            name="active"
            id="active"
            defaultChecked={combo?.active ?? true}
          />
          <label htmlFor="active" className="text-sm text-steel-gray">
            Activo (visible en el catálogo público)
          </label>
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <h3 className="font-semibold text-brand-dark">Productos del combo *</h3>
        <p className="mt-1 text-xs text-steel-gray">
          Selecciona los productos que componen el combo y la cantidad de
          cada uno.
        </p>

        <div className="mt-4 divide-y border rounded">
          {allProducts.map((product) => {
            const selected = product.id in quantities;
            return (
              <div key={product.id} className="flex items-center gap-3 px-3 py-2">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) => toggleProduct(product.id, e.target.checked)}
                />
                <div className="relative w-10 h-10 bg-off-white rounded overflow-hidden shrink-0">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-contain w-full h-full"
                    />
                  ) : null}
                </div>
                <span className="flex-1 text-sm text-carbon-black">{product.name}</span>
                {selected && (
                  <input
                    type="number"
                    min={1}
                    value={quantities[product.id]}
                    onChange={(e) =>
                      setQuantity(product.id, Math.max(1, Number(e.target.value) || 1))
                    }
                    className="border rounded px-2 py-1 text-sm w-20"
                    aria-label={`Cantidad de ${product.name}`}
                  />
                )}
              </div>
            );
          })}
          {allProducts.length === 0 && (
            <p className="px-3 py-4 text-sm text-steel-gray">
              No hay productos en el catálogo todavía.
            </p>
          )}
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
