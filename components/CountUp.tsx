"use client";

import { useEffect, useRef, useState } from "react";

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Cifra que rueda hasta su valor nuevo (tween de numero). Se renderiza ya en su valor final (sin JS y en el
 * servidor) y solo anima los cambios posteriores; con reduced-motion cambia de golpe.
 */
export function CountUp({ value, format, duration = 750, className }: { value: number; format: (n: number) => string; duration?: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
      const v = start + (value - start) * easeOutExpo(p);
      from.current = p >= 1 ? value : v;
      setShown(p >= 1 ? value : v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span className={`tabular-nums ${className ?? ""}`}>{format(shown)}</span>;
}
