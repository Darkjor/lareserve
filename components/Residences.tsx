"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, MagnifyingGlassPlus } from "@phosphor-icons/react/ssr";
import type { Tipologia } from "@/lib/inventory";
import { PLANS } from "@/lib/plans";
import { formatM2, formatMXN, whatsappLink } from "@/lib/site";
import { Lightbox, ZoomPane } from "./Lightbox";
import { PlanViewer } from "./PlanViewer";

const LETTERS: Tipologia[] = ["A", "B", "C", "D"];
export type TypeSummary = { unidades: number; m2: number; precioDesde: number };

export function Residences({ data, locale }: { data: Record<Tipologia, TypeSummary>; locale: string }) {
  const t = useTranslations();
  const uid = useId();
  const [active, setActive] = useState<Tipologia>("A");
  const [lockoff, setLockoff] = useState(false);
  const [zoom, setZoom] = useState(false);
  const key = active.toLowerCase();
  const d = data[active];
  const sleep = t.raw(`residences.${key}.sleep`) as string[];
  const live = t.raw(`residences.${key}.live`) as string[];
  const wa = whatsappLink(t("wa.type", { tipologia: active }));

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const move = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!move) return;
    e.preventDefault();
    const next = LETTERS[(i + move + LETTERS.length) % LETTERS.length];
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };

  return (
    <section id="residencias" className="section-y">
      <div className="wrap">
        <p className="eyebrow reveal">{t("residences.eyebrow")}</p>
        <h2 className="reveal mt-5 max-w-[16ch] text-display-l text-marfil-50">{t("residences.title")}</h2>
        <p className="reveal mt-6 max-w-[44ch] text-body-l text-marfil-200">{t("residences.intro")}</p>

        <div className="reveal mt-14 grid gap-8 xl:grid-cols-12 xl:gap-x-6">
          {/* Rail / tabs */}
          <div
            role="tablist"
            aria-label={t("residences.tabs")}
            aria-orientation="vertical"
            className="no-scrollbar -mx-[var(--gutter)] flex snap-x gap-2 overflow-x-auto px-[var(--gutter)] xl:col-span-3 xl:mx-0 xl:grid xl:content-start xl:gap-2 xl:overflow-visible xl:px-0"
          >
            {LETTERS.map((l, i) => {
              const on = l === active;
              return (
                <button
                  key={l}
                  id={`${uid}-tab-${l}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(l)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`min-h-12 min-w-[44%] snap-start rounded-full border px-5 py-3 text-left transition-colors sm:min-w-[22%] xl:min-w-0 xl:rounded-[6px] xl:px-6 xl:py-5 ${
                    on ? "border-oro-300 bg-selva-800" : "border-oliva-500/60 hover:border-marfil-200"
                  }`}
                >
                  <span className="flex items-baseline gap-4 xl:grid xl:grid-cols-[auto_1fr] xl:gap-x-6">
                    <span className={`font-name text-[2rem] leading-none xl:row-span-3 xl:text-[3.5rem] ${on ? "text-oro-300" : "text-marfil-50"}`}>{l}</span>
                    <span className="font-figure text-[1.125rem] font-medium leading-tight tabular-nums text-marfil-50 xl:text-[1.75rem]">{formatM2(data[l].m2, locale)}</span>
                    <span className="hidden text-small text-marfil-200 xl:block">{t("residences.rooms", { beds: t(`residences.${l.toLowerCase()}.beds`), baths: t(`residences.${l.toLowerCase()}.baths`) })}</span>
                    <span className="hidden text-small text-piedra-400 xl:block">{t("common.units", { n: data[l].unidades })}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Visor */}
          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="xl:col-span-5">
            <div className="bezel">
              <div className="bezel-core bg-selva-900 p-4 md:p-6">
                <div className="grid h-[clamp(300px,56dvh,560px)] [container-type:size]">
                  {LETTERS.map((l) => (
                    <div
                      key={l}
                      aria-hidden={l !== active}
                      className={`grid place-items-center [grid-area:1/1] transition-[opacity,transform] duration-[320ms] ease-[var(--ease-soft)] ${
                        l === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                      }`}
                    >
                      <PlanViewer id={l} step={l === active && lockoff ? 2 : 1} priority={l === "A"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="caption mt-3 max-w-[60ch]">{t("common.planNote")}</p>
          </div>

          {/* Ficha */}
          <div className="xl:col-span-4 xl:pl-4">
            <h3 className="font-display text-h3 text-marfil-50">
              <span className="font-name text-oro-300">{t("residences.type", { letter: active })}</span>
            </h3>
            <p className="mt-3 text-body-l text-marfil-200">{t(`residences.${key}.tagline`)}</p>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <h4 className="font-sans text-small font-semibold text-marfil-50">{t("residences.sleep")}</h4>
                <ul className="mt-3 grid gap-1.5 text-small text-marfil-200">
                  {sleep.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-sans text-small font-semibold text-marfil-50">{t("residences.live")}</h4>
                <ul className="mt-3 grid gap-1.5 text-small text-marfil-200">
                  {live.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-small text-piedra-400">{t("common.from")}</p>
              <p className="mt-1 font-figure text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-none font-medium tabular-nums text-oro-300">{formatMXN(d.precioDesde, locale)}</p>
              <p className="caption mt-3 max-w-[40ch]">{t("common.priceNote")}</p>
            </div>

            {active === "D" && (
              <p className="mt-6 text-small text-marfil-200">
                {t("residences.dNote")}{" "}
                <a href={`/${locale}#disponibilidad`} className="link-gold text-marfil-50">
                  {t("residences.dLink")}
                </a>
              </p>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-between">
                {t("cta.quote")}
                <span className="btn-icon" aria-hidden>
                  <ArrowUpRight size={18} weight="light" />
                </span>
              </a>
              <button type="button" aria-pressed={lockoff} onClick={() => setLockoff((v) => !v)} className="btn btn-secondary w-full">
                {lockoff ? t("residences.lockoffHide") : t("residences.lockoffShow")}
              </button>
            </div>
            <button type="button" onClick={() => setZoom(true)} className="link-gold mt-5 inline-flex min-h-11 items-center gap-2 text-small text-marfil-50">
              <MagnifyingGlassPlus size={18} weight="light" aria-hidden />
              {t("residences.expand")}
            </button>
          </div>
        </div>
      </div>

      {zoom && (
        <Lightbox label={t("residences.planAlt", { letter: active })} onClose={() => setZoom(false)}>
          <ZoomPane src={PLANS[active].src} w={PLANS[active].w} h={PLANS[active].h} alt={t("residences.planAlt", { letter: active })} sizes="90vw" />
        </Lightbox>
      )}
    </section>
  );
}
