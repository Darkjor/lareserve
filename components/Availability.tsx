import { getTranslations } from "next-intl/server";
import { totalLocales, totalResidencias, totalTorres } from "@/lib/inventory";
import { whatsappLink } from "@/lib/site";
import { ModulesPlan } from "./ModulesPlan";
import { LinkButton } from "./ui/LinkButton";

const STATS = [
  ["torres", totalTorres],
  ["residencias", totalResidencias],
  ["locales", totalLocales],
] as const;

/** Familia H: cifras en linea + plano ancho. Disponibilidad estatica (no hay explorador interactivo). */
export async function Availability() {
  const t = await getTranslations("availability");
  const tw = await getTranslations("wa");
  return (
    <section id="disponibilidad" className="section-y bg-wash">
      <div className="wrap">
        <h2 className="reveal max-w-[16ch] text-display-l text-ink">{t("title")}</h2>
        <ul className="reveal mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-14">
          {STATS.map(([key, n]) => (
            <li key={key} className="flex items-baseline gap-2.5">
              <span className="font-display text-[2.75rem] leading-none tabular-nums lining-nums text-ink">{n}</span>
              <span className="text-[0.9375rem] text-ink-2">{t(`stats.${key}`)}</span>
            </li>
          ))}
        </ul>
        <ModulesPlan>
          <LinkButton href={whatsappLink(tw("availability"))} external className="w-full justify-between sm:w-auto">
            {t("ask")}
          </LinkButton>
        </ModulesPlan>
      </div>
    </section>
  );
}