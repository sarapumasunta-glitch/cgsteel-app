import { createClient } from "@/lib/supabase/server";
import NewQuoteForm from "./NewQuoteForm";

export default async function NuevaCotizacionPage({
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
      <h1 className="text-2xl font-bold text-industrial-blue">Nueva cotización</h1>
      <div className="mt-6">
        <NewQuoteForm
          clients={clients ?? []}
          preselectedClientId={searchParams.client_id}
        />
      </div>
    </div>
  );
}
