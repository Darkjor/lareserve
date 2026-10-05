"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CARD_H, CARD_W, TOWERS, towerCounts, towerMatches, verificada, type Filter } from "@/lib/availability";

/** Paso 1: lamina del plano con 16 hotspots (botones) sobre las tarjetas de torre del propio dibujo. */
export function TowerMap({
  filter,
  onSelect,
  onWarm,
  debug,
  from,
}: {
  filter: Filter;
  onSelect: (slug: string) => void;
  onWarm: (tipo: 1 | 2) => void;
  debug: boolean;
  /** Torre de la que se regresa: la lamina "sale" desde su tarjeta. */
  from?: string | null;
}) {
  const t = useTranslations("availability");
  const [hov, setHov] = useState<string | null>(null);
  const [pos, setPos] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  // Movil: el visor arranca centrado en las torres del medio.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  const origin = TOWERS.find((x) => x.slug === from);

  return (
    <div className="bezel">
      <div className="passepartout rounded-[4px] p-2 md:p-6">
        <div ref={scroller} className="no-scrollbar overflow-x-auto md:overflow-visible">
          <div
            className={`relative aspect-[2/1] w-[1000px] overflow-hidden rounded-[2px] md:w-full ${origin ? "stage-enter-back" : "stage-enter"}`}
            style={origin ? ({ ["--ox" as string]: `${origin.x}%`, ["--oy" as string]: `${origin.y}%` } as React.CSSProperties) : undefined}
            onPointerMove={
              debug
                ? (e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setPos(`x ${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%  y ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
                  }
                : undefined
            }
          >
            <Image src="/img/plano-modulos.webp" alt={t("alt")} fill priority sizes="(min-width: 1360px) 840px, (min-width: 768px) 70vw, 1000px" className="object-cover" />
            {/* Velo turquesa de la laguna: unica aparicion del turquesa fuera de Lock-Off. */}
            <div
              aria-hidden
              className={`pointer-events-none absolute top-0 left-0 h-[46%] w-[58%] bg-[radial-gradient(ellipse_at_35%_45%,oklch(0.65_0.1_205/0.45),transparent_72%)] transition-opacity duration-300 ${hov ? "opacity-20" : "opacity-0"}`}
            />
            <div role="group" aria-label={t("plano")} className="absolute inset-0">
              {TOWERS.map((tw) => {
                const c = towerCounts(tw.slug);
                const ok = towerMatches(tw.slug, filter);
                const n = verificada ? c.disponibles : c.total;
                const label = !ok ? t("towerAriaNone", { torre: tw.name, tipo: tw.tipo }) : t(verificada ? "towerAriaV" : "towerAria", { torre: tw.name, tipo: tw.tipo, n });
                const tip = t(verificada ? "towerTipV" : "towerTip", { torre: tw.name, tipo: tw.tipo, n });
                const side = tw.x < 12 ? "left-0" : tw.x > 88 ? "right-0" : "left-1/2 -translate-x-1/2";
                const vert = tw.y > 55 ? "bottom-full mb-1.5" : "top-full mt-1.5";
                return (
                  <button
                    key={tw.slug}
                    type="button"
                    aria-label={label}
                    tabIndex={ok ? 0 : -1}
                    onClick={() => onSelect(tw.slug)}
                    onPointerEnter={() => {
                      setHov(tw.slug);
                      onWarm(tw.tipo);
                    }}
                    onPointerLeave={() => setHov(null)}
                    onFocus={() => {
                      setHov(tw.slug);
                      onWarm(tw.tipo);
                    }}
                    onBlur={() => setHov(null)}
                    style={{ left: `${tw.x - CARD_W / 2}%`, top: `${tw.y - CARD_H / 2}%`, width: `${CARD_W}%`, height: `${CARD_H}%` }}
                    className={`group absolute rounded-[5px] border transition-[transform,background-color,border-color,box-shadow] duration-[160ms] ease-out ${
                      debug ? "border-[#ff2bd6] bg-[#ff2bd6]/15" : "border-transparent"
                    } hover:z-10 hover:-translate-y-[3px] hover:scale-[1.04] hover:border-oro-500 hover:bg-oro-300/10 hover:shadow-[0_10px_24px_-10px_oklch(0.17_0.025_153/0.6)] focus-visible:z-10 focus-visible:-translate-y-[3px] focus-visible:scale-[1.04] focus-visible:border-oro-500 ${
                      ok ? "" : "bg-piedra-100/65 hover:bg-piedra-100/50"
                    }`}
                  >
                    {debug && <span className="pointer-events-none absolute -top-4 left-0 rounded bg-[#ff2bd6] px-1 text-[10px] leading-4 font-semibold text-white">{tw.slug}</span>}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute z-20 rounded-full bg-selva-950/95 px-3 py-1.5 text-caption whitespace-nowrap text-marfil-50 opacity-0 shadow-[var(--shadow-tint)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 ${side} ${vert}`}
                    >
                      {tip}
                    </span>
                  </button>
                );
              })}
            </div>
            {debug && pos && <p className="pointer-events-none absolute right-2 bottom-2 rounded bg-black/80 px-2 py-1 font-mono text-xs text-white">{pos}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
