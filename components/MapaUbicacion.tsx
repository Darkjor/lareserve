"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
          title={t(kind === "map" ? "titleMap" : "titleSat")}
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
 * Google Maps embebido sin clave. Escritorio (lg): mapa y satelite lado a lado a sangre. Movil: un solo iframe con pestanas
 * Mapa | Satelite (el satelite se crea al primer toque). Los iframes se montan a 600 px del viewport; la ilustracion
 * reserva la altura final (CLS 0) y es lo que queda si el iframe no carga.
 */
export function MapaUbicacion({ lat, lng }: { lat: number; lng: number }) {
  const t = useTranslations("location");
  const rootRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Kind>("map");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
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
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  const onKeys = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const next: Kind = e.key === "ArrowRight" || e.key === "End" ? "sat" : "map";
      setTab(next);
      document.getElementById(`mapa-tab-${next}`)?.focus();
    }
  }, []);

  const h = "h-[380px] lg:h-[clamp(420px,40vw,600px)]";
  const ready = near && desktop !== null;
  return (
    <div ref={rootRef}>
      {/* Movil: pestanas (< lg). */}
      <div className="wrap lg:hidden">
        <div role="tablist" aria-label={t("tabsLabel")} onKeyDown={onKeys} className="seg mb-3 flex w-full [&>*]:min-h-11 [&>*]:flex-1">
          {(["map", "sat"] as const).map((k) => (
            <button
              key={k}
              id={`mapa-tab-${k}`}
              type="button"
              role="tab"
              aria-selected={tab === k}
              aria-controls="mapa-panel"
              tabIndex={tab === k ? 0 : -1}
              data-active={tab === k}
              onClick={() => setTab(k)}
            >
              {t(k === "map" ? "tabMap" : "tabSat")}
            </button>
          ))}
        </div>
      </div>

      <div id="mapa-panel" role="tabpanel" aria-labelledby={`mapa-tab-${tab}`} className="wrap lg:hidden">
        <MapPanel key={tab} kind={tab} lat={lat} lng={lng} mount={ready && desktop === false} className={h} />
      </div>

      {/* Escritorio: dos paneles a sangre separados por 6 px. */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-[6px]">
        {(["map", "sat"] as const).map((k) => (
          <figure key={k} className="m-0">
            <MapPanel kind={k} lat={lat} lng={lng} mount={ready && desktop === true} className={h} />
            <figcaption className="mt-2 px-[var(--gutter)] text-caption text-ink-3">{t(k === "map" ? "tabMap" : "tabSat")}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
