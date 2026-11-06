import { getImageProps } from "next/image";
import ReactDOM from "react-dom";
import { getTranslations } from "next-intl/server";
import { AgendaLink } from "./AgendaLink";
import { HeroEffects } from "./HeroEffects";
import { LeadBand } from "./LeadBand";
import { LinkButton } from "./ui/LinkButton";

// Distancia de cada lama al centro (0 a 4): la celosia se abre desde el medio hacia los lados.
const SLATS = Array.from({ length: 9 }, (_, i) => ({ i, d: Math.abs(i - 4) }));

/**
 * Inicio: imagen a sangre de 100svh (LCP, ya pintada debajo) cubierta al cargar por una celosia de 9 lamas que giran en 3D
 * y la descubren; luego deriva lenta (scale 1.06 a 1 en 18 s). Titular por linea con mascara; al hacer scroll, parallax y
 * el contenido se desvanece (sin pin). Sin movimiento reducido o sin CSS queda la imagen final. Debajo, LeadBand.
 */
export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations("hero");
  const tcta = await getTranslations("cta");

  // Direccion de arte: render de la fachada al atardecer en escritorio, fachada vertical en movil.
  const {
    props: { srcSet: desktop, src: desktopSrc },
  } = getImageProps({ src: "/img/renders/fachada-atardecer.webp", alt: "", width: 1672, height: 941, sizes: "100vw", quality: 82 });
  const {
    props: { srcSet: mobile, src: mobileSrc, ...img },
  } = getImageProps({ src: "/img/hero-vertical.webp", alt: t("alt"), width: 1275, height: 1646, sizes: "100vw", quality: 75, priority: true, fetchPriority: "high", loading: "eager" });
  void desktopSrc;
  void mobileSrc;
  // Descarga temprana de la imagen del hero (solo la del ancho que aplica).
  ReactDOM.preload(mobileSrc, { as: "image", imageSrcSet: mobile, imageSizes: "100vw", media: "(max-width: 767px)", fetchPriority: "high" });
  ReactDOM.preload(desktopSrc, { as: "image", imageSrcSet: desktop, imageSizes: "100vw", media: "(min-width: 768px)", fetchPriority: "high" });

  return (
    <section id="inicio" data-hero>
      <div data-hero-photo className="on-dark relative isolate z-0 flex min-h-[100svh] flex-col overflow-hidden">
        <div data-hero-img className="absolute inset-x-0 top-0 -bottom-[8%] -z-10 will-change-transform">
          <div className="hero-drift size-full">
            <picture>
              <source media="(min-width: 768px)" srcSet={desktop} sizes="100vw" />
              <source media="(max-width: 767px)" srcSet={mobile} sizes="100vw" />
              <img {...img} src={mobileSrc} alt={t("alt")} className="size-full object-cover object-[50%_40%] md:object-[56%_55%]" />
            </picture>
          </div>
        </div>
        {/* Velo fijo (alfa >= .66 bajo el texto). */}
        <div aria-hidden className="hero-veil absolute inset-0 -z-10" />
        <div aria-hidden className="celosia">
          {SLATS.map((s) => (
            <span key={s.i} className="celosia-slat" style={{ ["--i" as string]: s.i, ["--d" as string]: s.d }} />
          ))}
        </div>

        <div data-hero-content className="wrap relative z-10 flex flex-1 flex-col justify-end pt-28 pb-24 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:pb-28">
          <div className="lg:col-span-7">
            <h1 className="text-hero text-paper">
              <span className="hero-line">
                <span style={{ ["--i" as string]: 6 }}>{t.rich("title", { em: (c) => <em className="text-oro-300">{c}</em> })}</span>
              </span>
            </h1>
            <p className="hero-fade mt-6 max-w-[40ch] text-body-l text-paper/92" style={{ ["--d" as string]: "800ms" }}>
              {t("subtitle")}
            </p>
            <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "950ms" }}>
              <AgendaLink className="w-full justify-between sm:w-auto">{tcta("book")}</AgendaLink>
              <LinkButton href={`/${locale}#residencias`} variant="ghost" className="w-full sm:w-auto">
                {tcta("residences")}
              </LinkButton>
            </div>
          </div>

          <div className="hero-fade mt-10 flex items-stretch gap-7 sm:gap-9 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:justify-self-end" style={{ ["--d" as string]: "1100ms" }}>
            <div>
              <p className="font-display text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-none text-paper">
                {t("priceFigure")} <span className="text-[0.55em] tracking-wide">{t("priceUnit")}</span>
              </p>
              <p className="mt-2 text-small text-paper/92">{t("priceNote")}</p>
            </div>
            <span aria-hidden className="w-px self-stretch bg-oro-300/50" />
            <div>
              <p className="font-display text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-none text-paper">
                {t("areaFigure")} <span className="text-[0.55em] tracking-wide">{t("areaUnit")}</span>
              </p>
              <p className="mt-2 text-small text-paper/92">{t("areaNote")}</p>
            </div>
          </div>
        </div>

        <div className="wrap absolute inset-x-0 bottom-0 z-10 pb-5">
          <p className="text-caption text-paper/92">{t("legal")}</p>
        </div>
        <HeroEffects />
      </div>
      <LeadBand />
    </section>
  );
}
