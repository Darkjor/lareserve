import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ManifestoTitle } from "./ManifestoTitle";

export async function Manifesto() {
  const t = await getTranslations("manifesto");
  const tc = await getTranslations("common");
  return (
    <section id="concepto" className="relative z-[1] section-y">
      <div className="wrap grid-12 items-start gap-y-14">
        <div className="col-span-12 lg:col-span-7">
          <ManifestoTitle text={t("title")} />
          <p className="reveal mt-12 max-w-[44ch] text-body-l text-marfil-200">{t("body")}</p>
          <p className="reveal mt-8 max-w-[44ch] font-display text-h4 text-oro-300">{t("closing")}</p>
        </div>
        <figure className="col-span-12 sm:col-span-8 lg:col-span-4 lg:col-start-9 lg:-mt-[calc(14vh+9rem)]">
          <div className="bezel reveal-clip">
            <div className="bezel-core relative aspect-[4/5]">
              <Image src="/img/manifiesto.webp" alt={t("alt")} fill sizes="(min-width: 1024px) 28vw, (min-width: 640px) 66vw, 100vw" className="object-cover" />
            </div>
          </div>
          <figcaption className="caption mt-3">{tc("imageCaption")}</figcaption>
        </figure>
      </div>
    </section>
  );
}
