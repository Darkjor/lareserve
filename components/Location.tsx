import { getTranslations } from "next-intl/server";
import { whatsappLink } from "@/lib/site";
import { MapViewer } from "./MapViewer";
import { LinkButton } from "./ui/LinkButton";

/** Solo distancias verificadas por research (decision 5): los minutos del mapa del cliente no se publican como lista. */
export async function Location() {
  const t = await getTranslations("location");
  const tw = await getTranslations("wa");
  const pts = ["p1", "p2", "p3"] as const;
  return (
    <section id="ubicacion" className="section-y">
      <div className="wrap">
        <h2 className="reveal text-display-l text-marfil-50">{t("title")}</h2>
        <p className="reveal mt-6 max-w-[44ch] text-body-l text-marfil-200">{t("intro")}</p>
        <div className="relative mt-12">
          <div className="reveal">
            <MapViewer />
          </div>
          <div className="mt-6 bg-selva-900 p-6 lg:absolute lg:top-10 lg:left-10 lg:mt-0 lg:w-[360px] lg:rounded-[6px] lg:border lg:border-[color:var(--hairline)] lg:p-8 lg:shadow-[var(--shadow-tint)]">
            <h3 className="font-display text-h4 text-marfil-50">{t("listLabel")}</h3>
            <ul className="mt-5 grid gap-5">
              {pts.map((p) => (
                <li key={p}>
                  <p className="text-small text-marfil-200">{t(`${p}.name`)}</p>
                  <p className="mt-1 font-figure text-[1.375rem] leading-tight font-medium tabular-nums text-marfil-50">{t(`${p}.value`)}</p>
                </li>
              ))}
            </ul>
            <LinkButton href={whatsappLink(tw("location"))} external variant="secondary" className="mt-7 w-full !whitespace-normal text-center text-small">
              {t("ask")}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
