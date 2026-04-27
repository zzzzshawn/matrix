import type { MetadataRoute } from "next";

function siteOrigin(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (typeof raw !== "string" || raw.length === 0) return undefined;
  try {
    return new URL(raw).origin;
  } catch {
    return undefined;
  }
}

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {})
  };
}
