import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";

/** Clases por variante: primario (oro), secundario (borde), ghost (sobre foto o verde) y enlace terciario. */
export function buttonClass(variant: ButtonVariant) {
  if (variant === "primary") return "btn btn-primary";
  if (variant === "secondary") return "btn btn-secondary";
  if (variant === "ghost") return "btn btn-ghost-light";
  return "link-gold inline-flex min-h-11 items-center gap-2";
}

type Props = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  className?: string;
};

/** Enlace con apariencia de boton (pill). El primario lleva el circulo de icono anidado. */
export function LinkButton({ href, children, variant = "primary", external, className = "" }: Props) {
  return (
    <a
      href={href}
      className={`${buttonClass(variant)} ${className}`}
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