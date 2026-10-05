import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { totalTorres, totalUnidades } from "@/lib/inventory";
import { whatsappLink } from "@/lib/site";
import { LinkButton } from "../ui/LinkButton";

/**
 * Placeholder de la fase 1: lamina del plano de modulos y resumen. El escenario interactivo
 * (plano > torre > fachada > ficha, ver spec seccion 5) lo construye la fase 2 en este mismo archivo.
 */
export async function AvailabilityStage() {
  const t = await getTranslations("availability");
  const tc = await getTranslations("common");
  const tw = await getTranslations("wa");
  return (
    <div>
      <figure>
        <div className="bezel">
          <div className="passepartout rounded-[4px] p-3 md:p-6">
            <div className="relative aspect-[2/1] overflow-hidden rounded-[2px]">
              <Image src="/img/plano-modulos.webp" alt={t("alt")} fill sizes="(min-width: 1360px) 1200px, 92vw" className="object-cover" />
            </div>
          </div>
        </div>
        <figcaption className="caption mt-3">{tc("imageCaption")}</figcaption>
      </figure>
      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-figure text-[1.75rem] leading-none font-medium tabular-nums text-marfil-50">
            {t("summary", { torres: totalTorres, n: totalUnidades })}
          </p>
          <p className="caption mt-3">{t("note")}</p>
        </div>
        <LinkButton href={whatsappLink(tw("availability"))} external className="w-full justify-between sm:w-auto">
          {t("ask")}
        </LinkButton>
      </div>
    </div>
  );
}
