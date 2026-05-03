import type { Metadata } from "next";

const siteUrl =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
    process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined;

const siteDescription =
  "Dot Matrix is a React component library of dot matrix loaders—expressive loading primitives you install via the shadcn registry and own as local code.";

const defaultTitle = "Dot Matrix";

const ogImageAlt =
  "Dot Matrix logo: white rounded square with six black dots on a light gray grid background.";

const ogImage = {
  url: "/og.png",
  width: 1024,
  height: 537,
  alt: ogImageAlt,
  type: "image/png" as const
};

const creatorName = "zzzzshawn";
const creatorUrl = "https://x.com/zzzzshawn/";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine
} from "geist/font/pixel";
import type { ReactNode } from "react";
import Link from "next/link";

import { HomeLink } from "@/components/home-link";
import { RouteAwareSiteFooter } from "@/components/route-aware-site-footer";
import { SiteMarkIcon } from "@/components/site-mark-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { DialKitRouteRoot } from "@/components/dialkit-route-root";
import "dialkit/styles.css";
import "./globals.css";

const fontVariables = [
  GeistSans.variable,
  GeistMono.variable,
  GeistPixelSquare.variable,
  GeistPixelGrid.variable,
  GeistPixelCircle.variable,
  GeistPixelTriangle.variable,
  GeistPixelLine.variable
].join(" ");

const themeInitScript = `(() => {
  try {
    const key = "dotmatrix-theme";
    const stored = localStorage.getItem(key);
    if (stored === "light" || stored === "dark") {
      document.documentElement.dataset.theme = stored;
      document.documentElement.style.colorScheme = stored;
    } else {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.style.colorScheme = "dark";
    }
  } catch {
    // Ignore storage errors in restricted contexts and keep dark default.
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();`;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  applicationName: defaultTitle,
  title: {
    default: defaultTitle,
    template: "%s · Dot Matrix"
  },
  description: siteDescription,
  keywords: [
    "Dot Matrix",
    "React",
    "component library",
    "dot matrix",
    "loaders",
    "loading",
    "shadcn",
    "shadcn/ui",
    "registry",
    "Tailwind CSS",
    "UI",
    "npm",
    "open source"
  ],
  authors: [{ name: creatorName, url: creatorUrl }],
  creator: creatorName,
  publisher: creatorName,
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: defaultTitle,
    title: defaultTitle,
    description: siteDescription,
    ...(siteUrl ? { url: new URL("/", siteUrl).href } : {}),
    images: [ogImage]
  },
  twitter: {
    card: "summary_large_image",
    site: "@zzzzshawn",
    creator: "@zzzzshawn",
    title: defaultTitle,
    description: siteDescription,
    images: [{ url: "/og.png", alt: ogImageAlt }]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      style={{ colorScheme: "dark" }}
      data-diffkit-extension="1"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          src="https://cdn.databuddy.cc/databuddy.js"
          data-client-id="3bcee424-7f5b-4bef-b4df-f4d057106989"
          data-track-outgoing-links="true"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body
        className={`${GeistPixelCircle.className} ${fontVariables} flex min-h-dvh flex-col font-medium antialiased`}
        cz-shortcut-listen="true"
      >
        <Link
          href="/"
          aria-label="Home"
          className="fixed left-4 top-4 z-20 inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#dfdfdf] p-0.5 before:absolute before:left-1/2 before:top-1/2 before:z-0 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] will-change-transform transition-transform duration-200 ease focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring) [@media(hover:hover)_and_(pointer:fine)]:hover:rotate-4 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.03] motion-reduce:will-change-auto motion-reduce:transition-none motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:hover:rotate-0 motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:hover:translate-y-0 motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:hover:scale-100"
        >
          <SiteMarkIcon className="relative z-10 size-8.5 shrink-0 select-none pointer-events-none" />
        </Link>
        <div className="fixed right-4 top-4 z-20 flex items-center gap-2">
          <HomeLink />
          <ThemeToggle />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <DialKitRouteRoot />
        <RouteAwareSiteFooter />
      </body>
    </html>
  );
}
