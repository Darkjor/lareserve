"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { whatsappLink } from "@/lib/site";
import { useContact } from "./ContactProvider";

/**
 * Barra inferior fija (< xl): "Agenda tu presentacion" + WhatsApp. Aparece al salir del hero y se oculta mientras
 * la franja del formulario, el CTA final o el pie estan en pantalla. Reemplaza al WhatsApp flotante en esos anchos.
 */
export function MobileBar() {
  const t = useTranslations();
  const { open } = useContact();
  const [pastHero, setPastHero] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero-photo]");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const els = ["agenda", "contacto"].map((id) => document.getElementById(id)).concat(document.querySelector("footer"));
    const live = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) live.add(e.target);
        else live.delete(e.target);
      }
      setCovered(live.size > 0);
    });
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const show = pastHero && !covered;
  return (
    <div
      inert={!show}
      data-show={show}
      className="fixed inset-x-0 bottom-0 z-30 translate-y-full border-t border-line bg-paper/96 pb-[env(safe-area-inset-bottom)] transition-transform duration-[320ms] ease-[var(--ease-soft)] data-[show=true]:translate-y-0 xl:hidden"
    >
      <div className="wrap flex h-14 items-center gap-3">
        <button type="button" onClick={() => open("presentacion")} className="btn btn-primary !min-h-11 flex-1 justify-between !py-1 !pr-1 !pl-5">
          {t("cta.book")}
          <span className="btn-icon" aria-hidden>
            <ArrowUpRight size={18} weight="light" />
          </span>
        </button>
        <a
          href={whatsappLink(t("wa.general"))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("common.whatsappAria")}
          className="grid size-11 shrink-0 place-items-center rounded-ui bg-verde-700 text-paper"
        >
          <WhatsappLogo size={24} weight="light" aria-hidden />
        </a>
      </div>
    </div>
  );
}
