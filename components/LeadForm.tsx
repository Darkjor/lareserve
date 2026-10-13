"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, CheckCircle, WarningCircle } from "@phosphor-icons/react/ssr";
import { sendLead } from "@/lib/leads";
import type { LeadFormState } from "@/lib/lead-schema";
import { whatsappLink } from "@/lib/site";

export type FormVariant = "panel" | "final" | "broker";
export type LeadTipo = "presentacion" | "legal" | "brochure" | "broker";
/** stack: una columna. compact: tarjeta del hero (nombre y telefono en 2 columnas desde lg). pairs: 2 columnas desde md (Aliados). */
export type FormLayout = "stack" | "compact" | "pairs";

const GRID: Record<FormLayout, string> = {
  stack: "grid gap-5",
  compact: "grid gap-4 lg:grid-cols-2 lg:gap-3",
  pairs: "grid gap-5 md:grid-cols-2 md:gap-x-4",
};
const FULL: Record<FormLayout, string> = { stack: "", compact: "lg:col-span-2", pairs: "md:col-span-2" };

const WA_KEY: Record<LeadTipo, string> = {
  presentacion: "presentation",
  legal: "legal",
  brochure: "brochure",
  broker: "brokers",
};

const SUBMIT_KEY: Record<LeadTipo, string> = {
  presentacion: "cta.book",
  legal: "cta.legal",
  brochure: "cta.brochure",
  broker: "cta.brokers",
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-small text-error">
      <WarningCircle size={18} weight="light" className="mt-0.5 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}

type Props = { variant: FormVariant; tipo: LeadTipo; layout?: FormLayout };

export function LeadForm({ variant, tipo, layout = "stack" }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<LeadFormState, FormData>(sendLead, { status: "idle" });
  const [contact, setContact] = useState("whatsapp");

  const values: Record<string, string> = state.status === "invalid" || state.status === "error" ? state.values : {};
  const errors = state.status === "invalid" ? state.errors : {};
  const errorCount = Object.keys(errors).length;
  const full = FULL[layout];
  const emailSpan = layout === "pairs" ? "" : full;

  useEffect(() => {
    if (state.status === "invalid") {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [state]);

  const id = (n: string) => `${uid}-${n}`;
  const msg = (k: keyof typeof errors) => (errors[k] ? t(`form.${errors[k]}`) : undefined);
  const wa = whatsappLink(t(`wa.${WA_KEY[tipo]}`));

  if (state.status === "success") {
    return (
      <div role="status" className="py-2">
        <CheckCircle size={44} weight="light" className="text-verde-700" aria-hidden />
        <h3 className="mt-5 text-h3 text-ink">{t("form.successTitle")}</h3>
        <p className="mt-3 text-body text-ink-2">{t("form.successBody")}</p>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8 w-full justify-between">
          {t("form.successCta")}
          <span className="btn-icon" aria-hidden>
            <ArrowUpRight size={18} weight="light" />
          </span>
        </a>
      </div>
    );
  }

  const fieldProps = (name: "nombre" | "telefono" | "email") => ({
    id: id(name),
    name,
    defaultValue: values[name] ?? "",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? id(`${name}-err`) : name === "telefono" ? id("tel-help") : undefined,
  });

  return (
    <form ref={formRef} action={action} noValidate className={GRID[layout]}>
      <input type="hidden" name="tipo" value={tipo} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="contacto_preferido" value={contact} />
      {/* Honeypot: una persona no lo ve ni lo llena. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {errorCount > 2 && (
        <p role="alert" className={`flex items-start gap-2 text-small text-error ${full}`}>
          <WarningCircle size={18} weight="light" className="mt-0.5 shrink-0" aria-hidden />
          {t("form.errSummary")}
        </p>
      )}
      {state.status === "error" && (
        <div role="alert" className={`rounded-surface border-2 border-error p-4 text-small text-error ${full}`}>
          <p className="flex items-start gap-2">
            <WarningCircle size={18} weight="light" className="mt-0.5 shrink-0" aria-hidden />
            {t("form.errNetwork")}
          </p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="link-gold mt-2 inline-block text-ink">
            {t("form.waAlt")}
          </a>
        </div>
      )}

      <div>
        <label htmlFor={id("nombre")} className="field-label">
          {t("form.name")}
        </label>
        <input {...fieldProps("nombre")} type="text" autoComplete="name" placeholder={t("form.namePh")} className="field" />
        <FieldError id={id("nombre-err")} message={msg("nombre")} />
      </div>

      {variant === "broker" && (
        <div>
          <label htmlFor={id("empresa")} className="field-label">
            {t("form.agency")}
          </label>
          <input id={id("empresa")} name="empresa" defaultValue={values.empresa ?? ""} type="text" autoComplete="organization" placeholder={t("form.agencyPh")} className="field" />
        </div>
      )}

      <div>
        <label htmlFor={id("telefono")} className="field-label">
          {t("form.phone")}
        </label>
        <input {...fieldProps("telefono")} type="tel" inputMode="tel" autoComplete="tel" placeholder={t("form.phonePh")} className="field" />
        {errors.telefono ? <FieldError id={id("telefono-err")} message={msg("telefono")} /> : <p id={id("tel-help")} className="caption mt-2">{t("form.phoneHelp")}</p>}
      </div>

      <div className={emailSpan}>
        <label htmlFor={id("email")} className="field-label">
          {t("form.email")} {variant !== "broker" && contact !== "correo" && <span className="font-normal text-ink-3">{t("form.emailOptional")}</span>}
        </label>
        <input {...fieldProps("email")} type="email" inputMode="email" autoComplete="email" placeholder={t("form.emailPh")} className="field" />
        <FieldError id={id("email-err")} message={msg("email")} />
      </div>

      {variant !== "broker" && (
        <fieldset className={full}>
          <legend className="field-label">{t("form.contact")}</legend>
          <div role="radiogroup" aria-label={t("form.contact")} className="seg w-full">
            {(["whatsapp", "llamada", "correo"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={contact === v}
                onClick={() => setContact(v)}
                className="flex-1"
              >
                {t(`form.contact${v === "whatsapp" ? "Whatsapp" : v === "llamada" ? "Call" : "Email"}`)}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {variant === "panel" && (
        <div className={full}>
          <label htmlFor={id("horario")} className="field-label">
            {t("form.schedule")}
          </label>
          <select id={id("horario")} name="horario" defaultValue={values.horario ?? ""} className="field">
            <option value="">{t("form.sched0")}</option>
            <option value="manana">{t("form.sched1")}</option>
            <option value="tarde">{t("form.sched2")}</option>
            <option value="noche">{t("form.sched3")}</option>
          </select>
        </div>
      )}

      {variant === "final" && (
        <div className={full}>
          <label htmlFor={id("interes")} className="field-label">
            {t("form.interest")}
          </label>
          <select id={id("interes")} name="interes" defaultValue={values.interes ?? ""} className="field">
            <option value="">{t("form.interestPh")}</option>
            <option value="A">{t("form.interestA")}</option>
            <option value="B">{t("form.interestB")}</option>
            <option value="C">{t("form.interestC")}</option>
            <option value="D">{t("form.interestD")}</option>
            <option value="local">{t("form.interestRetail")}</option>
            <option value="aun-no">{t("form.interestUnknown")}</option>
          </select>
        </div>
      )}

      {variant === "broker" && (
        <div className={full}>
          <label htmlFor={id("mensaje")} className="field-label">
            {t("form.message")} <span className="font-normal text-ink-3">{t("form.messageOptional")}</span>
          </label>
          <textarea id={id("mensaje")} name="mensaje" rows={3} defaultValue={values.mensaje ?? ""} placeholder={t("form.messagePh")} className="field resize-y" />
        </div>
      )}

      <div className={full}>
        <div className="flex items-start gap-3">
          <input
            id={id("consent")}
            name="consent"
            type="checkbox"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? id("consent-err") : undefined}
            className="mt-1 size-[22px] shrink-0 accent-[var(--color-ink)]"
          />
          <label htmlFor={id("consent")} className={`text-ink-2 ${layout === "compact" ? "text-caption" : "text-small"}`}>
            {t("form.consentBefore")}
            <a href={`/${locale}/privacidad`} target="_blank" rel="noopener noreferrer" className="link-gold text-ink">
              {t("form.consentLink")}
            </a>
            {t("form.consentAfter")}
          </label>
        </div>
        <FieldError id={id("consent-err")} message={msg("consent")} />
      </div>

      <button type="submit" className={`btn btn-primary relative w-full justify-between overflow-hidden ${full}`} disabled={pending} aria-disabled={pending}>
        {pending ? t("form.sending") : t(SUBMIT_KEY[tipo])}
        <span className="btn-icon" aria-hidden>
          <ArrowUpRight size={18} weight="light" />
        </span>
        {pending && <span className="btn-bar" aria-hidden />}
      </button>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={`link-gold justify-self-center text-small text-ink-2 ${full}`}>
        {t("form.waAlt")}
      </a>
    </form>
  );
}