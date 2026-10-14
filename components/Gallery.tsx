"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import { Lightbox, ZoomPane } from "./Lightbox";
import { DrawFrame } from "./ui/DrawFrame";

/** Carrusel de imagenes propias: orden de Marketing, proporciones alternadas para dar ritmo. */
const ITEMS = [
  { k: "aerial", src: "/img/hero-aerea.webp", w: 1828, h: 860, r: "3 / 2" },
  { k: "roof", src: "/img/roof-garden.webp", w: 977, h: 1272, r: "4 / 5" },
  { k: "pools", src: "/img/albercas.webp", w: 1661, h: 947, r: "3 / 2" },
  { k: "type1", src: "/img/fachada-tipo1.webp", w: 1920, h: 1080, r: "16 / 9" },
  { k: "type2", src: "/img/fachada-tipo2.webp", w: 1920, h: 1080, r: "16 / 9" },
  { k: "hammock", src: "/img/hamaca.webp", w: 1274, h: 1647, r: "4 / 5" },
  { k: "coconut", src: "/img/manifiesto.webp", w: 1011, h: 1313, r: "4 / 5" },
] as const;

/** Familia F: tira horizontal con snap nativo (sin JS funciona), marcos finos dorados y Lightbox. */
export function Gallery() {
  const t = useTranslations("gallery");
  const strip = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [open, setOpen] = useState<number | null>(null);

  const onScroll = () => {
    const el = strip.current;
    if (!el) return;
    const left = el.scrollLeft;
    let best = 0;
    let dist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).offsetLeft - 12 - left);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setIndex(best);
    setEdge({ start: left < 8, end: left + el.clientWidth >= el.scrollWidth - 8 });
  };

  const move = (dir: 1 | -1) => {
    const el = strip.current;
    if (!el) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: smooth ? "smooth" : "auto" });
  };

  const arrow = "grid size-12 place-items-center rounded-ui border border-line-strong text-ink transition-colors hover:border-oro-500 hover:bg-paper disabled:pointer-events-none disabled:opacity-40";
  const cur = open === null ? null : ITEMS[open];

  return (
    <section id="galeria" className="section-y bg-wash">
      <div className="wrap">
        <div className="reveal flex items-end justify-between gap-6">
          <h2 className="max-w-[16ch] text-display-l text-ink">{t("title")}</h2>
          <div className="hidden items-center gap-4 md:flex">
            <span className="caption tabular-nums" aria-hidden>
              {t("counter", { current: index + 1, total: ITEMS.length })}
            </span>
            <button type="button" aria-label={t("prev")} disabled={edge.start} onClick={() => move(-1)} className={arrow}>
              <ArrowLeft size={20} weight="light" aria-hidden />
            </button>
            <button type="button" aria-label={t("next")} disabled={edge.end} onClick={() => move(1)} className={arrow}>
              <ArrowRight size={20} weight="light" aria-hidden />
            </button>
          </div>
        </div>
      </div>
      <ul
        ref={strip}
        onScroll={onScroll}
        aria-label={t("label")}
        className="no-scrollbar reveal mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto px-[var(--gutter)] py-3 scroll-px-[var(--gutter)] md:mt-12"
      >
        {ITEMS.map((it, i) => (
          <li key={it.k} className="relative shrink-0 snap-start">
            <DrawFrame inset={-7} duration={1200} delay={(i % 3) * 120} />
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${t("open")}: ${t(`items.${it.k}.alt`)}`}
              className="group block w-[78vw] cursor-zoom-in overflow-hidden rounded-surface md:h-[460px] md:w-auto"
              style={{ aspectRatio: it.r }}
            >
              <span className="relative block size-full overflow-hidden">
                <Image
                  src={it.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 700px, 78vw"
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="wrap">
        <p className="caption mt-6">{t("caption")}</p>
      </div>
      {cur && (
        <Lightbox label={t(`items.${cur.k}.alt`)} onClose={() => setOpen(null)}>
          <ZoomPane src={cur.src} w={cur.w} h={cur.h} alt={t(`items.${cur.k}.alt`)} sizes="90vw" />
        </Lightbox>
      )}
    </section>
  );
}
