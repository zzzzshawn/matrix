import type { MetadataRoute } from "next";

function homeUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (typeof raw !== "string" || raw.length === 0) return undefined;
  try {
    return new URL("/", raw).href;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const url = homeUrl();
  if (!url) return [];
  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
