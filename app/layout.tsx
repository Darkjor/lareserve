import type { ReactNode } from "react";

// El <html> vive en app/[locale]/layout.tsx para poder fijar el idioma por ruta.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
