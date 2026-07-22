"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import TechnicalCorners from "@/components/TechnicalCorners";

export type LightboxImage = {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
};

const SWIPE_THRESHOLD = 50;

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
  title,
  description,
  showTechnicalCorners = false,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title?: string;
  description?: string | null;
  showTechnicalCorners?: boolean;
}) {
  const touchStartX = useRef<number | null>(null);
  const image = images[index];

  const prev = () => onNavigate((index - 1 + images.length) % images.length);
  const next = () => onNavigate((index + 1) % images.length);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  if (!image) return null;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD) prev();
    else if (deltaX < -SWIPE_THRESHOLD) next();
    touchStartX.current = null;
  }

  return (
    <div
      className="lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Cerrar"
        className="absolute right-4 top-4 text-white/80 hover:text-white"
      >
        <X size={32} />
      </button>

      {images.length > 1 && (
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
      )}

      <div
        className="lightbox-content flex max-h-[90vh] w-full max-w-4xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[75vh] w-full flex items-center justify-center">
          <div className="relative inline-block max-h-[75vh]">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 1200}
              height={image.height ?? 900}
              quality={90}
              className="mx-auto h-auto max-h-[75vh] w-auto max-w-full object-contain"
            />
            {showTechnicalCorners && (
              <TechnicalCorners color="border-brand-accent/80" size={18} inset={10} />
            )}
          </div>
        </div>
        {(title || description || images.length > 1) && (
          <div className="mt-4 text-center text-white">
            {title && <h3 className="text-lg font-bold">{title}</h3>}
            {description && (
              <p className="mt-1 max-w-xl text-sm text-white/80">{description}</p>
            )}
            {images.length > 1 && (
              <p className="mt-2 text-xs text-white/50">
                {index + 1} / {images.length}
              </p>
            )}
          </div>
        )}
      </div>

      {images.length > 1 && (
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
      )}
    </div>
  );
}
