"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { QUOTE_STATUSES, QUOTE_STATUS_LABELS } from "@/lib/quotes";

export default function CotizacionesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/cotizaciones?${params.toString()}`);
  }

  return (
    <div className="flex gap-3">
      <select
        defaultValue={searchParams.get("estado") ?? ""}
        onChange={(e) => updateParam("estado", e.target.value)}
        className="border rounded px-3 py-2 text-sm bg-white"
      >
        <option value="">Todos los estados</option>
        {QUOTE_STATUSES.map((status) => (
          <option key={status} value={status}>
            {QUOTE_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </div>
  );
}
