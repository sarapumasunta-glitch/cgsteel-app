import { createClient } from "@/lib/supabase/server";
import ComboForm from "../ComboForm";
import { createCombo } from "./actions";

export default async function NuevoComboPage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, image_url, category")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">Nuevo combo</h1>
      <div className="mt-6">
        <ComboForm
          allProducts={products ?? []}
          initialItems={[]}
          action={createCombo}
          submitLabel="Crear combo"
        />
      </div>
    </div>
  );
}
