import Image from "next/image";

export type TrustItem = {
  id: string;
  name: string;
  icon_or_photo_url: string | null;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TrustSection({ items }: { items: TrustItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-xl font-bold text-brand-dark text-center">
        Empresas y clientes que confían en nosotros
      </h2>
      <div className="mt-8 flex flex-wrap items-start justify-center gap-x-8 gap-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex w-28 flex-col items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-brand-medium/20 bg-white shadow-sm">
              {item.icon_or_photo_url ? (
                <Image
                  src={item.icon_or_photo_url}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-lg font-bold tracking-wide text-brand-medium">
                  {getInitials(item.name)}
                </span>
              )}
            </div>
            <span className="text-center text-sm font-medium leading-tight text-brand-dark">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
