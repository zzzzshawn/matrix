"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "dotmatrix-theme";

function systemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
      setTheme(stored);
      return;
    }

    const resolved = systemTheme();
    setTheme(resolved);
  }, []);

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        const current = theme ?? systemTheme();
        const next: ThemeMode = current === "dark" ? "light" : "dark";
        applyTheme(next);
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
        setTheme(next);
      }}
      className="theme-text fixed top-4 right-4 z-70 rounded-md border border-(--color-border) bg-(--color-surface-soft) px-2.5 py-1.5 text-xs transition-colors hover:bg-(--color-surface-muted)"
    >
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
