"use client";

import { useRef, useState } from "react";
import { uploadOrderFile } from "./actions";
import { FILE_KINDS, FILE_KIND_LABELS } from "@/lib/orders";

export default function ExpedienteUpload({ orderId }: { orderId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await uploadOrderFile(orderId, formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
    >
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-steel-gray mb-1">
          Archivo
        </label>
        <input
          type="file"
          name="file"
          required
          className="text-sm w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-steel-gray mb-1">
          Tipo
        </label>
        <select
          name="file_kind"
          className="border rounded px-3 py-2 text-sm w-full"
        >
          {FILE_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {FILE_KIND_LABELS[kind]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="visible_to_client" id="visible_to_client" />
        <label htmlFor="visible_to_client" className="text-sm text-steel-gray">
          Visible para el cliente
        </label>
      </div>

      <div className="md:col-span-3">
        <label className="block text-sm font-medium text-steel-gray mb-1">
          Descripción (opcional)
        </label>
        <input
          name="description"
          className="border rounded px-3 py-2 text-sm w-full"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60 w-full"
        >
          {pending ? "Subiendo..." : "Subir archivo"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm md:col-span-4">{error}</p>}
    </form>
  );
}
