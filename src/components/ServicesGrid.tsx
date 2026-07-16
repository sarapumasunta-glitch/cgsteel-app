"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Wrench, X } from "lucide-react";

export type ServiceItem = {
  id: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  video_url: string | null;
};

function ServiceCard({
  service,
  onPlayVideo,
  showCatalogLink,
}: {
  service: ServiceItem;
  onPlayVideo: () => void;
  showCatalogLink: boolean;
}) {
  return (
    <div className="bg-white rounded shadow overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-brand-light flex items-center justify-center">
        {service.photo_url ? (
          <Image
            src={service.photo_url}
            alt={service.name}
            width={320}
            height={320}
            quality={90}
            className="object-cover w-full h-full"
          />
        ) : (
          <Wrench className="text-brand-accent" size={44} strokeWidth={1.5} />
        )}
        {service.video_url && (
          <button
            type="button"
            onClick={onPlayVideo}
            aria-label={`Ver video de ${service.name}`}
            className="absolute inset-0 flex items-center justify-center bg-brand-dark/0 hover:bg-brand-dark/40 transition-colors group"
          >
            <PlayCircle
              className="text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow"
              size={48}
            />
          </button>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-brand-dark">{service.name}</h3>
        {service.description && (
          <p className="text-sm text-brand-medium">{service.description}</p>
        )}
        {showCatalogLink && (
          <Link
            href="/catalogo"
            className="mt-auto text-sm font-semibold text-brand-ring hover:text-brand-accent"
          >
            ¿Buscas algo así? Mira nuestro catálogo →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ServicesGrid({
  services,
  showCatalogLink = true,
}: {
  services: ServiceItem[];
  showCatalogLink?: boolean;
}) {
  const [videoService, setVideoService] = useState<ServiceItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onPlayVideo={() => setVideoService(service)}
            showCatalogLink={showCatalogLink}
          />
        ))}
      </div>

      {videoService && videoService.video_url && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setVideoService(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setVideoService(null);
            }}
            aria-label="Cerrar"
            className="absolute right-4 top-4 text-white/80 hover:text-white"
          >
            <X size={32} />
          </button>
          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={videoService.video_url}
              controls
              autoPlay
              className="w-full max-h-[80vh] rounded"
            />
            <p className="mt-3 text-center text-white font-heading font-bold">
              {videoService.name}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
