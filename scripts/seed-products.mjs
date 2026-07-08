// Seed inicial de la tabla `products` a partir de fotos reales seleccionadas
// de /public/gallery (se excluyen renders 3D/mockups y fotos de líneas de
// negocio fuera de alcance de esta siembra: arquitectura y eventos).
//
// Uso: node scripts/seed-products.mjs
// Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno
// (se leen automáticamente desde .env.local).

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readFileSync as readFileSyncAlias } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(rootDir, ".env.local");
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

loadEnvLocal();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GALLERY_DIR = path.join(rootDir, "public", "gallery");

const SEED_PRODUCTS = [
  // --- Decoración & Mobiliario en Metal ---
  {
    file: "proyecto-09.jpg",
    name: "Consola metálica blanca con base dorada",
    category: "decoracion",
    description:
      "Consola de diseño con cubierta blanca y estructura metálica en acabado dorado.",
    is_featured: true,
    is_active: true,
    sort_order: 1,
  },
  {
    file: "proyecto-10.jpg",
    name: "Mesa de centro circular con base de anillos entrelazados",
    category: "decoracion",
    description:
      "Mesa de centro con cubierta de vidrio templado y base escultórica en metal negro.",
    is_featured: true,
    is_active: true,
    sort_order: 2,
  },
  {
    file: "proyecto-11.jpg",
    name: "Mesa auxiliar cubo en madera y metal",
    category: "decoracion",
    description:
      "Mesa auxiliar con estructura metálica tipo rejilla y cubierta en madera.",
    is_featured: false,
    is_active: true,
    sort_order: 3,
  },
  {
    file: "proyecto-12.jpg",
    name: "Consola dorada de líneas geométricas",
    category: "decoracion",
    description:
      "Consola metálica con patas en ángulo y cubierta blanca, acabado dorado cepillado.",
    is_featured: false,
    is_active: true,
    sort_order: 4,
  },
  {
    file: "proyecto-13.jpg",
    name: "Consola dorada con patrón rectangular",
    category: "decoracion",
    description:
      "Consola de diseño con estructura metálica geométrica en acabado dorado y cubierta blanca.",
    is_featured: false,
    is_active: true,
    sort_order: 5,
  },

  // --- Publicidad & Señalización ---
  {
    file: "proyecto-05.jpg",
    name: "Rótulo circular luminoso personalizado",
    category: "publicidad",
    description:
      "Caja de luz circular a medida, ideal para fachadas de locales comerciales.",
    is_featured: true,
    is_active: true,
    sort_order: 1,
  },
  {
    file: "proyecto-19.jpg",
    name: "Torres luminosas triangulares para fachada",
    category: "publicidad",
    description:
      "Par de estructuras triangulares con iluminación interior para identificación de negocio.",
    is_featured: true,
    is_active: true,
    sort_order: 2,
  },
  {
    file: "proyecto-04.jpg",
    name: "Mobiliario publicitario iluminado con logo",
    category: "publicidad",
    description:
      "Mesa y panel con iluminación interior para exhibir marca en eventos o puntos de venta.",
    is_featured: true,
    is_active: true,
    sort_order: 3,
  },
  {
    file: "proyecto-14.jpg",
    name: "Tótem publicitario a medida",
    category: "publicidad",
    description: "Estructura tipo tótem para señalización interior de negocios.",
    is_featured: false,
    is_active: true,
    sort_order: 4,
  },
  {
    file: "proyecto-15.jpg",
    name: "Caballete publicitario personalizado",
    category: "publicidad",
    description:
      "Caballete tipo A a doble cara para publicidad exterior de negocios.",
    is_featured: false,
    is_active: true,
    sort_order: 5,
  },
  {
    file: "proyecto-17.jpg",
    name: "Caballete informativo de servicios",
    category: "publicidad",
    description:
      "Caballete publicitario para exhibir listado de servicios en la vía pública.",
    is_featured: false,
    is_active: true,
    sort_order: 6,
  },
  {
    file: "proyecto-21.jpg",
    name: "Panel luminoso para centro de diagnóstico",
    category: "publicidad",
    description:
      "Rótulo tipo panel con iluminación interior para fachada de negocio.",
    is_featured: false,
    is_active: true,
    sort_order: 7,
  },
  {
    file: "proyecto-20.jpg",
    name: "Lona publicitaria con acabados reforzados",
    category: "publicidad",
    description:
      "Lona impresa a color con ojales reforzados, lista para instalación exterior.",
    is_featured: false,
    is_active: true,
    sort_order: 8,
  },

  // --- Fotos reales pero de menor calidad (tomas de proceso / composición
  // poco clara): se crean inactivas para que el staff las revise y decida
  // si reemplazan la foto o las publican.
  {
    file: "proyecto-02.jpg",
    name: "Impresión de señalética de seguridad industrial",
    category: "publicidad",
    description: "Set de señalética de seguridad impresa en gran formato.",
    is_featured: false,
    is_active: false,
    sort_order: 9,
  },
  {
    file: "proyecto-06.jpg",
    name: "Set de señalética vial y de seguridad",
    category: "publicidad",
    description: "Señalética vial y de seguridad cortada a medida.",
    is_featured: false,
    is_active: false,
    sort_order: 10,
  },
  {
    file: "proyecto-07.jpg",
    name: "Rótulo circular en proceso de acabado",
    category: "publicidad",
    description: "Rótulo circular personalizado en etapa de producción.",
    is_featured: false,
    is_active: false,
    sort_order: 11,
  },
  {
    file: "proyecto-18.jpg",
    name: "Panel de caja de luz para negocio de agua purificada",
    category: "publicidad",
    description: "Panel superior de caja de luz publicitaria.",
    is_featured: false,
    is_active: false,
    sort_order: 12,
  },
];

async function run() {
  console.log(`Sembrando ${SEED_PRODUCTS.length} productos...`);

  for (const item of SEED_PRODUCTS) {
    const filePath = path.join(GALLERY_DIR, item.file);
    const fileBuffer = readFileSyncAlias(filePath);
    const storagePath = `seed-${item.file}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(storagePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error(`ERROR subiendo ${item.file}:`, uploadError.message);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(storagePath);

    const { error: insertError } = await supabase.from("products").insert({
      name: item.name,
      category: item.category,
      description: item.description,
      image_url: publicUrlData.publicUrl,
      is_featured: item.is_featured,
      is_active: item.is_active,
      sort_order: item.sort_order,
    });

    if (insertError) {
      console.error(`ERROR insertando ${item.name}:`, insertError.message);
      continue;
    }

    console.log(`OK: ${item.name} (${item.category}, activo=${item.is_active}, destacado=${item.is_featured})`);
  }

  console.log("Listo.");
}

run();
