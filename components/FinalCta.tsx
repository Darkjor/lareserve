import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ContactButton } from "./ContactProvider";
import { LeadForm } from "./LeadForm";

export async function FinalCta() {
  const t = await getTranslations("final");
  const tc = await getTranslations("common");
  const tcta = await getTranslations("cta");
  return (
    <section id="contacto" className="relative isolate bg-selva-950">
      <div className="relative aspect-[4/5] md:absolute md:inset-0 md:-z-10 md:aspect-auto">
        <Image src="/img/cta-final-45.webp" alt={t("alt")} fill sizes="100vw" className="object-cover md:hidden" />
        <Image src="/img/cta-final.webp" alt={t("alt")} fill sizes="100vw" className="hidden object-cover md:block" />
        <div
          aria-hidden
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(to right, oklch(0.17 0.025 153 / 0.92) 0%, oklch(0.17 0.025 153 / 0.6) 50%, oklch(0.17 0.025 153 / 0.35) 100%)" }}
        />
      </div>
      <div className="wrap grid-12 items-center gap-y-12 py-16 md:min-h-[90dvh] md:py-24">
        <div className="col-span-12 lg:col-span-6 xl:col-span-6">
          <h2 className="reveal text-display-l text-marfil-50">{t("title")}</h2>
          <p className="reveal mt-6 max-w-[46ch] text-body-l text-marfil-200">{t("body")}</p>
          <div className="reveal mt-8">
            <ContactButton kind="brochure" variant="secondary" className="w-full sm:w-auto">
              {tcta("brochure")}
            </ContactButton>
          </div>
          <p className="caption mt-8 hidden md:block">{tc("imageCaption")}</p>
        </div>
        <div className="reveal col-span-12 lg:col-span-5 lg:col-start-8">
          <div className="bezel">
            <div className="bezel-core bg-selva-900 p-6 md:p-8">
              <LeadForm variant="final" tipo="presentacion" />
            </div>
          </div>
        </div>
      </div>
      <p className="caption wrap pb-8 md:hidden">{tc("imageCaption")}</p>
    </section>
  );
}
