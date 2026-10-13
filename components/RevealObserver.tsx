"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __reveal?: boolean;
  }
}

/** Marca .reveal, .reveal-clip, .reveal-thread (umbral 15 %) y .reveal-frame (40 %) al entrar al viewport, una sola vez. */
export function RevealObserver() {
  useEffect(() => {
    const make = (threshold: number, hosts?: Map<Element, HTMLElement>) =>
      new IntersectionObserver(
        (entries, o) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              hosts?.get(e.target)?.classList.add("is-visible");
              o.unobserve(e.target);
            }
          }
        },
        { threshold, rootMargin: "0px 0px -6% 0px" },
      );
    const clipHosts = new Map<Element, HTMLElement>();
    const a = make(0.15, clipHosts);
    const b = make(0.4);
    document.querySelectorAll<HTMLElement>(".reveal, .reveal-thread").forEach((el) => a.observe(el));
    // .reveal-clip nace recortada al 100 %: se observa su contenedor y se marca el elemento.
    document.querySelectorAll<HTMLElement>(".reveal-clip").forEach((el) => {
      const host = el.parentElement ?? el;
      clipHosts.set(host, el);
      a.observe(host);
    });
    document.querySelectorAll<HTMLElement>(".reveal-frame").forEach((el) => b.observe(el));
    window.__reveal = true;
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);
  return null;
}
