"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);
  const prev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () =>
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex]);

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded bg-brand-light"
          >
            <Image
              src={img.src}
              alt="Proyecto realizado"
              width={img.width}
              height={img.height}
              quality={90}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 flex items-end bg-brand-dark/0 transition-colors group-hover:bg-brand-dark/40">
              <span className="p-3 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                Proyecto realizado
              </span>
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Cerrar"
            className="absolute right-4 top-4 text-white/80 hover:text-white"
          >
            <X size={32} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Anterior"
            className="absolute left-2 text-white/80 hover:text-white md:left-6"
          >
            <ChevronLeft size={40} />
          </button>

          <div
            className="relative max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex].src}
              alt="Proyecto realizado"
              width={images[openIndex].width}
              height={images[openIndex].height}
              quality={90}
              className="mx-auto h-auto max-h-[85vh] w-auto max-w-full object-contain"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Siguiente"
            className="absolute right-2 text-white/80 hover:text-white md:right-6"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </>
  );
}
