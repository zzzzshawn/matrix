"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";

export function RouteAwareSiteFooter() {
  const pathname = usePathname();

  if (pathname === "/playground") {
    return null;
  }

  return <SiteFooter />;
}
