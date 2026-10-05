import Image from "next/image";
import { getTranslations } from "next-intl/server";

/** Bento de 3 celdas: foto vertical, foto horizontal y fragmento de planta (textura distinta). */
export async function Amenities() {
  const t = await getTranslations("amenities");
  const tc = await getTranslations("common");
  return (
    <section id="amenidades" className="section-y">
      <div className="wrap">
        <h2 className="reveal max-w-[18ch] text-display-l text-marfil-50">{t("title")}</h2>
        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          <figure className="reveal flex flex-col lg:col-span-5 lg:row-span-2">
            <div className="bezel flex min-h-0 flex-1 flex-col">
              <div className="bezel-core relative aspect-[4/5] flex-1 lg:aspect-auto lg:min-h-[420px]">
                <Image src="/img/roof-garden.webp" alt={t("roof.alt")} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[22%_100%]" />
              </div>
            </div>
            <figcaption className="mt-4">
              <h3 className="font-display text-h3 text-marfil-50">{t("roof.title")}</h3>
              <p className="mt-1 max-w-[36ch] text-small text-marfil-200">{t("roof.text")}</p>
              <p className="caption mt-2">{tc("imageCaption")}</p>
            </figcaption>
          </figure>

          <figure className="reveal lg:col-span-7" style={{ ["--d" as string]: "90ms" }}>
            <div className="bezel">
              <div className="bezel-core relative aspect-[16/10] lg:aspect-[16/9]">
                <Image src="/img/albercas.webp" alt={t("pools.alt")} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
              </div>
            </div>
            <figcaption className="mt-4">
              <h3 className="font-display text-h3 text-marfil-50">{t("pools.title")}</h3>
              <p className="mt-1 max-w-[36ch] text-small text-marfil-200">{t("pools.text")}</p>
            </figcaption>
          </figure>

          <figure className="reveal lg:col-span-7" style={{ ["--d" as string]: "180ms" }}>
            <div className="bezel">
              <div className="bezel-core relative grid aspect-[16/9] place-items-center bg-selva-900 p-4 md:p-8">
                <Image
                  src="/img/plantas/terraza-b.webp"
                  alt={t("terraces.alt")}
                  width={850}
                  height={205}
                  sizes="(min-width: 1024px) 50vw, 90vw"
                  className="h-auto w-full drop-shadow-[0_24px_32px_oklch(0.1_0.04_153/0.6)]"
                />
              </div>
            </div>
            <figcaption className="mt-4">
              <h3 className="font-display text-h3 text-marfil-50">{t("terraces.title")}</h3>
              <p className="mt-1 max-w-[40ch] text-small text-marfil-200">{t("terraces.text")}</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
