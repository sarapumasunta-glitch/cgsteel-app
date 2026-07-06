import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cg Steel Design | Ingeniería y Fabricación en Metal",
  description:
    "Fabricación digital y estructural en metal. Letreros, cajas de luz, mobiliario metálico y proyectos industriales a medida.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
