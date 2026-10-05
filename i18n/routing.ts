import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // Las dos rutas llevan prefijo: /es y /en. La raiz redirige segun el navegador.
  localePrefix: "always",
});
