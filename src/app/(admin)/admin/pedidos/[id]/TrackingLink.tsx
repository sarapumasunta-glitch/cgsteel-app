"use client";

import { useState } from "react";

export default function TrackingLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-steel-gray">Enlace para el cliente:</span>
      <code className="text-sm bg-off-white px-3 py-1 rounded">{url}</code>
      <button
        onClick={handleCopy}
        className="text-sm bg-industrial-blue text-white px-3 py-1 rounded"
      >
        {copied ? "¡Copiado!" : "Copiar"}
      </button>
    </div>
  );
}
