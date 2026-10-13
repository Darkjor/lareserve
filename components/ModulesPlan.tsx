"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowsOutSimple } from "@phosphor-icons/react/ssr";
import { Lightbox, ZoomPane } from "./Lightbox";
import { PlanMarkers } from "./PlanMarkers";

/** Plano de modulos a ancho de contenedor (2:1). Movil: scroll horizontal. Ampliar abre el Lightbox. Recibe el CTA como hijo. */
export function ModulesPlan({ children }: { children: ReactNode }) {
  const t = useTranslations("availability");
  const [open, setOpen] = useState(false);
  return (
    <div className="reveal mt-10">
      <div role="region" aria-label={t("alt")} tabIndex={0} className="overflow-x-auto rounded-surface border border-line bg-paper md:overflow-visible">
        <div className="relative aspect-[2/1] min-w-[760px] md:min-w-0">
          <Image src="/img/plano-modulos.webp" alt={t("alt")} fill sizes="(min-width: 1360px) 1328px, (min-width: 768px) 92vw, 760px" className="object-cover" />
          <PlanMarkers />
        </div>
      </div>
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