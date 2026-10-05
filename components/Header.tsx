"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, List, X } from "@phosphor-icons/react/ssr";
import { Link, usePathname } from "@/i18n/navigation";
import { loadGsap } from "@/lib/gsap";
import { ContactButton, useContact } from "./ContactProvider";
import { useDialog } from "./ui/useDialog";

const LINKS = [
  ["residences", "residencias"],
  ["amenities", "amenidades"],
  ["availability", "disponibilidad"],
  ["location", "ubicacion"],
  ["legal", "legal"],
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
          className="!min-h-10 !px-4 text-small uppercase tracking-wider"
          aria-label={l === "es" ? t("langEs") : t("langEn")}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const { open: openContact } = useContact();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => setMenu(false);
  useDialog(menu, menuRef, closeMenu);

  // Estado del header segun scroll: ScrollTrigger (sin listeners de scroll propios).
  useEffect(() => {
    let kill: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setScrolled(y > 80);
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
        data-scrolled={scrolled}
        data-hidden={hidden && !menu}
        className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-[var(--gutter)] pt-4 transition-transform duration-[320ms] ease-[var(--ease-soft)] data-[hidden=true]:-translate-y-[140%] md:pt-5"
      >
        <nav
          aria-label={t("nav.label")}
          className="pointer-events-auto flex h-16 w-full max-w-[1100px] items-center justify-between gap-4 rounded-full border border-transparent pr-2 pl-5 transition-[background-color,border-color,box-shadow] duration-[320ms] [header[data-scrolled=true]_&]:border-[color:var(--hairline)] [header[data-scrolled=true]_&]:bg-selva-950/72 [header[data-scrolled=true]_&]:shadow-[var(--shadow-tint)] [header[data-scrolled=true]_&]:backdrop-blur-xl"
        >
          <a href={`/${locale}`} aria-label={t("nav.home")} className="shrink-0">
            <Image src="/brand/logo-dorado-h.svg" alt="" width={153} height={28} unoptimized priority className="hidden h-7 w-auto xl:block" />
            <Image src="/brand/logo-dorado-c.svg" alt="" width={70} height={28} unoptimized priority className="h-[26px] w-auto xl:hidden" />
          </a>

          <ul className="hidden items-center gap-1 xl:flex">
            {LINKS.map(([key, id]) => (
              <li key={id}>
                <a
                  href={`/${locale}#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  className={`inline-flex min-h-11 items-center px-3 text-small transition-colors hover:text-marfil-50 ${
                    active === id ? "link-gold text-marfil-50" : "text-marfil-200"
                  }`}
                >
                  {t(`nav.${key}`)}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LangSwitch className="hidden xl:inline-flex" />
            <ContactButton className="hidden !min-h-12 !pl-6 xl:inline-flex">{t("cta.book")}</ContactButton>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label={t("nav.menuOpen")}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full border border-marfil-50/25 bg-selva-950/60 text-marfil-50 xl:hidden"
            >
              <List size={22} weight="light" aria-hidden />
            </button>
          </div>
        </nav>
      </header>

      {menu && (
        <div id="mobile-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label={t("nav.label")} className="menu-overlay fixed inset-0 z-50 flex flex-col bg-selva-950/[0.96]">
          <div className="flex items-center justify-between px-[var(--gutter)] pt-5">
            <LangSwitch />
            <button
              type="button"
              onClick={closeMenu}
              aria-label={t("nav.menuClose")}
              className="grid size-11 place-items-center rounded-full border border-marfil-50/25 text-marfil-50"
            >
              <X size={22} weight="light" aria-hidden />
            </button>
          </div>
          <ul className="flex flex-1 flex-col justify-center gap-1 px-[var(--gutter)]">
            {LINKS.map(([key, id], i) => (
              <li key={id} className="menu-item" style={{ ["--i" as string]: i }}>
                <a
                  href={`/${locale}#${id}`}
                  onClick={closeMenu}
                  className="block py-2 font-display text-[clamp(2rem,9vw,2.25rem)] leading-tight text-marfil-50"
                >
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
