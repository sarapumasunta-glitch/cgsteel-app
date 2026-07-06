import { createClient } from "@/lib/supabase/server";

type HistoryEntry = {
  status: string;
  note: string | null;
  progress_percent: number | null;
  created_at: string;
};

type FileEntry = {
  file_kind: string;
  file_url: string;
  file_name: string;
  description: string | null;
  created_at: string;
};

type TrackingResult = {
  error?: string;
  order_number?: string;
  description?: string;
  status?: string;
  entry_date?: string;
  estimated_delivery_date?: string | null;
  actual_delivery_date?: string | null;
  responsible?: string | null;
  history?: HistoryEntry[];
  files?: FileEntry[];
};

export default async function SeguimientoPage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_order_by_tracking", {
    p_token: params.token,
  });

  const result = data as TrackingResult;

  if (error || !result || result.error === "not_found") {
    return (
      <main className="px-8 py-16 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-industrial-blue">
          Pedido no encontrado
        </h1>
        <p className="mt-4 text-steel-gray">
          Verifica el enlace de seguimiento que te proporcionamos.
        </p>
      </main>
    );
  }

  return (
    <main className="px-8 py-16 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-industrial-blue">
        Pedido {result.order_number}
      </h1>
      <p className="mt-2 text-steel-gray">{result.description}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-steel-gray">Estado actual</span>
          <p className="font-semibold">{result.status}</p>
        </div>
        <div>
          <span className="text-steel-gray">Fecha estimada de entrega</span>
          <p className="font-semibold">
            {result.estimated_delivery_date ?? "Por definir"}
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold text-industrial-blue">
        Historial de avances
      </h2>
      <ul className="mt-4 space-y-3">
        {(result.history ?? []).map((h, i) => (
          <li key={i} className="border-l-2 border-industrial-orange pl-4">
            <p className="font-semibold">{h.status}</p>
            {h.note && <p className="text-sm text-steel-gray">{h.note}</p>}
            <p className="text-xs text-steel-gray">
              {new Date(h.created_at).toLocaleDateString("es-EC")}
            </p>
          </li>
        ))}
      </ul>

      {(result.files ?? []).length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-bold text-industrial-blue">
            Documentos y fotografías
          </h2>
          <ul className="mt-4 space-y-2">
            {(result.files ?? []).map((f, i) => (
              <li key={i}>
                <a
                  href={f.file_url}
                  target="_blank"
                  className="text-industrial-blue underline"
                >
                  {f.file_name}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
