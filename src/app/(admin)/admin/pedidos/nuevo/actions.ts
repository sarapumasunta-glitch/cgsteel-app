"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { OrderChannel } from "@/lib/orders";

export async function createOrder(formData: FormData) {
  const client_id = String(formData.get("client_id") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const channel = String(formData.get("channel") ?? "") as OrderChannel;

  if (!client_id || !description || !channel) {
    return { error: "Cliente, descripción y canal son obligatorios." };
  }

  const supabase = createClient();

  const orderNumber = await generateOrderNumber();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      client_id,
      description,
      channel,
      estimated_value: numberOrZero(formData.get("estimated_value")),
      estimated_cost: numberOrZero(formData.get("estimated_cost")),
      estimated_delivery_date: emptyToNull(formData.get("estimated_delivery_date")),
      responsible: emptyToNull(formData.get("responsible")),
      notes: emptyToNull(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "No se pudo crear el pedido." };
  }

  redirect(`/admin/pedidos/${data.id}`);
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

function numberOrZero(value: FormDataEntryValue | null) {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}
