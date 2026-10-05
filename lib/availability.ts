import { disponibilidadVerificada, inventario, type Unidad } from "./inventory";

export type { Unidad };
export type Estado = "disponible" | "apartado" | "vendido";
export type Filter = "all" | "t1" | "t2" | "A" | "B" | "C" | "D" | "L";
export type Nivel = "3N" | "2N" | "1N" | "PB";

export const FILTERS: Filter[] = ["all", "t1", "t2", "A", "B", "C", "D", "L"];
export const NIVELES: Nivel[] = ["3N", "2N", "1N", "PB"];

/** Si es false la UI no afirma disponibilidad: ignora `estado` y muestra la nota de confirmacion. */
export const verificada = disponibilidadVerificada;

/** Tamano de las tarjetas de torre en la lamina del plano, en % del ancho y del alto (112x108 px de 1774x887). */
export const CARD_W = 6.3;
export const CARD_H = 12.2;

export type Tower = { slug: string; name: string; tipo: 1 | 2; x: number; y: number };

/**
 * Centro de cada tarjeta del plano en % del ancho x % del alto de `plano-modulos.webp` (1774x887).
 * Valores medidos sobre la lamina; recalibrar con `?debug=hotspots` si se cambia la imagen.
 * El orden es el del plano (derecha arriba a izquierda) y se usa para anterior/siguiente.
 */
export const TOWERS: Tower[] = [
  { slug: "estrella", name: "Estrella", tipo: 2, x: 50.3, y: 16.3 },
  { slug: "luna", name: "Luna", tipo: 1, x: 59.6, y: 16.3 },
  { slug: "sol", name: "Sol", tipo: 2, x: 69.9, y: 16.3 },
  { slug: "mangle", name: "Mangle", tipo: 1, x: 79.7, y: 16.3 },
  { slug: "coral", name: "Coral", tipo: 1, x: 88.9, y: 16.3 },
  { slug: "gruta", name: "Gruta", tipo: 1, x: 3.7, y: 62.7 },
  { slug: "costa", name: "Costa", tipo: 1, x: 11.4, y: 68.9 },
  { slug: "arena", name: "Arena", tipo: 1, x: 19.2, y: 75.3 },
  { slug: "oasis", name: "Oasis", tipo: 1, x: 34.7, y: 86.0 },
  { slug: "brisa", name: "Brisa", tipo: 1, x: 44.7, y: 90.3 },
  { slug: "nido", name: "Nido", tipo: 1, x: 55.1, y: 92.9 },
  { slug: "jungla", name: "Jungla", tipo: 2, x: 61.6, y: 93.2 },
  { slug: "laguna", name: "Laguna", tipo: 1, x: 67.9, y: 93.8 },
  { slug: "nube", name: "Nube", tipo: 1, x: 78.1, y: 93.8 },
  { slug: "arrecife", name: "Arrecife", tipo: 1, x: 85.9, y: 93.8 },
  { slug: "mar", name: "Mar", tipo: 1, x: 94.3, y: 93.8 },
];

/** Coordenadas en el viewBox 1920x1080 de las laminas de fachada (valores de partida de la spec; calibrar con `?debug=hotspots`). */
type Rect = [number, number];
export type FacadeLayout = {
  src: string;
  cols: Rect[];
  rows: Record<"3N" | "2N" | "1N", Rect>;
  locals: Record<string, Rect>;
  /** Franja de planta baja (y). */
  pb: Rect;
  roof: { x: Rect; y: Rect };
};

export const FACADE_W = 1920;
export const FACADE_H = 1080;

export const FACADES: Record<1 | 2, FacadeLayout> = {
  1: {
    src: "/img/fachada-tipo1.webp",
    cols: [[280, 530], [540, 805], [815, 1105], [1115, 1380], [1390, 1650]],
    rows: { "3N": [292, 438], "2N": [452, 598], "1N": [614, 752] },
    locals: { "1-001": [392, 860], "2-002": [1075, 1530] },
    pb: [782, 990],
    roof: { x: [830, 1080], y: [70, 270] },
  },
  2: {
    src: "/img/fachada-tipo2.webp",
    cols: [[398, 768], [775, 1160], [1170, 1545]],
    rows: { "3N": [305, 447], "2N": [462, 600], "1N": [616, 754] },
    locals: { "3-001": [455, 1495] },
    pb: [778, 975],
    roof: { x: [818, 1120], y: [90, 290] },
  },
};

