import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Destination } from "@/components/Destination";
import { Residences } from "@/components/Residences";
import { LockOff } from "@/components/LockOff";
import { Amenities } from "@/components/Amenities";
import { Availability } from "@/components/Availability";
import { Legal } from "@/components/Legal";
import { Location } from "@/components/Location";
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

  return (
    <>
      <Hero locale={locale} />
      <Manifesto />
      <Destination />
      <Residences data={data} locale={locale} />
      <LockOff />
      <Amenities />
      <Availability />
      <Legal />
      <Location />
      <Brokers />
      <FinalCta />
    </>
  );
}
