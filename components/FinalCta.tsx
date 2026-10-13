import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { whatsappLink } from "@/lib/site";
import { ContactButton } from "./ContactProvider";
import { LinkButton } from "./ui/LinkButton";

/** Familia K: foto a sangre con texto abajo a la izquierda. Movil: 4:5. La presentacion se agenda en el panel de contacto. */
export async function FinalCta() {
  const t = await getTranslations("final");
  const tcta = await getTranslations("cta");
  const tw = await getTranslations("wa");
  return (
    <section id="contacto" className="on-dark relative isolate flex aspect-[4/5] items-end overflow-hidden md:aspect-auto md:min-h-[78dvh]">
      <div className="absolute inset-0 -z-10">
        <Image src="/img/cta-final-45.webp" alt={t("alt")} fill sizes="100vw" className="object-cover md:hidden" />
        <Image src="/img/cta-final.webp" alt={t("alt")} fill sizes="100vw" className="hidden object-cover md:block" />
        <div aria-hidden className="cta-veil absolute inset-0" />
      </div>
      <div className="wrap pt-24 pb-12 md:pb-16">
        <div className="max-w-[640px] lg:max-w-[58%]">
          <h2 className="reveal text-display-l text-paper">{t("title")}</h2>
          <p className="reveal mt-5 max-w-[46ch] text-body-l text-paper/92" style={{ ["--d" as string]: "100ms" }}>
            {t("body")}
          </p>
          <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "200ms" }}>
            <ContactButton className="w-full justify-between sm:w-auto">{tcta("book")}</ContactButton>
            <LinkButton href={whatsappLink(tw("general"))} external variant="ghost" className="w-full sm:w-auto">
              {tcta("whatsapp")}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}