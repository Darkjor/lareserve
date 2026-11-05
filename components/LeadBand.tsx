import { getTranslations } from "next-intl/server";
import { LeadForm } from "./LeadForm";

/**
 * Franja del formulario justo debajo del hero (dentro de #inicio). Sin tarjeta ni sombra: campos sobre el papel.
 * Escritorio: titulo en col 1 a 4 y campos en col 5 a 12. Movil: una columna.
 */
export async function LeadBand() {
  const tp = await getTranslations("panel");
  return (
    <div id="agenda" className="scroll-mt-20 bg-paper py-12 md:py-16">
      <div className="wrap grid gap-8 lg:grid-cols-12 lg:gap-x-6">
        <div className="reveal lg:col-span-4">
          <span aria-hidden className="thread mb-5" />
          <h2 className="text-h3 text-ink">{tp("heroTitle")}</h2>
          <p className="mt-3 max-w-[34ch] text-small text-ink-2">{tp("leadLine")}</p>
        </div>
        <div className="lg:col-span-8">
          <LeadForm variant="inline" tipo="presentacion" layout="band" />
        </div>
      </div>
    </div>
  );
}
