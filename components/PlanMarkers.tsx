"use client";

import { useEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

/** Posicion (% x, y sobre la imagen) de los 16 modulos, en orden de x creciente. Medido sobre plano-modulos.webp. */
const SPOTS: [number, number][] = [
  [3.8, 45.3], [11.5, 51], [19.1, 56], [34.7, 68.2], [44.8, 74.3], [52.2, 32.1], [55.1, 79.8], [59.8, 33.6],
  [61.6, 80.5], [67.5, 35.4], [67.5, 82.9], [78.2, 85.5], [79.9, 33.7], [85.9, 85.1], [89, 33.7], [94.3, 84],
];

/**
 * Cascada de 16 anillos que se trazan sobre el plano (ScrollTrigger top 70 %, una vez). Capa paper baja de .5 a 0.
 * Sin JS o con movimiento reducido el CSS (.mk-armed) deja anillos y puntos en su estado final.
 */
export function PlanMarkers() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap()
      .then(({ gsap }) => {
        if (cancelled) return;
        ctx = gsap.context(() => {
          const tl = gsap.timeline({ paused: true });
          tl.to(".mk-paper", { opacity: 0, duration: 1.8, ease: "power2.out" }, 0);
          el.querySelectorAll(".mk-ring").forEach((ring, i) => {
            const at = 0.5 + i * 0.09;
            tl.to(ring, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, at);
            tl.to(ring.nextElementSibling, { opacity: 1, duration: 0.3, ease: "power1.out" }, at + 0.7);
          });
          gsap.timeline({ scrollTrigger: { trigger: el, start: "top 70%", once: true, onEnter: () => tl.play() } });
        }, el);
      })
      .catch(() => el.classList.remove("mk-armed"));
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="mk-armed pointer-events-none absolute inset-0">
      <div className="mk-paper absolute inset-0 bg-paper" />
      <svg viewBox="0 0 1000 500" className="absolute inset-0 size-full" focusable="false">
        {SPOTS.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle className="mk-ring" cx={x * 10} cy={y * 5} r={16} pathLength={1} />
            <circle className="mk-dot" cx={x * 10} cy={y * 5} r={4} />
          </g>
        ))}
      </svg>
    </div>
  );
}
