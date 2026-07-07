import { createClient } from "@/lib/supabase/server";

async function getMetrics() {
  const supabase = createClient();

  const [{ count: activeOrders }, { count: totalClients }, { data: quotes }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .not("status", "in", "(entregado,cancelado)"),
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase
        .from("quotes")
        .select("total, status")
        .eq("status", "aprobada"),
    ]);

  const approvedTotal =
    quotes?.reduce((sum, q) => sum + Number(q.total), 0) ?? 0;

  return { activeOrders, totalClients, approvedTotal };
}

export default async function DashboardPage() {
  const { activeOrders, totalClients, approvedTotal } = await getMetrics();

  const cards = [
    { label: "Pedidos activos", value: activeOrders ?? 0 },
    { label: "Clientes registrados", value: totalClients ?? 0 },
    {
      label: "Cotizaciones aprobadas ($)",
      value: approvedTotal.toLocaleString("es-EC", {
        style: "currency",
        currency: "USD",
      }),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark">
        Dashboard gerencial
      </h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded shadow p-6">
            <p className="text-brand-medium text-sm">{c.label}</p>
            <p className="text-3xl font-bold text-brand-dark mt-2">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/*
        TODO fase 2: gráficos con recharts para
        - Ventas por canal de ingreso
        - Rentabilidad por proyecto
        - Flujo de caja proyectado
      */}
    </div>
  );
}
