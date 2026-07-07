"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ORDER_STATUSES,
  ORDER_CHANNELS,
  ORDER_STATUS_LABELS,
  ORDER_CHANNEL_LABELS,
} from "@/lib/orders";

export default function PedidosFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/pedidos?${params.toString()}`);
  }

  return (
    <div className="flex gap-3">
      <select
        defaultValue={searchParams.get("estado") ?? ""}
        onChange={(e) => updateParam("estado", e.target.value)}
        className="border rounded px-3 py-2 text-sm bg-white"
      >
        <option value="">Todos los estados</option>
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {ORDER_STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("canal") ?? ""}
        onChange={(e) => updateParam("canal", e.target.value)}
        className="border rounded px-3 py-2 text-sm bg-white"
      >
        <option value="">Todos los canales</option>
        {ORDER_CHANNELS.map((channel) => (
          <option key={channel} value={channel}>
            {ORDER_CHANNEL_LABELS[channel]}
          </option>
        ))}
      </select>
    </div>
  );
}
