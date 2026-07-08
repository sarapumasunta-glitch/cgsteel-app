import Image from "next/image";
import Link from "next/link";
import {
  Target,
  HeartHandshake,
  Clock,
  BadgeCheck,
  FileText,
  PenTool,
  Flame,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { BUSINESS_LINES } from "@/lib/businessLines";
import GalleryGrid from "@/components/GalleryGrid";
import { GALLERY_IMAGES } from "@/lib/gallery";

const GALLERY_PREVIEW = GALLERY_IMAGES.slice(0, 8);

const HOW_WE_WORK = [
  {
    icon: FileText,
    title: "Cotización",
    description: "Nos cuentas tu proyecto y te enviamos una cotización clara.",
  },
  {
    icon: PenTool,
    title: "Diseño",
    description: "Definimos medidas, materiales y acabados antes de fabricar.",
  },
  {
    icon: Flame,
    title: "Fabricación",
    description: "Corte, plegado y soldadura en nuestro taller propio.",
  },
  {
    icon: Wrench,
    title: "Instalación",
    description: "Entregamos o instalamos en el sitio según el proyecto.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía y seguimiento",
    description: "Respaldamos el trabajo y damos seguimiento post-entrega.",
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
    image: "/catalog/mobiliario/soporte-arco.jpg",
    name: "Soporte Arco para decoración",
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
          Un solo aliado para cualquier proyecto en metal — de la idea
          individual a la producción en serie.
        </h1>
        <p className="mt-4 max-w-xl text-white/80 text-lg">
          Fabricación por unidad o por volumen — para el hogar, el evento, o
          la obra completa.
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
          Nuestras líneas de negocio
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUSINESS_LINES.map((line) => (
            <div
              key={line.slug}
              className="bg-white rounded shadow p-6 flex flex-col"
            >
              <line.icon className="text-brand-accent" size={28} />
              <h3 className="mt-3 font-semibold text-brand-dark">
                {line.title}
              </h3>
              <p className="mt-1 text-sm text-brand-medium flex-1">
                {line.message}
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
              <div className="relative aspect-square bg-brand-light flex items-center justify-center p-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={220}
                  height={220}
                  quality={90}
                  className="object-contain max-w-full max-h-full w-auto h-auto"
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
          Proyectos realizados
        </h2>
        <p className="mt-2 text-brand-medium max-w-2xl">
          Un vistazo real a nuestro taller y a los proyectos que hemos
          fabricado.
        </p>
        <div className="mt-8">
          <GalleryGrid images={GALLERY_PREVIEW} />
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/galeria"
            className="inline-block bg-brand-accent text-white font-semibold px-6 py-3 rounded hover:brightness-90"
          >
            Ver galería completa
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-brand-dark">
          Cómo trabajamos
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {HOW_WE_WORK.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-accent/10 text-brand-accent">
                <step.icon size={24} />
              </div>
              <p className="mt-3 text-xs font-semibold text-brand-accent">
                Paso {index + 1}
              </p>
              <h3 className="mt-1 font-semibold text-brand-dark">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-brand-medium">
                {step.description}
              </p>
            </div>
          ))}
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
