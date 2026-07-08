"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";
import { createQuote } from "./actions";
import { formatCurrency } from "@/lib/orders";

type ClientOption = {
  id: string;
  contact_name: string;
  company_name: string | null;
};

type ItemRow = {
  description: string;
  quantity: number;
  unit_price: number;
};

const EMPTY_ITEM: ItemRow = { description: "", quantity: 1, unit_price: 0 };

function isRedirectError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default function NewQuoteForm({
  clients,
  preselectedClientId,
}: {
  clients: ClientOption[];
  preselectedClientId?: string;
}) {
  const [clientId, setClientId] = useState(preselectedClientId ?? "");
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ ...EMPTY_ITEM }]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function updateItem(index: number, patch: Partial<ItemRow>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await createQuote({
        client_id: clientId,
        valid_until: validUntil || null,
        notes: notes.trim() || null,
        items,
      });
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al crear la cotización."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 max-w-3xl">
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
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
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
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-steel-gray mb-2">
          Ítems *
        </label>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-start">
              <input
                placeholder="Descripción"
                value={item.description}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                className="col-span-12 md:col-span-5 border rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                step="1"
                placeholder="Cant."
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, { quantity: Number(e.target.value) || 0 })
                }
                className="col-span-4 md:col-span-2 border rounded px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="P. unitario"
                value={item.unit_price}
                onChange={(e) =>
                  updateItem(index, { unit_price: Number(e.target.value) || 0 })
                }
                className="col-span-4 md:col-span-2 border rounded px-3 py-2 text-sm"
              />
              <div className="col-span-3 md:col-span-2 border rounded px-3 py-2 text-sm bg-off-white text-steel-gray">
                {formatCurrency(item.quantity * item.unit_price)}
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                aria-label="Eliminar ítem"
                className="col-span-1 flex items-center justify-center text-steel-gray hover:text-red-600 disabled:opacity-30 py-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex items-center gap-1 text-sm font-semibold text-industrial-blue"
        >
          <Plus size={16} /> Agregar ítem
        </button>

        <div className="mt-4 flex justify-end">
          <p className="text-sm font-semibold text-carbon-black">
            Subtotal: {formatCurrency(subtotal)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-steel-gray mb-1">
          Notas
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full"
        />
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
