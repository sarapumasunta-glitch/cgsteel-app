import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditServiceForm from "./EditServiceForm";
import ServicePhotoGallery from "./ServicePhotoGallery";
import AddServicePhotosForm from "./AddServicePhotosForm";

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

  const { data: images } = await supabase
    .from("service_images")
    .select("*")
    .eq("service_id", params.id)
    .order("display_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-industrial-blue">{service.name}</h1>
      <div className="max-w-2xl">
        <EditServiceForm service={service} />
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold text-industrial-blue mb-4">Fotos del servicio</h2>
        <ServicePhotoGallery serviceId={service.id} images={images ?? []} />
      </div>

      <div className="bg-white rounded shadow p-6 max-w-2xl">
        <h2 className="font-bold text-industrial-blue mb-4">Agregar más fotos</h2>
        <AddServicePhotosForm serviceId={service.id} />
      </div>
    </div>
  );
}
