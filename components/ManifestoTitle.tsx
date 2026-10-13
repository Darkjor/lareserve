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
        // Cada palabra: gris tenue a oro (0.5) y de oro a tinta (0.5), desfase 0.35 entre palabras. Scrub, sin pin.
        el.classList.add("m-armed");
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top 72%", end: "bottom 40%", scrub: true } });
        el.querySelectorAll(".m-word").forEach((w, i) => {
          tl.fromTo(w, { "--a": 0 }, { "--a": 1, duration: 0.5 }, i * 0.35);
          tl.fromTo(w, { "--b": 0 }, { "--b": 1, duration: 0.5 }, i * 0.35 + 0.5);
        });
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
      el?.classList.remove("m-armed");
    };
  }, []);

  return (
    <h2 ref={ref} className="text-display-l text-ink">
      {words.map((w, i) => (
        <span key={i} className="m-word">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h2>
  );
}
