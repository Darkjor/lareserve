import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { MapaUbicacion } from "./MapaUbicacion";

const LAT = 18.7675625;
const LNG = -87.6916875;

/**
 * Ubicacion: informacion a la izquierda (H2, parrafo, tres distancias, direccion y enlace "Abrir en Google Maps")
 * y un solo mapa de Google a la derecha. En movil, la informacion arriba y el mapa debajo.
 */
export async function Location() {
  const t = await getTranslations("location");
  const pts = ["p1", "p2", "p3"] as const;
  return (
    <section id="ubicacion" className="section-y bg-paper">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-12">
        <div className="reveal lg:col-span-5">
          <h2 className="text-display-l text-ink">{t("title")}</h2>
          <p className="mt-4 max-w-[44ch] text-body text-ink-2">{t("intro")}</p>

          <dl aria-label={t("listLabel")} className="mt-8 grid gap-6">
            {pts.map((p) => (
              <div key={p} className="border-l border-line pl-5">
                <dt className="text-small text-ink-2">{t(`${p}.name`)}</dt>
                <dd className="mt-1 font-figure text-[1.0625rem] font-semibold tabular-nums text-ink">{t(`${p}.value`)}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-small text-ink-2">{t("address")}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`}
            target="_blank"
            rel="noopener"
            aria-label={t("openMapsAria")}
            className="link-gold mt-3 inline-flex min-h-11 items-center gap-2 text-ink"
          >
            {t("openMaps")}
            <ArrowUpRight size={18} weight="light" aria-hidden />
          </a>
          <p className="caption mt-4">{t("sources")}</p>
        </div>

        <div className="lg:col-span-7">
          <MapaUbicacion lat={LAT} lng={LNG} />
        </div>
      </div>
    </section>
  );
}
