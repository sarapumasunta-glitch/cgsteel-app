import { createClient } from "@/lib/supabase/server";
import NewClientForm from "./NewClientForm";

export default async function ClientesPage() {
  const supabase = createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">Clientes</h1>
        <NewClientForm />
      </div>

      <div className="mt-6 bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {(clients ?? []).map((client) => (
              <tr key={client.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium text-carbon-black">
                  {client.contact_name}
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  {client.company_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  {client.phone ?? "—"}
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  {client.email ?? "—"}
                </td>
              </tr>
            ))}
            {(clients ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-steel-gray">
                  Todavía no hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
