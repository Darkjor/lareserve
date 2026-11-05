"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";
import { Lightbox, ZoomPane } from "./Lightbox";

/** Baldosas de la rejilla: renders ilustrativos y fotos del proyecto. Textos reutilizados de Amenidades, Lock-Off y Destino. */
const TILES = [
  { k: "pools", src: "/img/albercas.webp", w: 1661, h: 947, pos: "50% 50%" },
  { k: "terraces", src: "/img/hero-aerea.webp", w: 1828, h: 860, pos: "62% 50%" },
  { k: "lockoff", src: "/img/renders/interior-cocina-pequena.webp", w: 1254, h: 1254, pos: "50% 50%" },
  { k: "mahahual", src: "/img/mahahual-tortuga-43.webp", w: 1276, h: 957, pos: "50% 50%" },
] as const;

// Fila 1 = 7/5 columnas, fila 2 = 5/7 (escritorio). Movil: tira horizontal con snap.
const SPAN = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

/**
 * Familia C. Cabecera, banner de la amenidad principal a pantalla completa (parallax suave, sin pin) y rejilla
 * asimetrica de fotos a sangre con el nombre encima. Cada baldosa abre el Lightbox. Sin JS: todo visible.
 */
export function Vivir() {
  const t = useTranslations("vivir");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const banner = useRef<HTMLElement>(null);
  const shift = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const host = banner.current;
    const img = shift.current;
    if (!host || !img || prefersReducedMotion()) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        // Parallax: la imagen mide 110 % del alto y se desplaza +-4 % mientras el banner cruza la pantalla.
        gsap.fromTo(
          img,
          { yPercent: 4 },
          { yPercent: -4, ease: "none", scrollTrigger: { trigger: host, start: "top bottom", end: "bottom top", scrub: true } },
        );
      }, host);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const cur = open === null ? null : TILES[open];

  return (
    <section id="vivir" className="relative">
      <div className="wrap section-y pb-12 lg:pb-16">
        <p className="eyebrow reveal">{tn("amenities")}</p>
        <h2 className="reveal mt-4 max-w-[18ch] text-display-l text-ink" style={{ ["--d" as string]: "80ms" }}>
          {t("title")}
        </h2>
      </div>

      <figure ref={banner} className="on-dark m-0 lg:mx-auto lg:max-w-[1124px]">
        <div className="relative isolate flex min-h-[80svh] items-end overflow-hidden lg:min-h-[min(88dvh,820px)]">
          <div ref={shift} className="absolute inset-x-0 -inset-y-[5%] -z-10">
            <Image src="/img/roof-garden.webp" alt={t("roof.alt")} fill sizes="100vw" className="object-cover object-[40%_82%] lg:object-[50%_80%]" />
          </div>
          <div aria-hidden className="vz-veil-banner absolute inset-0 -z-10" />
          <div className="wrap pb-10 pt-32 lg:pb-14">
            <h3 className="reveal max-w-[16ch] text-display-l text-paper">{t("roof.title")}</h3>
            <p className="reveal mt-4 max-w-[40ch] text-body-l text-paper/92" style={{ ["--d" as string]: "100ms" }}>
              {t("roof.text")}
            </p>
          </div>
        </div>
        <figcaption className="wrap bg-paper py-3 text-caption text-ink-3">{tc("imageCaption")}</figcaption>
      </figure>

      <ul
        aria-label={t("listLabel")}
        className="no-scrollbar on-dark mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] lg:mt-0 lg:grid lg:snap-none lg:grid-cols-12 lg:gap-[6px] lg:overflow-visible lg:px-0"
      >
        {TILES.map((it, i) => (
          <li
            key={it.k}
            className={`reveal group relative aspect-[4/5] w-[78vw] shrink-0 snap-start overflow-hidden md:w-[46vw] lg:aspect-auto lg:h-[480px] lg:w-auto ${SPAN[i]}`}
            style={{ ["--d" as string]: `${i * 100}ms` }}
          >
            <figure className="relative m-0 size-full">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`${t("open")}: ${t(`${it.k}.title`)}`}
                className="absolute inset-0 cursor-zoom-in focus-visible:outline-offset-[-6px]"
              >
                <Image
                  src={it.src}
                  alt={t(`${it.k}.alt`)}
                  fill
                  sizes="(min-width: 1024px) 58vw, (min-width: 768px) 46vw, 78vw"
                  style={{ objectPosition: it.pos }}
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]"
                />
                <span aria-hidden className="vz-veil-tile absolute inset-0" />
              </button>
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-5 lg:p-7">
                <h3 className="font-display text-h3 text-paper">{t(`${it.k}.title`)}</h3>
                <p className="mt-1 max-w-[44ch] text-small text-paper/92">{t(`${it.k}.text`)}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="wrap caption py-3">{tc("imageCaption")}</p>

      {cur && (
        <Lightbox label={t(`${cur.k}.alt`)} onClose={() => setOpen(null)}>
          <ZoomPane src={cur.src} w={cur.w} h={cur.h} alt={t(`${cur.k}.alt`)} sizes="90vw" />
        </Lightbox>
      )}
    </section>
  );
}
