"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createClientRecord(formData: FormData) {
  const contact_name = String(formData.get("contact_name") ?? "").trim();
  if (!contact_name) {
    return { error: "El nombre de contacto es obligatorio." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("clients").insert({
    contact_name,
    company_name: emptyToNull(formData.get("company_name")),
    ruc: emptyToNull(formData.get("ruc")),
    email: emptyToNull(formData.get("email")),
    phone: emptyToNull(formData.get("phone")),
    address: emptyToNull(formData.get("address")),
    notes: emptyToNull(formData.get("notes")),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/clientes");
  return { success: true };
}

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}
