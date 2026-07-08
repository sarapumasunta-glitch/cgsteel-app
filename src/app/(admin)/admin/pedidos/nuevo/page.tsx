import { createClient } from "@/lib/supabase/server";
import NewOrderForm from "./NewOrderForm";

export default async function NuevoPedidoPage({
  searchParams,
}: {
  searchParams: { client_id?: string; quote_id?: string };
}) {
  const supabase = createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, contact_name, company_name")
    .order("contact_name");

  let quote: { id: string; total: number; notes: string | null; quote_number: string } | null =
    null;
  if (searchParams.quote_id) {
    const { data } = await supabase
      .from("quotes")
      .select("id, total, notes, quote_number")
      .eq("id", searchParams.quote_id)
      .maybeSingle();
    quote = data;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">Nuevo pedido</h1>
      <div className="mt-6">
        <NewOrderForm
          clients={clients ?? []}
          preselectedClientId={searchParams.client_id}
          quoteId={quote?.id}
          defaultEstimatedValue={quote?.total}
          defaultDescription={
            quote
              ? quote.notes ?? `Pedido generado a partir de la cotización ${quote.quote_number}`
              : undefined
          }
        />
      </div>
    </div>
  );
}
