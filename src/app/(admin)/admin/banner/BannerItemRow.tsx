"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Trash2, Video } from "lucide-react";
import { toggleBannerItemActive, deleteBannerItem, moveBannerItem } from "./actions";
import { HERO_BANNER_TYPE_LABELS, type HeroBannerType } from "@/lib/heroBanner";
import type { Tables } from "@/lib/types/database.types";

type BannerItem = Tables<"hero_banner_items">;

export default function BannerItemRow({
  item,
  isFirst,
  isLast,
}: {
  item: BannerItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setPending(true);
    setError(null);
    const result = await toggleBannerItemActive(item.id, !item.active);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar este item del banner? Esta acción no se puede deshacer.")) {
      return;
    }
    setPending(true);
    setError(null);
    const result = await deleteBannerItem(item.id);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleMove(direction: "up" | "down") {
    setPending(true);
    setError(null);
    const result = await moveBannerItem(item.id, direction);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3">
        <div className="relative w-20 h-14 bg-off-white rounded overflow-hidden flex items-center justify-center">
          {item.type === "video" ? (
            <Video className="text-steel-gray" size={20} />
          ) : (
            <Image
              src={item.media_url}
              alt="Banner"
              width={80}
              height={56}
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-steel-gray">
        {HERO_BANNER_TYPE_LABELS[item.type as HeroBannerType]}
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
