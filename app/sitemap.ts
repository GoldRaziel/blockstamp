import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://blockstamp.ae";
  const now = new Date();

  const routes = [
    "/", "/it", "/en", "/ar",
    "/service", "/verify", "/timbra", "/pay"
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
  }));
}
