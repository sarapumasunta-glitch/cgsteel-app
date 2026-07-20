const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s-0.0939777,-78.4360241!6i16!3m1!1ses!5m1!1ses";

export default function Page() {
  return (
    <main className="px-6 md:px-8 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">Nosotros</h1>

      <p className="mt-6 text-brand-medium leading-relaxed">
        Cg Steel Design nació de la unión entre el oficio metalúrgico
        tradicional y las herramientas de fabricación digital. Diseñamos y
        fabricamos en metal piezas que exigen precisión: desde rótulos
        luminosos y cajas de luz para negocios, hasta mobiliario metálico,
        señalética y estructuras para eventos.
      </p>

      <p className="mt-4 text-brand-medium leading-relaxed">
        Cada proyecto pasa por nuestro propio flujo de trabajo: diseño,
        cotización, fabricación, control de calidad y entrega, con
        seguimiento visible para el cliente en cada etapa. Combinamos corte,
        plegado y soldadura de metal con procesos digitales de diseño y
        control de producción, lo que nos permite ofrecer plazos más cortos
        sin sacrificar el acabado.
      </p>

      <p className="mt-4 text-brand-medium leading-relaxed">
        Nuestra misión es simple: convertir una idea o un boceto en una
        pieza metálica funcional y bien terminada, con la misma seriedad
        tanto en un pedido pequeño como en un proyecto industrial completo.
      </p>

      <div className="mt-10 bg-white rounded shadow p-6">
        <h2 className="font-bold text-lg text-brand-dark">
          Taller propio en Calderón, Quito
        </h2>
        <p className="mt-1 text-sm text-brand-medium">
          Un negocio local y establecido, con taller propio para diseño,
          fabricación y control de calidad de cada proyecto.
        </p>
        <div className="mt-4 rounded overflow-hidden border border-brand-medium/20">
          <iframe
            src={MAPS_EMBED_SRC}
            width="100%"
            height="280"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación del taller Cg Steel Design en Calderón, Quito"
          />
        </div>
      </div>
    </main>
  );
}
