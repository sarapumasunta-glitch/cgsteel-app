"use client";

import ImageGallery from "@/components/admin/ImageGallery";
import { deleteProductImage, moveProductImage, toggleProductImageActive } from "./actions";
import type { Tables } from "@/lib/types/database.types";

type ProductImage = Tables<"product_images">;

export default function ProductPhotoGallery({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  return (
    <ImageGallery
      images={images}
      emptyMessage="Este producto todavía no tiene fotos."
      onToggleActive={(imageId, active) =>
        toggleProductImageActive(productId, imageId, active)
      }
      onMove={(imageId, direction) => moveProductImage(productId, imageId, direction)}
      onDelete={(imageId) => deleteProductImage(productId, imageId)}
    />
  );
}
