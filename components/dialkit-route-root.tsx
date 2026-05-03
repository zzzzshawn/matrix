"use client";

import { DialRoot } from "dialkit";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function DialKitRouteRoot() {
  const pathname = usePathname();
  const isPlayground = pathname === "/playground";

  useEffect(() => {
    if (!isPlayground) {
      delete document.body.dataset.playgroundRoute;
      return;
    }

    document.body.dataset.playgroundRoute = "true";

    return () => {
      delete document.body.dataset.playgroundRoute;
    };
  }, [isPlayground]);

  if (!isPlayground) {
    return null;
  }

  return (
    <DialRoot
      position="top-right"
      defaultOpen
      theme="system"
      productionEnabled
    />
  );
}
