import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Umbrella,
  Warehouse,
  DoorOpen,
  AppWindow,
  Layers,
  Fence,
  SignpostBig,
  Flower2,
  Armchair,
  Table2,
  Rainbow,
  PartyPopper,
} from "lucide-react";

export type BusinessProduct = {
  name: string;
  description?: string;
  image?: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
};

export type BusinessLine = {
  slug: string;
  title: string;
  message: string;
  icon: LucideIcon;
  whatsappMessage?: string;
  comingSoonNote?: string;
  products: BusinessProduct[];
};

export const BUSINESS_LINES: BusinessLine[] = [
  {
    slug: "arquitectura",
    title: "Arquitectura & Estructuras Metálicas",
    message:
      "Del plano a la obra: estructuras metálicas para tu hogar o negocio",
    icon: Building2,
    whatsappMessage:
      "Hola, quisiera cotizar un proyecto de estructura metálica/arquitectura",
    comingSoonNote: "Próximamente: casos reales de nuestros proyectos",
    products: [
      { name: "Pérgolas", icon: Umbrella, comingSoon: true },
      { name: "Techos", icon: Warehouse, comingSoon: true },
      { name: "Puertas", icon: DoorOpen, comingSoon: true },
      { name: "Ventanas", icon: AppWindow, comingSoon: true },
      { name: "Losas", icon: Layers, comingSoon: true },
      { name: "Seguridades residenciales", icon: Fence, comingSoon: true },
    ],
  },
  {
    slug: "publicidad",
    title: "Publicidad & Señalización",
    message: "Haz que tu marca se vea",
    icon: SignpostBig,
    products: [
      {
        name: "Triángulo (sin luz)",
        image: "/catalog/rotulacion/triangulo-sin-luz.jpg",
        description: "Altura 100 cm, estructura de caras dobles",
      },
      {
        name: "Triángulo (con luz)",
        image: "/catalog/rotulacion/triangulo-con-luz.jpg",
        description: "Triangular con estructura y luz interior",
      },
      {
        name: "Señalética",
        image: "/catalog/rotulacion/senaletica.jpg",
        description: "Material: PVC y vinil",
      },
      {
        name: "Caballete",
        image: "/catalog/rotulacion/caballete.jpg",
        description: "Estructura metálica",
      },
      {
        name: "Rótulo (bastidor)",
        image: "/catalog/rotulacion/rotulo-bastidor.jpg",
        description: "Estructura de tubo cuadrado",
      },
      {
        name: "Caja de luz circular",
        image: "/catalog/rotulacion/caja-luz-circular.jpg",
        description: "Estructura de tubo cuadrado",
      },
      {
        name: "Caja luminosa 4 x 1",
        image: "/catalog/rotulacion/caja-luminosa-4x1.jpg",
        description: "Estructura metálica",
      },
      {
        name: "Caja luminosa 1 x 1",
        image: "/catalog/rotulacion/caja-luminosa-1x1.jpg",
        description: "Estructura de tubo metálico 3/4",
      },
    ],
  },
  {
    slug: "decoracion",
    title: "Decoración & Mobiliario en Metal",
    message: "Diseño con carácter industrial para espacios únicos",
    icon: Armchair,
    products: [
      {
        name: "Soporte Arco para decoración",
        image: "/catalog/mobiliario/soporte-arco.jpg",
        description: "Medida: 180 x 80 cm",
      },
      {
        name: "Consola Elegant",
        image: "/catalog/mobiliario/consola-elegant.jpg",
        description: "Melamina blanca y estructura metálica dorada",
      },
      {
        name: 'Consola modelo "Egipcia"',
        image: "/catalog/mobiliario/consola-egipcia.jpg",
        description: "Medida: 100 x 80 x 35 cm",
      },
      {
        name: "Foot Table",
        image: "/catalog/mobiliario/foot-table.jpg",
        description: "Medida: 100 x 100 x 75 cm aprox.",
      },
      {
        name: "Macetas y soportes decorativos",
        icon: Flower2,
        comingSoon: true,
      },
    ],
  },
  {
    slug: "eventos",
    title: "Eventos & Espacios Temporales",
    message: "Montamos y desmontamos: tu evento, sin complicaciones",
    icon: PartyPopper,
    whatsappMessage:
      "Hola, quisiera cotizar mobiliario/estructuras para un evento",
    products: [
      {
        name: "Tarima / Escenario metálico",
        image: "/catalog/mobiliario/tarima.jpg",
        description: "Estructura metálica modular para eventos y escenarios",
      },
      { name: "Sillas", icon: Armchair, comingSoon: true },
      { name: "Mesas", icon: Table2, comingSoon: true },
      { name: "Arcos", icon: Rainbow, comingSoon: true },
    ],
  },
];
