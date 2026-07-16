import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ComboForm from "../ComboForm";
import { updateCombo } from "./actions";

export default async function EditarComboPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [{ data: combo }, { data: products }, { data: items }] = await Promise.all([
    supabase.from("combos").select("*").eq("id", params.id).single(),
    supabase.from("products").select("id, name, image_url, category").order("name"),
    supabase.from("combo_items").select("product_id, quantity").eq("combo_id", params.id),
  ]);

  if (!combo) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">{combo.name}</h1>
      <div className="mt-6">
        <ComboForm
          combo={combo}
          allProducts={products ?? []}
          initialItems={items ?? []}
          action={updateCombo.bind(null, combo.id)}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
