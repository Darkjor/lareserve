import { getTranslations } from "next-intl/server";
import { FileText, Leaf, Scales } from "@phosphor-icons/react/ssr";
import { ContactButton } from "./ContactProvider";

const ITEMS = [
  ["mia", Scales],
  ["land", Leaf],
  ["deed", FileText],
] as const;

export async function Legal() {
  const t = await getTranslations("legal");
  const tcta = await getTranslations("cta");
  return (
    <section id="legal" className="bg-selva-950 py-[clamp(4rem,3rem+4vw,6rem)]">
      <div className="wrap grid-12 gap-y-14">
        <div className="col-span-12 lg:col-span-6">
          <h2 className="reveal text-display-l text-marfil-50">{t("title")}</h2>
          <p className="reveal mt-8 max-w-[40ch] text-body-l text-marfil-200">{t("closing")}</p>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <ul className="grid gap-10">
            {ITEMS.map(([k, Icon], i) => (
              <li key={k} className="reveal flex gap-5" style={{ ["--d" as string]: `${i * 90}ms` }}>
                <Icon size={32} weight="light" className="mt-1 shrink-0 text-oro-300" aria-hidden />
                <div>
                  <h3 className="font-display text-[1.375rem] leading-tight font-medium text-marfil-50">{t(`items.${k}.title`)}</h3>
                  <p className="mt-2 max-w-[40ch] text-small text-marfil-200">{t(`items.${k}.text`)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="reveal mt-12">
            <ContactButton kind="legal" variant="secondary" className="w-full sm:w-auto">
              {tcta("legal")}
            </ContactButton>
            <p className="caption mt-3">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
