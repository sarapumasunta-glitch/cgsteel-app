"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QUOTE_TAX_RATE } from "@/lib/quotes";

type ItemInput = {
  description: string;
  quantity: number;
  unit_price: number;
};

export async function createQuote(formData: FormData) {
  const client_id = String(formData.get("client_id") ?? "");
  const valid_until = emptyToNull(formData.get("valid_until"));
  const notes = emptyToNull(formData.get("notes"));

  let items: ItemInput[] = [];
  try {
    items = JSON.parse(String(formData.get("items_json") ?? "[]"));
  } catch {
    return { error: "Los ítems de la cotización no son válidos." };
  }

  items = items
    .map((item) => ({
      description: String(item.description ?? "").trim(),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    }))
    .filter((item) => item.description && item.quantity > 0);

  if (!client_id) {
    return { error: "Selecciona un cliente." };
  }
  if (items.length === 0) {
    return { error: "Agrega al menos un ítem con descripción y cantidad." };
  }
  if (items.some((item) => isNaN(item.quantity) || isNaN(item.unit_price) || item.unit_price < 0)) {
    return { error: "Revisa las cantidades y precios de los ítems." };
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const tax = subtotal * QUOTE_TAX_RATE;
  const total = subtotal + tax;

  const supabase = createClient();

  const quoteNumber = await generateQuoteNumber();

  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      quote_number: quoteNumber,
      client_id,
      valid_until,
      notes,
      subtotal,
      tax,
      total,
    })
    .select("id")
    .single();

  if (quoteError || !quote) {
    return { error: quoteError?.message ?? "No se pudo crear la cotización." };
  }

  const { error: itemsError } = await supabase.from("quote_items").insert(
    items.map((item, index) => ({
      quote_id: quote.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      sort_order: index,
    }))
  );

  if (itemsError) {
    return { error: itemsError.message };
  }

  redirect(`/admin/cotizaciones/${quote.id}`);
}

async function generateQuoteNumber() {
  const supabase = createClient();
  const year = new Date().getFullYear();
  const prefix = `COT-${year}-`;

  const { data: last } = await supabase
    .from("quotes")
    .select("quote_number")
    .like("quote_number", `${prefix}%`)
    .order("quote_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextSeq = 1;
  if (last?.quote_number) {
    const lastSeq = parseInt(last.quote_number.slice(prefix.length), 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }

  return `${prefix}${String(nextSeq).padStart(4, "0")}`;
}

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}
