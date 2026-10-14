"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { loadGsap } from "@/lib/gsap";

/** Cinco piezas de Vivir. Imagenes y textos reutilizados de Amenidades, Lock-Off y Destino. */
const ITEMS = [
  { k: "roof", src: "/img/roof-garden.webp", w: 977, h: 1272, fit: "cover", r: 0.8 },
  { k: "pools", src: "/img/albercas.webp", w: 1661, h: 947, fit: "cover", r: 1.5 },
  { k: "terraces", src: "/img/plantas/terraza-b.webp", w: 850, h: 205, fit: "contain" },
  { k: "lockoff", src: "/img/plantas/planta-b.webp", w: 945, h: 941, fit: "contain" },
  { k: "mahahual", src: "/img/mahahual-tortuga-43.webp", w: 1276, h: 957, fit: "cover", r: 4 / 3 },
] as const;

type Item = (typeof ITEMS)[number];

/**
 * Familia C. Escritorio con movimiento: encuadre fijo (unico pin, 200vh en total) con indice de 5 piezas.
 * Movil, movimiento reducido y sin JS: las 5 piezas apiladas. El CSS (.vz-stage / .vz-stack) elige el arbol.
 */
export function Vivir() {
  const t = useTranslations("vivir");
  const tn = useTranslations("nav");
  const root = useRef<HTMLDivElement>(null);
  const st = useRef<{ start: number; end: number; scroll: (n: number) => void } | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        st.current = ScrollTrigger.create({
          trigger: el,
          start: "top 72px",
          end: "+=100%",
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(ITEMS.length - 1, Math.floor(self.progress * ITEMS.length))),
        });
      }, el);
      // Las imagenes son lazy: refrescar al decodificar para no desfasar el pin.
      el.querySelectorAll("img").forEach((img) => img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true }));
    });
    return () => {
      cancelled = true;
      st.current = null;
      ctx?.revert();
    };
  }, []);

  const go = (i: number) => {
    const s = st.current;
    if (s) s.scroll(s.start + ((i + 0.5) / ITEMS.length) * (s.end - s.start));
    else setActive(i);
  };

  const heading = (
    <>
      <p className="eyebrow">{tn("amenities")}</p>
      <h2 className="mt-4 text-display-l text-ink">{t("title")}</h2>
    </>
  );

  const frame = (it: Item, cls = "") => (
    <div className={`relative size-full overflow-hidden rounded-surface ${it.fit === "contain" ? "bg-wash" : ""} ${cls}`}>
      <Image
        src={it.src}
        alt={t(`${it.k}.alt`)}
        fill
        sizes="(min-width: 1024px) 56vw, 100vw"
        className={it.fit === "contain" ? "object-contain p-6 drop-shadow-[0_18px_24px_rgb(21_26_23/0.18)]" : "object-cover"}
      />
    </div>
  );

  return (
    <section id="vivir" className="relative">
      {/* Escritorio con movimiento y JS: escena fijada */}
      <div ref={root} className="vz-stage">
        <div className="wrap grid h-[calc(100dvh-72px)] grid-cols-12 items-center gap-x-6">
          <div className="col-span-5">
            {heading}
            <ol aria-label={t("listLabel")} className="mt-9 grid gap-1">
              {ITEMS.map((it, i) => {
                const on = i === active;
                return (
                  <li key={it.k} data-on={on}>
                    <h3 className="font-display text-h3">
                      <button
                        type="button"
                        aria-current={on ? "true" : undefined}
                        onClick={() => go(i)}
                        className={`flex min-h-11 w-full items-center gap-4 text-left transition-colors duration-300 ${on ? "text-ink" : "text-ink-3 hover:text-ink"}`}
                      >
                        <span aria-hidden className="vz-thread" />
                        {t(`${it.k}.title`)}
                      </button>
                    </h3>
                    <div className="vz-phrase" aria-hidden={!on}>
                      <p className="pl-14 text-small text-ink-2">{t(`${it.k}.text`)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="col-span-7">
            <div className="frame-out relative h-[min(calc(100dvh-168px),700px)] w-full [container-type:size]">
              {ITEMS.map((it, i) => (
                <div key={it.k} className="vz-img absolute inset-0" data-on={i === active} aria-hidden={i !== active}>
                  {"r" in it ? (
                    // La foto conserva su proporcion (recorte < 15 %): el marco se ajusta a la foto.
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ width: `min(100cqw, calc(100cqh * ${it.r}))`, aspectRatio: String(it.r) }}
                    >
                      {frame(it)}
                    </div>
                  ) : (
                    frame(it)
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Movil, movimiento reducido y sin JS: piezas apiladas */}
      <div className="vz-stack section-y">
        <div className="wrap">
          {heading}
          <ul aria-label={t("listLabel")} className="mt-10 grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
            {ITEMS.map((it) => (
              <li key={it.k} className="reveal">
                <figure>
                  <div className="aspect-[16/10]" style={"r" in it ? { aspectRatio: String(it.r) } : undefined}>{frame(it)}</div>
                  <figcaption className="mt-4">
                    <h3 className="font-display text-h3 text-ink">{t(`${it.k}.title`)}</h3>
                    <p className="mt-1 max-w-[40ch] text-small text-ink-2">{t(`${it.k}.text`)}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
