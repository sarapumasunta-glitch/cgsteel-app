import { createClient } from "@/lib/supabase/server";
import NewOrderForm from "./NewOrderForm";

export default async function NuevoPedidoPage({
  searchParams,
}: {
  searchParams: { client_id?: string };
}) {
  const supabase = createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, contact_name, company_name")
    .order("contact_name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">Nuevo pedido</h1>
      <div className="mt-6">
        <NewOrderForm
          clients={clients ?? []}
          preselectedClientId={searchParams.client_id}
        />
      </div>
    </div>
  );
}
