"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProductImages } from "./actions";
import MultiImageDropzone, { type PendingImage } from "@/components/admin/MultiImageDropzone";

export default function AddProductPhotosForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [images, setImages] = useState<PendingImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      setError("Selecciona al menos una foto.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img.file));

      const result = await addProductImages(productId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        setImages([]);
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al subir las fotos."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <MultiImageDropzone images={images} onChange={setImages} />

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <button
        type="submit"
        disabled={pending || images.length === 0}
        className="mt-4 bg-industrial-orange text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
      >
        {pending ? "Subiendo..." : "Agregar fotos"}
      </button>
    </form>
  );
}
