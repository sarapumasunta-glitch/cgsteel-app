"use client";

import { useState } from "react";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  DISCOUNT_TYPES,
  DISCOUNT_TYPE_LABELS,
  calculateDiscountedPrice,
  formatPrice,
  type DiscountType,
} from "@/lib/products";
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
  const [basePrice, setBasePrice] = useState(product?.base_price?.toString() ?? "");
  const [discountActive, setDiscountActive] = useState(product?.discount_active ?? false);
  const [discountType, setDiscountType] = useState<DiscountType>(
    (product?.discount_type as DiscountType) ?? "percentage"
  );
  const [discountValue, setDiscountValue] = useState(
    product?.discount_value?.toString() ?? ""
  );

  const basePriceNum = Number(basePrice);
  const discountValueNum = Number(discountValue);
  const hasValidPreview =
    discountActive &&
    basePrice !== "" &&
    !isNaN(basePriceNum) &&
    discountValue !== "" &&
    !isNaN(discountValueNum);
  const previewPrice = hasValidPreview
    ? calculateDiscountedPrice(basePriceNum, discountType, discountValueNum)
    : null;

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

      <div className="mt-6 border-t pt-6">
        <h3 className="font-semibold text-brand-dark">Oferta / Descuento</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-steel-gray mb-1">
              Precio base (para calcular el descuento)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="base_price"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="Ej. 100.00"
              className="border rounded px-3 py-2 text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-2 md:pt-6">
            <input
              type="checkbox"
              name="discount_active"
              id="discount_active"
              checked={discountActive}
              onChange={(e) => setDiscountActive(e.target.checked)}
            />
            <label htmlFor="discount_active" className="text-sm text-steel-gray">
              Activar descuento
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-steel-gray mb-1">
              Tipo de descuento
            </label>
            <select
              name="discount_type"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountType)}
              className="border rounded px-3 py-2 text-sm w-full"
            >
              {DISCOUNT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {DISCOUNT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-steel-gray mb-1">
              Valor del descuento {discountType === "percentage" ? "(%)" : "($)"}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="discount_value"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "percentage" ? "Ej. 20" : "Ej. 10.00"}
              className="border rounded px-3 py-2 text-sm w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-steel-gray mb-1">
              Etiqueta del badge
            </label>
            <input
              name="discount_label"
              defaultValue={product?.discount_label ?? ""}
              placeholder='Ej. "20% OFF" o "Oferta especial"'
              className="border rounded px-3 py-2 text-sm w-full"
            />
          </div>
        </div>

        {previewPrice !== null && (
          <div className="mt-4 bg-brand-light rounded p-4 flex items-center gap-3">
            <span className="text-sm text-steel-gray">Preview:</span>
            <span className="text-sm line-through text-steel-gray">
              {formatPrice(basePriceNum)}
            </span>
            <span className="text-lg font-bold text-brand-accent">
              {formatPrice(previewPrice)}
            </span>
          </div>
        )}
        {discountActive && !hasValidPreview && (
          <p className="mt-4 text-xs text-steel-gray">
            Ingresa un precio base y un valor de descuento para ver el preview.
          </p>
        )}
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
