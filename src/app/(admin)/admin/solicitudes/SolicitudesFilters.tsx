"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  QUOTE_REQUEST_STATUSES,
  QUOTE_REQUEST_STATUS_LABELS,
} from "@/lib/quoteRequests";

export default function SolicitudesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("estado", value);
    } else {
      params.delete("estado");
    }
    router.push(`/admin/solicitudes?${params.toString()}`);
  }

  return (
    <select
      defaultValue={searchParams.get("estado") ?? ""}
      onChange={(e) => updateParam(e.target.value)}
      className="border rounded px-3 py-2 text-sm bg-white"
    >
      <option value="">Todos los estados</option>
      {QUOTE_REQUEST_STATUSES.map((status) => (
        <option key={status} value={status}>
          {QUOTE_REQUEST_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
