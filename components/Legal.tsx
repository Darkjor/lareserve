import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ContactButton } from "./ContactProvider";

const ITEMS = ["mia", "land", "deed"] as const;

/** Familia G: dos fotos escalonadas + lista de certezas con hilo dorado. Fotos provisionales (decorativas). */
export async function Legal() {
  const t = await getTranslations("legal");
  const tn = await getTranslations("nav");
  const tcta = await getTranslations("cta");
  return (
    <section id="legal" className="section-y">
      <div className="wrap grid-12 items-start gap-y-12">
        <figure className="col-span-6 lg:col-span-3">
          <div className="reveal-clip relative aspect-[4/3] overflow-hidden rounded-surface">
            <Image src="/img/hero-aerea.webp" alt={t("cards.limited.alt")} fill sizes="(min-width: 1024px) 25vw, 46vw" className="clip-img object-cover object-[55%_50%]" />
          </div>
          <figcaption className="mt-4">
            <h3 className="font-display text-h4 text-ink">{t("cards.limited.title")}</h3>
            <p className="mt-1 text-small text-ink-2">{t("cards.limited.text")}</p>
          </figcaption>
        </figure>
        <figure className="col-span-6 mt-8 lg:col-span-3 lg:mt-[72px]">
          <div className="reveal-clip relative aspect-[5/4] overflow-hidden rounded-surface" style={{ ["--d" as string]: "180ms" }}>
            <Image src="/img/cta-final.webp" alt={t("cards.developer.alt")} fill sizes="(min-width: 1024px) 25vw, 46vw" className="clip-img object-cover" />
          </div>
          <figcaption className="mt-4">
            <h3 className="font-display text-h4 text-ink">{t("cards.developer.title")}</h3>
            <p className="mt-1 text-small text-ink-2">{t("cards.developer.text")}</p>
          </figcaption>
        </figure>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:self-center">
          <p className="eyebrow reveal">{tn("legal")}</p>
          <h2 className="reveal mt-4 text-display-l text-ink">{t("title")}</h2>
          <p className="reveal mt-5 max-w-[44ch] text-body-l text-ink-2">{t("closing")}</p>
          <ul className="mt-9 grid gap-7">
            {ITEMS.map((k, i) => (
              <li key={k} className="reveal" style={{ ["--d" as string]: `${i * 140}ms` }}>
                <span className="thread reveal-thread" style={{ ["--d" as string]: `${i * 140 + 200}ms` }} aria-hidden />
                <h3 className="mt-4 font-display text-h4 text-ink">{t(`items.${k}`)}</h3>
              </li>
            ))}
          </ul>
          <div className="reveal mt-10">
            <ContactButton kind="legal" className="w-full sm:w-auto">
              {tcta("legal")}
            </ContactButton>
            <p className="caption mt-3">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}