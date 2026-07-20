import Image from "next/image";
import { siVisa, siMastercard, siDinersclub } from "simple-icons";

const CARD_ICONS = [siVisa, siMastercard, siDinersclub];

const LOCAL_PAYMENT_METHODS = [
  { name: "Bivi", src: "/brand/payment-bivi.png" },
  { name: "De Una", src: "/brand/payment-deuna.png" },
];

export default function PaymentMethods() {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-white/40 mb-3">
        Aceptamos
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {CARD_ICONS.map((icon) => (
          <div
            key={icon.slug}
            title={icon.title}
            className="flex items-center justify-center h-9 px-3 bg-white rounded"
          >
            <svg
              role="img"
              aria-label={icon.title}
              viewBox="0 0 24 24"
              className="h-4 w-auto"
              fill={`#${icon.hex}`}
            >
              <path d={icon.path} />
            </svg>
          </div>
        ))}
        {LOCAL_PAYMENT_METHODS.map((method) => (
          <div
            key={method.name}
            title={method.name}
            className="flex items-center justify-center h-9 px-3 bg-white rounded"
          >
            <Image
              src={method.src}
              alt={method.name}
              width={300}
              height={300}
              className="h-6 w-6 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
