const SERVICES = [
  {
    title: "Rótulos y letreros",
    description:
      "Rótulos luminosos y no luminosos para fachadas, corte de letras 3D y señalización de marca.",
  },
  {
    title: "Cajas de luz",
    description:
      "Cajas de luz publicitarias con acabados en acrílico y estructura metálica reforzada.",
  },
  {
    title: "Mobiliario metálico",
    description:
      "Mesas, estanterías, exhibidores y mobiliario a medida para locales comerciales e industriales.",
  },
  {
    title: "Señalética",
    description:
      "Señalética informativa, de seguridad y normativa para empresas, locales y espacios públicos.",
  },
  {
    title: "Estructuras para eventos",
    description:
      "Estructuras metálicas desarmables y tarimas para ferias, activaciones de marca y eventos.",
  },
];

export default function Page() {
  return (
    <main className="px-6 md:px-8 py-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Servicios</h1>
      <p className="mt-4 text-brand-medium max-w-2xl">
        Fabricamos en metal a partir de un boceto, un plano o una idea.
        Estos son los servicios que ofrecemos con mayor frecuencia.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map((service) => (
          <div key={service.title} className="bg-white rounded shadow p-6">
            <h2 className="font-heading font-bold text-lg text-brand-dark">
              {service.title}
            </h2>
            <p className="mt-2 text-sm text-brand-medium">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <a
        href="/cotizar"
        className="inline-block mt-10 bg-brand-accent text-white font-semibold px-6 py-3 rounded hover:brightness-90"
      >
        Solicitar cotización
      </a>
    </main>
  );
}
