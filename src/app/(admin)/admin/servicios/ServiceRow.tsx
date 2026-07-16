"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ChevronUp, ChevronDown, Video, ImageOff } from "lucide-react";
import { toggleServiceActive, deleteService, moveService } from "./actions";
import type { Tables } from "@/lib/types/database.types";

type Service = Tables<"services">;

export default function ServiceRow({
  service,
  isFirst,
  isLast,
}: {
  service: Service;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setPending(true);
    setError(null);
    const result = await toggleServiceActive(service.id, !service.active);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleDelete() {
    if (
      !confirm(
        `¿Eliminar el servicio "${service.name}"? Esto borra también su foto y video del almacenamiento. Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    const result = await deleteService(service.id);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  async function handleMove(direction: "up" | "down") {
    setPending(true);
    setError(null);
    const result = await moveService(service.id, direction);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3">
        <div className="relative w-14 h-14 bg-off-white rounded overflow-hidden flex items-center justify-center">
          {service.photo_url ? (
            <Image
              src={service.photo_url}
              alt={service.name}
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
        <Link href={`/admin/servicios/${service.id}`} className="hover:underline">
          {service.name}
        </Link>
      </td>
      <td className="px-4 py-3">
        {service.video_url ? (
          <Video className="text-steel-gray" size={18} />
        ) : (
          <span className="text-xs text-steel-gray">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-steel-gray">{service.display_order}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={pending}
          className={`inline-block px-2 py-1 rounded text-xs font-semibold disabled:opacity-60 ${
            service.active
              ? "bg-green-100 text-green-700"
              : "bg-steel-gray/20 text-steel-gray"
          }`}
        >
          {service.active ? "Activo" : "Inactivo"}
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
            href={`/admin/servicios/${service.id}`}
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
