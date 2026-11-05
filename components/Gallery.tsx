"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import { Lightbox, ZoomPane } from "./Lightbox";

/** Tira de imagenes propias y renders ilustrativos: alternan fachadas, interiores y entorno (sin repetir contiguas). */
const ITEMS = [
  { k: "aerial", src: "/img/hero-aerea.webp", w: 1828, h: 860 },
  { k: "sala", src: "/img/renders/interior-sala.webp", w: 1402, h: 1122 },
  { k: "pools", src: "/img/albercas.webp", w: 1661, h: 947 },
  { k: "sala2", src: "/img/renders/interior-sala-2.webp", w: 1672, h: 941 },
  { k: "roof", src: "/img/roof-garden.webp", w: 977, h: 1272 },
  { k: "recibidor", src: "/img/renders/interior-recibidor.webp", w: 1672, h: 941 },
  { k: "type1", src: "/img/fachada-tipo1.webp", w: 1920, h: 1080 },
  { k: "cocinaPequena", src: "/img/renders/interior-cocina-pequena.webp", w: 1254, h: 1254 },
  { k: "hammock", src: "/img/hamaca.webp", w: 1274, h: 1647 },
  { k: "bano", src: "/img/renders/interior-bano.webp", w: 1254, h: 1254 },
] as const;

/** Familia F: tira horizontal con snap nativo (sin JS funciona), a sangre y Lightbox. */
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
      const d = Math.abs((c as HTMLElement).offsetLeft - left);
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
    <section id="galeria" className="bg-wash pt-[clamp(4.5rem,3rem+5vw,7.5rem)]">
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
        className="no-scrollbar reveal mt-10 flex snap-x snap-mandatory gap-[6px] overflow-x-auto md:mt-12"
      >
        {ITEMS.map((it, i) => (
          <li key={it.k} className="relative shrink-0 snap-start">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${t("open")}: ${t(`items.${it.k}.alt`)}`}
              className="group block h-[320px] cursor-zoom-in overflow-hidden md:h-[460px]"
              style={{ aspectRatio: `${it.w} / ${it.h}` }}
            >
              <span className="relative block size-full overflow-hidden">
                <Image
                  src={it.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 820px, 80vw"
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="wrap">
        <p className="caption py-5">{t("caption")}</p>
      </div>
      {cur && (
        <Lightbox label={t(`items.${cur.k}.alt`)} onClose={() => setOpen(null)}>
          <ZoomPane src={cur.src} w={cur.w} h={cur.h} alt={t(`items.${cur.k}.alt`)} sizes="90vw" />
        </Lightbox>
      )}
    </section>
  );
}
