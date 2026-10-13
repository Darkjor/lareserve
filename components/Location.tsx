import { getTranslations } from "next-intl/server";
import { MapViewer } from "./MapViewer";

/**
 * Familia E: mapa con panel solapado (xl). Une Destination (parrafo) y Location (distancias verificadas,
 * decision 5: los minutos del mapa del cliente no se publican como lista). Desde xl el panel cuelga 72 px bajo el mapa.
 */
export async function Location() {
  const t = await getTranslations("location");
  const tc = await getTranslations("common");
  const pts = ["p1", "p2", "p3"] as const;
  return (
    <section id="ubicacion" className="section-y">
      <div className="wrap">
        <div className="relative xl:pb-[72px]">
          <div className="reveal">
            <MapViewer />
          </div>
          <p className="caption mt-3 xl:absolute xl:right-0 xl:bottom-0 xl:mt-0 xl:w-1/2 xl:text-right">
            {t("caption")} {tc("imageCaption")} {t("sources")}
          </p>
          <div className="reveal mt-8 xl:absolute xl:bottom-0 xl:left-0 xl:mt-0 xl:w-5/12 xl:rounded-surface xl:bg-paper xl:p-10 xl:shadow-soft" style={{ ["--d" as string]: "500ms" }}>
            <h2 className="text-display-l text-ink">{t("title")}</h2>
            <p className="mt-4 max-w-[44ch] text-body text-ink-2">{t("intro")}</p>
            <dl className="mt-6">
              {pts.map((p) => (
                <div key={p} className="flex items-baseline justify-between gap-6 border-b border-line py-3 first:pt-0 last:border-b-0 last:pb-0">
                  <dt className="text-small text-ink-2">{t(`${p}.name`)}</dt>
                  <dd className="text-right font-figure text-[1.0625rem] font-semibold tabular-nums text-ink">{t(`${p}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}