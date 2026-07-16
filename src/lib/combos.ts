import type { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/types/database.types";

export type ComboWithProducts = Tables<"combos"> & { productNames: string[] };

// Reutilizado por /catalogo y por el resumen "Catálogo destacado" del
// home, para no duplicar el fetch de combos + resolución de nombres de
// producto en dos lugares.
export async function getActiveCombosWithProducts(
  supabase: ReturnType<typeof createClient>,
  limit?: number
): Promise<ComboWithProducts[]> {
  let query = supabase.from("combos").select("*").eq("active", true).order("display_order");
  if (limit) {
    query = query.limit(limit);
  }
  const { data: activeCombos } = await query;

  const comboIds = (activeCombos ?? []).map((combo) => combo.id);
  const { data: comboItemRows } = comboIds.length
    ? await supabase.from("combo_items").select("combo_id, product_id").in("combo_id", comboIds)
    : { data: [] as { combo_id: string; product_id: string }[] };

  const productIds = [...new Set((comboItemRows ?? []).map((row) => row.product_id))];
  const { data: comboProductRows } = productIds.length
    ? await supabase.from("products").select("id, name").in("id", productIds)
    : { data: [] as { id: string; name: string }[] };

  const productNameById = new Map((comboProductRows ?? []).map((p) => [p.id, p.name]));

  return (activeCombos ?? []).map((combo) => ({
    ...combo,
    productNames: (comboItemRows ?? [])
      .filter((row) => row.combo_id === combo.id)
      .map((row) => productNameById.get(row.product_id))
      .filter((name): name is string => !!name),
  }));
}
