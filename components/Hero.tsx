import { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";
import { HeroEffects } from "./HeroEffects";
import { LeadForm } from "./LeadForm";
import { DrawFrame } from "./ui/DrawFrame";
import { LinkButton } from "./ui/LinkButton";

/**
 * Hero con formulario en linea. Escritorio (lg): foto a sangre, texto a la izquierda y tarjeta de papel con
 * el formulario a la derecha, ambos alineados abajo. Movil: foto de 86dvh con el texto y la tarjeta entra debajo.
 */
export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("hero");
  const tc = await getTranslations("common");
  const tcta = await getTranslations("cta");
  const tp = await getTranslations("panel");

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
    <section id="inicio" data-hero className="relative isolate z-0">
      <div data-hero-photo className="absolute inset-x-0 top-0 -z-10 h-[86dvh] overflow-hidden lg:h-full">
        {/* Parallax (GSAP) en el contenedor externo; la escala de carga (CSS) en el interno. */}
        <div data-hero-img className="absolute inset-x-0 top-0 -bottom-[8%] will-change-transform">
          <div className="hero-sun size-full">
            <picture>
              <source media="(min-width: 768px)" srcSet={desktop} />
              <source media="(max-width: 767px)" srcSet={mobile} />
              <img {...img} alt={t("alt")} className="size-full object-cover object-[28%_40%] md:object-[52%_50%]" />
            </picture>
          </div>
        </div>
        {/* Velo fijo (alfa >= .66 bajo el texto) y capa extra que oscurece al salir (la anima HeroEffects). */}
        <div aria-hidden className="hero-veil absolute inset-0" />
        <div aria-hidden className="hero-emerge absolute inset-0 bg-veil opacity-0" />
        <div aria-hidden data-hero-dim className="absolute inset-0 bg-veil opacity-0" />
      </div>

      <div className="wrap relative lg:grid lg:min-h-dvh lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:pt-28 lg:pb-16">
        <div className="on-dark flex min-h-[86dvh] flex-col justify-end pt-28 pb-14 lg:col-span-6 lg:min-h-0 lg:p-0">
          <span aria-hidden className="thread hero-thread mb-6 !w-16" />
          <h1 className="text-display-xl text-paper">
            <span className="hero-line">
              <span>{t.rich("title", { em: (c) => <em className="text-oro-300">{c}</em> })}</span>
            </span>
          </h1>
          <p className="hero-fade mt-6 max-w-[40ch] text-body-l text-paper/92" style={{ ["--d" as string]: "700ms" }}>
            {t("subtitle")}
          </p>
          <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "950ms" }}>
            {/* Movil: el primario lleva a la tarjeta. En escritorio el formulario es el CTA. */}
            <LinkButton href="#agenda" className="w-full justify-between sm:w-auto lg:hidden">
              {tcta("book")}
            </LinkButton>
            <LinkButton href={`/${locale}#residencias`} variant="ghost" className="w-full sm:w-auto">
              {tcta("residences")}
            </LinkButton>
          </div>
        </div>

        <div className="relative -mt-10 md:max-w-[560px] lg:col-span-5 lg:col-start-8 lg:mt-0 lg:w-[440px] lg:max-w-none lg:justify-self-end">
          <div id="agenda" className="hero-card hero-fade relative scroll-mt-24 rounded-surface bg-paper shadow-photo" style={{ ["--d" as string]: "900ms" }}>
            <DrawFrame inset={10} mode="load" delay={900} duration={1100} />
            <h2 className="text-h4 text-ink">{tp("heroTitle")}</h2>
            <div className="mt-5">
              <LeadForm variant="panel" tipo="presentacion" layout="compact" />
            </div>
          </div>
          <p className="caption mt-3 lg:text-paper/92">{tc("imageCaption")}</p>
        </div>
      </div>
      <HeroEffects />
    </section>
  );
}