const WHATSAPP_NUMBER = "593983842395";
const WHATSAPP_DISPLAY = "+593 98 384 2395";

export default function Page() {
  return (
    <main className="px-6 md:px-8 py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-industrial-blue">Contacto</h1>
      <p className="mt-4 text-steel-gray">
        Cuéntanos qué necesitas fabricar y te respondemos a la brevedad, ya
        sea por WhatsApp o mediante el formulario de cotización.
      </p>

      <div className="mt-8 bg-white rounded shadow p-6 space-y-4">
        <div>
          <p className="text-sm text-steel-gray">WhatsApp</p>
          <p className="font-semibold text-carbon-black">{WHATSAPP_DISPLAY}</p>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded"
        >
          Escríbenos por WhatsApp
        </a>

        <div className="pt-4 border-t">
          <p className="text-sm text-steel-gray">
            ¿Prefieres dejarnos los detalles de tu proyecto por escrito?
          </p>
          <a
            href="/cotizar"
            className="inline-block mt-3 bg-industrial-orange text-white font-semibold px-6 py-3 rounded"
          >
            Solicitar cotización
          </a>
        </div>
      </div>
    </main>
  );
}
