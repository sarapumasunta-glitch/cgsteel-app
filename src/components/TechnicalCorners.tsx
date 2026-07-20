// Esquinas tipo marca de plano técnico (┌ ┐ └ ┘), delgadas y sutiles,
// para enmarcar fotos de proyectos como un guiño a la documentación
// técnica de estructuras. No es un marco decorativo completo: solo
// las 4 esquinas, separadas del borde de la foto.
export default function TechnicalCorners({
  color = "border-white/90",
  size = 14,
  inset = 8,
}: {
  color?: string;
  size?: number;
  inset?: number;
}) {
  // drop-shadow mantiene las líneas visibles sobre fotos claras u
  // oscuras sin necesitar un fondo detrás de cada marca.
  const common = `absolute drop-shadow-sm ${color}`;
  const style = { width: size, height: size };

  return (
    <div className="pointer-events-none absolute inset-0">
      <span
        className={`${common} border-t border-l`}
        style={{ ...style, top: inset, left: inset }}
      />
      <span
        className={`${common} border-t border-r`}
        style={{ ...style, top: inset, right: inset }}
      />
      <span
        className={`${common} border-b border-l`}
        style={{ ...style, bottom: inset, left: inset }}
      />
      <span
        className={`${common} border-b border-r`}
        style={{ ...style, bottom: inset, right: inset }}
      />
    </div>
  );
}
