"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowsLeftRight, ArrowsOutSimple } from "@phosphor-icons/react/ssr";
import { Lightbox, ZoomPane } from "./Lightbox";
import { PlanMarkers } from "./PlanMarkers";

/** Plano de modulos a ancho de contenedor (2:1). Movil: scroll horizontal con aviso y boton para deslizar. Ampliar abre el Lightbox. Recibe el CTA como hijo. */
export function ModulesPlan({ children }: { children: ReactNode }) {
  const t = useTranslations("availability");
  const [open, setOpen] = useState(false);
  const [moved, setMoved] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const slide = () => {
    const el = scroller.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    el.scrollTo({ left: atEnd ? 0 : el.scrollWidth, behavior: "smooth" });
  };

  return (
    <div className="reveal mt-10">
      <div
        ref={scroller}
        role="region"
        aria-label={t("alt")}
        tabIndex={0}
        onScroll={() => !moved && setMoved(true)}
        className="overflow-x-auto md:overflow-visible"
      >
        <div className="relative aspect-[2/1] min-w-[760px] md:min-w-0">
          <Image src="/img/plano-modulos.webp" alt={t("alt")} fill sizes="(min-width: 1360px) 1328px, (min-width: 768px) 92vw, 760px" className="object-cover" />
          <PlanMarkers />
        </div>
      </div>
      <button
        type="button"
        onClick={slide}
        className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-surface border border-ink/20 px-4 text-small font-semibold text-ink md:hidden ${moved ? "" : "motion-safe:animate-pulse"}`}
      >
        <ArrowsLeftRight size={20} weight="light" aria-hidden />
        {t("scrollHint")}
      </button>
      <p className="caption mt-3">{t("note")}</p>
      <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
        {children}
        <button type="button" onClick={() => setOpen(true)} className="link-gold inline-flex min-h-11 items-center gap-2 text-ink">
          <ArrowsOutSimple size={18} weight="light" aria-hidden />
          {t("expand")}
        </button>
      </div>
      {open && (
        <Lightbox label={t("alt")} onClose={() => setOpen(false)}>
          <ZoomPane src="/img/plano-modulos.webp" w={1774} h={887} alt={t("alt")} sizes="95vw" />
        </Lightbox>
      )}
    </div>
  );
}
