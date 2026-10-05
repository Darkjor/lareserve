import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacidad">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: `${t("title")} | Grand Mayahual La Reserve`,
    alternates: { canonical: `/${locale}/privacidad`, languages: { es: "/es/privacidad", en: "/en/privacidad" } },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacidad">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as { title: string; text: string }[];
  return (
    <article className="wrap pt-36 pb-24 md:pt-44">
      <div className="max-w-[66ch]">
        <h1 className="text-display-l text-marfil-50">{t("title")}</h1>
        <p className="mt-6 rounded-[2px] border border-oro-300/50 px-4 py-3 text-small text-oro-300">{t("draft")}</p>
        <p className="caption mt-4">{t("updated")}</p>
        <div className="mt-12 grid gap-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-h3 text-marfil-50">{s.title}</h2>
              <p className="mt-3 text-body text-marfil-200">{s.text}</p>
            </section>
          ))}
        </div>
        <a href={`/${locale}`} className="link-gold mt-14 inline-flex min-h-11 items-center text-marfil-50">
          {t("back")}
        </a>
      </div>
    </article>
  );
}
