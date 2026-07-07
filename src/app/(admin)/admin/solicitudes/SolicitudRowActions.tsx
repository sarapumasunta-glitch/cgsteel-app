"use client";

import { useState } from "react";
import { convertToClient, markContacted, discardRequest } from "./actions";
import type { QuoteRequestStatus } from "@/lib/quoteRequests";

function isRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default function SolicitudRowActions({
  requestId,
  status,
}: {
  requestId: string;
  status: QuoteRequestStatus;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    "convertir" | "contactado" | "descartar" | null
  >(null);

  async function handleConvert() {
    setPendingAction("convertir");
    setError(null);
    try {
      const result = await convertToClient(requestId);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (isRedirectError(err)) {
        throw err;
      }
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al convertir la solicitud."
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleMarkContacted() {
    setPendingAction("contactado");
    setError(null);
    try {
      const result = await markContacted(requestId);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al actualizar la solicitud."
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDiscard() {
    setPendingAction("descartar");
    setError(null);
    try {
      const result = await discardRequest(requestId);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al descartar la solicitud."
      );
    } finally {
      setPendingAction(null);
    }
  }

  if (status === "convertido" || status === "descartado") {
    return null;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={handleConvert}
          disabled={pendingAction !== null}
          className="bg-industrial-orange text-white text-xs font-semibold px-3 py-1.5 rounded disabled:opacity-60"
        >
          {pendingAction === "convertir" ? "Convirtiendo..." : "Convertir en cliente"}
        </button>
        {status === "nuevo" && (
          <button
            onClick={handleMarkContacted}
            disabled={pendingAction !== null}
            className="bg-industrial-blue text-white text-xs font-semibold px-3 py-1.5 rounded disabled:opacity-60"
          >
            {pendingAction === "contactado" ? "Guardando..." : "Marcar como contactado"}
          </button>
        )}
        <button
          onClick={handleDiscard}
          disabled={pendingAction !== null}
          className="text-steel-gray text-xs font-semibold px-3 py-1.5 rounded border disabled:opacity-60"
        >
          {pendingAction === "descartar" ? "Descartando..." : "Descartar"}
        </button>
      </div>
      {error && <p className="text-red-600 text-xs mt-2 text-right">{error}</p>}
    </div>
  );
}
