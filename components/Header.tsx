"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, List, X } from "@phosphor-icons/react/ssr";
import { Link, usePathname } from "@/i18n/navigation";
import { loadGsap } from "@/lib/gsap";
import { ContactButton, useContact } from "./ContactProvider";
import { useDialog } from "./ui/useDialog";

// Orden de la pagina (spec de Direccion). Los ids sin bloque todavia (vivir, faq) los monta el dev 2.
const LINKS = [
  ["amenities", "vivir"],
  ["residences", "residencias"],
  ["location", "ubicacion"],
  ["legal", "legal"],
  ["availability", "disponibilidad"],
  ["brokers", "aliados"],
  ["faq", "faq"],
] as const;

function LangSwitch({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <div className={`seg ${className}`} role="group" aria-label={t("lang")}>
      {(["es", "en"] as const).map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          hrefLang={l}
          lang={l}
          aria-current={locale === l ? "true" : undefined}
          data-active={locale === l}
          className="text-small"
          aria-label={l === "es" ? t("langEs") : t("langEn")}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { open: openContact } = useContact();
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => setMenu(false);
  useDialog(menu, menuRef, closeMenu);

  // Transparente con scrim solo sobre la foto del hero (inicio); en el resto, barra de papel.
  const overHero = pathname === "/" && !pastHero;

  // Estado del header segun scroll: ScrollTrigger (sin listeners de scroll propios).
  useEffect(() => {
    let kill: (() => void) | undefined;
    let cancelled = false;
    let photo: HTMLElement | null = null;
    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          if (!photo?.isConnected) photo = document.querySelector<HTMLElement>("[data-hero-photo]");
          setPastHero(photo ? y > photo.offsetHeight - 80 : true);
          setHidden(self.direction === 1 && y > 320);
        },
      });
      kill = () => st.kill();
    });
    return () => {
      cancelled = true;
      kill?.();
    };
  }, []);

  // Enlace activo segun la seccion en pantalla.
  useEffect(() => {
    const els = LINKS.map(([, id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header
        data-over-hero={overHero}
        data-hidden={hidden && !menu}
        className="group/header fixed inset-x-0 top-0 z-40 h-[72px] transition-transform duration-[320ms] ease-[var(--ease-soft)] data-[hidden=true]:-translate-y-full"
      >
        <div
          aria-hidden
          className="header-scrim pointer-events-none absolute inset-x-0 top-0 h-[168px] transition-opacity duration-[320ms] group-data-[hidden=true]/header:opacity-0 group-data-[over-hero=false]/header:opacity-0"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 border-b border-line bg-paper/96 opacity-0 transition-opacity duration-[320ms] group-data-[over-hero=false]/header:opacity-100"
        />
        <nav aria-label={t("nav.label")} className="wrap relative flex h-full items-center justify-between gap-4">
          <a href={`/${locale}`} aria-label={t("nav.home")} className="shrink-0">
            <span className="logo-white">
              <Image src="/brand/logo-blanco-h.svg" alt="" width={153} height={28} unoptimized priority className="hidden h-7 w-auto xl:block" />
              <Image src="/brand/logo-blanco-c.svg" alt="" width={70} height={28} unoptimized priority className="h-[26px] w-auto xl:hidden" />
            </span>
            <span className="logo-gold">
              <Image src="/brand/logo-dorado-h.svg" alt="" width={153} height={28} unoptimized loading="eager" className="hidden h-7 w-auto xl:block" />
              <Image src="/brand/logo-dorado-c.svg" alt="" width={70} height={28} unoptimized loading="eager" className="h-[26px] w-auto xl:hidden" />
            </span>
          </a>

          <ul className="hidden items-center xl:flex">
            {LINKS.map(([key, id]) => (
              <li key={id}>
                <a
                  href={`/${locale}#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  className={`inline-flex min-h-11 items-center px-2.5 text-small text-paper transition-colors hover:text-oro-300 group-data-[over-hero=false]/header:text-ink group-data-[over-hero=false]/header:hover:text-oro-700 2xl:px-3 ${
                    active === id ? "link-gold" : ""
                  }`}
                >
                  {t(`nav.${key}`)}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LangSwitch className="hidden xl:inline-flex" />
            <ContactButton className="hidden !min-h-11 !py-1 !pr-1 !pl-5 xl:inline-flex">{t("cta.book")}</ContactButton>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label={t("nav.menuOpen")}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-ui border border-paper/50 bg-veil/40 text-paper transition-colors group-data-[over-hero=false]/header:border-line-strong group-data-[over-hero=false]/header:bg-transparent group-data-[over-hero=false]/header:text-ink xl:hidden"
            >
              <List size={22} weight="light" aria-hidden />
            </button>
          </div>
        </nav>
      </header>

      {menu && (
        <div id="mobile-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label={t("nav.label")} className="menu-overlay fixed inset-0 z-50 flex flex-col bg-paper">
          <div className="flex items-center justify-between px-[var(--gutter)] pt-5">
            <LangSwitch />
            <button
              type="button"
              onClick={closeMenu}
              aria-label={t("nav.menuClose")}
              className="grid size-11 place-items-center rounded-ui border border-line-strong text-ink"
            >
              <X size={22} weight="light" aria-hidden />
            </button>
          </div>
          <ul className="flex flex-1 flex-col justify-center gap-1 px-[var(--gutter)]">
            {LINKS.map(([key, id], i) => (
              <li key={id} className="menu-item" style={{ ["--i" as string]: i }}>
                <a href={`/${locale}#${id}`} onClick={closeMenu} className="block py-2 font-display text-h3 text-ink">
                  {t(`nav.${key}`)}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-[var(--gutter)] pb-8">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openContact("presentacion");
              }}
              className="btn btn-primary w-full justify-between"
            >
              {t("cta.book")}
              <span className="btn-icon" aria-hidden>
                <ArrowUpRight size={18} weight="light" />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}