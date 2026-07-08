import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewClientForm from "./NewClientForm";
import ClientesSearch from "./ClientesSearch";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createClient();

  let query = supabase.from("clients").select("*").order("created_at", { ascending: false });

  if (searchParams.q) {
    const term = searchParams.q.trim();
    query = query.or(
      `contact_name.ilike.%${term}%,company_name.ilike.%${term}%,ruc.ilike.%${term}%`
    );
  }

  const { data: clients } = await query;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">Clientes</h1>
        <NewClientForm />
      </div>

      <div className="mt-4">
        <ClientesSearch />
      </div>

      <div className="mt-4 bg-white rounded shadow overflow-x-auto">
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
              <tr
                key={client.id}
                className="border-b last:border-0 hover:bg-off-white cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-carbon-black">
                  <Link href={`/admin/clientes/${client.id}`} className="block">
                    {client.contact_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/clientes/${client.id}`} className="block">
                    {client.company_name ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/clientes/${client.id}`} className="block">
                    {client.phone ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-steel-gray">
                  <Link href={`/admin/clientes/${client.id}`} className="block">
                    {client.email ?? "—"}
                  </Link>
                </td>
              </tr>
            ))}
            {(clients ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-steel-gray">
                  {searchParams.q
                    ? "Ningún cliente coincide con la búsqueda."
                    : "Todavía no hay clientes registrados."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
