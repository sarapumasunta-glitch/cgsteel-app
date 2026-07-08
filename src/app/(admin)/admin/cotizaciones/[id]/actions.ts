"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { QuoteStatus } from "@/lib/quotes";

export async function changeQuoteStatus(quoteId: string, formData: FormData) {
  const currentStatus = String(formData.get("current_status") ?? "");
  const newStatus = String(formData.get("status") ?? "") as QuoteStatus;

  if (!newStatus) {
    return { error: "Selecciona un estado." };
  }
  if (newStatus === currentStatus) {
    return { error: "Selecciona un estado diferente al actual para registrar el cambio." };
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("quotes")
    .update({ status: newStatus })
    .eq("id", quoteId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/cotizaciones/${quoteId}`);
  return { success: true };
}
