import { setRequestLocale } from "next-intl/server";
import { Vivir } from "@/components/Vivir";
import { Gallery } from "@/components/Gallery";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Residences } from "@/components/Residences";
import { Location } from "@/components/Location";
import { Legal } from "@/components/Legal";
import { Availability } from "@/components/Availability";
import { Brokers } from "@/components/Brokers";
import { FinalCta } from "@/components/FinalCta";
import { resumenTipologia, type Tipologia } from "@/lib/inventory";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = Object.fromEntries(
    (["A", "B", "C", "D"] as Tipologia[]).map((l) => {
      const { unidades, m2, precioDesde } = resumenTipologia(l);
      return [l, { unidades, m2, precioDesde }];
    }),
  ) as Record<Tipologia, { unidades: number; m2: number; precioDesde: number }>;

  // Orden de ZAMA (spec de Direccion 2026-10-12). Vivir, Galeria y FAQ montados en la parte 2.
  return (
    <>
      <Hero locale={locale} />
      <Manifesto />
      <Vivir />
      <Residences data={data} locale={locale} />
      <Location />
      <Gallery />
      <Legal />
      <Availability />
      <Brokers />
      <Faq />
      <FinalCta />
    </>
  );
}