"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ChevronUp, ChevronDown, ImageOff } from "lucide-react";
import { toggleComboActive, deleteCombo, moveCombo } from "./actions";
import type { Tables } from "@/lib/types/database.types";

type Combo = Tables<"combos">;

export default function ComboRow({
  combo,
  itemCount,
  isFirst,
  isLast,
  formattedPrice,
}: {
  combo: Combo;
  itemCount: number;
  isFirst: boolean;
  isLast: boolean;
  formattedPrice: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setPending(true);
    setError(null);
    const result = await toggleComboActive(combo.id, !combo.active);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleDelete() {
    if (
      !confirm(
        `¿Eliminar el combo "${combo.name}"? Los productos que lo componen NO se eliminan, solo la relación. Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    const result = await deleteCombo(combo.id);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleMove(direction: "up" | "down") {
    setPending(true);
    setError(null);
    const result = await moveCombo(combo.id, direction);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3">
        <div className="relative w-14 h-14 bg-off-white rounded overflow-hidden flex items-center justify-center">
          {combo.image_url ? (
            <Image
              src={combo.image_url}
              alt={combo.name}
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          ) : (
            <ImageOff className="text-steel-gray" size={20} />
          )}
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-carbon-black">
        <Link href={`/admin/combos/${combo.id}`} className="hover:underline">
          {combo.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-steel-gray">{formattedPrice}</td>
      <td className="px-4 py-3 text-steel-gray">{itemCount}</td>
      <td className="px-4 py-3 text-steel-gray">{combo.display_order}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={pending}
          className={`inline-block px-2 py-1 rounded text-xs font-semibold disabled:opacity-60 ${
            combo.active
              ? "bg-green-100 text-green-700"
              : "bg-steel-gray/20 text-steel-gray"
          }`}
        >
          {combo.active ? "Activo" : "Inactivo"}
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
            href={`/admin/combos/${combo.id}`}
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
