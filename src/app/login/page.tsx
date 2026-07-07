"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Credenciales incorrectas");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-dark">
      <form
        onSubmit={handleSubmit}
        className="bg-brand-light p-8 rounded shadow w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-brand-dark">
          Cg Steel Design — Acceso administrador
        </h1>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-brand-medium/20 rounded px-4 py-2 mt-6"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-brand-medium/20 rounded px-4 py-2 mt-3"
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-brand-accent text-white font-semibold py-3 rounded mt-6 hover:brightness-90"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
