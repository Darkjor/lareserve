import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Barlow, Barlow_Semi_Condensed, EB_Garamond, Marcellus } from "next/font/google";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { ContactProvider } from "@/components/ContactProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { RevealObserver } from "@/components/RevealObserver";
import { ALLOW_INDEXING, SITE_URL, site } from "@/lib/site";

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-barlow", display: "swap" });
const barlowSC = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-barlow-sc",
  display: "swap",
});
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    applicationName: site.name,
    alternates: { canonical: `/${locale}`, languages: { es: "/es", en: "/en", "x-default": "/es" } },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_MX",
      siteName: site.name,
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [{ url: "/img/og.jpg", width: 1200, height: 630, alt: t("ogAlt") }],
    },
    twitter: { card: "summary_large_image", title: t("ogTitle"), description: t("ogDescription"), images: ["/img/og.jpg"] },
    robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A150E",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${garamond.variable} ${barlow.variable} ${barlowSC.variable} ${marcellus.variable} antialiased`}
    >
      <head>
        {/* Activa los reveals antes del primer render. Sin JS el contenido queda visible;
            si el observador no actua en 3 s, se muestra todo. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('reveal-ready');setTimeout(function(){if(!window.__reveal){document.querySelectorAll('.reveal,.reveal-clip').forEach(function(e){e.classList.add('is-visible')})}},3000);",
          }}
        />
      </head>
      <body>
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        <NextIntlClientProvider messages={messages}>
          <ContactProvider>
            <a
              href="#contenido"
              className="fixed top-3 left-3 z-[80] -translate-y-[200%] rounded-full bg-oro-300 px-5 py-3 text-small font-semibold text-selva-950 focus:translate-y-0"
            >
              {t("skip")}
            </a>
            <Header />
            <main id="contenido">{children}</main>
            <Footer />
            <WhatsAppFloat />
            <RevealObserver />
          </ContactProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
