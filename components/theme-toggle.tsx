"use client";

import { ThemeMatrixIcon } from "@/components/package-manager-install-toolbar";
import { useCallback, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "dotmatrix-theme";
const DEFAULT_THEME: ThemeMode = "dark";
const THEME_TRANSITION_STYLE_ID = "dotmatrix-theme-transition-styles";

function updateTransitionStyles(css: string) {
  const existing = document.getElementById(THEME_TRANSITION_STYLE_ID);
  const styleElement =
    existing instanceof HTMLStyleElement ? existing : document.createElement("style");

  styleElement.id = THEME_TRANSITION_STYLE_ID;
  styleElement.textContent = css;

  if (!existing) {
    document.head.appendChild(styleElement);
  }
}

function createThemeTransitionCss() {
  return `
    ::view-transition-group(root) {
      animation-duration: 700ms;
      animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }

    ::view-transition-old(root) {
      animation: none;
      z-index: -1;
    }

    ::view-transition-new(root) {
      animation-name: dotmatrix-theme-reveal;
    }

    @keyframes dotmatrix-theme-reveal {
      from {
        clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
      }
      to {
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      ::view-transition-group(root),
      ::view-transition-new(root),
      ::view-transition-old(root) {
        animation-duration: 0ms !important;
      }
    }
  `;
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

    applyTheme(DEFAULT_THEME);
    setTheme(DEFAULT_THEME);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = theme ?? DEFAULT_THEME;
    const next: ThemeMode = current === "dark" ? "light" : "dark";
    const switchTheme = () => {
      applyTheme(next);
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      setTheme(next);
    };

    if (typeof document.startViewTransition !== "function") {
      switchTheme();
      return;
    }

    updateTransitionStyles(createThemeTransitionCss());
    document.startViewTransition(switchTheme);
  }, [theme]);

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
      className="inline-flex w-max min-w-0 rounded-xl bg-surface p-1 text-fg-strong transition-[opacity,color] duration-150 ease-out hover:opacity-90 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
    >
      <span className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-bg p-[7px]">
        <ThemeMatrixIcon className="size-4 sm:size-5" />
      </span>
    </button>
  );
}
