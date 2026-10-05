"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __reveal?: boolean;
  }
}

/** Marca como visibles los elementos .reveal y .reveal-clip al entrar al viewport (una sola vez). */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-clip");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    window.__reveal = true;
    return () => io.disconnect();
  }, []);
  return null;
}
