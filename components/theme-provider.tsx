"use client";

/**
 * Zephlyn — Theme provider
 * Toggles `class="dark"` on <html>. Persists the choice in localStorage.
 * SSR-safe: reads from a tiny inline script in <head> to avoid flash.
 */

import * as React from "react";

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

interface Ctx {
  theme: Theme;
  resolvedTheme: Resolved;
  setTheme: (t: Theme) => void;
}

const ThemeCtx = React.createContext<Ctx | null>(null);

const STORAGE_KEY = "zephlyn-theme";

function readSystem(): Resolved {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyClass(resolved: Resolved) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolved, setResolved] = React.useState<Resolved>("light");

  // initial read
  React.useEffect(() => {
    const stored = (typeof window !== "undefined"
      ? (localStorage.getItem(STORAGE_KEY) as Theme | null)
      : null) ?? "system";
    setThemeState(stored);
    const r = stored === "system" ? readSystem() : stored;
    setResolved(r);
    applyClass(r);
  }, []);

  // watch system changes when in system mode
  React.useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const r = readSystem();
      setResolved(r);
      applyClass(r);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    const r = next === "system" ? readSystem() : next;
    setResolved(r);
    applyClass(r);
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, resolvedTheme: resolved, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/**
 * Inline script that runs BEFORE React hydrates to set the right theme class
 * on <html> immediately, preventing a flash of the wrong theme.
 *
 * Drop into <head> in your root layout:
 *   <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
 */
export const themeBootScript = `
(function() {
  try {
    var s = localStorage.getItem('${STORAGE_KEY}') || 'system';
    var dark = s === 'dark' || (s === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;
    if (dark) root.classList.add('dark');
    root.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();
`.trim();
