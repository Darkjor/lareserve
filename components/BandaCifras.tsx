import Image from "next/image";
import { AgendaLink } from "./AgendaLink";
import { FINANCIAMIENTO_VISIBLE } from "@/lib/flags";

export type Cifra = { value: string; label: string };

// Tamano decreciente: la primera cifra manda, no son tres iguales.
const SIZE = [
  "text-[clamp(2.75rem,1.8rem+4vw,5.5rem)]",
  "text-[clamp(2.4rem,1.6rem+3.4vw,4.75rem)]",
  "text-[clamp(2.1rem,1.4rem+2.9vw,4rem)]",
];

/**
 * Banda de cifras (S3): foto a sangre con velo, tres cifras en una fila con filete vertical (apiladas con filete
 * horizontal de 28 px en movil) y un CTA. Solo cifras ya publicadas. La variante `financiamiento` no se muestra
 * hasta tener datos de la clienta (bandera FINANCIAMIENTO_VISIBLE). Se monta en #residencias (brief 2).
 */
export function BandaCifras({
  src,
  alt = "",
  cifras,
  cta,
  caption,
  variant = "cifras",
  title,
}: {
  src: string;
  alt?: string;
  cifras: [Cifra, Cifra, Cifra];
  cta: string;
  caption: string;
  variant?: "cifras" | "financiamiento";
  title?: string;
}) {
  if (variant === "financiamiento" && !FINANCIAMIENTO_VISIBLE) return null;
  return (
    <figure className="on-dark relative isolate m-0 bg-veil">
      <div className="relative flex min-h-[clamp(480px,48vw,640px)] items-center overflow-hidden">
        <Image src={src} alt={alt} fill sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden className="cta-veil absolute inset-0 -z-10" />
        <div className="wrap py-16">
          {title && <h3 className="mb-8 max-w-[30ch] font-display text-h3 text-paper">{title}</h3>}
          <ul className="flex flex-col md:flex-row md:items-end">
            {cifras.map((c, i) => (
              <li key={c.label} className="md:border-l md:border-paper/30 md:px-10 md:first:border-l-0 md:first:pl-0">
                {i > 0 && <span aria-hidden className="my-6 block h-px w-7 bg-paper/30 md:hidden" />}
                <p className="flex items-baseline gap-3">
                  <span className={`font-display leading-none text-paper ${SIZE[i]}`}>{c.value}</span>
                  <span className="text-[1.0625rem] text-paper/92">{c.label}</span>
                </p>
              </li>
            ))}
          </ul>
          <AgendaLink className="mt-10 w-full justify-between sm:w-auto">{cta}</AgendaLink>
        </div>
      </div>
      <figcaption className="wrap bg-paper py-3 text-caption text-ink-3">{caption}</figcaption>
    </figure>
  );
}
