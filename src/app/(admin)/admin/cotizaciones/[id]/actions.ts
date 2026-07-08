"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { QuoteStatus } from "@/lib/quotes";

export async function changeQuoteStatus(quoteId: string, formData: FormData) {
  const newStatus = String(formData.get("status") ?? "") as QuoteStatus;

  if (!newStatus) {
    return { error: "Selecciona un estado." };
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

export async function convertQuoteToOrder(quoteId: string) {
  const supabase = createClient();

  const { data: quote, error: fetchError } = await supabase
    .from("quotes")
    .select("*, quote_items(*)")
    .eq("id", quoteId)
    .single();

  if (fetchError || !quote) {
    return { error: fetchError?.message ?? "No se encontró la cotización." };
  }

  if (quote.status !== "aprobada") {
    return { error: "Solo se puede convertir una cotización aprobada." };
  }

  const items = (quote.quote_items ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const description =
    items.map((item) => `${item.quantity} x ${item.description}`).join(", ") ||
    `Generado desde cotización ${quote.quote_number}`;

  const orderNumber = await generateOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      client_id: quote.client_id,
      description,
      channel: "pagina_web",
      quote_id: quote.id,
      estimated_value: quote.total,
      notes: quote.notes,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "No se pudo crear el pedido." };
  }

  redirect(`/admin/pedidos/${order.id}`);
}

async function generateOrderNumber() {
  const supabase = createClient();
  const year = new Date().getFullYear();
  const prefix = `PED-${year}-`;

  const { data: last } = await supabase
    .from("orders")
    .select("order_number")
    .like("order_number", `${prefix}%`)
    .order("order_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextSeq = 1;
  if (last?.order_number) {
    const lastSeq = parseInt(last.order_number.slice(prefix.length), 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }

  return `${prefix}${String(nextSeq).padStart(4, "0")}`;
}
