"use client";

import { useState } from "react";
import { updateClientRecord } from "./actions";

type Client = {
  id: string;
  contact_name: string;
  company_name: string | null;
  ruc: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
};

export default function EditClientForm({ client }: { client: Client }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      const result = await updateClientRecord(client.id, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar el cliente."
      );
    } finally {
      setPending(false);
    }
  }

  if (!editing) {
    return (
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-industrial-blue">Datos del cliente</h2>
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-industrial-blue underline"
          >
            Editar
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-steel-gray">RUC</dt>
          <dd>{client.ruc ?? "—"}</dd>

          <dt className="text-steel-gray">Teléfono</dt>
          <dd>{client.phone ?? "—"}</dd>

          <dt className="text-steel-gray">Email</dt>
          <dd>{client.email ?? "—"}</dd>

          <dt className="text-steel-gray">Dirección</dt>
          <dd>{client.address ?? "—"}</dd>

          {client.notes && (
            <>
              <dt className="text-steel-gray">Notas</dt>
              <dd>{client.notes}</dd>
            </>
          )}
        </dl>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="font-bold text-industrial-blue mb-4">Editar cliente</h2>
      <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="contact_name"
          placeholder="Nombre de contacto *"
          required
          defaultValue={client.contact_name}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="company_name"
          placeholder="Empresa"
          defaultValue={client.company_name ?? ""}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="ruc"
          placeholder="RUC"
          defaultValue={client.ruc ?? ""}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={client.email ?? ""}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="phone"
          placeholder="Teléfono"
          defaultValue={client.phone ?? ""}
          className="border rounded px-3 py-2 text-sm"
        />
        <input
          name="address"
          placeholder="Dirección"
          defaultValue={client.address ?? ""}
          className="border rounded px-3 py-2 text-sm"
        />
        <textarea
          name="notes"
          placeholder="Notas"
          defaultValue={client.notes ?? ""}
          className="border rounded px-3 py-2 text-sm md:col-span-2"
        />

        {error && <p className="text-red-600 text-sm md:col-span-2">{error}</p>}

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-steel-gray px-4 py-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
