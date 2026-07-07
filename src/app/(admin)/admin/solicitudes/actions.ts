"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function convertToClient(requestId: string) {
  const supabase = createClient();

  const { data: request, error: fetchError } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    return { error: fetchError?.message ?? "No se encontró la solicitud." };
  }

  const { data: client, error: insertError } = await supabase
    .from("clients")
    .insert({
      contact_name: request.full_name,
      company_name: request.company_name,
      email: request.email,
      phone: request.phone,
    })
    .select("id")
    .single();

  if (insertError || !client) {
    return { error: insertError?.message ?? "No se pudo crear el cliente." };
  }

  const { error: updateError } = await supabase
    .from("quote_requests")
    .update({ status: "convertido", converted_client_id: client.id })
    .eq("id", requestId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/admin/solicitudes");
  redirect(`/admin/pedidos/nuevo?client_id=${client.id}`);
}

export async function markContacted(requestId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("quote_requests")
    .update({ status: "contactado" })
    .eq("id", requestId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/solicitudes");
  return { success: true };
}

export async function discardRequest(requestId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("quote_requests")
    .update({ status: "descartado" })
    .eq("id", requestId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/solicitudes");
  return { success: true };
}
