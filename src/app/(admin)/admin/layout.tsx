import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: newRequestsCount } = await supabase
    .from("quote_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "nuevo");

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-industrial-blue text-off-white p-6">
        <h2 className="font-bold text-lg">Cg Steel Design</h2>
        <nav className="mt-8 space-y-2 text-sm">
          <a href="/admin" className="block hover:text-industrial-orange">
            Dashboard
          </a>
          <a
            href="/admin/solicitudes"
            className="flex items-center justify-between hover:text-industrial-orange"
          >
            Solicitudes
            {!!newRequestsCount && (
              <span className="bg-industrial-orange text-white text-xs font-semibold rounded-full px-2 py-0.5">
                {newRequestsCount}
              </span>
            )}
          </a>
          <a
            href="/admin/clientes"
            className="block hover:text-industrial-orange"
          >
            Clientes
          </a>
          <a
            href="/admin/cotizaciones"
            className="block hover:text-industrial-orange"
          >
            Cotizaciones
          </a>
          <a
            href="/admin/pedidos"
            className="block hover:text-industrial-orange"
          >
            Pedidos
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-off-white">{children}</main>
    </div>
  );
}
