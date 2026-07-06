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

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-industrial-blue text-off-white p-6">
        <h2 className="font-bold text-lg">Cg Steel Design</h2>
        <nav className="mt-8 space-y-2 text-sm">
          <a href="/admin" className="block hover:text-industrial-orange">
            Dashboard
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
