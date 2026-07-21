"use client";

import ImageGallery from "@/components/admin/ImageGallery";
import { deleteServiceImage, moveServiceImage, toggleServiceImageActive } from "./actions";
import type { Tables } from "@/lib/types/database.types";

type ServiceImage = Tables<"service_images">;

export default function ServicePhotoGallery({
  serviceId,
  images,
}: {
  serviceId: string;
  images: ServiceImage[];
}) {
  return (
    <ImageGallery
      images={images}
      emptyMessage="Este servicio todavía no tiene fotos."
      onToggleActive={(imageId, active) =>
        toggleServiceImageActive(serviceId, imageId, active)
      }
      onMove={(imageId, direction) => moveServiceImage(serviceId, imageId, direction)}
      onDelete={(imageId) => deleteServiceImage(serviceId, imageId)}
    />
  );
}
