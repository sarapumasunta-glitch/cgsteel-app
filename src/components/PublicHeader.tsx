"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { trackEvent } from "@/lib/analytics";

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-brand-dark border-b border-brand-medium/20 sticky top-0 z-50">
      <div className="h-20 px-6 md:px-8 flex items-center justify-between">
        {/*
          logo-header.png / logo-icon.png son azul oscuro y quedan
          invisibles sobre el header oscuro (bg-brand-dark), por eso
          se usa la variante monocromática blanca en su lugar. El
          contenedor tiene altura fija (h-20) y la imagen se ajusta con
          h-full/object-contain para que el padding transparente del
          PNG nunca empuje la altura del header.
        */}
        <Link href="/" className="flex items-center h-full py-3">
          <Image
            src="/brand/logo-icon-mono-white.png"
            alt="Cg Steel Design"
            width={681}
            height={801}
            priority
            className="h-full w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-white font-semibold"
                  : "text-white/70 hover:text-white transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cotizar"
            onClick={() => trackEvent("click_solicitar_cotizacion")}
            className="bg-brand-accent text-white font-semibold px-4 py-2 rounded hover:brightness-90"
          >
            Solicitar cotización
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          className="md:hidden text-white"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <nav className="mobile-nav-panel md:hidden px-6 pb-6 flex flex-col gap-4 text-sm font-medium border-t border-brand-medium/20 pt-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                pathname === link.href
                  ? "text-white font-semibold"
                  : "text-white/70"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cotizar"
            onClick={() => {
              trackEvent("click_solicitar_cotizacion");
              setOpen(false);
            }}
            className="bg-brand-accent text-white font-semibold px-4 py-2 rounded text-center hover:brightness-90"
          >
            Solicitar cotización
          </Link>
        </nav>
      )}
    </header>
  );
}
