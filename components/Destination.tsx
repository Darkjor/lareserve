import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function Destination() {
  const t = await getTranslations("destination");
  const facts = ["f1", "f2", "f3"] as const;
  return (
    <section id="destino" className="relative overflow-x-clip pt-[clamp(6rem,4rem+8vw,12rem)] pb-[clamp(5rem,3rem+7vw,9rem)]">
      <div className="wrap">
        <h2 className="reveal text-display-word text-marfil-50">{t("word")}</h2>
      </div>
      <div className="reveal-clip mt-10 md:mt-14">
        <div className="relative aspect-[4/3] w-full md:aspect-[21/9]">
          <Image src="/img/mahahual-tortuga-43.webp" alt={t("alt")} fill sizes="100vw" className="object-cover md:hidden" />
          <Image src="/img/mahahual-tortuga.webp" alt={t("alt")} fill sizes="100vw" className="hidden object-cover md:block" />
        </div>
      </div>
      <div className="wrap mt-16">
        <p className="reveal max-w-[28ch] font-display text-h3 text-marfil-50">{t("lead")}</p>
        <dl className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
          {facts.map((f, i) => (
            <div key={f} className="reveal" style={{ ["--d" as string]: `${i * 90}ms` }}>
              <dt className="font-figure text-[1.75rem] leading-none font-medium tabular-nums text-oro-300">{t(`facts.${f}.value`)}</dt>
              <dd className="mt-3 max-w-[30ch] text-small text-marfil-200">{t(`facts.${f}.text`)}</dd>
            </div>
          ))}
        </dl>
        <p className="caption mt-12">{t("sources")}</p>
      </div>
    </section>
  );
}
