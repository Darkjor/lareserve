import { getTranslations } from "next-intl/server";
import { LeadForm } from "./LeadForm";

/** Familia I: columna estrecha con formulario (unico bloque centrado). Titulo, una linea y formulario en rejilla de 2 columnas. */
export async function Brokers() {
  const t = await getTranslations("brokers");
  return (
    <section id="aliados" className="section-y">
      <div className="wrap">
        <div className="mx-auto max-w-[640px]">
          <h2 className="reveal text-display-l text-ink">{t("title")}</h2>
          <p className="reveal mt-5 max-w-[52ch] text-body text-ink-2" style={{ ["--d" as string]: "100ms" }}>
            {t("intro")}
          </p>
          <div className="reveal mt-10" style={{ ["--d" as string]: "200ms" }}>
            <LeadForm variant="broker" tipo="broker" layout="pairs" />
          </div>
        </div>
      </div>
    </section>
  );
}