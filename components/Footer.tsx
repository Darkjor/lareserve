import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ContactButton } from "./ContactProvider";
import { site, whatsappLink } from "@/lib/site";

const LINKS = [
  ["residences", "residencias"],
  ["amenities", "amenidades"],
  ["availability", "disponibilidad"],
  ["location", "ubicacion"],
  ["legal", "legal"],
  ["brokers", "aliados"],
] as const;

export async function Footer() {
  const t = await getTranslations();
  const locale = await getLocale();
  return (
    <footer className="border-t border-oliva-500/40 bg-selva-950 pt-20 pb-10">
      <div className="wrap">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <Image src="/brand/logo-dorado.svg" alt={site.name} width={179} height={82} unoptimized className="h-20 w-auto" />
            <p className="mt-6 max-w-[40ch] text-small text-marfil-200">
              {t("footer.about")} {t("footer.developer")}
            </p>
          </div>
          <nav aria-label={t("footer.explore")} className="col-span-6 lg:col-span-2 lg:col-start-7">
            <h2 className="font-sans text-small font-semibold text-marfil-50">{t("footer.explore")}</h2>
            <ul className="mt-4 grid gap-1">
              {LINKS.map(([key, id]) => (
                <li key={id}>
                  <a href={`/${locale}#${id}`} className="inline-flex min-h-11 items-center text-small text-marfil-200 transition-colors hover:text-oro-300">
                    {t(`nav.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-6 lg:col-span-2">
            <h2 className="font-sans text-small font-semibold text-marfil-50">{t("footer.contact")}</h2>
            <ul className="mt-4 grid gap-1 text-small text-marfil-200">
              <li>
                <a href={whatsappLink(t("wa.general"))} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center transition-colors hover:text-oro-300">
                  {site.whatsappDisplay}
                </a>
              </li>
              <li className="inline-flex min-h-11 items-center">{site.domain}</li>
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-2">
            <h2 className="font-sans text-small font-semibold text-marfil-50">{t("footer.legal")}</h2>
            <ul className="mt-4 grid justify-items-start gap-1 text-small text-marfil-200">
              <li>
                <a href={`/${locale}/privacidad`} className="inline-flex min-h-11 items-center transition-colors hover:text-oro-300">
                  {t("footer.privacy")}
                </a>
              </li>
              <li className="mt-3">
                <ContactButton kind="brochure" variant="secondary" className="!min-h-12 !px-5 text-small">
                  {t("cta.brochure")}
                </ContactButton>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 grid gap-3 border-t border-oliva-500/40 pt-8">
          <p className="caption max-w-[90ch]">{t("footer.disclaimer")}</p>
          <p className="caption">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
