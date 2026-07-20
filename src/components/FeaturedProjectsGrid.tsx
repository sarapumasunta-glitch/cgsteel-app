"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";
import type { ProjectGalleryItem } from "@/components/ProjectGalleryGrid";

// Clases de grid por posición según la cantidad total de proyectos
// destacados, para lograr un layout tipo "bento" (1-2 fotos grandes +
// el resto chicas) en vez de un grid parejo. Pensado para 1-5 items.
function getTileClasses(index: number, total: number): string {
  if (total === 1) return "col-span-2 md:col-span-4 row-span-2";
  if (total === 2) return "col-span-2 md:col-span-2 row-span-2";
  if (total === 3) {
    return index === 0
      ? "col-span-2 md:col-span-2 row-span-2"
      : "col-span-2 md:col-span-2 row-span-1";
  }
  if (total === 4) {
    if (index === 0) return "col-span-2 md:col-span-2 row-span-2";
    if (index === 1) return "col-span-2 md:col-span-2 row-span-1";
    return "col-span-1 row-span-1";
  }
  // 5 o más: 1 grande + el resto chicas en bento 2x2
  return index === 0
    ? "col-span-2 md:col-span-2 row-span-2"
    : "col-span-1 row-span-1";
}

export default function FeaturedProjectsGrid({
  projects,
}: {
  projects: ProjectGalleryItem[];
}) {
  const [openProjectIndex, setOpenProjectIndex] = useState<number | null>(null);
  const [openImageIndex, setOpenImageIndex] = useState(0);

  const visibleProjects = projects.slice(0, 5);
  const openProject = openProjectIndex !== null ? visibleProjects[openProjectIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[190px] lg:auto-rows-[220px] gap-4">
        {visibleProjects.map((project, i) => {
          const cover = project.images[0];
          const isBig = i === 0 && visibleProjects.length > 1;
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => {
                setOpenProjectIndex(i);
                setOpenImageIndex(0);
              }}
              className={`group relative block overflow-hidden rounded bg-brand-light ${getTileClasses(
                i,
                visibleProjects.length
              )}`}
            >
              {cover ? (
                <Image
                  src={cover.image_url}
                  alt={project.name}
                  fill
                  sizes={isBig ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                  quality={90}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-brand-medium">
                  Sin foto
                </div>
              )}
              <div className="absolute inset-0 flex items-end bg-brand-dark/0 transition-colors group-hover:bg-brand-dark/50">
                <span className="p-3 font-display tracking-wide text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {project.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {openProject && (
        <Lightbox
          images={openProject.images.map((img) => ({
            src: img.image_url,
            alt: openProject.name,
            width: img.width,
            height: img.height,
          }))}
          index={openImageIndex}
          onNavigate={setOpenImageIndex}
          onClose={() => setOpenProjectIndex(null)}
          title={openProject.name}
          description={openProject.description}
        />
      )}
    </>
  );
}
