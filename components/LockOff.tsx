"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Bathtub, Bed, CoatHanger, CookingPot } from "@phosphor-icons/react/ssr";
import { loadGsap } from "@/lib/gsap";
import { whatsappLink } from "@/lib/site";
import { PlanViewer } from "./PlanViewer";

const ICONS = [Bed, Bathtub, CookingPot, CoatHanger];
const STEPS = ["s1", "s2", "s3"] as const;

/**
 * Lock-Off. Unico pin-scrub de la pagina: en escritorio con movimiento permitido la escena se fija
 * (3 pasos por scroll); en movil y con movimiento reducido se muestran los pasos apilados.
 * Los dos arboles estan en el HTML; el CSS (lg + motion-safe) decide cual se ve, asi que no depende de JS.
 */
export function LockOff() {
  const t = useTranslations();
  const scene = useRef<HTMLDivElement>(null);
  const [mstep, setMstep] = useState<1 | 3>(1);
  const wa = whatsappLink(t("wa.lockoff"));

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "+=300%",
          pin: true,
          onUpdate: (self) => {
            const p = self.progress;
            el.dataset.step = p < 0.33 ? "1" : p < 0.66 ? "2" : "3";
          },
          onLeaveBack: () => {
            el.dataset.step = "1";
          },
        });
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const contents = (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-small text-marfil-200 sm:grid-cols-4 lg:grid-cols-2">
      {(t.raw("lockoff.contents") as string[]).map((c, i) => {
        const Icon = ICONS[i];
        return (
          <li key={c} className="flex items-center gap-3">
            <Icon size={22} weight="light" className="text-turquesa-500" aria-hidden />
            {c}
          </li>
        );
      })}
    </ul>
  );

  const closing = (
    <div>
      <p className="font-display text-h4 text-marfil-50">{t("lockoff.closing")}</p>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6 w-full justify-between sm:w-auto">
        {t("cta.quote")}
        <span className="btn-icon" aria-hidden>
          <ArrowUpRight size={18} weight="light" />
        </span>
      </a>
      <p className="caption mt-5 max-w-[56ch]">{t("lockoff.disclaimer")}</p>
    </div>
  );

  return (
    <section id="lockoff" className="relative">
      {/* Escritorio con movimiento: escena fijada */}
      <div ref={scene} data-step="1" className="hidden h-dvh overflow-hidden lg:motion-safe:block">
        <div className="wrap grid h-full grid-cols-12 items-center gap-x-6">
          <div className="col-span-5 xl:col-span-4">
            <h2 className="text-display-l text-marfil-50">{t("lockoff.title")}</h2>
            <ol aria-label={t("lockoff.stepsLabel")} className="mt-10 grid gap-6">
              {STEPS.map((s, i) => (
                <li key={s} data-for={i + 1} className="lo-text">
                  <h3 className="font-display text-h3 text-marfil-50">{t(`lockoff.${s}.title`)}</h3>
                  <p className="mt-1 max-w-[34ch] text-small text-marfil-200">{t(`lockoff.${s}.text`)}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8">{contents}</div>
            <div className="mt-8">{closing}</div>
          </div>
          <div className="col-span-7 xl:col-span-8">
            <div className="bezel">
              <div className="bezel-core bg-selva-900 p-6">
                <div className="grid h-[min(72dvh,680px)] place-items-center [container-type:size]">
                  <PlanViewer id="B" priority />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movil y movimiento reducido: pasos apilados */}
      <div className="section-y lg:motion-safe:hidden">
        <div className="wrap">
          <h2 className="max-w-[16ch] text-display-l text-marfil-50">{t("lockoff.title")}</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-7">
              <div className="seg mb-4" role="group" aria-label={t("lockoff.toggleLabel")}>
                <button type="button" aria-pressed={mstep === 1} onClick={() => setMstep(1)}>
                  {t("lockoff.full")}
                </button>
                <button type="button" aria-pressed={mstep === 3} onClick={() => setMstep(3)}>
                  {t("lockoff.split")}
                </button>
              </div>
              <div className="bezel">
                <div className="bezel-core bg-selva-900 p-3 md:p-6">
                  <div className="grid h-[clamp(300px,52dvh,560px)] place-items-center [container-type:size]">
                    <PlanViewer id="B" step={mstep} />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <ol aria-label={t("lockoff.stepsLabel")} className="grid gap-6">
                {STEPS.map((s) => (
                  <li key={s}>
                    <h3 className="font-display text-h3 text-marfil-50">{t(`lockoff.${s}.title`)}</h3>
                    <p className="mt-1 max-w-[40ch] text-small text-marfil-200">{t(`lockoff.${s}.text`)}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8">{contents}</div>
              <div className="mt-8">{closing}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
