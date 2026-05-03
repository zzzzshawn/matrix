"use client";

import { DialRoot } from "dialkit";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function useDocumentTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const read = () => {
      const t = document.documentElement.dataset.theme;
      setTheme(t === "light" ? "light" : "dark");
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export function DialKitRouteRoot() {
  const pathname = usePathname();
  const isPlayground = pathname === "/playground";
  const dialTheme = useDocumentTheme();

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
      theme={dialTheme}
      productionEnabled
    />
  );
}
