/**
 * Marco P4: hilo de 1 px oro que se dibuja (stroke-dashoffset 1 a 0). Se coloca dentro de un contenedor `relative`.
 * `inset` en px: positivo = dentro del contenedor, negativo = fuera. mode "scroll": se dibuja al entrar (RevealObserver);
 * "load": se dibuja solo, con retardo `delay` (hero, cambio de pestana). Sin JS o con movimiento reducido: trazo completo.
 */
export function DrawFrame({ inset = -7, mode = "scroll", delay = 0, duration }: { inset?: number; mode?: "scroll" | "load"; delay?: number; duration?: number }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      className={`draw-frame ${mode === "scroll" ? "reveal-frame" : "draw-load"}`}
      style={{ ["--i" as string]: `${inset}px`, ["--d" as string]: `${delay}ms`, ...(duration ? { ["--dur" as string]: `${duration}ms` } : null) }}
    >
      <rect x=".5" y=".5" rx="2" pathLength={1} />
    </svg>
  );
}
