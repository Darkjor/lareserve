"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, CaretDown } from "@phosphor-icons/react/ssr";
import type { Tipologia } from "@/lib/inventory";
import { PLANS } from "@/lib/plans";
import { formatM2, formatMXN, whatsappLink } from "@/lib/site";
import { CountUp } from "./CountUp";
import { Lightbox, ZoomPane } from "./Lightbox";
import { RENDERS, SLIDES, TipologiaStage } from "./TipologiaStage";

const LETTERS: Tipologia[] = ["A", "B", "C", "D"];
export type TypeSummary = { unidades: number; m2: number; precioDesde: number };

const compact = (p: number) => `$${(p / 1_000_000).toFixed(2)} M`;

/**
 * Tipologias interactivas (bloque central). Selector de 4 columnas con m2 y "desde", comparador desplegable en
 * filas con filetes, escenario (planta + 5 renders ilustrativos) con barrido de luz, ficha sin tarjeta y
 * Lock-Off como fila bajo la planta. Sin JS: cuatro fichas apiladas con su planta, caracteristicas y Cotizar.
 */
export function Residences({ data, locale, children }: { data: Record<Tipologia, TypeSummary>; locale: string; children?: ReactNode }) {
  const t = useTranslations();
  const uid = useId();
  const [active, setActive] = useState<Tipologia>("A");
  const [slide, setSlide] = useState(0);
  const [split, setSplit] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const [compare, setCompare] = useState(false);
  const [moved, setMoved] = useState(false);
  const [tick, setTick] = useState(0);
  const [announce, setAnnounce] = useState("");

  const key = active.toLowerCase();
  const d = data[active];
  const wa = whatsappLink(t("wa.type", { tipologia: active }));

  const select = useCallback(
    (l: Tipologia, focus = false) => {
      setActive(l);
      setSlide(0);
      setMoved(true);
      setTick((n) => n + 1);
      setAnnounce(t("residences.announce", { letter: l, area: formatM2(data[l].m2, locale) }));
      if (focus) document.getElementById(`${uid}-tab-${l}`)?.focus();
    },
    [data, locale, t, uid],
  );
  const pick = (i: number) => {
    setSlide(i);
    setMoved(true);
    setTick((n) => n + 1);
  };

  // Hash compartible (#residencias-b) y estado del comparador en la sesion.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const m = /^#residencias-([abcd])$/i.exec(window.location.hash);
      if (m) {
        setActive(m[1].toUpperCase() as Tipologia);
        document.getElementById("residencias")?.scrollIntoView();
      }
      try {
        if (sessionStorage.getItem("tip-compare") === "1") setCompare(true);
      } catch {}
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  const toggleCompare = () => {
    setCompare((v) => {
      try {
        sessionStorage.setItem("tip-compare", v ? "0" : "1");
      } catch {}
      return !v;
    });
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const move = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    const edge = e.key === "Home" ? 0 : e.key === "End" ? LETTERS.length - 1 : -1;
    if (!move && edge < 0) return;
    e.preventDefault();
    select(LETTERS[edge >= 0 ? edge : (i + move + LETTERS.length) % LETTERS.length], true);
  };

  const bullets = (l: Tipologia) => {
    const k = l.toLowerCase();
    return [
      formatM2(data[l].m2, locale),
      t(k === "d" ? "residences.roomsLockoff" : "residences.rooms", { beds: t(`residences.${k}.beds`), baths: t(`residences.${k}.baths`) }),
      ...(t.raw(`residences.${k}.features`) as string[]),
    ];
  };
  const renderBullets = (l: Tipologia) => (
    <ul className="mt-6 space-y-3">
      {bullets(l).map((b) => (
        <li key={b} className="tip-li text-body text-ink-2">
          {b}
        </li>
      ))}
    </ul>
  );

  const rows: { id: string; label: string; val: (l: Tipologia) => string }[] = [
    { id: "area", label: t("residences.compare.area"), val: (l) => formatM2(data[l].m2, locale) },
    { id: "beds", label: t("residences.compare.beds"), val: (l) => t(`residences.${l.toLowerCase()}.beds`) },
    { id: "baths", label: t("residences.compare.baths"), val: (l) => t(`residences.${l.toLowerCase()}.baths`) },
    { id: "from", label: t("residences.compare.from"), val: (l) => compact(data[l].precioDesde) },
  ];

  const onPlan = slide === 0;
  const zoomSlide = zoom != null ? SLIDES[zoom] : null;

  return (
    <section id="residencias" className="surface-piedra overflow-x-clip pt-[clamp(4.5rem,3rem+5vw,7.5rem)]">
      <div className="wrap pb-[clamp(4.5rem,3rem+5vw,7.5rem)]">
        <h2 className="reveal max-w-[16ch] text-display-l text-ink">{t("residences.title")}</h2>
        <p className="reveal mt-6 max-w-[44ch] text-body-l text-ink-2">{t("residences.intro")}</p>

        <div className="tip-js">
          <p role="status" className="sr-only">
            {announce}
          </p>

          {/* Selector: 4 columnas, fijo en movil */}
          <div className="sticky top-[72px] z-20 -mx-[var(--gutter)] mt-12 border-b border-line bg-paper px-[var(--gutter)] lg:static lg:bg-transparent">
            <div role="tablist" aria-label={t("residences.tabs")} className="relative grid grid-cols-4">
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
                    onClick={() => select(l)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={`flex min-h-[88px] flex-col items-start justify-center px-1 pt-3 pb-4 text-left transition-colors duration-300 sm:px-4 ${on ? "text-ink" : "text-ink-3 hover:text-ink"}`}
                  >
                    <span className="font-display text-[2.5rem] leading-none">{l}</span>
                    <span className="mt-2 font-figure text-base leading-none font-semibold tabular-nums">{formatM2(data[l].m2, locale)}</span>
                    <span className="mt-1.5 text-[0.75rem] leading-tight sm:text-[0.875rem]">
                      {t("residences.tabFrom")} <span className="whitespace-nowrap">{compact(data[l].precioDesde)}</span>
                    </span>
                  </button>
                );
              })}
              <span aria-hidden className="tip-ind" style={{ "--i": LETTERS.indexOf(active) } as React.CSSProperties} />
            </div>
          </div>

          {/* Comparador en filas con filetes */}
          <div className="mt-2">
            <button
              type="button"
              aria-expanded={compare}
              aria-controls={`${uid}-compare`}
              onClick={toggleCompare}
              className="link-gold inline-flex min-h-11 items-center gap-2 text-small text-ink"
            >
              {t("residences.compare.toggle")}
              <CaretDown size={16} weight="light" aria-hidden className={`transition-transform duration-500 ease-[var(--ease-out-expo)] ${compare ? "rotate-180" : ""}`} />
            </button>
            <div id={`${uid}-compare`} className="tip-compare" data-open={compare} inert={!compare} role="group" aria-label={t("residences.compare.label")}>
              <div>
                <dl className="pb-4">
                  {rows.map((r) => (
                    <div key={r.id} className="border-b border-line py-3">
                      <dt className="text-[0.75rem] leading-none text-ink-3">{r.label}</dt>
                      <dd className="mt-2 grid grid-cols-4">
                        {LETTERS.map((l) => (
                          <span
                            key={l}
                            onClick={() => select(l)}
                            className={`cursor-pointer px-1 font-figure text-base font-semibold tabular-nums transition-colors duration-300 sm:px-4 sm:text-[1.0625rem] ${l === active ? "text-ink" : "text-ink-2 hover:text-ink"}`}
                          >
                            <span className="sr-only">{t("residences.compare.tip", { letter: l })}: </span>
                            {r.val(l)}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                  <p className="caption pt-3">{t("residences.compare.lockoff")}</p>
                </dl>
              </div>
            </div>
          </div>

          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="mt-10 grid gap-x-8 gap-y-12 lg:grid-cols-12">
            {/* Escenario */}
            <div className="min-w-0 lg:col-span-7">
              <TipologiaStage key={active} letter={active} index={slide} onIndex={pick} onZoom={() => setZoom(slide)} split={split} moved={moved} tick={tick} />

              <div className="mt-5 border-t border-line pt-4 data-[off=true]:invisible" data-off={!onPlan} inert={!onPlan}>
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-h4 text-ink">{t("lockoff.title")}</h3>
                    <p className="mt-1 text-small text-ink-2" aria-live="polite">
                      {split ? t("lockoff.splitText") : t("lockoff.fullText")}
                    </p>
                  </div>
                  <div className="seg" role="group" aria-label={t("lockoff.toggleLabel")}>
                    <button type="button" aria-pressed={!split} onClick={() => setSplit(false)}>
                      {t("lockoff.full")}
                    </button>
                    <button type="button" aria-pressed={split} onClick={() => setSplit(true)}>
                      {t("lockoff.split")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ficha sin tarjeta */}
            <div className="lg:col-span-5">
              <div key={active} className={moved ? "tip-ficha" : ""}>
                <h3 className="font-display text-h3 text-oro-700">{t("residences.type", { letter: active })}</h3>
                <p className="mt-3 max-w-[40ch] text-body-l text-ink-2">{t(`residences.${key}.tagline`)}</p>
                {renderBullets(active)}
              </div>
              <figure className="m-0 mt-10">
                <p className="text-small text-ink-3">{t("common.from")}</p>
                <p className="mt-1 font-figure text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-none font-semibold text-ink">
                  <CountUp value={d.precioDesde} format={(n) => formatMXN(n, locale)} />
                </p>
                <figcaption className="caption mt-3 max-w-[44ch]">{t("common.priceNote")}</figcaption>
              </figure>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-between sm:w-auto">
                  {t("cta.quote")}
                  <span className="btn-icon" aria-hidden>
                    <ArrowUpRight size={18} weight="light" />
                  </span>
                </a>
                <button type="button" onClick={() => setZoom(0)} className="link-gold inline-flex min-h-11 items-center text-small text-ink">
                  {t("residences.expand")}
                </button>
              </div>
              {active === "D" && (
                <p className="mt-5 text-small text-ink-2">
                  {t("residences.dNote")}{" "}
                  <a href={`/${locale}#disponibilidad`} className="link-gold text-ink">
                    {t("residences.dLink")}
                  </a>
                </p>
              )}
              <p className="caption mt-6 max-w-[46ch]">
                {t("lockoff.closing")} {t("lockoff.disclaimer")}
              </p>
            </div>
          </div>
        </div>

        {/* Sin JS: cuatro fichas apiladas y una tira nativa con snap (se oculta en cuanto hay JS). */}
        <div className="tip-nojs mt-12">
          {LETTERS.map((l) => {
            const k = l.toLowerCase();
            return (
              <article key={l} className="border-t border-line py-10">
                <h3 className="font-display text-h3 text-oro-700">{t("residences.type", { letter: l })}</h3>
                <p className="mt-3 max-w-[40ch] text-body-l text-ink-2">{t(`residences.${k}.tagline`)}</p>
                <div className="relative mt-6 h-[min(70dvh,520px)]">
                  <Image src={PLANS[l].src} alt={t("residences.planAlt", { letter: l })} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
                </div>
                {renderBullets(l)}
                <p className="mt-6 font-figure text-[1.5rem] font-semibold text-ink">
                  {t("common.from")} {formatMXN(data[l].precioDesde, locale)}
                </p>
                <a href={whatsappLink(t("wa.type", { tipologia: l }))} className="btn btn-primary mt-4 inline-flex">
                  {t("cta.quote")}
                </a>
              </article>
            );
          })}
          <ul aria-label={t("residences.nojs")} className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)]">
            {RENDERS.map((r) => (
              <li key={r.key} className="w-[82%] shrink-0 snap-center sm:w-[56%]">
                <Image src={`/img/renders/${r.file}-960.webp`} alt={`${t(`residences.slides.${r.key}`)}`} width={r.w} height={r.h} sizes="82vw" className="h-auto w-full" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {children}

      {zoomSlide && (
        <Lightbox label={zoomSlide.kind === "plan" ? t("residences.planAlt", { letter: active }) : t(`residences.slides.${zoomSlide.key}`)} onClose={() => setZoom(null)}>
          {zoomSlide.kind === "plan" ? (
            <ZoomPane src={PLANS[active].src} w={PLANS[active].w} h={PLANS[active].h} alt={t("residences.planAlt", { letter: active })} sizes="90vw" />
          ) : (
            <ZoomPane
              src={`/img/renders/${zoomSlide.file}.webp`}
              w={zoomSlide.w}
              h={zoomSlide.h}
              alt={`${t(`residences.slides.${zoomSlide.key}`)}`}
              sizes="90vw"
            />
          )}
        </Lightbox>
      )}
    </section>
  );
}
