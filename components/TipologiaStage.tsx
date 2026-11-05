"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CaretLeft, CaretRight, MagnifyingGlassPlus } from "@phosphor-icons/react/ssr";
import type { Tipologia } from "@/lib/inventory";
import { PLANS } from "@/lib/plans";
import { PlanViewer } from "./PlanViewer";

export type Slide = { kind: "plan" } | { kind: "render"; key: string; file: string; w: number; h: number };

/** Renders interiores ilustrativos: comunes a las cuatro tipologias (no pertenecen a una en concreto). */
export const RENDERS: Extract<Slide, { kind: "render" }>[] = [
  { kind: "render", key: "fachada", file: "fachada-atardecer", w: 1672, h: 941 },
  { kind: "render", key: "sala", file: "interior-sala-cocina", w: 1448, h: 1086 },
  { kind: "render", key: "recamara", file: "interior-recamara", w: 1672, h: 941 },
  { kind: "render", key: "bano", file: "interior-bano", w: 1254, h: 1254 },
  { kind: "render", key: "cocina", file: "interior-cocina", w: 1672, h: 941 },
];
export const SLIDES: Slide[] = [{ kind: "plan" }, ...RENDERS];

/**
 * Escenario de una tipologia: planta + 5 renders. Las diapositivas viven apiladas; la entrante se descubre con
 * el "barrido de luz" (clip horizontal + banda calida que lo antecede). Sin autoplay. Flechas del teclado con
 * el foco en el escenario, swipe en tactil, diapositivas fuera de vista `inert`.
 */
export function TipologiaStage({
  letter,
  index,
  onIndex,
  onZoom,
  split,
  moved,
  tick,
}: {
  letter: Tipologia;
  index: number;
  onIndex: (i: number) => void;
  onZoom: () => void;
  split: boolean;
  moved: boolean;
  tick: number;
}) {
  const t = useTranslations("residences");
  const tc = useTranslations("common");
  const total = SLIDES.length;
  const [prev, setPrev] = useState<number | null>(null);
  const prevIndex = useRef(index);
  const touch = useRef<number | null>(null);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (prevIndex.current === index) return;
    const from = prevIndex.current;
    prevIndex.current = index;
    setPrev(from);
    const id = window.setTimeout(() => setPrev(null), 1000);
    return () => window.clearTimeout(id);
  }, [index]);

  const go = (d: number) => onIndex((index + d + total) % total);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };
  const nameOf = (s: Slide) => (s.kind === "plan" ? t("slides.plan") : t(`slides.${s.key}`));
  const fail = (i: number) => setFailed((f) => ({ ...f, [i]: true }));

  return (
    <div className="tip-stage-wrap">
      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label={t("carousel.label", { letter })}
        tabIndex={0}
        onKeyDown={onKey}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          touch.current = null;
          if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
        }}
        className="tip-stage relative isolate overflow-hidden bg-wash"
        data-moved={moved}
      >
        {SLIDES.map((s, i) => {
          const active = i === index;
          const state = active ? "is-active" : i === prev ? "is-prev" : "";
          const alt = s.kind === "render" ? nameOf(s) : "";
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={t("carousel.slide", { n: i + 1, total })}
              inert={!active}
              className={`tip-slide ${state}`}
            >
              {failed[i] ? (
                <p className="grid size-full place-items-center bg-wash text-small text-ink-3">{t("carousel.unavailable")}</p>
              ) : s.kind === "plan" ? (
                <div className="tip-plan grid size-full place-items-center p-5 [container-type:size] md:p-8">
                  <PlanViewer id={letter} step={active && split ? 3 : 1} sizes="(min-width: 1024px) 56vw, 100vw" />
                </div>
              ) : (
                <>
                  <Image
                    src={`/img/renders/${s.file}-960.webp`}
                    alt={alt}
                    width={s.w}
                    height={s.h}
                    sizes="100vw"
                    onError={() => fail(i)}
                    className="tip-img size-full object-cover lg:hidden"
                  />
                  <Image
                    src={`/img/renders/${s.file}.webp`}
                    alt={alt}
                    width={s.w}
                    height={s.h}
                    sizes="(min-width: 1024px) 58vw, 1px"
                    onError={() => fail(i)}
                    className="tip-img hidden size-full object-cover lg:block"
                  />
                </>
              )}
            </div>
          );
        })}
        {tick > 0 && <span key={tick} aria-hidden className="tip-luz" />}
        <div className="pointer-events-none absolute right-4 bottom-4 z-[3] flex gap-2 md:right-6 md:bottom-6">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              aria-label={d < 0 ? t("carousel.prev") : t("carousel.next")}
              className="tip-arrow pointer-events-auto"
            >
              {d < 0 ? <CaretLeft size={20} weight="light" aria-hidden /> : <CaretRight size={20} weight="light" aria-hidden />}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-x-6 gap-y-2">
        <div aria-live="polite" className="min-w-0">
          <p className="font-figure text-[0.8125rem] font-semibold tabular-nums text-ink">
            {t("carousel.counter", { n: index + 1, total })} <span className="ml-2 font-body font-normal text-ink-2">{nameOf(SLIDES[index])}</span>
          </p>
          <p className="caption mt-1 max-w-[60ch]">{SLIDES[index].kind === "plan" ? tc("planNote") : index === 0 ? t("carousel.renderCaption") : " "}</p>
        </div>
        <button type="button" onClick={onZoom} className="link-gold inline-flex min-h-11 shrink-0 items-center gap-2 text-small text-ink">
          <MagnifyingGlassPlus size={18} weight="light" aria-hidden />
          {t("carousel.enlarge")}
        </button>
      </div>

      <ul aria-label={t("carousel.thumbs")} className="mt-2 hidden gap-3 lg:flex">
        {SLIDES.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onIndex(i)}
              aria-current={i === index ? "true" : undefined}
              aria-label={t("carousel.thumb", { name: nameOf(s) })}
              className="tip-thumb"
            >
              <span className="relative block h-11 w-16 overflow-hidden bg-wash">
                {s.kind === "plan" ? (
                  <Image src={PLANS[letter].src} alt="" fill sizes="64px" className="object-contain p-1" />
                ) : (
                  <Image src={`/img/renders/${s.file}-960.webp`} alt="" fill sizes="64px" className="object-cover" />
                )}
              </span>
              <span aria-hidden className="tip-thumb-line" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
