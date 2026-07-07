const CATEGORIES = [
  {
    title: "Mobiliario metálico",
    description:
      "Mesas, sillas, estanterías y exhibidores metálicos para uso comercial e industrial, con acabados en pintura electrostática.",
  },
  {
    title: "Rótulos y cajas de luz",
    description:
      "Letras corpóreas, rótulos luminosos y cajas de luz publicitarias fabricadas a medida según la imagen de tu marca.",
  },
  {
    title: "Proyectos personalizados",
    description:
      "Piezas y estructuras metálicas diseñadas desde cero a partir de un plano, boceto o referencia que nos compartas.",
  },
];

export default function Page() {
  return (
    <main className="px-6 md:px-8 py-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-industrial-blue">Catálogo</h1>
      <p className="mt-4 text-steel-gray max-w-2xl">
        Estas son las categorías generales de nuestro trabajo. Escríbenos
        contándonos qué necesitas y te enviamos referencias específicas.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => (
          <div key={category.title} className="bg-white rounded shadow overflow-hidden">
            <div className="h-32 bg-industrial-blue" />
            <div className="p-6">
              <h2 className="font-heading font-bold text-lg text-industrial-blue">
                {category.title}
              </h2>
              <p className="mt-2 text-sm text-steel-gray">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
