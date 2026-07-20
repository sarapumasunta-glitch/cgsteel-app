"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";
import TechnicalCorners from "@/components/TechnicalCorners";
import type { GalleryImage } from "@/lib/gallery";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            <TechnicalCorners />
            <div className="absolute inset-0 flex items-end bg-brand-dark/0 transition-colors group-hover:bg-brand-dark/40">
              <span className="p-3 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                Proyecto realizado
              </span>
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={images.map((img) => ({
            src: img.src,
            alt: "Proyecto realizado",
            width: img.width,
            height: img.height,
          }))}
          index={openIndex}
          onNavigate={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          showTechnicalCorners
        />
      )}
    </>
  );
}
