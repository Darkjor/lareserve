"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { whatsappLink } from "@/lib/site";

/** FAB de WhatsApp: aparece tras 600 px de scroll (centinela + IntersectionObserver). */
export function WhatsAppFloat() {
  const t = useTranslations();
  const sentinel = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute top-[600px] left-0 h-px w-px" />
      <a
        href={whatsappLink(t("wa.general"))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("common.whatsappAria")}
        data-show={show}
        className="wa-float fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full bg-[image:var(--gold-grad)] text-selva-950 opacity-0 shadow-[var(--shadow-tint)] transition-[opacity,transform] duration-[320ms] data-[show=true]:opacity-100 pointer-events-none data-[show=true]:pointer-events-auto hover:scale-105 active:scale-95 md:right-6 md:bottom-6"
        tabIndex={show ? 0 : -1}
      >
        <WhatsappLogo size={28} weight="light" aria-hidden />
      </a>
    </>
  );
}
