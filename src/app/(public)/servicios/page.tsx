import { createClient } from "@/lib/supabase/server";
import ServicesGrid from "@/components/ServicesGrid";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import TrackedLink from "@/components/TrackedLink";

export default async function Page() {
  const supabase = createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, video_url, service_images(image_url, display_order, active)")
    .eq("active", true)
    .order("display_order");

  const hasServices = (services ?? []).length > 0;

  return (
    <main className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Servicios</h1>
      <p className="mt-4 text-brand-medium max-w-2xl">
        Un solo aliado para cualquier proyecto en metal. Cuéntanos qué
        necesitas y te asesoramos desde el diseño hasta la instalación.
      </p>

      <div className="mt-10">
        {hasServices ? (
          <ServicesGrid services={services!} />
        ) : (
          <div className="bg-white rounded shadow p-8 text-center max-w-lg mx-auto">
            <p className="text-brand-medium">
              Servicios en actualización, contáctanos por WhatsApp.
            </p>
            <TrackedLink
              href={buildWhatsAppUrl(
                "Hola, quiero saber más sobre los servicios de Cg Steel Design."
              )}
              external
              eventName="click_whatsapp_cotizar"
              eventParams={{ source: "servicios_sin_resultados" }}
              className="mt-4 inline-block bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded hover:brightness-90"
            >
              Cotizar por WhatsApp
            </TrackedLink>
          </div>
        )}
      </div>
    </main>
  );
}
