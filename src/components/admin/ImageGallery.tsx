"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";

export type GalleryImage = {
  id: string;
  image_url: string;
  active: boolean;
};

export default function ImageGallery({
  images,
  onToggleActive,
  onMove,
  onDelete,
  emptyMessage = "Todavía no hay fotos.",
}: {
  images: GalleryImage[];
  onToggleActive: (imageId: string, active: boolean) => Promise<{ error?: string } | void>;
  onMove: (imageId: string, direction: "up" | "down") => Promise<{ error?: string } | void>;
  onDelete: (imageId: string) => Promise<{ error?: string } | void>;
  emptyMessage?: string;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle(image: GalleryImage) {
    setPendingId(image.id);
    setError(null);
    const result = await onToggleActive(image.id, !image.active);
    if (result?.error) setError(result.error);
    setPendingId(null);
  }

  async function handleDelete(imageId: string) {
    if (!confirm("¿Eliminar esta foto? También se borra del almacenamiento.")) {
      return;
    }
    setPendingId(imageId);
    setError(null);
    const result = await onDelete(imageId);
    if (result?.error) setError(result.error);
    setPendingId(null);
  }

  async function handleMove(imageId: string, direction: "up" | "down") {
    setPendingId(imageId);
    setError(null);
    const result = await onMove(imageId, direction);
    if (result?.error) setError(result.error);
    setPendingId(null);
  }

  if (images.length === 0) {
    return <p className="text-sm text-steel-gray">{emptyMessage}</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="bg-off-white rounded overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={image.image_url}
                alt=""
                width={200}
                height={200}
                className={`object-cover w-full h-full ${image.active ? "" : "opacity-40"}`}
              />
              {!image.active && (
                <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  Inactiva
                </span>
              )}
            </div>
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(image.id, "up")}
                  disabled={pendingId === image.id || index === 0}
                  aria-label="Subir"
                  className="text-steel-gray hover:text-industrial-blue disabled:opacity-30"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(image.id, "down")}
                  disabled={pendingId === image.id || index === images.length - 1}
                  aria-label="Bajar"
                  className="text-steel-gray hover:text-industrial-blue disabled:opacity-30"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                disabled={pendingId === image.id}
                aria-label="Eliminar foto"
                className="text-steel-gray hover:text-red-600 disabled:opacity-30"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="px-2 pb-2">
              <button
                type="button"
                onClick={() => handleToggle(image)}
                disabled={pendingId === image.id}
                className={`w-full text-xs font-semibold px-2 py-1 rounded disabled:opacity-60 ${
                  image.active
                    ? "bg-green-100 text-green-700"
                    : "bg-steel-gray/20 text-steel-gray"
                }`}
              >
                {image.active ? "Activa" : "Inactiva"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </div>
  );
}
