"use client";

import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

type Gsap = Awaited<ReturnType<typeof loadGsap>>["gsap"];
type ST = Awaited<ReturnType<typeof loadGsap>>["ScrollTrigger"];

const DEPTH = 6; // % de desplazamiento horizontal de la imagen dentro de cada pieza
const IDLE_MS = 160;
// Tope de velocidad: la tira recorre como mucho 1.5x lo que dura el cruce (en tiras largas no llega al final: se ve calma).
const MAX_RATIO = 1.5;

/**
 * Movimiento ligado al scroll en celular y tableta (< 1024 px). Sin pin, solo transform y scrollLeft.
 *  - [data-bleed]: foto a sangre, escala 1.1 a 1 y yPercent -6 a 6 mientras cruza el viewport.
 *  - [data-strip]: la tira horizontal avanza de 0 al final al cruzar el viewport; cada [data-strip-img]
 *    escala 1.12 y se mueve en x en sentido contrario segun su posicion en la tira.
 * Con movimiento reducido no hace nada (estado estatico). Sin JS: igual que siempre.
 */
export function MovilScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let mm: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ScrollTrigger.config({ ignoreMobileResize: true });
      const matcher = gsap.matchMedia();
      mm = matcher;
      matcher.add({ movil: "(max-width: 1023.98px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const { movil, reduce } = ctx.conditions as { movil: boolean; reduce: boolean };
        if (!movil || reduce) return;

        gsap.utils.toArray<HTMLElement>("[data-bleed]").forEach((el) => {
          gsap.set(el, { willChange: "transform" });
          gsap.fromTo(
            el,
            { scale: 1.1, yPercent: -6 },
            {
              scale: 1,
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: 1 },
            },
          );
        });

        const undo = gsap.utils.toArray<HTMLElement>("[data-strip]").map((s) => linkStrip(gsap, ScrollTrigger, s));
        return () => undo.forEach((f) => f());
      });
    });
    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);
  return null;
}

function linkStrip(gsap: Gsap, ScrollTrigger: ST, strip: HTMLElement) {
  const imgs = Array.from(strip.querySelectorAll<HTMLElement>("[data-strip-img]"));
  const pieces = imgs.map((i) => i.closest("li") as HTMLElement);
  const setX = imgs.map((i) => gsap.quickSetter(i, "xPercent") as (v: number) => void);
  gsap.set(imgs, { willChange: "transform" });
  gsap.fromTo(imgs, { scale: 1 }, { scale: 1.12, duration: 1.4, ease: "power2.out" });

  // Profundidad: depende solo de la posicion de la pieza en la tira (vale ligado o nativo).
  const depth = () => {
    const s = strip.getBoundingClientRect();
    const mid = s.left + s.width / 2;
    pieces.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const rel = (r.left + r.width / 2 - mid) / (s.width / 2 + r.width / 2);
      setX[i](-Math.max(-1, Math.min(1, rel)) * DEPTH);
    });
  };
  depth();
  strip.addEventListener("scroll", depth, { passive: true });
  ScrollTrigger.addEventListener("refresh", depth);

  // Ligado al scroll vertical: sin snap mientras el scroll mueve la tira.
  strip.style.scrollSnapType = "none";
  const tween = gsap.to(strip, {
    scrollLeft: () => Math.min(strip.scrollWidth - strip.clientWidth, MAX_RATIO * (window.innerHeight + strip.offsetHeight)),
    ease: "none",
    scrollTrigger: { trigger: strip, start: "top bottom", end: "bottom top", scrub: 1, invalidateOnRefresh: true },
  });

  // Suelta la tira en la primera intencion del usuario: arrastre horizontal, raton, rueda lateral o foco.
  // Un toque que solo empuja el scroll vertical NO la suelta: si no, casi nunca se veria el efecto.
  let released = false;
  let touching = false;
  let sx = 0;
  let sy = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const settle = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!touching) strip.style.scrollSnapType = "";
    }, IDLE_MS);
  };
  const release = () => {
    if (released) return;
    released = true;
    tween.scrollTrigger?.kill();
    tween.kill();
    strip.addEventListener("scroll", settle, { passive: true });
    settle(); // el snap vuelve cuando el gesto termina y el scroll se queda quieto (sin tiron bajo el dedo)
  };
  const onTouchStart = (e: TouchEvent) => {
    touching = true;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  };
  const onTouchMove = (e: TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - sx);
    if (dx > 4 && dx > Math.abs(e.touches[0].clientY - sy)) release();
  };
  const onTouchEnd = () => {
    touching = false;
    if (released) settle();
  };
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "touch") release();
  };
  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) release();
  };
  const on = { passive: true } as const;
  strip.addEventListener("touchstart", onTouchStart, on);
  strip.addEventListener("touchmove", onTouchMove, on);
  strip.addEventListener("touchend", onTouchEnd, on);
  strip.addEventListener("touchcancel", onTouchEnd, on);
  strip.addEventListener("pointerdown", onPointerDown, on);
  strip.addEventListener("wheel", onWheel, on);
  strip.addEventListener("focusin", release);

  return () => {
    clearTimeout(timer);
    strip.removeEventListener("scroll", depth);
    strip.removeEventListener("scroll", settle);
    ScrollTrigger.removeEventListener("refresh", depth);
    strip.removeEventListener("touchstart", onTouchStart);
    strip.removeEventListener("touchmove", onTouchMove);
    strip.removeEventListener("touchend", onTouchEnd);
    strip.removeEventListener("touchcancel", onTouchEnd);
    strip.removeEventListener("pointerdown", onPointerDown);
    strip.removeEventListener("wheel", onWheel);
    strip.removeEventListener("focusin", release);
    strip.style.scrollSnapType = "";
  };
}
