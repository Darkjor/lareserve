"use client";

import Image from "next/image";
import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import {
  FACADES,
  FACADE_H,
  FACADE_W,
  NIVELES,
  estadoVisible,
  isLocal,
  matches,
  nivelAtY,
  pct,
  rectOf,
  towerCounts,
  unitsAtLevel,
  unitsOf,
  type Filter,
  type Nivel,
  type Tower,
  type Unidad,
} from "@/lib/availability";
import { formatM2 } from "@/lib/site";
import { StatusChip, chipClass } from "./shared";

/** Cabecera de torre: nombre, tipo, resumen, flechas anterior/siguiente y mini-mapa 120x60. */
export function TowerHeader({ tower, onPrev, onNext }: { tower: Tower; onPrev: () => void; onNext: () => void }) {
  const t = useTranslations("availability");
  const c = towerCounts(tower.slug);
  const arrow = "grid size-11 place-items-center rounded-full border border-marfil-50/25 text-marfil-50 transition-colors hover:border-oro-300";
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div>
        <h3 className="font-name text-[clamp(1.75rem,1.3rem+1.4vw,2rem)] leading-none text-marfil-50">{tower.name}</h3>
        <p className="mt-2 text-small text-marfil-200">
          {t("towerType", { torre: "", tipo: tower.tipo }).replace(/^\s*·\s*/, "")} · {t("head", { res: c.residencias, loc: c.locales })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative h-[60px] w-[120px] overflow-hidden rounded-[3px] border border-oro-300/30" role="img" aria-label={t("minimap")}>
          <Image src="/img/plano-modulos.webp" alt="" fill sizes="120px" className="object-cover" />
          <span
            aria-hidden
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-selva-950 bg-oro-300 shadow-[0_0_0_3px_oklch(0.83_0.115_92/0.35)]"
            style={{ left: `${tower.x}%`, top: `${tower.y}%` }}
          />
        </div>
        <button type="button" onClick={onPrev} aria-label={t("prev")} className={arrow}>
          <ArrowLeft size={20} weight="light" aria-hidden />
        </button>
        <button type="button" onClick={onNext} aria-label={t("next")} className={arrow}>
          <ArrowRight size={20} weight="light" aria-hidden />
        </button>
      </div>
    </div>
  );
}

const nivelNum = (n: Nivel) => n.slice(0, 1);

