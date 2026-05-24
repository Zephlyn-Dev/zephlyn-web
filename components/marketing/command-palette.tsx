"use client";

/**
 * Cmd+K command palette (Linear / Raycast / Vercel pattern).
 *
 * Self-contained — no kbar / cmdk dependency. Lightweight:
 *   • Cmd/Ctrl+K toggles open
 *   • Esc closes
 *   • ↑↓ navigate, Enter selects
 *   • Type to filter
 *
 * Maps to scene jumps (scroll-y targets), theme toggle, and external links.
 * Cinematic-aware: scene jumps set window.scrollY into the proxy range
 * matching each UI_SCENES start.
 */

import * as React from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "@/components/theme-provider";
import { UI_SCENES, SCENE_LABELS } from "@/components/scene/scene-config";

type Action = {
  id: string;
  title: string;
  hint?: string;
  group: string;
  keywords?: string;
  run: (ctx: { setTheme: (t: "light" | "dark") => void }) => void;
};

function scrollToCinematicProgress(p: number) {
  // Find the scroll proxy by class — landing-experience.tsx renders one
  // div with h-[360vh].
  const proxy = document.querySelector<HTMLElement>('[class*="h-\\[360vh\\]"]');
  if (!proxy) return;
  const top = proxy.offsetTop;
  const max = proxy.offsetHeight - window.innerHeight;
  if (max <= 0) return;
  const y = top + p * max;
  window.scrollTo({ top: Math.round(y), behavior: "smooth" });
}

function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const ACTIONS: Action[] = [
  ...UI_SCENES.map((range, i) => ({
    id: `scene-${i}`,
    title: `Jump to scene ${i + 1} — ${SCENE_LABELS[i]}`,
    hint: `Scene ${i + 1} / 7`,
    group: "Cinematic",
    keywords: SCENE_LABELS[i].toLowerCase(),
    run: () => scrollToCinematicProgress(range[0] + 0.005),
  })),
  {
    id: "pillars",
    title: "Where we start",
    hint: "Section",
    group: "Sections",
    keywords: "pillars platform where start what we automate",
    run: () => scrollToHash("#pillars"),
  },
  {
    id: "why",
    title: "Why Zephlyn",
    hint: "Section",
    group: "Sections",
    keywords: "why agency saas service",
    run: () => scrollToHash("#why"),
  },
  {
    id: "faq",
    title: "Common questions",
    hint: "Section",
    group: "Sections",
    keywords: "questions faq support",
    run: () => scrollToHash("#faq"),
  },
  {
    id: "contact",
    title: "Get in touch",
    hint: "Action",
    group: "Sections",
    keywords: "contact email talk reach out cta",
    run: () => scrollToHash("#get-started"),
  },
  {
    id: "theme-light",
    title: "Switch to light theme",
    hint: "Theme",
    group: "Settings",
    keywords: "light theme bright",
    run: ({ setTheme }) => setTheme("light"),
  },
  {
    id: "theme-dark",
    title: "Switch to dark theme",
    hint: "Theme",
    group: "Settings",
    keywords: "dark theme night",
    run: ({ setTheme }) => setTheme("dark"),
  },
  {
    id: "mail",
    title: "Email social@zephlyn.io",
    hint: "External",
    group: "Contact",
    keywords: "email contact mail",
    run: () => {
      window.location.href = "mailto:social@zephlyn.io";
    },
  },
];

function filterActions(query: string) {
  if (!query.trim()) return ACTIONS;
  const q = query.toLowerCase();
  return ACTIONS.filter((a) =>
    `${a.title} ${a.group} ${a.keywords ?? ""}`.toLowerCase().includes(q)
  );
}

function groupActions(actions: Action[]) {
  const groups = new Map<string, Action[]>();
  for (const a of actions) {
    const arr = groups.get(a.group) ?? [];
    arr.push(a);
    groups.set(a.group, arr);
  }
  return Array.from(groups.entries());
}

export function CommandPalette() {
  const { setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const filtered = React.useMemo(() => filterActions(query), [query]);
  const grouped = React.useMemo(() => groupActions(filtered), [filtered]);
  const flat = filtered;

  // Global Cmd/Ctrl+K listener
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reset query / focus when opened
  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Clamp activeIdx as filtered list shrinks
  React.useEffect(() => {
    if (activeIdx >= flat.length) setActiveIdx(Math.max(0, flat.length - 1));
  }, [flat.length, activeIdx]);

  function runActive() {
    const a = flat[activeIdx];
    if (!a) return;
    setOpen(false);
    a.run({ setTheme: (t) => setTheme(t) });
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(flat.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    }
  }

  if (!open) return null;

  let runningIdx = -1;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        style={{ animation: "paletteFadeIn 200ms ease forwards" }}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full max-w-[560px] rounded-2xl border border-border bg-card overflow-hidden",
          "shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6),0_0_0_1px_rgba(155,107,255,0.10)]"
        )}
        style={{ animation: "paletteRise 240ms cubic-bezier(0.22,1,0.36,1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground shrink-0"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Jump to a scene, theme, page…"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/70 font-display text-[15px]"
            aria-label="Search commands"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background/60 font-mono text-[10px] text-muted-foreground tracking-[0.06em]">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[52vh] overflow-y-auto p-2"
        >
          {grouped.length === 0 && (
            <p className="px-3 py-6 text-center type-body-sm text-muted-foreground">
              No matches.
            </p>
          )}
          {grouped.map(([group, items]) => (
            <div key={group} className="mb-2 last:mb-0">
              <p className="px-2 pt-2 pb-1 type-overline text-muted-foreground/60 tracking-[0.18em]">
                {group}
              </p>
              {items.map((a) => {
                runningIdx++;
                const isActive = runningIdx === activeIdx;
                const myIdx = runningIdx;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onMouseEnter={() => setActiveIdx(myIdx)}
                    onClick={() => {
                      setActiveIdx(myIdx);
                      runActive();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-left transition-colors",
                      isActive
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="type-body-sm">{a.title}</span>
                    {a.hint && (
                      <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground/60 shrink-0">
                        {a.hint}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint row */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-border bg-muted/30">
          <span className="type-caption font-mono text-muted-foreground/70 tracking-[0.06em]">
            Cmd/Ctrl + K to open · ↑↓ navigate · ↵ select
          </span>
          <span className="type-caption font-mono text-muted-foreground/70 tracking-[0.06em] hidden sm:inline">
            Zephlyn
          </span>
        </div>
      </div>

      <style>{`
        @keyframes paletteFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes paletteRise {
          from { transform: translateY(-12px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}
