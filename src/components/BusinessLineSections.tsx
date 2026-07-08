import Image from "next/image";
import { BUSINESS_LINES, type BusinessLine, type BusinessProduct } from "@/lib/businessLines";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

function ProductCard({ product }: { product: BusinessProduct }) {
  if (product.image) {
    return (
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="relative aspect-square bg-brand-light flex items-center justify-center p-4">
          <Image
            src={product.image}
            alt={product.name}
            width={280}
            height={280}
            quality={90}
            className="object-contain max-w-full max-h-full w-auto h-auto"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-brand-dark">{product.name}</h3>
          {product.description && (
            <p className="mt-1 text-sm text-brand-medium">{product.description}</p>
          )}
        </div>
      </div>
    );
  }

  const Icon = product.icon;

  return (
    <div className="bg-white rounded shadow overflow-hidden flex flex-col">
      <div className="aspect-square bg-brand-light flex items-center justify-center">
        {Icon && <Icon className="text-brand-accent" size={44} strokeWidth={1.5} />}
      </div>
      <div className="p-4 flex-1 flex flex-col items-start gap-2">
        <h3 className="font-semibold text-brand-dark">{product.name}</h3>
        {product.comingSoon && (
          <span className="text-xs font-semibold text-brand-accent bg-brand-accent/10 px-2 py-1 rounded">
            Próximamente
          </span>
        )}
      </div>
    </div>
  );
}

function BusinessLineSection({ line }: { line: BusinessLine }) {
  return (
    <section className="mt-16 first:mt-0">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-brand-dark">
            {line.title}
          </h2>
          <p className="mt-1 text-brand-medium">{line.message}</p>
        </div>
        <a
          href={buildWhatsAppUrl(line.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-block bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded hover:brightness-90"
        >
          Cotizar por WhatsApp
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {line.products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>

      {line.comingSoonNote && (
        <p className="mt-6 text-sm text-brand-medium italic">
          {line.comingSoonNote}
        </p>
      )}
    </section>
  );
}

export default function BusinessLineSections() {
  return (
    <>
      {BUSINESS_LINES.map((line) => (
        <BusinessLineSection key={line.slug} line={line} />
      ))}
    </>
  );
}
