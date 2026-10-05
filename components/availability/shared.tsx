"use client";

import { useSyncExternalStore } from "react";
import { CheckCircle, Clock, Prohibit } from "@phosphor-icons/react/ssr";
import type { Estado } from "@/lib/availability";

type TFn = (key: string, values?: Record<string, string | number>) => string;

/** lg (1024) en adelante: escenario + ficha lateral. Por debajo: chips y hoja inferior. El servidor asume escritorio. */
export function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}

export const statusKey = (e: Estado) => (e === "disponible" ? "available" : e === "apartado" ? "reserved" : "sold");

/** Chip de estado: icono + patron + texto (nunca solo color). */
export function StatusChip({ estado, t, className = "" }: { estado: Estado; t: TFn; className?: string }) {
  const Icon = estado === "disponible" ? CheckCircle : estado === "apartado" ? Clock : Prohibit;
  const tone =
    estado === "disponible"
      ? "text-oro-300"
      : estado === "apartado"
        ? "text-marfil-50 pat-apartado"
        : "text-marfil-200 pat-vendido";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-marfil-50/25 bg-selva-950/90 px-2 py-0.5 text-[0.6875rem] leading-4 font-semibold tracking-wide whitespace-nowrap uppercase ${tone} ${className}`}
    >
      <Icon size={12} weight="regular" aria-hidden />
      {t(`status.${statusKey(estado)}`)}
    </span>
  );
}

/** Pestanas / chips: pill de 44 px con estado pulsado. */
export const chipClass =
  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-4 text-small font-semibold whitespace-nowrap transition-colors duration-150 border-marfil-50/25 text-marfil-50 hover:border-oro-300 aria-pressed:border-oro-300 aria-pressed:bg-oro-300 aria-pressed:text-selva-950 aria-selected:border-oro-300 aria-selected:bg-oro-300 aria-selected:text-selva-950";
