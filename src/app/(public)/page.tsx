import Image from "next/image";
import Link from "next/link";
import {
  Lightbulb,
  Armchair,
  SignpostBig,
  PartyPopper,
  Target,
  HeartHandshake,
  Clock,
  BadgeCheck,
} from "lucide-react";

const SERVICES = [
  {
    icon: Lightbulb,
    title: "Rótulos y cajas de luz",
    description: "Rótulos luminosos y cajas de luz publicitarias a medida.",
  },
  {
    icon: Armchair,
    title: "Mobiliario metálico",
    description: "Mobiliario metálico a medida para locales e industria.",
  },
  {
    icon: SignpostBig,
    title: "Señalética",
    description: "Señalética informativa y de seguridad en PVC y vinil.",
  },
  {
    icon: PartyPopper,
    title: "Estructuras para eventos",
    description: "Estructuras metálicas y tarimas para eventos y ferias.",
  },
];

const CATALOG_HIGHLIGHTS = [
  {
    image: "/catalog/mobiliario/consola-egipcia.jpg",
    name: 'Consola modelo "Egipcia"',
  },
  {
    image: "/catalog/mobiliario/tarima.jpg",
    name: "Tarima / Escenario metálico",
  },
  {
    image: "/catalog/rotulacion/caja-luz-circular.jpg",
    name: "Caja de luz circular",
  },
  {
    image: "/catalog/rotulacion/triangulo-con-luz.jpg",
    name: "Triángulo (con luz)",
  },
  {
    image: "/catalog/mobiliario/foot-table.jpg",
    name: "Foot Table",
  },
  {
    image: "/catalog/sublimados/jarro-blanco.jpg",
    name: "Jarro blanco 11oz sublimado",
  },
];

const WHY_US = [
  {
    icon: Target,
    text: "Precisión en fabricación digital",
  },
  {
    icon: HeartHandshake,
    text: "Atención personalizada",
  },
  {
    icon: Clock,
    text: "Cumplimiento de plazos",
  },
  {
    icon: BadgeCheck,
    text: "Acabados de calidad industrial",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-brand-dark text-white px-8 py-24">
        <h1 className="text-4xl font-bold max-w-2xl">
          Ingeniería y fabricación en metal para proyectos que exigen
          precisión.
        </h1>
        <p className="mt-4 max-w-xl text-white/80 text-lg">
          Cg Steel Design diseña y fabrica estructuras metálicas, rótulos,
          cajas de luz y mobiliario industrial a medida.
        </p>
        <a
          href="/cotizar"
          className="inline-block mt-8 bg-brand-accent text-white font-semibold px-6 py-3 rounded hover:brightness-90"
        >
          Solicitar cotización
        </a>
      </section>

      <section className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">
          Nuestros servicios
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded shadow p-6 flex flex-col"
            >
              <service.icon className="text-brand-accent" size={28} />
              <h3 className="mt-3 font-semibold text-brand-dark">
                {service.title}
              </h3>
              <p className="mt-1 text-sm text-brand-medium flex-1">
                {service.description}
              </p>
              <Link
                href="/servicios"
                className="mt-3 text-sm font-semibold text-brand-ring hover:text-brand-accent"
              >
                Ver más →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">
          Nuestro catálogo
        </h2>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-6">
          {CATALOG_HIGHLIGHTS.map((item) => (
            <div key={item.image} className="bg-white rounded shadow overflow-hidden">
              <div className="relative aspect-square bg-brand-light">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-contain p-4"
                />
              </div>
              <p className="px-3 py-2 text-sm font-medium text-brand-dark">
                {item.name}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/catalogo"
            className="inline-block bg-brand-accent text-white font-semibold px-6 py-3 rounded hover:brightness-90"
          >
            Ver catálogo completo
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">
          Por qué elegirnos
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <item.icon className="text-brand-accent shrink-0" size={24} />
              <p className="text-brand-dark font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-dark text-white px-6 md:px-8 py-16 text-center">
        <h2 className="text-2xl font-heading font-bold">
          ¿Tienes un proyecto en mente?
        </h2>
        <p className="mt-2 text-white/80">
          Cuéntanos qué necesitas fabricar y te ayudamos a hacerlo realidad.
        </p>
        <a
          href="/cotizar"
          className="inline-block mt-6 bg-brand-accent text-white font-semibold px-6 py-3 rounded hover:brightness-90"
        >
          Solicitar cotización
        </a>
      </section>
    </main>
  );
}
