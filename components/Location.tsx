import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { MapaUbicacion } from "./MapaUbicacion";

const LAT = 18.7675625;
const LNG = -87.6916875;

/**
 * Ubicacion: H2 + parrafo sobre papel, Google Maps (mapa y satelite) a sangre, tres distancias sin caja
 * (filete solo entre columnas), direccion en texto y enlace "Abrir en Google Maps".
 */
export async function Location() {
  const t = await getTranslations("location");
  const pts = ["p1", "p2", "p3"] as const;
  return (
    <section id="ubicacion" className="section-y bg-paper">
      <div className="wrap reveal">
        <h2 className="text-display-l text-ink">{t("title")}</h2>
        <p className="mt-4 max-w-[44ch] text-body text-ink-2">{t("intro")}</p>
      </div>

      <div className="mt-10 md:mt-12">
        <MapaUbicacion lat={LAT} lng={LNG} />
      </div>

      <div className="wrap mt-10 md:mt-12">
        <dl aria-label={t("listLabel")} className="grid gap-6 md:grid-cols-3 md:gap-0">
          {pts.map((p) => (
            <div key={p} className="md:border-l md:border-line md:px-8 md:first:border-l-0 md:first:pl-0">
              <dt className="text-small text-ink-2">{t(`${p}.name`)}</dt>
              <dd className="mt-1 font-figure text-[1.0625rem] font-semibold tabular-nums text-ink">{t(`${p}.value`)}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p className="text-small text-ink-2">{t("address")}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`}
            target="_blank"
            rel="noopener"
            aria-label={t("openMapsAria")}
            className="link-gold inline-flex min-h-11 items-center gap-2 text-ink"
          >
            {t("openMaps")}
            <ArrowUpRight size={18} weight="light" aria-hidden />
          </a>
        </div>
        <p className="caption mt-4">{t("sources")}</p>
      </div>
    </section>
  );
}
