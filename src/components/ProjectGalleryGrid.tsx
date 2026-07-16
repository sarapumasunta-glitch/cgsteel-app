"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type ProjectGalleryImage = {
  id: string;
  image_url: string;
  width: number | null;
  height: number | null;
};

export type ProjectGalleryItem = {
  id: string;
  name: string;
  description: string | null;
  images: ProjectGalleryImage[];
};

export default function ProjectGalleryGrid({
  projects,
}: {
  projects: ProjectGalleryItem[];
}) {
  const [openProjectIndex, setOpenProjectIndex] = useState<number | null>(null);
  const [openImageIndex, setOpenImageIndex] = useState(0);

  const openProject = openProjectIndex !== null ? projects[openProjectIndex] : null;

  const close = () => setOpenProjectIndex(null);
  const prev = () =>
    setOpenImageIndex((i) =>
      openProject ? (i - 1 + openProject.images.length) % openProject.images.length : 0
    );
  const next = () =>
    setOpenImageIndex((i) =>
      openProject ? (i + 1) % openProject.images.length : 0
    );

  useEffect(() => {
    if (openProjectIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openProjectIndex, openProject]);

  const currentImage = openProject?.images[openImageIndex];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((project, i) => {
          const cover = project.images[0];
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => {
                setOpenProjectIndex(i);
                setOpenImageIndex(0);
              }}
              className="group relative block aspect-square overflow-hidden rounded bg-brand-light"
            >
              {cover ? (
                <Image
                  src={cover.image_url}
                  alt={project.name}
                  width={400}
                  height={400}
                  quality={90}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-brand-medium">
                  Sin foto
                </div>
              )}
              <div className="absolute inset-0 flex items-end bg-brand-dark/0 transition-colors group-hover:bg-brand-dark/50">
                <span className="p-3 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {project.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {openProject && currentImage && (
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

          {openProject.images.length > 1 && (
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
            className="flex max-h-[90vh] w-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] w-full flex items-center justify-center">
              <Image
                src={currentImage.image_url}
                alt={openProject.name}
                width={currentImage.width ?? 1200}
                height={currentImage.height ?? 900}
                quality={90}
                className="mx-auto h-auto max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <h3 className="text-lg font-heading font-bold">{openProject.name}</h3>
              {openProject.description && (
                <p className="mt-1 max-w-xl text-sm text-white/80">
                  {openProject.description}
                </p>
              )}
              {openProject.images.length > 1 && (
                <p className="mt-2 text-xs text-white/50">
                  {openImageIndex + 1} / {openProject.images.length}
                </p>
              )}
            </div>
          </div>

          {openProject.images.length > 1 && (
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
      )}
    </>
  );
}
