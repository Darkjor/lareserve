"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Bathtub, Bed, CoatHanger, CookingPot, MagnifyingGlassPlus } from "@phosphor-icons/react/ssr";
import type { Tipologia } from "@/lib/inventory";
import { PLANS } from "@/lib/plans";
import { formatM2, formatMXN, whatsappLink } from "@/lib/site";
import { Lightbox, ZoomPane } from "./Lightbox";
import { PlanViewer } from "./PlanViewer";
import { DrawFrame } from "./ui/DrawFrame";

const LETTERS: Tipologia[] = ["A", "B", "C", "D"];
const ICONS = [Bed, Bathtub, CookingPot, CoatHanger];
export type TypeSummary = { unidades: number; m2: number; precioDesde: number };

/** Familia D: banco de trabajo. Pestanas A-D (.seg), planta, ficha y tarjeta protagonista Lock-Off con interruptor Completa/Dividida. */
export function Residences({ data, locale }: { data: Record<Tipologia, TypeSummary>; locale: string }) {
  const t = useTranslations();
  const uid = useId();
  const [active, setActive] = useState<Tipologia>("A");
  const [split, setSplit] = useState(false);
  const [zoom, setZoom] = useState(false);
  const key = active.toLowerCase();
  const d = data[active];
  const wa = whatsappLink(t("wa.type", { tipologia: active }));

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const move = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    const edge = e.key === "Home" ? 0 : e.key === "End" ? LETTERS.length - 1 : -1;
    if (!move && edge < 0) return;
    e.preventDefault();
    const next = LETTERS[edge >= 0 ? edge : (i + move + LETTERS.length) % LETTERS.length];
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };

  return (
    <section id="residencias" className="section-y bg-wash">
      <div className="wrap">
        <h2 className="reveal max-w-[16ch] text-display-l text-ink">{t("residences.title")}</h2>
        <p className="reveal mt-6 max-w-[44ch] text-body-l text-ink-2">{t("residences.intro")}</p>

        <div className="reveal no-scrollbar -mx-[var(--gutter)] mt-12 overflow-x-auto px-[var(--gutter)]">
          <div role="tablist" aria-label={t("residences.tabs")} className="seg">
            {LETTERS.map((l, i) => {
              const on = l === active;
              return (
                <button
                  key={l}
                  id={`${uid}-tab-${l}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  data-active={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(l)}
                  onKeyDown={(e) => onKey(e, i)}
                  className="gap-3 !px-5"
                >
                  <span className="font-name text-[1.25rem] leading-none">{l}</span>
                  <span className="hidden font-figure tabular-nums sm:inline">{formatM2(data[l].m2, locale)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="reveal mt-8 grid gap-10 xl:grid-cols-12 xl:gap-x-8">
          {/* Planta */}
          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="xl:col-span-7">
            <div className="relative rounded-surface border border-line bg-paper p-4 md:p-6">
              <DrawFrame key={active} inset={10} mode="load" delay={300} />
              <div className="grid h-[clamp(300px,56dvh,560px)] [container-type:size]">
                {LETTERS.map((l) => (
                  <div
                    key={l}
                    aria-hidden={l !== active}
                    data-on={l === active}
                    className="plan-layer grid place-items-center [grid-area:1/1]"
                  >
                    <PlanViewer id={l} step={l === active && split ? 3 : 1} priority={l === "A"} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
              <p className="caption max-w-[60ch]">{t("common.planNote")}</p>
              <button type="button" onClick={() => setZoom(true)} className="link-gold inline-flex min-h-11 items-center gap-2 text-small text-ink">
                <MagnifyingGlassPlus size={18} weight="light" aria-hidden />
                {t("residences.expand")}
              </button>
            </div>
          </div>

          {/* Ficha + Lock-Off */}
          <div className="xl:col-span-5">
            <h3 className="font-display text-h3 text-oro-700">{t("residences.type", { letter: active })}</h3>
            <p className="mt-3 text-body-l text-ink-2">{t(`residences.${key}.tagline`)}</p>
            <p className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 font-figure text-[1.125rem] font-semibold tabular-nums text-ink">
              <span>{formatM2(d.m2, locale)}</span>
              <span>{t("residences.rooms", { beds: t(`residences.${key}.beds`), baths: t(`residences.${key}.baths`) })}</span>
            </p>
            <p className="mt-4 max-w-[46ch] text-small text-ink-2">{t(`residences.${key}.spaces`)}</p>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
              <div>
                <p className="text-small text-ink-3">{t("common.from")}</p>
                <p className="mt-1 font-figure text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-none font-semibold tabular-nums text-ink">{formatMXN(d.precioDesde, locale)}</p>
              </div>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary justify-between">
                {t("cta.quote")}
                <span className="btn-icon" aria-hidden>
                  <ArrowUpRight size={18} weight="light" />
                </span>
              </a>
            </div>
            <p className="caption mt-3 max-w-[44ch]">{t("common.priceNote")}</p>
            {active === "D" && (
              <p className="mt-4 text-small text-ink-2">
                {t("residences.dNote")}{" "}
                <a href={`/${locale}#disponibilidad`} className="link-gold text-ink">
                  {t("residences.dLink")}
                </a>
              </p>
            )}

            <div className="relative mt-12 rounded-surface bg-paper p-6 md:p-7">
              <DrawFrame inset={-7} />
              <h4 className="font-display text-h4 text-ink">{t("lockoff.title")}</h4>
              <p className="mt-2 max-w-[40ch] text-small text-ink-2">{t("lockoff.text")}</p>
              <div className="seg mt-5" role="group" aria-label={t("lockoff.toggleLabel")}>
                <button type="button" aria-pressed={!split} onClick={() => setSplit(false)}>
                  {t("lockoff.full")}
                </button>
                <button type="button" aria-pressed={split} onClick={() => setSplit(true)}>
                  {t("lockoff.split")}
                </button>
              </div>
              <p className="mt-3 text-small text-ink-2" aria-live="polite">
                {split ? t("lockoff.splitText") : t("lockoff.fullText")}
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-small text-ink-2">
                {(t.raw("lockoff.contents") as string[]).map((c, i) => {
                  const Icon = ICONS[i];
                  return (
                    <li key={c} className="flex items-center gap-3">
                      <Icon size={20} weight="light" className="text-ink" aria-hidden />
                      {c}
                    </li>
                  );
                })}
              </ul>
              <p className="caption mt-2">{t("lockoff.contentsNote")}</p>
              <p className="mt-5 text-small font-semibold text-ink">{t("lockoff.closing")}</p>
              <p className="caption mt-2">{t("lockoff.disclaimer")}</p>
            </div>
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
