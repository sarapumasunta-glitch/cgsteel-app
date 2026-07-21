"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";

export default function CotizarPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("quote_requests").insert({
      full_name: String(form.get("full_name") ?? ""),
      company_name: String(form.get("company_name") ?? "") || null,
      email: String(form.get("email") ?? "") || null,
      phone: String(form.get("phone") ?? "") || null,
      description: String(form.get("description") ?? ""),
    });

    if (error) {
      setStatus("error");
    } else {
      trackEvent("submit_cotizacion");
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <main className="px-8 py-16 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-brand-dark">
          ¡Gracias!
        </h1>
        <p className="mt-4 text-brand-medium">
          Recibimos tu solicitud. Nos pondremos en contacto contigo pronto.
        </p>
      </main>
    );
  }

  return (
    <main className="px-8 py-16 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark">
        Solicitar cotización
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          name="full_name"
          required
          placeholder="Nombre completo"
          className="w-full border border-brand-medium/20 rounded px-4 py-2"
        />
        <input
          name="company_name"
          placeholder="Empresa (opcional)"
          className="w-full border border-brand-medium/20 rounded px-4 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          className="w-full border border-brand-medium/20 rounded px-4 py-2"
        />
        <input
          name="phone"
          placeholder="Teléfono"
          className="w-full border border-brand-medium/20 rounded px-4 py-2"
        />
        <textarea
          name="description"
          required
          placeholder="Cuéntanos qué necesitas fabricar"
          rows={5}
          className="w-full border border-brand-medium/20 rounded px-4 py-2"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-brand-accent text-white font-semibold px-6 py-3 rounded hover:brightness-90"
        >
          {status === "sending" ? "Enviando..." : "Enviar solicitud"}
        </button>
        {status === "error" && (
          <p className="text-red-600">
            Ocurrió un error al enviar. Intenta de nuevo.
          </p>
        )}
      </form>
    </main>
  );
}