export const slugOf = (name: string) => name.toLowerCase();
export const towerBySlug = (slug: string | null | undefined) => TOWERS.find((t) => t.slug === slug);

const byTower = new Map<string, Unidad[]>();
for (const u of inventario.unidades) {
  const k = slugOf(u.torre);
  byTower.set(k, [...(byTower.get(k) ?? []), u]);
}

export const unitsOf = (slug: string): Unidad[] => byTower.get(slug) ?? [];
export const dataOk = Array.isArray(inventario.unidades) && inventario.unidades.length > 0 && TOWERS.every((t) => unitsOf(t.slug).length > 0);

export const isLocal = (u: Unidad) => u.uso === "comercial";

/** Estado visible: solo existe cuando la disponibilidad esta verificada. */
export const estadoVisible = (u: Unidad): Estado | null => (verificada ? (u.estado as Estado) : null);

export function matches(u: Unidad, f: Filter, tipo?: 1 | 2): boolean {
  switch (f) {
    case "all":
      return true;
    case "t1":
      return (tipo ?? u.tipoModulo) === 1;
    case "t2":
      return (tipo ?? u.tipoModulo) === 2;
    case "L":
      return isLocal(u);
    default:
      return !isLocal(u) && u.tipologia === f;
  }
}

export const towerMatches = (slug: string, f: Filter) => {
  const tw = towerBySlug(slug);
  return unitsOf(slug).some((u) => matches(u, f, tw?.tipo));
};

export function towerCounts(slug: string) {
  const us = unitsOf(slug);
  return {
    total: us.length,
    disponibles: us.filter((u) => u.estado === "disponible").length,
    residencias: us.filter((u) => !isLocal(u)).length,
    locales: us.filter(isLocal).length,
  };
}

/** "3N" -> nivel de una unidad por su codigo (residencias: letra-NCC; locales: PB). */
export function nivelOf(u: Unidad): Nivel {
  return (u.nivel as Nivel) ?? "PB";
}

/** Numero de nivel (1..3) y columna (0..n) de una residencia por su codigo `A-203`. */
export function cellOf(u: Unidad): { row: "1N" | "2N" | "3N"; col: number } | null {
  if (isLocal(u)) return null;
  const n = parseInt(u.unidad.slice(2), 10);
  const lv = Math.floor(n / 100);
  if (!(lv >= 1 && lv <= 3)) return null;
  return { row: `${lv}N` as "1N" | "2N" | "3N", col: (n % 100) - 1 };
}

/** Rectangulo (px del viewBox de la fachada) de una unidad, o null si no se puede ubicar. */
export function rectOf(u: Unidad, tipo: 1 | 2): { x: Rect; y: Rect } | null {
  const f = FACADES[tipo];
  if (isLocal(u)) {
    const x = f.locals[u.unidad];
    return x ? { x, y: f.pb } : null;
  }
  const c = cellOf(u);
  if (!c || !f.cols[c.col]) return null;
  return { x: f.cols[c.col], y: f.rows[c.row] };
}

/** Unidades de un nivel ordenadas de izquierda a derecha. */
export function unitsAtLevel(slug: string, nivel: Nivel): Unidad[] {
  return unitsOf(slug)
    .filter((u) => nivelOf(u) === nivel)
    .sort((a, b) => a.unidad.localeCompare(b.unidad, undefined, { numeric: true }));
}

/** Nivel segun la posicion vertical (en % del alto de la lamina) para el toque sobre la fachada en movil. */
export function nivelAtY(tipo: 1 | 2, yPct: number): Nivel {
  const f = FACADES[tipo];
  const y = (yPct / 100) * FACADE_H;
  const mid = (a: Rect, b: Rect) => (a[1] + b[0]) / 2;
  if (y < mid(f.rows["3N"], f.rows["2N"])) return "3N";
  if (y < mid(f.rows["2N"], f.rows["1N"])) return "2N";
  if (y < (f.rows["1N"][1] + f.pb[0]) / 2) return "1N";
  return "PB";
}

export const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

/** Evento de analitica al dataLayer (GTM) si existe; no hace nada si no. */
export function track(event: string, data: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer?.push({ event, ...data });
}

export const actualizado = (inventario as { actualizado: string | null }).actualizado;
