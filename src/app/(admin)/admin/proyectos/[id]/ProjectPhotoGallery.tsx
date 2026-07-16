"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { deleteProjectImage, moveProjectImage } from "./actions";
import type { Tables } from "@/lib/types/database.types";

type ProjectImage = Tables<"project_images">;

export default function ProjectPhotoGallery({
  projectId,
  images,
}: {
  projectId: string;
  images: ProjectImage[];
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(imageId: string) {
    if (!confirm("¿Eliminar esta foto? También se borra del almacenamiento.")) {
      return;
    }
    setPendingId(imageId);
    setError(null);
    const result = await deleteProjectImage(projectId, imageId);
    if (result?.error) setError(result.error);
    setPendingId(null);
  }

  async function handleMove(imageId: string, direction: "up" | "down") {
    setPendingId(imageId);
    setError(null);
    const result = await moveProjectImage(projectId, imageId, direction);
    if (result?.error) setError(result.error);
    setPendingId(null);
  }

  if (images.length === 0) {
    return (
      <p className="text-sm text-steel-gray">
        Este proyecto todavía no tiene fotos.
      </p>
    );
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
                className="object-cover w-full h-full"
              />
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
          </div>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </div>
  );
}
