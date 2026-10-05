"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Tipologia } from "@/lib/inventory";
import { PLANS, linePath, pts } from "@/lib/plans";

type Props = {
  id: Tipologia;
  /** 1 completa, 2 suite y linea, 3 suite resaltada y accesos. Sin valor: hereda data-step del ancestro. */
  step?: 1 | 2 | 3;
  priority?: boolean;
  sizes?: string;
};

/** Planta recortada con overlay SVG de Lock-Off. El overlay usa porcentajes de la propia imagen. */
export function PlanViewer({ id, step, priority, sizes = "(min-width: 1280px) 40vw, 90vw" }: Props) {
  const t = useTranslations();
  const plan = PLANS[id];
  const ratio = plan.w / plan.h;
  return (
    <div
      data-step={step}
      className="relative"
      style={{ width: `min(100cqw, calc(100cqh * ${ratio.toFixed(4)}))`, aspectRatio: `${plan.w} / ${plan.h}` }}
    >
      <Image
        src={plan.src}
        alt={t("residences.planAlt", { letter: id })}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain drop-shadow-[0_24px_32px_oklch(0.1_0.04_153/0.6)]"
      />
      <svg className="lo-layer pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {plan.zones.map((z, i) => (
          <polygon key={i} points={pts(z)} className="lo-zone" />
        ))}
        <path d={linePath(plan.line)} pathLength={100} className="lo-line" fill="none" />
      </svg>
      <span
        className="lo-layer pointer-events-none absolute rounded-[2px] bg-selva-950/90 px-2 py-1 text-caption font-semibold text-turquesa-500"
        style={{ left: `${plan.label[0]}%`, top: `${plan.label[1]}%` }}
      >
        {t("lockoff.suite")}
      </span>
      {plan.accesses?.map(([x, y], i) => (
        <span key={i} className="lo-access pointer-events-none absolute" style={{ left: `${x}%`, top: `${y}%`, translate: "-50% -50%" }} aria-hidden>
          <span className="lo-ring block" />
        </span>
      ))}
      {plan.accessLabel && (
        <span
          className="lo-access pointer-events-none absolute rounded-[2px] bg-selva-950/90 px-2 py-1 text-caption font-semibold text-oro-300"
          style={{ left: `${plan.accessLabel[0]}%`, top: `${plan.accessLabel[1]}%` }}
        >
          {t("lockoff.access")}
        </span>
      )}
    </div>
  );
}
