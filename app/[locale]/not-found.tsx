import { getLocale, getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();
  return (
    <div className="wrap grid min-h-dvh place-content-center gap-6 py-24">
      <h1 className="text-display-l text-marfil-50">{t("title")}</h1>
      <a href={`/${locale}`} className="link-gold text-marfil-50">
        {t("back")}
      </a>
    </div>
  );
}
