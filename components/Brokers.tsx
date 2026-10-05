import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LeadForm } from "./LeadForm";

export async function Brokers() {
  const t = await getTranslations("brokers");
  const tc = await getTranslations("common");
  const bullets = t.raw("bullets") as string[];
  return (
    <section id="aliados" className="section-y">
      <div className="wrap grid-12 items-start gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <p className="eyebrow reveal">{t("eyebrow")}</p>
          <h2 className="reveal mt-5 max-w-[14ch] text-display-l text-marfil-50">{t("title")}</h2>
          <p className="reveal mt-6 max-w-[44ch] text-body text-marfil-200">{t("intro")}</p>
          <ul className="reveal mt-8 grid gap-2 text-small text-marfil-200">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <figure className="reveal-clip mt-10 max-w-[420px]">
            <div className="bezel">
              <div className="bezel-core relative aspect-[4/5]">
                <Image src="/img/hamaca.webp" alt={t("alt")} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
              </div>
            </div>
            <figcaption className="caption mt-3">{tc("imageCaption")}</figcaption>
          </figure>
        </div>
        <div className="reveal col-span-12 lg:col-span-6 lg:col-start-7">
          <div className="bezel">
            <div className="bezel-core bg-selva-900 p-6 md:p-10">
              <LeadForm variant="broker" tipo="broker" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
