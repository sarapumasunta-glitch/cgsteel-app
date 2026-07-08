"use client";

import { useState } from "react";
import { changeQuoteStatus } from "./actions";
import { QUOTE_STATUSES, QUOTE_STATUS_LABELS, type QuoteStatus } from "@/lib/quotes";

export default function QuoteStatusForm({
  quoteId,
  currentStatus,
}: {
  quoteId: string;
  currentStatus: QuoteStatus;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await changeQuoteStatus(quoteId, formData);
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

      <div className="flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium text-steel-gray mb-1">
            Nuevo estado
          </label>
          <select
            name="status"
            defaultValue={currentStatus}
            className="border rounded px-3 py-2 text-sm"
          >
            {QUOTE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {QUOTE_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Actualizar estado"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </form>
  );
}
