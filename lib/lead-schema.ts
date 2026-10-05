import { z } from "zod";

const optional = (max: number) =>
  z.string().trim().max(max).transform((v) => (v === "" ? null : v)).nullable().optional();

export const leadSchema = z
  .object({
    tipo: z.enum(["presentacion", "legal", "brochure", "broker"]).catch("presentacion"),
    nombre: z.string().trim().min(2, "errNombre").max(120, "errNombre"),
    telefono: z
      .string()
      .trim()
      .max(30, "errTelefono")
      .refine((v) => v.replace(/\D/g, "").length >= 10, "errTelefono"),
    email: z
      .string()
      .trim()
      .max(160, "errEmail")
      .refine((v) => v === "" || z.email().safeParse(v).success, "errEmail")
      .transform((v) => (v === "" ? null : v)),
    contacto_preferido: z
      .enum(["whatsapp", "llamada", "correo", ""])
      .catch("")
      .transform((v) => (v === "" ? null : v)),
    horario: optional(40),
    interes: optional(60),
    empresa: optional(160),
    mensaje: optional(2000),
    consent: z.literal("on", "errConsent"),
    locale: z.enum(["es", "en"]).catch("es"),
  })
  .superRefine((lead, ctx) => {
    if (lead.contacto_preferido === "correo" && !lead.email) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "errEmailRequerido" });
    }
  });

export type LeadField = "nombre" | "telefono" | "email" | "consent";
export const LEAD_FIELDS = [
  "tipo", "nombre", "telefono", "email", "contacto_preferido", "horario", "interes", "empresa", "mensaje", "locale",
] as const;

export type LeadFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; values: Record<string, string> }
  | { status: "invalid"; errors: Partial<Record<LeadField, string>>; values: Record<string, string> };
