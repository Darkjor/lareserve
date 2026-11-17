"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Kind = "map" | "sat";
const TYPE: Record<Kind, string> = { map: "m", sat: "k" };
const LOAD_TIMEOUT = 8000;

function MapPanel({ kind, lat, lng, mount, className }: { kind: Kind; lat: number; lng: number; mount: boolean; className: string }) {
  const t = useTranslations("location");
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(false);
  const live = mount && !failed;

  // Si el iframe no emite load en 8 s se queda la ilustracion.
  useEffect(() => {
    if (!live || loaded) return;
    const id = setTimeout(() => setFailed(true), LOAD_TIMEOUT);
    return () => clearTimeout(id);
  }, [live, loaded]);

  // Esc devuelve el scroll a la pagina.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div onPointerLeave={() => setActive(false)} className={`relative overflow-hidden bg-wash ${className}`}>
      <Image src="/img/ubicacion.webp" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      {live && (
        <iframe
          title={t("titleMap")}
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&t=${TYPE[kind]}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 size-full border-0 transition-opacity duration-[400ms] ease-[var(--ease-soft)] ${loaded ? "opacity-100" : "opacity-0"} ${active ? "" : "pointer-events-none"}`}
        />
      )}
      {live && loaded && (
        <button
          type="button"
          aria-label={t("activate")}
          aria-pressed={active}
          onClick={() => setActive(true)}
          className={`absolute inset-0 cursor-pointer focus-visible:outline-offset-[-4px] ${active ? "pointer-events-none" : ""}`}
        />
      )}
    </div>
  );
}

/**
 * Google Maps embebido sin clave: un solo mapa. El iframe se monta a 600 px del viewport; la ilustracion reserva la
 * altura final (CLS 0) y es lo que queda si el iframe no carga.
 */
export function MapaUbicacion({ lat, lng, className = "" }: { lat: number; lng: number; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <MapPanel kind="map" lat={lat} lng={lng} mount={near} className={`h-[380px] lg:h-[clamp(420px,40vw,600px)] ${className}`} />
    </div>
  );
}
