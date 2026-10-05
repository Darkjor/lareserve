"use client";

import { useEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

/** Titular del manifiesto: las palabras se encienden con el scroll (scrub). Legible sin JS y con movimiento reducido. */
export function ManifestoTitle({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const spans = el.querySelectorAll(".m-word");
        gsap.fromTo(
          spans,
          { opacity: 0.22 },
          { opacity: 1, ease: "none", stagger: 0.12, scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 35%", scrub: true } },
        );
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <h2 ref={ref} className="text-display-l text-marfil-50">
      {words.map((w, i) => (
        <span key={i} className="m-word">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h2>
  );
}
