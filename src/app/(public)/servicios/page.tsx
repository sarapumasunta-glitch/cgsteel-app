import BusinessLineSections from "@/components/BusinessLineSections";

export default function Page() {
  return (
    <main className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Servicios</h1>
      <p className="mt-4 text-brand-medium max-w-2xl">
        Un solo aliado para cualquier proyecto en metal, organizado en cuatro
        líneas de negocio. Cuéntanos qué necesitas y te asesoramos desde el
        diseño hasta la instalación.
      </p>

      <BusinessLineSections />
    </main>
  );
}
