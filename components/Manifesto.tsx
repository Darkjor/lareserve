import { DownloadSimple } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { ContactButton } from "./ContactProvider";
import { ManifestoTitle } from "./ManifestoTitle";

/** Familia B: declaracion tipografica, sin imagen. Pregunta del manifiesto, parrafo y enlace al brochure. */
export async function Manifesto() {
  const t = await getTranslations("manifesto");
  const tcta = await getTranslations("cta");
  return (
    <section id="concepto" className="relative z-[1] section-y">
      <div className="wrap">
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
    </section>
  );
}