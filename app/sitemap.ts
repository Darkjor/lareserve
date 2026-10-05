import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pair = (path: string, priority: number) => ({
    url: `${SITE_URL}/es${path}`,
    alternates: { languages: { es: `${SITE_URL}/es${path}`, en: `${SITE_URL}/en${path}` } },
    priority,
  });
  return [pair("", 1), pair("/privacidad", 0.2)];
}
