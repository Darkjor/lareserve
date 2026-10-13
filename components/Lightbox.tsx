"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { MagnifyingGlassMinus, MagnifyingGlassPlus, X } from "@phosphor-icons/react/ssr";
import { useDialog } from "./ui/useDialog";

/** Lightbox: scrim de velo, superficie de papel y controles de 44 px. Esc cierra, foco atrapado. */
export function Lightbox({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const tc = useTranslations("common");
  useDialog(true, ref, onClose);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-veil/94 p-3 md:p-8" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-full w-full max-w-[1200px] flex-col overflow-hidden rounded-surface bg-paper shadow-photo"
      >
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label={tc("close")}
          className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-ui bg-paper text-ink shadow-soft"
        >
          <X size={20} weight="light" aria-hidden />
        </button>
        <div className="flex min-h-0 flex-1 flex-col bg-wash">{children}</div>
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
      <div className="flex justify-center gap-2 border-t border-line bg-paper p-3">
        <button type="button" onClick={() => setZoom((z) => clamp(z - 0.5))} aria-label={t("zoomOut")} className="grid size-11 place-items-center rounded-ui border border-line-strong text-ink hover:border-oro-500">
          <MagnifyingGlassMinus size={20} weight="light" aria-hidden />
        </button>
        <button type="button" onClick={() => setZoom((z) => clamp(z + 0.5))} aria-label={t("zoomIn")} className="grid size-11 place-items-center rounded-ui border border-line-strong text-ink hover:border-oro-500">
          <MagnifyingGlassPlus size={20} weight="light" aria-hidden />
        </button>
      </div>
    </>
  );
}