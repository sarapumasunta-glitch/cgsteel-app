import { createClient } from "@/lib/supabase/server";
import { BUSINESS_LINES } from "@/lib/businessLines";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Tables } from "@/lib/types/database.types";
import type { ProductCategory } from "@/lib/products";
import { getActiveCombosWithProducts } from "@/lib/combos";
import { ProductCard, ComboCard } from "@/components/CatalogCards";

type Product = Tables<"products">;

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

  const combos = await getActiveCombosWithProducts(supabase);

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
                <h2 className="text-xl font-bold text-brand-dark">
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
            <h2 className="text-xl font-bold text-brand-dark">
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
        <h2 className="text-xl font-bold">¿Buscas algo más?</h2>
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
