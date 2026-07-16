import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BannerItemRow from "./BannerItemRow";

export default async function BannerAdminPage() {
  const supabase = createClient();

  const { data: items } = await supabase
    .from("hero_banner_items")
    .select("*")
    .order("display_order");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">
          Banner del home
        </h1>
        <Link
          href="/admin/banner/nuevo"
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
        >
          Nuevo item
        </Link>
      </div>
      <p className="mt-2 text-sm text-steel-gray max-w-2xl">
        Si hay fotos activas, se muestran en carrusel en la home. Si hay un
        video activo, se reproduce en loop. Si no hay ningún item activo, la
        home usa el mensaje de bienvenida por defecto.
      </p>

      <div className="mt-6 bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item, index) => (
              <BannerItemRow
                key={item.id}
                item={item}
                isFirst={index === 0}
                isLast={index === (items ?? []).length - 1}
              />
            ))}
            {(items ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-steel-gray">
                  No hay items en el banner todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
