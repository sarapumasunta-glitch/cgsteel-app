import { redirect } from "next/navigation";
import Image from "next/image";
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
      <aside className="w-64 bg-brand-dark text-white p-6">
        <Image
          src="/brand/logo-icon-mono-white.png"
          alt="Cg Steel Design"
          width={681}
          height={801}
          className="h-16 w-auto object-contain"
        />
        <nav className="mt-10 space-y-2 text-sm">
          <a href="/admin" className="block hover:text-brand-accent">
            Dashboard
          </a>
          <a
            href="/admin/solicitudes"
            className="flex items-center justify-between hover:text-brand-accent"
          >
            Solicitudes
            {!!newRequestsCount && (
              <span className="bg-brand-accent text-white text-xs font-semibold rounded-full px-2 py-0.5">
                {newRequestsCount}
              </span>
            )}
          </a>
          <a
            href="/admin/clientes"
            className="block hover:text-brand-accent"
          >
            Clientes
          </a>
          <a
            href="/admin/catalogo"
            className="block hover:text-brand-accent"
          >
            Catálogo
          </a>
          <a
            href="/admin/banner"
            className="block hover:text-brand-accent"
          >
            Banner
          </a>
          <a
            href="/admin/proyectos"
            className="block hover:text-brand-accent"
          >
            Proyectos
          </a>
          <a
            href="/admin/servicios"
            className="block hover:text-brand-accent"
          >
            Servicios
          </a>
          <a
            href="/admin/cotizaciones"
            className="block hover:text-brand-accent"
          >
            Cotizaciones
          </a>
          <a
            href="/admin/pedidos"
            className="block hover:text-brand-accent"
          >
            Pedidos
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-brand-light">{children}</main>
    </div>
  );
}
