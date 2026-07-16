import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import ComboRow from "./ComboRow";

export default async function CombosAdminPage() {
  const supabase = createClient();

  const { data: combos } = await supabase
    .from("combos")
    .select("*, combo_items(id)")
    .order("display_order");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">Combos</h1>
        <Link
          href="/admin/combos/nuevo"
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
        >
          Nuevo combo
        </Link>
      </div>
      <p className="mt-2 text-sm text-steel-gray max-w-2xl">
        Paquetes de varios productos a un precio fijo. Solo los combos
        activos aparecen en /catalogo.
      </p>

      <div className="mt-6 bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(combos ?? []).map((combo, index) => (
              <ComboRow
                key={combo.id}
                combo={combo}
                itemCount={combo.combo_items?.length ?? 0}
                isFirst={index === 0}
                isLast={index === (combos ?? []).length - 1}
                formattedPrice={formatPrice(combo.combo_price)}
              />
            ))}
            {(combos ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-steel-gray">
                  No hay combos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
