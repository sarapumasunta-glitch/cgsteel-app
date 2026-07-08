"use client";

import { useState } from "react";
import Link from "next/link";
import { createOrder } from "./actions";
import { ORDER_CHANNELS, ORDER_CHANNEL_LABELS } from "@/lib/orders";

type ClientOption = {
  id: string;
  contact_name: string;
  company_name: string | null;
};

export default function NewOrderForm({
  clients,
  preselectedClientId,
  quoteId,
  defaultDescription,
  defaultEstimatedValue,
}: {
  clients: ClientOption[];
  preselectedClientId?: string;
  quoteId?: string;
  defaultDescription?: string;
  defaultEstimatedValue?: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await createOrder(formData);
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
        err instanceof Error ? err.message : "Ocurrió un error inesperado al crear el pedido."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded shadow p-6 max-w-2xl">
      {quoteId && <input type="hidden" name="quote_id" value={quoteId} />}
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
            <div className="flex gap-2 items-center">
              <select
                name="client_id"
                required
                defaultValue={preselectedClientId ?? ""}
                className="border rounded px-3 py-2 text-sm flex-1"
              >
                <option value="">Selecciona un cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.contact_name}
                    {c.company_name ? ` — ${c.company_name}` : ""}
                  </option>
                ))}
              </select>
              <Link
                href="/admin/clientes"
                className="text-sm text-industrial-blue underline whitespace-nowrap"
              >
                + Nuevo cliente
              </Link>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Descripción *
          </label>
          <textarea
            name="description"
            required
            defaultValue={defaultDescription}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Canal de ingreso *
          </label>
          <select
            name="channel"
            required
            className="border rounded px-3 py-2 text-sm w-full"
          >
            <option value="">Selecciona...</option>
            {ORDER_CHANNELS.map((channel) => (
              <option key={channel} value={channel}>
                {ORDER_CHANNEL_LABELS[channel]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Responsable
          </label>
          <input
            name="responsible"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Valor estimado (USD)
          </label>
          <input
            type="number"
            step="0.01"
            name="estimated_value"
            defaultValue={defaultEstimatedValue}
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Costo estimado (USD)
          </label>
          <input
            type="number"
            step="0.01"
            name="estimated_cost"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Fecha estimada de entrega
          </label>
          <input
            type="date"
            name="estimated_delivery_date"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Notas
          </label>
          <textarea
            name="notes"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

      <button
        type="submit"
        disabled={pending || clients.length === 0}
        className="mt-6 bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
      >
        {pending ? "Creando..." : "Crear pedido"}
      </button>
    </form>
  );
}
