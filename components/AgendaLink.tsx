"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { buttonClass, type ButtonVariant } from "./ui/LinkButton";

/** Ancla a la franja del formulario (#agenda) y mueve el foco al primer campo, sin modal. Sin JS funciona como ancla normal. */
export function AgendaLink({ children, variant = "primary", className = "" }: { children: ReactNode; variant?: ButtonVariant; className?: string }) {
  return (
    <a
      href="#agenda"
      onClick={(e) => {
        const band = document.getElementById("agenda");
        if (!band) return;
        e.preventDefault();
        band.scrollIntoView({ block: "start" });
        band.querySelector<HTMLElement>("input[name=nombre]")?.focus({ preventScroll: true });
        history.replaceState(null, "", "#agenda");
      }}
      className={`${buttonClass(variant)} ${className}`}
    >
      {children}
      {variant === "primary" && (
        <span className="btn-icon" aria-hidden>
          <ArrowUpRight size={18} weight="light" />
        </span>
      )}
    </a>
  );
}
