// Fuente unica de los datos del desarrollo que no son textos de marketing.
// Los textos viven en messages/{es,en}.json; precios y estados en data/inventario.json.
export const site = {
  name: "Grand Mayahual La Reserve",
  developer: "Mexo Company",
  domain: "lareservemahahual.com",
  /** WhatsApp comercial, formato internacional sin "+" ni espacios. */
  whatsapp: "529987042445",
  whatsappDisplay: "+52 998 704 2445",
} as const;

// Dominio publico: variable explicita, luego el dominio de produccion de Vercel, luego localhost.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const raw = (process.env.NEXT_PUBLIC_SITE_URL || vercelHost || "http://localhost:3000").trim();

export const SITE_URL = (/^https?:\/\//.test(raw) ? raw : `https://${raw}`).replace(/\/$/, "");
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export function whatsappLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Sustituye las variables entre llaves de un mensaje prellenado. */
export function fillMessage(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
}

export function formatMXN(value: number, locale: string) {
  const n = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return locale === "en" ? `MXN ${n}` : `$${n} MXN`;
}

export function formatM2(value: number, locale: string) {
  return `${new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", { maximumFractionDigits: 2 }).format(value)} m²`;
}
