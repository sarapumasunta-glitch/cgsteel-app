"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createQuote } from "./actions";
import { QUOTE_TAX_RATE } from "@/lib/quotes";
import { formatCurrency } from "@/lib/orders";

type ClientOption = {
  id: string;
  contact_name: string;
  company_name: string | null;
};

type ItemRow = {
  description: string;
  quantity: string;
  unit_price: string;
};

const EMPTY_ROW: ItemRow = { description: "", quantity: "1", unit_price: "" };

export default function NewQuoteForm({
  clients,
  preselectedClientId,
}: {
  clients: ClientOption[];
  preselectedClientId?: string;
}) {
  const [items, setItems] = useState<ItemRow[]>([{ ...EMPTY_ROW }]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unit_price);
      if (isNaN(quantity) || isNaN(unitPrice)) return sum;
      return sum + quantity * unitPrice;
    }, 0);
    const tax = subtotal * QUOTE_TAX_RATE;
    return { subtotal, tax, total: subtotal + tax };
  }, [items]);

  function updateItem(index: number, field: keyof ItemRow, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    formData.set(
      "items_json",
      JSON.stringify(
        items.map((item) => ({
          description: item.description,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        }))
      )
    );
    try {
      const result = await createQuote(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "digest" in err &&
        typeof (err as { digest: unknown }).digest === "string" &&
        (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al crear la cotización."
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
            Cliente *
          </label>
          {clients.length === 0 ? (
            <p className="text-sm text-red-600">
              No hay clientes registrados.{" "}
              <Link href="/admin/clientes" className="underline">
                Crea uno primero
              </Link>
              .
            </p>
          ) : (
            <select
              name="client_id"
              required
              defaultValue={preselectedClientId ?? ""}
              className="border rounded px-3 py-2 text-sm w-full"
            >
              <option value="">Selecciona un cliente...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.contact_name}
                  {c.company_name ? ` — ${c.company_name}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Válida hasta
          </label>
          <input
            type="date"
            name="valid_until"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-steel-gray">
            Ítems *
          </label>
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-industrial-blue underline"
          >
            + Agregar ítem
          </button>
        </div>

        <div className="mt-2 space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <input
                placeholder="Descripción"
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                className="border rounded px-3 py-2 text-sm flex-1"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Cant."
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                className="border rounded px-3 py-2 text-sm w-24"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Precio unit."
                value={item.unit_price}
                onChange={(e) => updateItem(index, "unit_price", e.target.value)}
                className="border rounded px-3 py-2 text-sm w-32"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                className="text-red-600 text-sm px-2 py-2 disabled:opacity-30"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <dl className="text-sm space-y-1 w-56">
            <div className="flex justify-between">
              <dt className="text-steel-gray">Subtotal</dt>
              <dd>{formatCurrency(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel-gray">IVA ({QUOTE_TAX_RATE * 100}%)</dt>
              <dd>{formatCurrency(totals.tax)}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt>Total</dt>
              <dd>{formatCurrency(totals.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-steel-gray mb-1">
          Notas
        </label>
        <textarea name="notes" className="border rounded px-3 py-2 text-sm w-full" />
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      <button
        type="submit"
        disabled={pending || clients.length === 0}
        className="mt-6 bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
      >
        {pending ? "Creando..." : "Crear cotización"}
      </button>
    </form>
  );
}
