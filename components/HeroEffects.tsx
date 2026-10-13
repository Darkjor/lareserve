"use client";

import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Hero al hacer scroll: la imagen sube 4 % (parallax) y una capa extra de velo se oscurece de 0 a .25.
 * El velo base (.hero-veil) no se anima: el contraste bajo el texto no depende del scroll. Sin movimiento reducido.
 */
export function HeroEffects() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const trigger = { trigger: "[data-hero-photo]", start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-img]", { yPercent: -4, ease: "none", scrollTrigger: trigger });
        gsap.to("[data-hero-dim]", { opacity: 0.25, ease: "none", scrollTrigger: trigger });
      });
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);
  return null;
}