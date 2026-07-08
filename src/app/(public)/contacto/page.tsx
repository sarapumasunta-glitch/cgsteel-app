import { WHATSAPP_DISPLAY, buildWhatsAppUrl } from "@/lib/whatsapp";

const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s-0.093929,-78.436098!6i15!3m1!1ses!5m1!1ses";
const MAPS_LINK = "https://maps.app.goo.gl/NY83PX8hPdaGi4SV9";

export default function Page() {
  return (
    <main className="px-6 md:px-8 py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Contacto</h1>
      <p className="mt-4 text-brand-medium">
        Cuéntanos qué necesitas fabricar y te respondemos a la brevedad, ya
        sea por WhatsApp o mediante el formulario de cotización.
      </p>

      <div className="mt-8 bg-white rounded shadow p-6 space-y-4">
        <div>
          <p className="text-sm text-brand-medium">WhatsApp</p>
          <p className="font-semibold text-brand-dark">{WHATSAPP_DISPLAY}</p>
        </div>

        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded hover:brightness-90"
        >
          Escríbenos por WhatsApp
        </a>

        <div className="pt-4 border-t border-brand-medium/20">
          <p className="text-sm text-brand-medium">
            ¿Prefieres dejarnos los detalles de tu proyecto por escrito?{" "}
            <a href="/cotizar" className="font-semibold text-brand-ring hover:text-brand-accent underline">
              Completa el formulario de cotización
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded shadow p-6">
        <h2 className="font-heading font-bold text-lg text-brand-dark">
          Taller propio en Calderón, Quito
        </h2>
        <p className="mt-1 text-sm text-brand-medium">
          Visítanos con cita previa o coordina la entrega de tu proyecto
          directamente en nuestro taller.
        </p>
        <div className="mt-4 rounded overflow-hidden border border-brand-medium/20">
          <iframe
            src={MAPS_EMBED_SRC}
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación del taller Cg Steel Design en Calderón, Quito"
          />
        </div>
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-brand-ring hover:text-brand-accent underline"
        >
          Abrir en Google Maps
        </a>
      </div>
    </main>
  );
}
