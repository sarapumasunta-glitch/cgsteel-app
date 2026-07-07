"use client";

import { useState } from "react";
import { createClientRecord } from "./actions";

export default function NewClientForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await createClientRecord(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar el cliente."
      );
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
      >
        Nuevo cliente
      </button>
    );
  }

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="font-bold text-industrial-blue mb-4">Nuevo cliente</h2>
      <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="contact_name"
          placeholder="Nombre de contacto *"
          required
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="company_name"
          placeholder="Empresa"
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="ruc"
          placeholder="RUC"
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="phone"
          placeholder="Teléfono"
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="address"
          placeholder="Dirección"
          className="border rounded px-3 py-2 text-sm"
        />
        <textarea
          name="notes"
          placeholder="Notas"
          className="border rounded px-3 py-2 text-sm md:col-span-2"
        />

        {error && (
          <p className="text-red-600 text-sm md:col-span-2">{error}</p>
        )}

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar cliente"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-steel-gray px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
