import GalleryGrid from "@/components/GalleryGrid";
import { GALLERY_IMAGES } from "@/lib/gallery";

export default function Page() {
  return (
    <main className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Galería</h1>
      <p className="mt-4 text-brand-medium max-w-2xl">
        Un vistazo a nuestro taller y a los proyectos que hemos fabricado.
        Haz clic en cualquier foto para ampliarla.
      </p>

      <div className="mt-10">
        <GalleryGrid images={GALLERY_IMAGES} />
      </div>
    </main>
  );
}
