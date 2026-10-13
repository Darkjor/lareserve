import { setRequestLocale } from "next-intl/server";
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

  // Orden de ZAMA (spec de Direccion 2026-10-12). Los huecos 3, 6 y 10 los monta el dev 2.
  return (
    <>
      <Hero locale={locale} />
      <Manifesto />
      {/* 3 vivir (id="vivir"): pendiente. Reutiliza partes de Amenities, LockOff y Destination (desmontados, siguen en components/). */}
      <Residences data={data} locale={locale} />
      <Location />
      {/* 6 galeria (id="galeria"): pendiente. Reutiliza Lightbox. */}
      <Legal />
      <Availability />
      <Brokers />
      {/* 10 faq (id="faq"): pendiente. */}
      <FinalCta />
    </>
  );
}