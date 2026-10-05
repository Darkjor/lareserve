// Verifica que messages/es.json y messages/en.json tengan las mismas claves, sin vacios ni rayas largas.
import fs from "node:fs";

const load = (f) => JSON.parse(fs.readFileSync(new URL("../messages/" + f + ".json", import.meta.url), "utf8"));
const flat = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) => (typeof v === "object" ? flat(v, p + k + ".") : [[p + k, v]]));

const es = new Map(flat(load("es")));
const en = new Map(flat(load("en")));
const issues = [];
for (const [k, v] of es) {
  if (!en.has(k)) issues.push("falta en en.json: " + k);
  if (!String(v).trim()) issues.push("vacio en es.json: " + k);
}
for (const [k, v] of en) {
  if (!es.has(k)) issues.push("falta en es.json: " + k);
  if (!String(v).trim()) issues.push("vacio en en.json: " + k);
}
for (const [k, v] of [...es, ...en]) if (/[–—]/.test(String(v))) issues.push("raya larga en: " + k);
if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
console.log("messages OK (" + es.size + " claves)");
