import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
};

/** Enlace con apariencia de boton (pill). El primario lleva el circulo de icono anidado. */
export function LinkButton({ href, children, variant = "primary", external, className = "" }: Props) {
  return (
    <a
      href={href}
      className={`btn ${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

export function ButtonLabel({ children, primary = true }: { children: ReactNode; primary?: boolean }) {
  return (
    <>
      {children}
      {primary && (
        <span className="btn-icon" aria-hidden>
          <ArrowUpRight size={18} weight="light" />
        </span>
      )}
    </>
  );
}
