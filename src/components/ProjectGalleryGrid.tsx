"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";
import TechnicalCorners from "@/components/TechnicalCorners";
import { trackEvent } from "@/lib/analytics";

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
                trackEvent("view_project_detail", { project_name: project.name });
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
              <TechnicalCorners />
              <div className="absolute inset-0 flex items-end bg-brand-dark/0 transition-colors group-hover:bg-brand-dark/50">
                <span className="p-3 text-sm font-display tracking-wide font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
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
          showTechnicalCorners
        />
      )}
    </>
  );
}
