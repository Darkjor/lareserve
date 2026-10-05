import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Conecta i18n/request.ts (locale y mensajes por peticion) con el build.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 82],
  },
};

export default withNextIntl(nextConfig);
