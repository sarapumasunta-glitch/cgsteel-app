"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-brand-dark border-b border-brand-medium/20 sticky top-0 z-50">
      <div className="px-6 md:px-8 py-5 md:py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {/*
            logo-header.png / logo-icon.png son azul oscuro y quedan
            invisibles sobre el header oscuro (bg-brand-dark), por eso
            se usa la variante monocromática blanca en su lugar.
          */}
          <Image
            src="/brand/logo-mono-white.png"
            alt="Cg Steel Design"
            width={640}
            height={640}
            priority
            className="h-16 w-auto hidden md:block"
          />
          <Image
            src="/brand/logo-mono-white.png"
            alt="Cg Steel Design"
            width={640}
            height={640}
            priority
            className="h-12 w-auto md:hidden"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-brand-accent"
                  : "text-white hover:text-brand-accent"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cotizar"
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
        <nav className="md:hidden px-6 pb-6 flex flex-col gap-4 text-sm font-medium border-t border-brand-medium/20 pt-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                pathname === link.href
                  ? "text-brand-accent"
                  : "text-white"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cotizar"
            onClick={() => setOpen(false)}
            className="bg-brand-accent text-white font-semibold px-4 py-2 rounded text-center hover:brightness-90"
          >
            Solicitar cotización
          </Link>
        </nav>
      )}
    </header>
  );
}
