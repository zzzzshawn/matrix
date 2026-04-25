import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "@/loaders/styles.css";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  title: "Dotmatrix Loader Library",
  description: "Dotmatrix-style loading animations with shadcn registry support."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark"  data-diffkit-extension="1">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased` } cz-shortcut-listen="true">{children}</body>
    </html>
  );
}
