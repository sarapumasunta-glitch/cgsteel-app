import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";

const WHATSAPP_NUMBER = "593983842395";
const WHATSAPP_DISPLAY = "+593 98 384 2395";

export default function PublicFooter() {
  return (
    <footer className="bg-carbon-black text-off-white px-6 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div>
          <h2 className="font-heading font-bold text-lg">Cg Steel Design</h2>
          <p className="mt-2 text-sm text-steel-gray">
            Fabricación digital y estructural en metal: letreros, cajas de
            luz, mobiliario metálico y proyectos industriales a medida.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wide text-steel-gray">
            Enlaces rápidos
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-industrial-orange">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wide text-steel-gray">
            Contacto
          </h3>
          <p className="mt-3 text-sm">WhatsApp: {WHATSAPP_DISPLAY}</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            className="inline-block mt-3 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-steel-gray/30 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-steel-gray">
          © {new Date().getFullYear()} Cg Steel Design. Todos los derechos
          reservados.
        </p>
        <Link href="/login" className="text-xs text-steel-gray/60 hover:text-steel-gray">
          Acceso interno
        </Link>
      </div>
    </footer>
  );
}
