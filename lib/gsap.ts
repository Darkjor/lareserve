"use client";

import { useSyncExternalStore } from "react";

/** Carga GSAP + ScrollTrigger bajo demanda: no entra al JS inicial. */
export async function loadGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

const REDUCE = "(prefers-reduced-motion: reduce)";
export function prefersReducedMotion() {
  return window.matchMedia(REDUCE).matches;
}

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** true si se permiten animaciones; false en el servidor y con movimiento reducido. */
export function useAnimationsEnabled() {
  return useSyncExternalStore(subscribe, () => !window.matchMedia(REDUCE).matches, () => false);
}
