"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus, FileKind } from "@/lib/orders";

export async function changeOrderStatus(orderId: string, formData: FormData) {
  const currentStatus = String(formData.get("current_status") ?? "");
  const newStatus = String(formData.get("status") ?? "") as OrderStatus;
  const note = String(formData.get("note") ?? "").trim();
  const progressRaw = String(formData.get("progress_percent") ?? "").trim();

  if (!newStatus) {
    return { error: "Selecciona un estado." };
  }
  if (newStatus === currentStatus) {
    return { error: "Selecciona un estado diferente al actual para registrar el cambio." };
  }

  const progressPercent = progressRaw === "" ? null : Number(progressRaw);
  if (progressPercent !== null && (isNaN(progressPercent) || progressPercent < 0 || progressPercent > 100)) {
    return { error: "El porcentaje de avance debe estar entre 0 y 100." };
  }

  const supabase = createClient();

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (updateError) {
    return { error: updateError.message };
  }

  if (note || progressPercent !== null) {
    const { data: historyRow } = await supabase
      .from("order_status_history")
      .select("id")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (historyRow) {
      await supabase
        .from("order_status_history")
        .update({
          note: note || null,
          progress_percent: progressPercent,
        })
        .eq("id", historyRow.id);
    }
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  return { success: true };
}

export async function uploadOrderFile(orderId: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  const fileKind = String(formData.get("file_kind") ?? "otro") as FileKind;
  const visibleToClient = formData.get("visible_to_client") === "on";
  const description = String(formData.get("description") ?? "").trim();

  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo." };
  }

  const supabase = createClient();

  const path = `${orderId}/${crypto.randomUUID()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("expedientes")
    .upload(path, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from("expedientes")
    .getPublicUrl(path);

  const { error: insertError } = await supabase.from("order_files").insert({
    order_id: orderId,
    file_kind: fileKind,
    file_url: publicUrlData.publicUrl,
    file_name: file.name,
    description: description || null,
    visible_to_client: visibleToClient,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  return { success: true };
}
