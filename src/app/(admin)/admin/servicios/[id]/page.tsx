import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditServiceForm from "./EditServiceForm";

export default async function EditarServicioPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!service) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">{service.name}</h1>
      <div className="mt-6">
        <EditServiceForm service={service} />
      </div>
    </div>
  );
}
