import Image from "next/image";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Tables } from "@/lib/types/database.types";
import { type DiscountType, calculateDiscountedPrice, formatPrice } from "@/lib/products";
import type { ComboWithProducts } from "@/lib/combos";

type Product = Tables<"products">;

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.discount_active &&
    product.base_price !== null &&
    product.discount_type !== null &&
    product.discount_value !== null;

  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(
        product.base_price!,
        product.discount_type as DiscountType,
        product.discount_value!
      )
    : null;

  return (
    <div className="bg-white rounded shadow overflow-hidden relative">
      {hasDiscount && product.discount_label && (
        <span className="absolute top-2 left-2 z-10 bg-brand-accent text-white text-xs font-semibold px-2 py-1 rounded">
          {product.discount_label}
        </span>
      )}
      <div className="relative aspect-square bg-brand-light flex items-center justify-center p-4">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={280}
            height={280}
            quality={90}
            className="object-contain max-w-full max-h-full w-auto h-auto"
          />
        ) : (
          <div className="text-sm text-brand-medium">Sin foto</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-brand-dark">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-brand-medium">{product.description}</p>
        )}
        {discountedPrice !== null ? (
          <p className="mt-2 flex items-center gap-2">
            <span className="text-sm line-through text-brand-medium">
              {formatPrice(product.base_price!)}
            </span>
            <span className="text-sm font-bold text-brand-accent">
              {formatPrice(discountedPrice)}
            </span>
          </p>
        ) : (
          product.price_range && (
            <p className="mt-2 text-sm font-semibold text-brand-ring">
              {product.price_range}
            </p>
          )
        )}
      </div>
    </div>
  );
}

export function ComboCard({ combo }: { combo: ComboWithProducts }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-brand-light flex items-center justify-center p-4">
        {combo.image_url ? (
          <Image
            src={combo.image_url}
            alt={combo.name}
            width={280}
            height={280}
            quality={90}
            className="object-contain max-w-full max-h-full w-auto h-auto"
          />
        ) : (
          <div className="text-sm text-brand-medium">Sin foto</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-brand-dark">{combo.name}</h3>
        {combo.description && (
          <p className="text-sm text-brand-medium">{combo.description}</p>
        )}
        {combo.productNames.length > 0 && (
          <p className="text-xs text-brand-medium">
            Incluye: {combo.productNames.join(", ")}
          </p>
        )}
        <p className="text-sm font-bold text-brand-accent">
          {formatPrice(combo.combo_price)}
        </p>
        <a
          href={buildWhatsAppUrl(
            `Hola, quiero cotizar el combo "${combo.name}".`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-block bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded text-center hover:brightness-90"
        >
          Cotizar por WhatsApp
        </a>
      </div>
    </div>
  );
}
