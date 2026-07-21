import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TrustItemRow from "./TrustItemRow";

export default async function ConfianzaAdminPage() {
  const supabase = createClient();

  const { data: items } = await supabase
    .from("trust_items")
    .select("*")
    .order("display_order");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">
          Confían en nosotros
        </h1>
        <Link
          href="/admin/confianza/nuevo"
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
        >
          Nuevo item
        </Link>
      </div>
      <p className="mt-2 text-sm text-steel-gray max-w-2xl">
        Clientes o marcas que se muestran en la sección &quot;Confían en
        nosotros&quot; de /nosotros. Solo los items activos aparecen ahí.
      </p>

      <div className="mt-6 bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item, index) => (
              <TrustItemRow
                key={item.id}
                item={item}
                isFirst={index === 0}
                isLast={index === (items ?? []).length - 1}
              />
            ))}
            {(items ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-steel-gray">
                  No hay items todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
