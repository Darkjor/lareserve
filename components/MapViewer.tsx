"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowsOutSimple } from "@phosphor-icons/react/ssr";
import { Lightbox, ZoomPane } from "./Lightbox";

/** Mapa ilustrativo. Movil: visor con scroll horizontal y boton Ampliar (lightbox con zoom). */
export function MapViewer() {
  const t = useTranslations("location");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  return (
    <figure>
      <div className="bezel">
        <div className="bezel-core relative">
          <div className="no-scrollbar snap-x overflow-x-auto md:overflow-visible">
            <div className="relative aspect-[16/9] w-[900px] snap-center md:w-full">
              <Image src="/img/ubicacion.webp" alt={t("alt")} fill sizes="(min-width: 1360px) 1250px, 900px" className="object-cover" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn btn-secondary absolute right-3 bottom-3 !min-h-11 !px-4 text-small md:hidden"
          >
            <ArrowsOutSimple size={18} weight="light" aria-hidden />
            {t("expand")}
          </button>
        </div>
      </div>
      <figcaption className="caption mt-3">
        {t("caption")} {tc("imageCaption")}
      </figcaption>
      {open && (
        <Lightbox label={t("alt")} onClose={() => setOpen(false)}>
          <ZoomPane src="/img/ubicacion.webp" w={2400} h={1351} alt={t("alt")} sizes="95vw" />
        </Lightbox>
      )}
    </figure>
  );
}
