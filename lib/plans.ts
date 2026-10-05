import type { Tipologia } from "@/lib/inventory";

type Pt = [number, number];

export type Plan = {
  src: string;
  w: number;
  h: number;
  /** Poligonos de la suite Lock-Off en porcentaje (0 a 100) de la planta recortada. */
  zones: Pt[][];
  /** Linea divisoria (muro) en porcentaje; solo se usa en el trazo animado. */
  line: Pt[];
  /** Posicion de la etiqueta "Suite Lock-Off" en porcentaje. */
  label: Pt;
  /** Marcas de acceso (solo donde se calibraron). */
  accesses?: Pt[];
  accessLabel?: Pt;
};

const px = (w: number, h: number, pts: Pt[]): Pt[] => pts.map(([x, y]) => [+((x / w) * 100).toFixed(2), +((y / h) * 100).toFixed(2)]);

// Valores de partida de la spec (seccion 7). Calibrar visualmente con el cliente.
export const PLANS: Record<Tipologia, Plan> = {
  A: {
    src: "/img/plantas/planta-a.webp",
    w: 1090,
    h: 610,
    zones: [[[55, 0], [100, 0], [100, 100], [55, 100]]],
    line: [[55, 0], [55, 100]],
    label: [57, 4],
  },
  B: {
    src: "/img/plantas/planta-b.webp",
    w: 945,
    h: 941,
    zones: [[[74, 10], [97, 10], [97, 75], [74, 75]]],
    line: [[74, 10], [74, 75]],
    label: [75, 78],
    accesses: [[63, 13], [70, 13]],
    accessLabel: [60, 22],
  },
  C: {
    src: "/img/plantas/planta-c.webp",
    w: 955,
    h: 940,
    zones: [px(955, 940, [[55, 15], [195, 15], [195, 225], [280, 225], [280, 370], [345, 370], [345, 670], [150, 670], [150, 370], [130, 370], [130, 230], [55, 230]])],
    line: px(955, 940, [[195, 15], [195, 225], [280, 225], [280, 370], [345, 370], [345, 670]]),
    label: [6, 74],
  },
  D: {
    src: "/img/plantas/planta-d.webp",
    w: 610,
    h: 1024,
    zones: [
      px(610, 1024, [[10, 310], [130, 310], [130, 490], [10, 490]]),
      px(610, 1024, [[125, 470], [200, 470], [200, 600], [125, 600]]),
      px(610, 1024, [[90, 640], [250, 640], [250, 770], [90, 770]]),
    ],
    line: px(610, 1024, [[130, 400], [160, 535], [170, 705]]),
    label: [2, 24],
  },
};

export const pts = (p: Pt[]) => p.map(([x, y]) => `${x},${y}`).join(" ");
export const linePath = (p: Pt[]) => p.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
