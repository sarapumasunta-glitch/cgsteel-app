import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS, type ProductCategory } from "@/lib/products";

export default async function CatalogoAdminPage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(image_url, display_order)")
    .order("sort_order")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">Catálogo</h1>
        <Link
          href="/admin/catalogo/nuevo"
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="mt-6 space-y-8">
        {PRODUCT_CATEGORIES.map((category) => {
          const items = (products ?? []).filter((p) => p.category === category);
          return (
            <div key={category}>
              <h2 className="font-bold text-industrial-blue mb-3">
                {PRODUCT_CATEGORY_LABELS[category as ProductCategory]}
              </h2>
              <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-steel-gray border-b">
                      <th className="px-4 py-3 w-20">Foto</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Destacado</th>
                      <th className="px-4 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((product) => {
                      const thumbnailUrl =
                        [...(product.product_images ?? [])].sort(
                          (a, b) => a.display_order - b.display_order
                        )[0]?.image_url ?? null;
                      return (
                      <tr key={product.id} className="border-b last:border-0 hover:bg-off-white">
                        <td className="px-4 py-2">
                          <Link href={`/admin/catalogo/${product.id}`}>
                            <div className="relative w-12 h-12 bg-off-white rounded overflow-hidden">
                              {thumbnailUrl ? (
                                <Image
                                  src={thumbnailUrl}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="object-contain w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-steel-gray text-xs">
                                  —
                                </div>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-2 font-medium text-carbon-black">
                          <Link href={`/admin/catalogo/${product.id}`} className="block">
                            {product.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2">
                          {product.is_featured ? (
                            <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                              Destacado
                            </span>
                          ) : (
                            <span className="text-steel-gray">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              product.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-steel-gray/20 text-steel-gray"
                            }`}
                          >
                            {product.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                      );
                    })}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center text-steel-gray">
                          Sin productos en esta categoría todavía.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
