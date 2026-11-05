import Image from "next/image";
import { DownloadSimple } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { ContactButton } from "./ContactProvider";
import { ManifestoTitle } from "./ManifestoTitle";

/** Familia B: declaracion tipografica sobre textura de piedra (S2) y banda de respiro (S4) con la fachada de dia. */
export async function Manifesto() {
  const t = await getTranslations("manifesto");
  const tcta = await getTranslations("cta");
  const tc = await getTranslations("common");
  return (
    <section id="concepto" className="surface-piedra relative z-[1]">
      <div className="wrap section-y pb-14 lg:pb-20">
        <div className="max-w-[1100px]">
          <ManifestoTitle text={t("title")} />
        </div>
        <div className="grid-12 mt-12 items-start gap-y-8 lg:mt-14">
          <p className="reveal col-span-12 max-w-[48ch] text-body-l text-ink-2 lg:col-span-5">{t("body")}</p>
          <div className="reveal col-span-12 flex flex-col items-start gap-3 lg:col-span-5 lg:col-start-8">
            <span className="font-display text-[1.75rem] leading-none text-ink-3">{t("developer")}</span>
            <ContactButton kind="brochure" variant="link">
              <DownloadSimple size={20} weight="light" aria-hidden />
              {tcta("brochure")}
            </ContactButton>
          </div>
        </div>
      </div>
      <figure className="m-0">
        <div className="relative h-[clamp(380px,34vw,520px)] w-full overflow-hidden">
          <Image src="/img/renders/fachada-dia.webp" alt="" fill sizes="100vw" className="object-cover object-[50%_42%]" />
        </div>
        <figcaption className="wrap py-3 text-caption text-ink-3">{tc("imageCaption")}</figcaption>
      </figure>
    </section>
  );
}