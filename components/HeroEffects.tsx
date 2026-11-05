"use client";

import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Hero al hacer scroll (sin pin): la imagen sube 6 % (parallax suave) y el contenido se desvanece.
 * El velo base no se anima. Sin movimiento reducido.
 */
export function HeroEffects() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.to("[data-hero-img]", {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero-photo]", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-content]", {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero-photo]", start: "18% top", end: "72% top", scrub: true },
        });
      });
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);
  return null;
}
