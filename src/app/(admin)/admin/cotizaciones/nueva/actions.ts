"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QUOTE_TAX_RATE } from "@/lib/quotes";

type QuoteItemInput = {
  description: string;
  quantity: number;
  unit_price: number;
};

export async function createQuote(input: {
  client_id: string;
  valid_until: string | null;
  notes: string | null;
  items: QuoteItemInput[];
}) {
  if (!input.client_id) {
    return { error: "Selecciona un cliente." };
  }

  const items = input.items.filter((item) => item.description.trim() !== "");
  if (items.length === 0) {
    return { error: "Agrega al menos un ítem con descripción." };
  }

  const supabase = createClient();
  const quoteNumber = await generateQuoteNumber();

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const tax = subtotal * QUOTE_TAX_RATE;
  const total = subtotal + tax;

  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      quote_number: quoteNumber,
      client_id: input.client_id,
      valid_until: input.valid_until,
      notes: input.notes,
      subtotal,
      tax,
      total,
    })
    .select("id")
    .single();

  if (quoteError || !quote) {
    return { error: quoteError?.message ?? "No se pudo crear la cotización." };
  }

  const itemsToInsert = items.map((item, index) => ({
    quote_id: quote.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    sort_order: index,
  }));

  const { error: itemsError } = await supabase
    .from("quote_items")
    .insert(itemsToInsert);

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
