import Image from "next/image";

const WHATSAPP_NUMBER = "593983842395";

type Product = {
  image: string;
  name: string;
  description: string;
};

type Section = {
  title: string;
  products: Product[];
};

const SECTIONS: Section[] = [
  {
    title: "Mobiliario y decoración",
    products: [
      {
        image: "/catalog/mobiliario/soporte-arco.jpg",
        name: "Soporte Arco para decoración",
        description: "Medida: 180 x 80 cm",
      },
      {
        image: "/catalog/mobiliario/consola-elegant.jpg",
        name: "Consola Elegant",
        description: "Melamina blanca y estructura metálica dorada",
      },
      {
        image: "/catalog/mobiliario/consola-egipcia.jpg",
        name: 'Consola modelo "Egipcia"',
        description: "Medida: 100 x 80 x 35 cm",
      },
      {
        image: "/catalog/mobiliario/foot-table.jpg",
        name: "Foot Table",
        description: "Medida: 100 x 100 x 75 cm aprox.",
      },
      {
        image: "/catalog/mobiliario/tarima.jpg",
        name: "Tarima / Escenario metálico",
        description: "Estructura metálica modular para eventos y escenarios",
      },
    ],
  },
  {
    title: "Rótulos y señalización",
    products: [
      {
        image: "/catalog/rotulacion/triangulo-sin-luz.jpg",
        name: "Triángulo (sin luz)",
        description: "Altura 100 cm, estructura de caras dobles",
      },
      {
        image: "/catalog/rotulacion/triangulo-con-luz.jpg",
        name: "Triángulo (con luz)",
        description: "Triangular con estructura y luz interior",
      },
      {
        image: "/catalog/rotulacion/senaletica.jpg",
        name: "Señalética",
        description: "Material: PVC y vinil",
      },
      {
        image: "/catalog/rotulacion/caballete.jpg",
        name: "Caballete",
        description: "Estructura metálica",
      },
      {
        image: "/catalog/rotulacion/rotulo-bastidor.jpg",
        name: "Rótulo (bastidor)",
        description: "Estructura de tubo cuadrado",
      },
      {
        image: "/catalog/rotulacion/caja-luz-circular.jpg",
        name: "Caja de luz circular",
        description: "Estructura de tubo cuadrado",
      },
      {
        image: "/catalog/rotulacion/caja-luminosa-4x1.jpg",
        name: "Caja luminosa 4 x 1",
        description: "Estructura metálica",
      },
      {
        image: "/catalog/rotulacion/caja-luminosa-1x1.jpg",
        name: "Caja luminosa 1 x 1",
        description: "Estructura de tubo metálico 3/4",
      },
    ],
  },
  {
    title: "Personalizados y sublimados",
    products: [
      {
        image: "/catalog/sublimados/mouse-pad.jpg",
        name: "Mouse pad rectangular",
        description: "Sublimado con imagen personalizada",
      },
      {
        image: "/catalog/sublimados/jarro-blanco.jpg",
        name: "Jarro blanco 11oz sublimado",
        description: "Taza de cerámica personalizada",
      },
    ],
  },
];

export default function Page() {
  return (
    <main className="px-6 md:px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Catálogo</h1>
      <p className="mt-4 text-brand-medium max-w-2xl">
        Una muestra de nuestro trabajo. Si no ves exactamente lo que buscas,
        cuéntanos tu proyecto y lo fabricamos a medida.
      </p>

      {SECTIONS.map((section) => (
        <section key={section.title} className="mt-12">
          <h2 className="text-xl font-heading font-bold text-brand-dark">
            {section.title}
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.products.map((product) => (
              <div
                key={product.name}
                className="bg-white rounded shadow overflow-hidden"
              >
                <div className="relative aspect-square bg-brand-light">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-brand-dark">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-brand-medium">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-16 bg-brand-dark text-white rounded p-10 text-center">
        <h2 className="text-xl font-heading font-bold">¿Buscas algo más?</h2>
        <p className="mt-2 text-white/70 max-w-xl mx-auto">
          Fabricamos piezas a medida a partir de una foto, un plano o una
          idea. Escríbenos y lo conversamos.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          className="inline-block mt-6 bg-green-600 text-white font-semibold px-6 py-3 rounded hover:brightness-90"
        >
          Escríbenos por WhatsApp
        </a>
      </section>
    </main>
  );
}
