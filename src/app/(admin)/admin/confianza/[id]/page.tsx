import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditTrustItemForm from "./EditTrustItemForm";

export default async function EditarTrustItemPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: item } = await supabase
    .from("trust_items")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!item) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">{item.name}</h1>
      <div className="mt-6">
        <EditTrustItemForm item={item} />
      </div>
    </div>
  );
}
