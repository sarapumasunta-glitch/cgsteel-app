import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS_LINES } from "@/lib/businessLines";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Tables } from "@/lib/types/database.types";
import {
  type ProductCategory,
  type DiscountType,
  calculateDiscountedPrice,
  formatPrice,
} from "@/lib/products";

type Product = Tables<"products">;
type Combo = Tables<"combos"> & { productNames: string[] };

function ProductCard({ product }: { product: Product }) {
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

function ComboCard({ combo }: { combo: Combo }) {
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

export default async function Page() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("name");

  const productsByCategory = new Map<ProductCategory, Product[]>();
  for (const product of products ?? []) {
    const category = product.category as ProductCategory;
    const list = productsByCategory.get(category) ?? [];
    list.push(product);
    productsByCategory.set(category, list);
  }

  const { data: activeCombos } = await supabase
    .from("combos")
    .select("*")
    .eq("active", true)
    .order("display_order");

  const comboIds = (activeCombos ?? []).map((combo) => combo.id);
  const { data: comboItemRows } = comboIds.length
    ? await supabase.from("combo_items").select("combo_id, product_id").in("combo_id", comboIds)
    : { data: [] as { combo_id: string; product_id: string }[] };

  const productIds = [...new Set((comboItemRows ?? []).map((row) => row.product_id))];
  const { data: comboProductRows } = productIds.length
    ? await supabase.from("products").select("id, name").in("id", productIds)
    : { data: [] as { id: string; name: string }[] };

  const productNameById = new Map((comboProductRows ?? []).map((p) => [p.id, p.name]));

  const combos: Combo[] = (activeCombos ?? []).map((combo) => ({
    ...combo,
    productNames: (comboItemRows ?? [])
      .filter((row) => row.combo_id === combo.id)
      .map((row) => productNameById.get(row.product_id))
      .filter((name): name is string => !!name),
  }));

  return (
    <main className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Catálogo</h1>
      <p className="mt-4 text-brand-medium max-w-2xl">
        Una muestra de nuestro trabajo, organizada en cuatro líneas de
        negocio. Si no ves exactamente lo que buscas, cuéntanos tu proyecto y
        lo fabricamos a medida.
      </p>

      {BUSINESS_LINES.map((line) => {
        const lineProducts = productsByCategory.get(line.slug as ProductCategory) ?? [];

        return (
          <section key={line.slug} className="mt-16 first:mt-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-bold text-brand-dark">
                  {line.title}
                </h2>
                <p className="mt-1 text-brand-medium">{line.message}</p>
              </div>
              <a
                href={buildWhatsAppUrl(line.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-block bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded hover:brightness-90"
              >
                Cotizar por WhatsApp
              </a>
            </div>

            {lineProducts.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lineProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-brand-medium italic">
                Próximamente: casos reales de nuestros proyectos
              </p>
            )}
          </section>
        );
      })}

      {combos.length > 0 && (
        <section className="mt-16">
          <div>
            <h2 className="text-xl font-heading font-bold text-brand-dark">
              Combos
            </h2>
            <p className="mt-1 text-brand-medium">
              Paquetes con varios productos a un precio especial.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 bg-brand-dark text-white rounded p-10 text-center">
        <h2 className="text-xl font-heading font-bold">¿Buscas algo más?</h2>
        <p className="mt-2 text-white/70 max-w-xl mx-auto">
          Fabricamos piezas a medida a partir de una foto, un plano o una
          idea. Escríbenos y lo conversamos.
        </p>
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 bg-green-600 text-white font-semibold px-6 py-3 rounded hover:brightness-90"
        >
          Escríbenos por WhatsApp
        </a>
      </section>
    </main>
  );
}
