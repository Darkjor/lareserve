"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { MagnifyingGlassMinus, MagnifyingGlassPlus, X } from "@phosphor-icons/react/ssr";
import { useDialog } from "./ui/useDialog";

/** Lightbox: marco de piedra caliza con la imagen sobre selva. Esc cierra, foco atrapado. */
export function Lightbox({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const tc = useTranslations("common");
  useDialog(true, ref, onClose);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-selva-950/90 p-3 md:p-8" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="passepartout relative flex max-h-full w-full max-w-[1200px] flex-col rounded-[6px] p-3 shadow-[var(--shadow-tint)] md:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label={tc("close")}
          className="absolute top-5 right-5 z-10 grid size-11 place-items-center rounded-full bg-selva-950 text-marfil-50 md:top-8 md:right-8"
        >
          <X size={20} weight="light" aria-hidden />
        </button>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[4px] bg-selva-900">{children}</div>
      </div>
    </div>
  );
}

/** Imagen con zoom (botones y ctrl + rueda / pellizco del trackpad); arrastra para moverte. */
export function ZoomPane({ src, w, h, alt, sizes }: { src: string; w: number; h: number; alt: string; sizes: string }) {
  const t = useTranslations("location");
  const [zoom, setZoom] = useState(1);
  const clamp = (z: number) => Math.min(3, Math.max(1, +z.toFixed(2)));
  return (
    <>
      <div
        className="min-h-0 flex-1 overflow-auto"
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) setZoom((z) => clamp(z - e.deltaY * 0.01));
        }}
      >
        <div style={{ width: `${zoom * 100}%` }} className="mx-auto">
          <Image src={src} alt={alt} width={w} height={h} sizes={sizes} className="h-auto w-full" />
        </div>
      </div>
      <div className="flex justify-center gap-2 border-t border-oliva-500/40 p-3">
        <button type="button" onClick={() => setZoom((z) => clamp(z - 0.5))} aria-label={t("zoomOut")} className="grid size-11 place-items-center rounded-full border border-marfil-50/25 text-marfil-50 hover:border-oro-300">
          <MagnifyingGlassMinus size={20} weight="light" aria-hidden />
        </button>
        <button type="button" onClick={() => setZoom((z) => clamp(z + 0.5))} aria-label={t("zoomIn")} className="grid size-11 place-items-center rounded-full border border-marfil-50/25 text-marfil-50 hover:border-oro-300">
          <MagnifyingGlassPlus size={20} weight="light" aria-hidden />
        </button>
      </div>
    </>
  );
}
