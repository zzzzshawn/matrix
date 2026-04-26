import type { Metadata } from "next";

const siteUrl =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
  process.env.NEXT_PUBLIC_SITE_URL.length > 0
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined;

const realmDescription =
  "Realm is a React component library of dot matrix loaders—expressive loading primitives you install via the shadcn registry and own as local code.";
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

import { HomeLink } from "@/components/home-link";
import { ThemeToggle } from "@/components/theme-toggle";
import "@/loaders/styles.css";
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
  applicationName: "Realm",
  title: {
    default: "Realm",
    template: "%s · Realm"
  },
  description: realmDescription,
  keywords: [
    "Realm",
    "React",
    "component library",
    "dot matrix",
    "loaders",
    "loading",
    "shadcn",
    "Tailwind CSS"
  ],
  openGraph: {
    type: "website",
    siteName: "Realm",
    title: "Realm",
    description: realmDescription
  },
  twitter: {
    card: "summary_large_image",
    title: "Realm",
    description: realmDescription
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
      </head>
      <body
        className={`${GeistPixelCircle.className} ${fontVariables} font-medium antialiased`}
        cz-shortcut-listen="true"
      >
        <div className="fixed right-4 top-4 z-20 flex items-center gap-2">
          <HomeLink />
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