/** Paso 2: fachada por niveles. Escritorio: hotspots sobre la lamina. Movil: banda de nivel + pestanas + chips. */
export function Facade({
  tower,
  filter,
  unidad,
  nivel,
  onNivel,
  onSelect,
  onEscape,
  onClearFilter,
  debug,
  fromMap,
}: {
  tower: Tower;
  filter: Filter;
  unidad: string | null;
  nivel: Nivel;
  onNivel: (n: Nivel) => void;
  onSelect: (code: string) => void;
  onEscape: () => void;
  onClearFilter: () => void;
  debug: boolean;
  fromMap: boolean;
}) {
  const t = useTranslations("availability");
  const locale = useLocale();
  const f = FACADES[tower.tipo];
  const units = unitsOf(tower.slug);
  const [rov, setRov] = useState<string | null>(null);
  const [pos, setPos] = useState("");

  const rows = NIVELES.map((n) => unitsAtLevel(tower.slug, n)).filter((r) => r.length > 0);
  const codes = rows.flat().map((u) => u.unidad);
  const tabCode = rov && codes.includes(rov) ? rov : unidad && codes.includes(unidad) ? unidad : codes[0];
  const anyMatch = units.some((u) => matches(u, filter, tower.tipo));

  const label = (u: Unidad) => {
    const ev = estadoVisible(u);
    return t(isLocal(u) ? "unitLocal" : "unitRes", {
      unidad: u.unidad,
      torre: tower.name,
      nivel: nivelNum(u.nivel as Nivel),
      m2: formatM2(u.m2, locale),
      estado: ev ? t(`status.${ev === "disponible" ? "available" : ev === "apartado" ? "reserved" : "sold"}`) : t("status.unverified"),
    });
  };

  const cx = (u: Unidad) => {
    const r = rectOf(u, tower.tipo);
    return r ? (r.x[0] + r.x[1]) / 2 : 0;
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onEscape();
      return;
    }
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-code]");
    if (!el) return;
    const ri = rows.findIndex((r) => r.some((u) => u.unidad === el.dataset.code));
    if (ri < 0) return;
    const ci = rows[ri].findIndex((u) => u.unidad === el.dataset.code);
    let next: Unidad | undefined;
    if (e.key === "ArrowRight") next = rows[ri][ci + 1];
    else if (e.key === "ArrowLeft") next = rows[ri][ci - 1];
    else if (e.key === "Home") next = rows[ri][0];
    else if (e.key === "End") next = rows[ri][rows[ri].length - 1];
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const r2 = rows[ri + (e.key === "ArrowUp" ? -1 : 1)];
      if (r2) {
        const x = cx(rows[ri][ci]);
        next = r2.reduce((best, u) => (Math.abs(cx(u) - x) < Math.abs(cx(best) - x) ? u : best), r2[0]);
      }
    } else return;
    e.preventDefault();
    if (!next) return;
    setRov(next.unidad);
    e.currentTarget.querySelector<HTMLElement>(`[data-code="${next.unidad}"]`)?.focus();
  };

  // Banda del nivel elegido (movil): en % del alto de la lamina.
  const band = nivel === "PB" ? f.pb : f.rows[nivel];
  const levelUnits = unitsAtLevel(tower.slug, nivel);

  return (
    <div>
      <div className="bezel">
        <div className="passepartout rounded-[4px] p-2 md:p-4">
          <div
            className={`relative aspect-[16/9] overflow-hidden rounded-[2px] ${fromMap ? "stage-enter" : "card-enter"}`}
            style={{ ["--ox" as string]: `${tower.x}%`, ["--oy" as string]: `${tower.y}%` } as CSSProperties}
            onPointerMove={
              debug
                ? (e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setPos(`x ${Math.round(((e.clientX - r.left) / r.width) * FACADE_W)}  y ${Math.round(((e.clientY - r.top) / r.height) * FACADE_H)}`);
                  }
                : undefined
            }
          >
            <Image src={f.src} alt={t("facadeAlt", { torre: tower.name })} fill priority sizes="(min-width: 1360px) 800px, (min-width: 1024px) 60vw, 94vw" className="object-cover" />

            {/* Movil: banda del nivel y toque sobre la fachada para cambiar de nivel (los objetivos tactiles son los chips). */}
            <div
              aria-hidden
              className="absolute inset-0 lg:hidden"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                onNivel(nivelAtY(tower.tipo, ((e.clientY - r.top) / r.height) * 100));
              }}
            >
              <div
                className="absolute inset-x-0 border-y-2 border-oro-500 bg-oro-300/15 transition-[top,height] duration-300 ease-out"
                style={{ top: pct(band[0] - 6, FACADE_H), height: pct(band[1] - band[0] + 12, FACADE_H) }}
              />
            </div>

            {/* Escritorio: un boton por unidad, posicionado en % sobre la lamina. */}
            <div role="group" aria-label={t("facade", { torre: tower.name })} onKeyDown={onKey} className="absolute inset-0 hidden lg:block">
              {units.map((u) => {
                const r = rectOf(u, tower.tipo);
                if (!r) return null;
                const ev = estadoVisible(u);
                const ok = matches(u, filter, tower.tipo);
                return (
                  <button
                    key={u.unidad}
                    type="button"
                    data-code={u.unidad}
                    aria-label={label(u)}
                    aria-pressed={unidad === u.unidad}
                    tabIndex={u.unidad === tabCode ? 0 : -1}
                    onFocus={() => setRov(u.unidad)}
                    onClick={() => onSelect(u.unidad)}
                    style={{ left: pct(r.x[0], FACADE_W), top: pct(r.y[0], FACADE_H), width: pct(r.x[1] - r.x[0], FACADE_W), height: pct(r.y[1] - r.y[0], FACADE_H) }}
                    className={`group absolute rounded-[3px] border-2 transition-[background-color,border-color,box-shadow] duration-150 ${
                      debug ? "border-[#ff2bd6] bg-[#ff2bd6]/15" : "border-transparent"
                    } hover:border-oro-500 hover:bg-oro-300/20 focus-visible:border-oro-500 aria-pressed:border-oro-500 aria-pressed:bg-oro-300/25 aria-pressed:shadow-[0_0_0_2px_var(--color-selva-950)] ${
                      !ok ? "bg-piedra-100/60" : ev === "vendido" ? "pat-vendido bg-selva-950/40" : ev === "apartado" ? "pat-apartado bg-selva-950/25" : ""
                    }`}
                  >
                    {ev && ev !== "disponible" && <StatusChip estado={ev} t={t} className="absolute top-1.5 right-1.5" />}
                    {debug && <span className="pointer-events-none absolute bottom-0 left-0 rounded bg-[#ff2bd6] px-1 text-[10px] leading-4 text-white">{u.unidad}</span>}
                  </button>
                );
              })}
              <a
                href="#amenidades"
                aria-label={t("roofAria", { torre: tower.name })}
                style={{ left: pct(f.roof.x[0], FACADE_W), top: pct(f.roof.y[0], FACADE_H), width: pct(f.roof.x[1] - f.roof.x[0], FACADE_W), height: pct(f.roof.y[1] - f.roof.y[0], FACADE_H) }}
                className={`group absolute grid place-items-end justify-items-center rounded-[3px] border-2 pb-2 transition-colors duration-150 ${debug ? "border-[#ff2bd6] bg-[#ff2bd6]/15" : "border-transparent"} hover:border-marfil-50/70 hover:bg-selva-950/25 focus-visible:border-marfil-50`}
              >
                <span className="rounded-full bg-selva-950/90 px-3 py-1 text-caption whitespace-nowrap text-marfil-50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{t("roofLink")}</span>
              </a>
            </div>
            {debug && pos && <p className="pointer-events-none absolute right-2 bottom-2 rounded bg-black/80 px-2 py-1 font-mono text-xs text-white">{pos}</p>}
          </div>
        </div>
      </div>

      {!anyMatch && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[4px] border border-oro-300/30 bg-selva-900 px-4 py-3 text-small text-marfil-200">
          <span>{t("noMatch")}</span>
          <button type="button" onClick={onClearFilter} className="min-h-11 font-semibold text-oro-300 underline underline-offset-4">
            {t("clearFilter")}
          </button>
        </div>
      )}

      {/* Movil: pestanas de nivel y chips de unidad (objetivos de 44-48 px). */}
      <div className="mt-5 lg:hidden">
        <div role="tablist" aria-label={t("levels")} className="grid grid-cols-4 gap-2">
          {NIVELES.map((n) => (
            <button
              key={n}
              type="button"
              role="tab"
              id={`lvl-${n}`}
              aria-selected={nivel === n}
              aria-controls="lvl-panel"
              aria-label={n === "PB" ? t("levelNamePB") : t("levelName", { n: nivelNum(n) })}
              onClick={() => onNivel(n)}
              className={`${chipClass} min-h-12 px-0`}
            >
              {n === "PB" ? t("levelPB") : t("levelTab", { n: nivelNum(n) })}
            </button>
          ))}
        </div>
        <div id="lvl-panel" role="tabpanel" aria-labelledby={`lvl-${nivel}`} className="mt-3 flex flex-wrap gap-2">
          {levelUnits.map((u) => {
            const ev = estadoVisible(u);
            const ok = matches(u, filter, tower.tipo);
            return (
              <button
                key={u.unidad}
                type="button"
                aria-pressed={unidad === u.unidad}
                aria-label={label(u)}
                onClick={() => onSelect(u.unidad)}
                className={`${chipClass} gap-2 ${ok ? "" : "opacity-40"} ${ev === "vendido" ? "pat-vendido" : ev === "apartado" ? "pat-apartado" : ""}`}
              >
                {t("chipUnit", { unidad: u.unidad, m2: formatM2(u.m2, locale) })}
                {ev && ev !== "disponible" && <StatusChip estado={ev} t={t} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
