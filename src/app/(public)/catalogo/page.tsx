import BusinessLineSections from "@/components/BusinessLineSections";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Page() {
  return (
    <main className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Catálogo</h1>
      <p className="mt-4 text-brand-medium max-w-2xl">
        Una muestra de nuestro trabajo, organizada en cuatro líneas de
        negocio. Si no ves exactamente lo que buscas, cuéntanos tu proyecto y
        lo fabricamos a medida.
      </p>

      <BusinessLineSections />

      <section className="mt-16 bg-brand-dark text-white rounded p-10 text-center">
        <h2 className="text-xl font-heading font-bold">¿Buscas algo más?</h2>
        <p className="mt-2 text-white/70 max-w-xl mx-auto">
          Fabricamos piezas a medida a partir de una foto, un plano o una
          idea. Escríbenos y lo conversamos.
        </p>
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 bg-green-600 text-white font-semibold px-6 py-3 rounded hover:brightness-90"
        >
          Escríbenos por WhatsApp
        </a>
      </section>
    </main>
  );
}
