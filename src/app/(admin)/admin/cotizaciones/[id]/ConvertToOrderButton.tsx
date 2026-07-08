"use client";

import { useState } from "react";
import { convertQuoteToOrder } from "./actions";

function isRedirectError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default function ConvertToOrderButton({ quoteId }: { quoteId: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    try {
      const result = await convertQuoteToOrder(quoteId);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al convertir el pedido."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="bg-industrial-blue text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
      >
        {pending ? "Convirtiendo..." : "Convertir en pedido"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
