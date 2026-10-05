"use server";

import { createClient } from "@supabase/supabase-js";
import { LEAD_FIELDS, leadSchema, type LeadField, type LeadFormState } from "@/lib/lead-schema";

/** Cliente de Supabase solo si hay variables de entorno; si no, null (el formulario sigue respondiendo ok). */
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function sendLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // Honeypot: un bot lo llena; se responde exito sin guardar nada.
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  const raw: Record<string, string> = {};
  for (const k of [...LEAD_FIELDS, "consent"]) raw[k] = String(formData.get(k) ?? "");

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<LeadField, string>> = {};
    for (const issue of parsed.error.issues) {
      const f = issue.path[0];
      if ((f === "nombre" || f === "telefono" || f === "email" || f === "consent") && !errors[f]) errors[f] = issue.message;
    }
    const values: Record<string, string> = {};
    for (const k of LEAD_FIELDS) values[k] = raw[k];
    return { status: "invalid", errors, values };
  }

  const supabase = getSupabase();
  if (!supabase) return { status: "success" }; // sin Supabase configurado no falla; la UI ofrece WhatsApp.

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { consent, empresa, mensaje, ...rest } = parsed.data;
  const { error } = await supabase
    .from("leads")
    .insert({ ...rest, mensaje: empresa ? `[${empresa}] ${mensaje ?? ""}`.trim() : mensaje });
  if (error) {
    console.error("[leads] insert fallo:", error.message);
    const values: Record<string, string> = {};
    for (const k of LEAD_FIELDS) values[k] = raw[k];
    return { status: "error", values };
  }
  return { status: "success" };
}
