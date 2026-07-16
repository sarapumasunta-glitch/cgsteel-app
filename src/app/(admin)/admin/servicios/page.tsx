import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ServiceRow from "./ServiceRow";

export default async function ServiciosAdminPage() {
  const supabase = createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("display_order");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">Servicios</h1>
        <Link
          href="/admin/servicios/nuevo"
          className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
        >
          Nuevo servicio
        </Link>
      </div>
      <p className="mt-2 text-sm text-steel-gray max-w-2xl">
        Solo los servicios activos aparecen en /servicios. Puedes desactivar
        uno sin eliminarlo.
      </p>

      <div className="mt-6 bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-gray border-b">
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Video</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(services ?? []).map((service, index) => (
              <ServiceRow
                key={service.id}
                service={service}
                isFirst={index === 0}
                isLast={index === (services ?? []).length - 1}
              />
            ))}
            {(services ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-steel-gray">
                  No hay servicios todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
