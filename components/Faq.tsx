import { Plus } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { whatsappLink } from "@/lib/site";

const KEYS = ["where", "prices", "lockoff", "legal", "payment", "presentation"] as const;

/** Familia J: titulo fijo + acordeon nativo (<details name>). El JSON-LD usa las mismas cadenas que se ven. */
export async function Faq() {
  const t = await getTranslations("faq");
  const tw = await getTranslations("wa");
  const items = KEYS.map((k) => ({ k, q: t(`items.${k}.q`), a: t(`items.${k}.a`) }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <section id="faq" className="section-y bg-wash">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap grid-12 gap-y-10">
        <div className="reveal col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-[120px]">
            <h2 className="text-display-l text-ink">{t("title")}</h2>
            <a href={whatsappLink(tw("general"))} target="_blank" rel="noopener noreferrer" className="link-gold mt-6 inline-flex min-h-11 items-center text-ink">
              {t("ask")}
            </a>
          </div>
        </div>
        <div className="faq reveal col-span-12 lg:col-span-7 lg:col-start-6">
          {items.map(({ k, q, a }) => (
            <details key={k} name="faq" className="border-b border-line last:border-b-0">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-h4 text-ink">{q}</h3>
                <Plus size={20} weight="light" className="faq-plus shrink-0 text-oro-700" aria-hidden />
              </summary>
              <p className="max-w-[60ch] pb-6 text-body text-ink-2">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
