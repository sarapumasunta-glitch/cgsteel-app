import Link from "next/link";
import { Instagram } from "lucide-react";
import { WHATSAPP_DISPLAY, buildWhatsAppUrl } from "@/lib/whatsapp";

const INSTAGRAM_URL = "https://www.instagram.com/cgsteeldesign";
const TIKTOK_URL = "https://www.tiktok.com/@cg.steel.design";

const FOOTER_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
  { href: "/cotizar", label: "Solicitar cotización" },
];

function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.6 5.82c-.9-.86-1.5-2.02-1.6-3.32h-3.2v13.7c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1-2.72-2.72 2.72 2.72 0 0 1 2.72-2.72c.28 0 .55.04.8.12v-3.27a6.02 6.02 0 0 0-.8-.05A5.97 5.97 0 0 0 3.12 16.2 5.97 5.97 0 0 0 9.1 22.16a5.97 5.97 0 0 0 5.97-5.97V9.4a8.16 8.16 0 0 0 4.77 1.53V7.72a4.85 4.85 0 0 1-3.24-1.9z" />
    </svg>
  );
}

export default function PublicFooter() {
  return (
    <footer className="bg-brand-dark text-white px-6 md:px-8 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <h2 className="font-heading font-bold text-lg">Cg Steel Design</h2>
          <p className="mt-2 text-sm text-white/60 max-w-sm">
            Fabricación digital y estructural en metal: letreros, cajas de
            luz, mobiliario metálico y proyectos industriales a medida.
          </p>

          <div className="mt-4 flex items-center gap-1 -ml-2.5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Instagram"
              className="flex items-center justify-center w-10 h-10 rounded-full text-white/70 hover:text-brand-accent transition-colors"
            >
              <Instagram size={22} />
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en TikTok"
              className="flex items-center justify-center w-10 h-10 rounded-full text-white/70 hover:text-brand-accent transition-colors"
            >
              <TikTokIcon size={22} />
            </a>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-sm text-white/60">WhatsApp: {WHATSAPP_DISPLAY}</p>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded hover:brightness-90"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>

      <nav className="max-w-5xl mx-auto mt-8 pt-6 border-t border-brand-medium/20 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/50">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-white/80 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="max-w-5xl mx-auto mt-6 pt-6 border-t border-brand-medium/20 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Cg Steel Design. Todos los derechos
          reservados.
        </p>
        <Link href="/login" className="text-xs text-white/40 hover:text-white/70">
          Acceso interno
        </Link>
      </div>
    </footer>
  );
}
