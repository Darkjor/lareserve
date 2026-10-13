"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, X } from "@phosphor-icons/react/ssr";
import { LeadForm, type LeadTipo } from "./LeadForm";
import { buttonClass, type ButtonVariant } from "./ui/LinkButton";
import { useDialog } from "./ui/useDialog";

type Kind = Exclude<LeadTipo, "broker">;
const Ctx = createContext<{ open: (kind?: Kind) => void }>({ open: () => {} });
export const useContact = () => useContext(Ctx);

/** Panel lateral "Agenda tu presentacion" (hoja inferior en movil). Unico modal junto con el lightbox y el menu. */
export function ContactProvider({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<Kind | null>(null);
  const open = useCallback((k: Kind = "presentacion") => setKind(k), []);
  const close = useCallback(() => setKind(null), []);
  const value = useMemo(() => ({ open }), [open]);
  return (
    <Ctx.Provider value={value}>
      {children}
      {kind && <ContactPanel kind={kind} onClose={close} />}
    </Ctx.Provider>
  );
}

function ContactPanel({ kind, onClose }: { kind: Kind; onClose: () => void }) {
  const t = useTranslations("panel");
  const tc = useTranslations("common");
  const ref = useRef<HTMLDivElement>(null);
  useDialog(true, ref, onClose);
  const title = kind === "legal" ? t("legalTitle") : kind === "brochure" ? t("brochureTitle") : t("title");
  const intro = kind === "legal" ? t("legalIntro") : kind === "brochure" ? t("brochureIntro") : t("intro");

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-veil/55" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="sheet absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-surface bg-paper shadow-photo md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[440px] md:rounded-none md:rounded-l-surface"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <h2 id="contact-title" className="text-h3 text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={tc("close")}
            className="grid size-11 shrink-0 place-items-center rounded-ui border border-line-strong text-ink transition-colors hover:border-oro-500"
          >
            <X size={20} weight="light" aria-hidden />
          </button>
        </div>
        <p className="px-6 pt-2 text-small text-ink-2">{intro}</p>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-8">
          <LeadForm variant="panel" tipo={kind} />
        </div>
      </div>
    </div>
  );
}

/** Boton que abre el panel de contacto. */
export function ContactButton({
  kind = "presentacion",
  variant = "primary",
  className = "",
  children,
}: {
  kind?: Kind;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  const { open } = useContact();
  return (
    <button type="button" onClick={() => open(kind)} className={`${buttonClass(variant)} ${className}`}>
      {children}
      {variant === "primary" && (
        <span className="btn-icon" aria-hidden>
          <ArrowUpRight size={18} weight="light" />
        </span>
      )}
    </button>
  );
}