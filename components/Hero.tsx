import { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";
import { ContactButton } from "./ContactProvider";
import { HeroEffects } from "./HeroEffects";
import { LinkButton } from "./ui/LinkButton";

export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("hero");
  const tc = await getTranslations("common");
  const tcta = await getTranslations("cta");

  // Direccion de arte: aerea horizontal en escritorio, fachada vertical en movil.
  const {
    props: { srcSet: desktop },
  } = getImageProps({ src: "/img/hero-aerea.webp", alt: "", width: 1828, height: 860, sizes: "100vw", quality: 82 });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({
    src: "/img/hero-vertical.webp",
    alt: t("alt"),
    width: 1275,
    height: 1646,
    sizes: "100vw",
    quality: 75,
    priority: true,
  });

  return (
    <section id="inicio" data-hero className="relative isolate z-0 min-h-dvh overflow-hidden">
      <div data-hero-img className="hero-sun absolute inset-0 -z-20 will-change-transform">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktop} />
          <source media="(max-width: 767px)" srcSet={mobile} />
          <img {...img} alt={t("alt")} className="size-full object-cover object-[28%_40%] md:object-[52%_50%]" />
        </picture>
      </div>
      <div
        data-hero-veil
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top right, oklch(0.17 0.025 153 / 0.9) 0%, oklch(0.17 0.025 153 / 0.55) 45%, transparent 80%), linear-gradient(to bottom, oklch(0.17 0.025 153 / 0.55), transparent 22%)",
        }}
      />

      <div className="wrap flex min-h-dvh flex-col justify-end pt-24 pb-14 md:pb-16">
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-7">
            <p className="eyebrow hero-fade" style={{ ["--d" as string]: "700ms" }}>
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 text-display-xl text-marfil-50">
              <span className="hero-line">
                <span>{t.rich("title", { em: (c) => <em>{c}</em> })}</span>
              </span>
            </h1>
            <p className="hero-fade mt-6 max-w-[34ch] text-body-l text-marfil-200" style={{ ["--d" as string]: "1000ms" }}>
              {t("subtitle")}
            </p>
            <div className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "1250ms" }}>
              <ContactButton className="w-full justify-between sm:w-auto">{tcta("book")}</ContactButton>
              <LinkButton href={`/${locale}#residencias`} variant="secondary" className="w-full sm:w-auto">
                {tcta("residences")}
              </LinkButton>
            </div>
          </div>
        </div>
        <p className="caption mt-8 max-w-[44ch] lg:absolute lg:right-[var(--gutter)] lg:bottom-[calc(14vh+2rem)] lg:mt-0 lg:max-w-[28ch] lg:text-right">
          {tc("imageCaption")}
        </p>
      </div>
      <HeroEffects />
    </section>
  );
}
