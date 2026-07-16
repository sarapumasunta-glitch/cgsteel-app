import { createClient } from "@/lib/supabase/server";
import HeroBannerCarousel from "@/components/HeroBannerCarousel";

function HeroBannerFallback() {
  return (
    <section className="bg-brand-dark text-white px-8 py-24">
      <h1 className="text-4xl font-bold max-w-2xl">
        Un solo aliado para cualquier proyecto en metal — de la idea
        individual a la producción en serie.
      </h1>
      <p className="mt-4 max-w-xl text-white/80 text-lg">
        Fabricación por unidad o por volumen — para el hogar, el evento, o la
        obra completa.
      </p>
      <a
        href="/cotizar"
        className="inline-block mt-8 bg-brand-accent text-white font-semibold px-6 py-3 rounded hover:brightness-90"
      >
        Solicitar cotización
      </a>
    </section>
  );
}

export default async function HeroBanner() {
  const supabase = createClient();

  const { data: items } = await supabase
    .from("hero_banner_items")
    .select("*")
    .eq("active", true)
    .order("display_order");

  const activeVideo = (items ?? []).find((item) => item.type === "video");
  const activeImages = (items ?? []).filter((item) => item.type === "image");

  if (activeVideo) {
    return (
      <section className="relative w-full h-[40vh] md:h-[60vh] bg-brand-dark overflow-hidden">
        <video
          src={activeVideo.media_url}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </section>
    );
  }

  if (activeImages.length > 0) {
    return (
      <HeroBannerCarousel images={activeImages.map((item) => item.media_url)} />
    );
  }

  return <HeroBannerFallback />;
}
