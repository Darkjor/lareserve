// Exporta los assets de _material/ a public/ (spec de diseño §9).
// Uso: npm run assets
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const M = "_material";
const I = `${M}/imagenes`;
const OUT = "public";
const out = (p) => {
  const f = path.join(OUT, p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  return f;
};
const webp = (src, dest, q = 82, ops = (s) => s) =>
  ops(sharp(src)).webp({ quality: q, effort: 6 }).toFile(out(dest));

const P = (n) => `${I}/PROTOTIPO_DE_CASAS_LA_RESERVE_2026_${n}.jpg`;
const B = (n) => `${I}/BROCHURE_GRAND_MAYAHUAL_LA_RESERVE_2026__${n}.jpg`;

// Fondo negro exterior a transparente: relleno desde el borde (no vacía los muros).
async function planta(src, rect, dest, q = 90) {
  const { data, info } = await sharp(src)
    .extract({ left: rect[0], top: rect[1], width: rect[2], height: rect[3] })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const seen = new Uint8Array(w * h);
  const stack = [];
  const dark = (i) => data[i * 4] <= 10 && data[i * 4 + 1] <= 10 && data[i * 4 + 2] <= 10;
  const push = (x, y) => {
    const i = y * w + x;
    if (!seen[i] && dark(i)) {
      seen[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w, y = (i / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }
  for (let i = 0; i < w * h; i++) if (seen[i]) data[i * 4 + 3] = 0;
  // recorte ajustado al contenido visible
  const img = sharp(data, { raw: { width: w, height: h, channels: 4 } });
  await img.webp({ quality: q, alphaQuality: 95, effort: 6 }).toFile(out(dest));
}

const jobs = [];
jobs.push(webp(P("p02_0_1828x860"), "img/hero-aerea.webp", 82));
jobs.push(webp(B("p02_0_1275x1646"), "img/hero-vertical.webp", 80));
jobs.push(
  sharp(P("p02_0_1828x860")).extract({ left: 95, top: 0, width: 1638, height: 860 }).resize(1200, 630).jpeg({ quality: 82 }).toFile(out("img/og.jpg")),
);
jobs.push(webp(B("p03_0_1011x1313"), "img/manifiesto.webp", 82));
jobs.push(webp(B("p04_0_1276x1647"), "img/mahahual-tortuga.webp", 82, (s) => s.extract({ left: 0, top: 690, width: 1276, height: 547 })));
jobs.push(webp(B("p04_0_1276x1647"), "img/mahahual-tortuga-43.webp", 82, (s) => s.extract({ left: 0, top: 300, width: 1276, height: 957 })));
jobs.push(webp(P("p04_0_1661x947"), "img/albercas.webp", 82));
// Sin la franja alta de cielo: el recorte arranca en y=220 para que se vea el roof y el jacuzzi.
jobs.push(webp(B("p06_0_977x1272"), "img/roof-garden.webp", 82, (s) => s.extract({ left: 0, top: 220, width: 977, height: 1052 })));
jobs.push(webp(B("p07_0_1274x1647"), "img/hamaca.webp", 80));
jobs.push(webp(P("p03_0_1672x941"), "img/cta-final.webp", 82));
jobs.push(webp(P("p03_0_1672x941"), "img/cta-final-45.webp", 82, (s) => s.extract({ left: 460, top: 0, width: 753, height: 941 })));
jobs.push(webp(`${I}/DISPONIBILIDAD_LA_RESERVE__2026_p01_0_1774x887.jpg`, "img/plano-modulos.webp", 85));
jobs.push(webp(`${M}/renders/render_3_1920_alta_calidad.png`, "img/fachada-tipo1.webp", 88));
jobs.push(webp(`${M}/renders/render_1_1920_alta_calidad.png`, "img/fachada-tipo2.webp", 88));
jobs.push(planta(P("p06_2_1536x1024"), [20, 150, 1090, 610], "img/plantas/planta-a.webp"));
jobs.push(planta(P("p05_2_1672x941"), [30, 0, 945, 941], "img/plantas/planta-b.webp"));
jobs.push(planta(P("p07_2_1448x1086"), [20, 70, 955, 940], "img/plantas/planta-c.webp"));
jobs.push(planta(P("p08_2_1535x1024"), [400, 0, 610, 1024], "img/plantas/planta-d.webp"));
jobs.push(planta(P("p05_2_1672x941"), [60, 720, 850, 205], "img/plantas/terraza-b.webp"));
jobs.push(webp(`${I}/IDENTIDAD_DE_MARCA_GRAND_MAYAHUAL_LA_RES_p01_0_3872x2207.jpg`, "img/piedra.webp", 70, (s) => s.resize(1600, 912)));
jobs.push(webp(`${M}/doc/UBICACIÓN.png`, "img/ubicacion.webp", 80, (s) => s.resize(2400, 1351)));
jobs.push(webp(`${M}/doc/UBICACIÓN.png`, "img/ubicacion-sm.webp", 80, (s) => s.resize(1000, 563)));
await Promise.all(jobs);

// Logos: el SVG original es un lockup vertical (isotipo arriba, nombre abajo).
const logoSrc = (f) => fs.readFileSync(`${M}/Logos/${f}`, "utf8");
const inner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>[\s\S]*?<\/title>/, "");
const ISO = [820, 430, 410, 420]; // isotipo
const TXT = [130, 880, 1790, 380]; // GRAND MAYAHUAL + LA RESERVE
const RES = [330, 1140, 1400, 120]; // solo LA RESERVE
const box = (body, [x, y, w, h], X, Y, W, H) => `<svg x="${X}" y="${Y}" width="${W}" height="${H}" viewBox="${x} ${y} ${w} ${h}">${body}</svg>`;
fs.mkdirSync("public/brand", { recursive: true });
for (const [name, file] of [["dorado", "logo_principal_dorado.svg"], ["blanco", "logo_1_blanco.svg"]]) {
  const body = inner(logoSrc(file));
  const full = logoSrc(file).replace(/viewBox="[^"]*"/, `viewBox="130 440 1790 820"`).replace(/ width="\d+" height="\d+"/, "");
  fs.writeFileSync(`public/brand/logo-${name}.svg`, full);
  // horizontal: isotipo + nombre
  fs.writeFileSync(
    `public/brand/logo-${name}-h.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2300 420"><title>Grand Mayahual La Reserve</title>${box(body, ISO, 0, 0, 410, 420)}${box(body, TXT, 510, 20, 1790, 380)}</svg>`,
  );
  // compacto (móvil): isotipo + LA RESERVE
  fs.writeFileSync(
    `public/brand/logo-${name}-c.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 420"><title>La Reserve</title>${box(body, ISO, 0, 0, 410, 420)}${box(body, RES, 480, 184, 560, 48)}</svg>`,
  );
  if (name === "dorado") {
    const iso = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#0A150E"/>${box(body, ISO, 96, 96, 320, 320)}</svg>`;
    fs.writeFileSync("public/brand/isotipo.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="820 430 410 420">${body}</svg>`);
    fs.mkdirSync("app", { recursive: true });
    fs.writeFileSync("app/icon.svg", iso);
    const png = (s) => sharp(Buffer.from(iso), { density: 300 }).resize(s, s).png().toBuffer();
    fs.writeFileSync("app/apple-icon.png", await png(180));
    const p32 = await png(32);
    const hdr = Buffer.alloc(22);
    hdr.writeUInt16LE(1, 2); hdr.writeUInt16LE(1, 4); hdr[6] = 32; hdr[7] = 32; hdr.writeUInt16LE(1, 10); hdr.writeUInt16LE(32, 12);
    hdr.writeUInt32LE(p32.length, 14); hdr.writeUInt32LE(22, 18);
    fs.writeFileSync("app/favicon.ico", Buffer.concat([hdr, p32]));
  }
}

// Inventario con flag de disponibilidad verificada.
const raw = JSON.parse(fs.readFileSync(`${M}/inventario.json`, "utf8"));
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync(
  "data/inventario.json",
  JSON.stringify({ disponibilidadVerificada: false, actualizado: null, unidades: raw }, null, 1),
);
console.log("assets ok:", raw.length, "unidades");
