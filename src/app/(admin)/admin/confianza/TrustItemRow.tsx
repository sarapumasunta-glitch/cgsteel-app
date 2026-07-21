"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ChevronUp, ChevronDown, Building2 } from "lucide-react";
import { toggleTrustItemActive, deleteTrustItem, moveTrustItem } from "./actions";
import type { Tables } from "@/lib/types/database.types";

type TrustItem = Tables<"trust_items">;

export default function TrustItemRow({
  item,
  isFirst,
  isLast,
}: {
  item: TrustItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setPending(true);
    setError(null);
    const result = await toggleTrustItemActive(item.id, !item.active);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleDelete() {
    if (
      !confirm(
        `¿Eliminar "${item.name}"? Esto borra también su foto del almacenamiento. Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    const result = await deleteTrustItem(item.id);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleMove(direction: "up" | "down") {
    setPending(true);
    setError(null);
    const result = await moveTrustItem(item.id, direction);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3">
        <div className="relative w-14 h-14 bg-off-white rounded overflow-hidden flex items-center justify-center">
          {item.icon_or_photo_url ? (
            <Image
              src={item.icon_or_photo_url}
              alt={item.name}
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          ) : (
            <Building2 className="text-steel-gray" size={20} />
          )}
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-carbon-black">
        <Link href={`/admin/confianza/${item.id}`} className="hover:underline">
          {item.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-steel-gray">{item.display_order}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={pending}
          className={`inline-block px-2 py-1 rounded text-xs font-semibold disabled:opacity-60 ${
            item.active
              ? "bg-green-100 text-green-700"
              : "bg-steel-gray/20 text-steel-gray"
          }`}
        >
          {item.active ? "Activo" : "Inactivo"}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleMove("up")}
            disabled={pending || isFirst}
            aria-label="Subir"
            className="text-steel-gray hover:text-industrial-blue disabled:opacity-30"
          >
            <ChevronUp size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleMove("down")}
            disabled={pending || isLast}
            aria-label="Bajar"
            className="text-steel-gray hover:text-industrial-blue disabled:opacity-30"
          >
            <ChevronDown size={18} />
          </button>
          <Link
            href={`/admin/confianza/${item.id}`}
            className="text-sm font-semibold text-industrial-blue hover:underline"
          >
            Editar
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            aria-label="Eliminar"
            className="text-steel-gray hover:text-red-600 disabled:opacity-30"
          >
            <Trash2 size={18} />
          </button>
        </div>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </td>
    </tr>
  );
}
