import { getTranslations } from "next-intl/server";
import { AvailabilityStage } from "./availability/AvailabilityStage";
import { totalLocales, totalResidencias } from "@/lib/inventory";

export async function Availability() {
  const t = await getTranslations("availability");
  return (
    <section id="disponibilidad" className="section-y">
      <div className="wrap">
        <p className="eyebrow reveal">{t("eyebrow")}</p>
        <h2 className="reveal mt-5 max-w-[16ch] text-display-l text-marfil-50">{t("title")}</h2>
        <p className="reveal mt-6 max-w-[48ch] text-body-l text-marfil-200">
          {t("intro", { residencias: totalResidencias, locales: totalLocales })}
        </p>
        <div className="reveal mt-12">
          <AvailabilityStage />
        </div>
      </div>
    </section>
  );
}
