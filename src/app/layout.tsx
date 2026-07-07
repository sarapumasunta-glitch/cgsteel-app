import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cg Steel Design | Ingeniería y Fabricación en Metal",
  description:
    "Fabricación digital y estructural en metal. Letreros, cajas de luz, mobiliario metálico y proyectos industriales a medida.",
  icons: {
    icon: [
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/brand/favicon-180.png",
  },
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
