export default function HomePage() {
  return (
    <main>
      <section className="bg-industrial-blue text-off-white px-8 py-24">
        <h1 className="text-4xl font-bold max-w-2xl">
          Ingeniería y fabricación en metal para proyectos que exigen
          precisión.
        </h1>
        <p className="mt-4 max-w-xl text-steel-gray-100 text-lg">
          Cg Steel Design diseña y fabrica estructuras metálicas, rótulos,
          cajas de luz y mobiliario industrial a medida.
        </p>
        <a
          href="/cotizar"
          className="inline-block mt-8 bg-industrial-orange text-white font-semibold px-6 py-3 rounded"
        >
          Solicitar cotización
        </a>
      </section>

      {/*
        TODO: secciones Nosotros / Servicios / Proyectos / Galería
        destacados, cada una enlazando a su página completa.
      */}
    </main>
  );
}
