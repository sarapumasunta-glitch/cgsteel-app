"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="px-6 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-xl text-industrial-blue">
          Cg Steel Design
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-industrial-orange"
                  : "text-carbon-black hover:text-industrial-orange"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cotizar"
            className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded"
          >
            Solicitar cotización
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          className="md:hidden text-industrial-blue"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden px-6 pb-6 flex flex-col gap-4 text-sm font-medium border-t pt-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                pathname === link.href
                  ? "text-industrial-orange"
                  : "text-carbon-black"
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cotizar"
            onClick={() => setOpen(false)}
            className="bg-industrial-orange text-white font-semibold px-4 py-2 rounded text-center"
          >
            Solicitar cotización
          </Link>
        </nav>
      )}
    </header>
  );
}
