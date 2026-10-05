"use client";

import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

/** Hero al hacer scroll: la imagen sube hasta 6 % y el velo se oscurece. Sin movimiento reducido. */
export function HeroEffects() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const trigger = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-img]", { yPercent: -6, ease: "none", scrollTrigger: trigger });
        gsap.fromTo("[data-hero-veil]", { opacity: 0.6 }, { opacity: 1, ease: "none", scrollTrigger: trigger });
      });
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);
  return null;
}
