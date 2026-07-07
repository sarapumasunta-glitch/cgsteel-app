import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";

const WHATSAPP_NUMBER = "593983842395";
const WHATSAPP_DISPLAY = "+593 98 384 2395";

export default function PublicFooter() {
  return (
    <footer className="bg-brand-dark text-white px-6 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div>
          <h2 className="font-heading font-bold text-lg">Cg Steel Design</h2>
          <p className="mt-2 text-sm text-white/60">
            Fabricación digital y estructural en metal: letreros, cajas de
            luz, mobiliario metálico y proyectos industriales a medida.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wide text-white/60">
            Enlaces rápidos
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wide text-white/60">
            Contacto
          </h3>
          <p className="mt-3 text-sm">WhatsApp: {WHATSAPP_DISPLAY}</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            className="inline-block mt-3 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded hover:brightness-90"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-brand-medium/20 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-white/50">
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
