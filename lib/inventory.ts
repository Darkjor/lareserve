import data from "@/data/inventario.json";

export type Tipologia = "A" | "B" | "C" | "D";
export type Unidad = (typeof data.unidades)[number];

export const inventario = data;
export const disponibilidadVerificada = data.disponibilidadVerificada;

/** Resumen por tipologia calculado del inventario: m2, precio de lista minimo y numero de unidades. */
export function resumenTipologia(t: Tipologia) {
  const us = data.unidades.filter((u) => u.uso === "habitacional" && u.tipologia === t);
  return {
    unidades: us.length,
    m2: us[0]?.m2 ?? 0,
    precioDesde: Math.min(...us.map((u) => u.precioMXN)),
    torres: [...new Set(us.map((u) => u.torre))],
  };
}

export const totalUnidades = data.unidades.length;
export const totalTorres = new Set(data.unidades.map((u) => u.torre)).size;
export const totalResidencias = data.unidades.filter((u) => u.uso === "habitacional").length;
export const totalLocales = totalUnidades - totalResidencias;
