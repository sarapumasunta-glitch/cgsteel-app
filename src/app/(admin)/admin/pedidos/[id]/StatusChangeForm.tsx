"use client";

import { useState } from "react";
import { changeOrderStatus } from "./actions";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orders";

export default function StatusChangeForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await changeOrderStatus(orderId, formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al cambiar el estado."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded shadow p-6">
      <h2 className="font-bold text-industrial-blue mb-4">Cambiar estado</h2>
      <input type="hidden" name="current_status" value={currentStatus} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Nuevo estado
          </label>
          <select
            name="status"
            defaultValue={currentStatus}
            className="border rounded px-3 py-2 text-sm w-full"
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {ORDER_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            % de avance (opcional)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            name="progress_percent"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>

        <div className="md:col-span-1 flex items-end">
          <button
            type="submit"
            disabled={pending}
            className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60 w-full"
          >
            {pending ? "Guardando..." : "Registrar cambio"}
          </button>
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Nota (opcional)
          </label>
          <textarea
            name="note"
            className="border rounded px-3 py-2 text-sm w-full"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </form>
  );
}
