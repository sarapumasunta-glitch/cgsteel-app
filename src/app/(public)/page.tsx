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
import GalleryGrid from "@/components/GalleryGrid";
import FeaturedProjectsGrid from "@/components/FeaturedProjectsGrid";
import ServicesGrid from "@/components/ServicesGrid";
import { ProductCard, ComboCard } from "@/components/CatalogCards";
import { GALLERY_IMAGES } from "@/lib/gallery";
import { getPublishedProjectItems } from "@/lib/projects";
import { getActiveCombosWithProducts } from "@/lib/combos";
import { createClient } from "@/lib/supabase/server";
import HeroBanner from "@/components/HeroBanner";

const GALLERY_PREVIEW = GALLERY_IMAGES.slice(0, 8);
const FEATURED_PROJECTS_LIMIT = 5;

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

export default async function HomePage() {
  const supabase = createClient();

  const { data: featuredServices } = await supabase
    .from("services")
    .select("id, name, description, photo_url, video_url")
    .eq("active", true)
    .order("display_order")
    .limit(4);

  const projectItems = await getPublishedProjectItems(supabase);
  const featuredProjects = projectItems.slice(0, FEATURED_PROJECTS_LIMIT);
  const hasDynamicProjects = featuredProjects.length > 0;

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(6);

  const featuredCombos = await getActiveCombosWithProducts(supabase, 2);

  return (
    <main>
      <HeroBanner />

      <section className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-dark">
          Nuestros servicios
        </h2>
        {featuredServices && featuredServices.length > 0 ? (
          <div className="mt-8">
            <ServicesGrid services={featuredServices} showCatalogLink={false} />
          </div>
        ) : (
          <p className="mt-8 text-brand-medium">
            Muy pronto mostraremos aquí un resumen de nuestros servicios.
          </p>
        )}
        <div className="mt-8 text-center">
          <Link
            href="/servicios"
            className="inline-block bg-brand-accent text-white font-semibold px-6 py-3 rounded hover:brightness-90"
          >
            Ver todos los servicios
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-dark">
          Proyectos destacados
        </h2>
        <p className="mt-2 text-brand-medium max-w-2xl">
          Un vistazo real a nuestro taller y a los proyectos que hemos
          fabricado.
        </p>
        <div className="mt-8">
          {hasDynamicProjects ? (
            <FeaturedProjectsGrid projects={featuredProjects} />
          ) : (
            <GalleryGrid images={GALLERY_PREVIEW} />
          )}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/proyectos"
            className="inline-block bg-brand-accent text-white font-semibold px-6 py-3 rounded hover:brightness-90"
          >
            Ver todos los proyectos
          </Link>
        </div>
      </section>

      <section className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-dark">
          Nuestro catálogo
        </h2>
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-brand-medium">
            Muy pronto mostraremos aquí una selección de productos destacados.
          </p>
        )}

        {featuredCombos.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-bold text-brand-dark">
              Combos especiales
            </h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredCombos.map((combo) => (
                <ComboCard key={combo.id} combo={combo} />
              ))}
            </div>
          </div>
        )}

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
        <h2 className="text-2xl font-bold text-brand-dark">
          Cómo trabajamos
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {HOW_WE_WORK.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-start">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-medium/10 text-brand-medium">
                <step.icon size={24} />
              </div>
              <p className="mt-3 text-xs font-semibold text-brand-medium">
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

      <section className="bg-brand-dark text-white px-6 md:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold">
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

      <section className="bg-brand-accent px-6 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center">
            Por qué elegirnos
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <item.icon className="text-white shrink-0" size={24} />
                <p className="text-white font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
