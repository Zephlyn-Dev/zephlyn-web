"use client";

/**
 * Boot screen — theme-aware full-viewport overlay on first paint.
 * Light mode: lavender/white radial. Dark mode: purple/ink radial.
 * Auto-dismisses after 2s or on first scroll.
 */

import * as React from "react";
import { useTheme } from "@/components/theme-provider";

export function BootScreen() {
  const [dismissed, setDismissed] = React.useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDismissed(true), 1500);
    const dismiss = () => setDismissed(true);
    const onScroll = () => {
      dismiss();
      window.removeEventListener("scroll", onScroll);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") dismiss();
    };
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const bg = isDark
    ? "radial-gradient(ellipse at center, #2C1271 0%, #1B0B3A 40%, #0A0517 80%)"
    : "radial-gradient(ellipse at center, #EDE6FF 0%, #F4F1FB 50%, #FFFFFF 90%)";

  const stroke = isDark ? "#FBFAFE" : "#4F1DD0";
  const accent = isDark ? "#B69AFF" : "#5B2BE0";
  const labelColor = isDark ? "rgba(251,250,254,0.45)" : "rgba(10,5,23,0.5)";

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{
        background: bg,
        opacity: dismissed ? 0 : 1,
        transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-7">
        <svg
          viewBox="0 0 200 200"
          width={140}
          height={140}
          fill="none"
          stroke={stroke}
          strokeLinecap="round"
        >
          <path
            d="M 32 64 C 60 64 72 64 100 64 C 128 64 140 64 168 64"
            strokeWidth="1.4"
            opacity="0.5"
            style={{
              strokeDasharray: 200,
              strokeDashoffset: 200,
              animation: "echoDraw 1.4s ease forwards 0.1s",
            }}
          />
          <path
            d="M 32 136 C 60 136 72 136 100 136 C 128 136 140 136 168 136"
            strokeWidth="1.4"
            opacity="0.5"
            style={{
              strokeDasharray: 200,
              strokeDashoffset: 200,
              animation: "echoDraw 1.4s ease forwards 0.2s",
            }}
          />
          <path
            d="M 28 100 C 52 72 76 128 100 100 C 124 72 148 128 172 100"
            strokeWidth="2.2"
            stroke={accent}
            style={{
              strokeDasharray: 240,
              strokeDashoffset: 240,
              animation: "echoDraw 1.4s ease forwards 0.4s",
            }}
          />
          {[
            [32, 64],
            [168, 64],
            [32, 136],
            [168, 136],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={stroke}
              opacity="0"
              style={{
                animation: `dotIn 0.4s ease forwards ${1.2 + i * 0.08}s`,
              }}
            />
          ))}
        </svg>

        <span
          className="font-display font-bold leading-none tracking-[-0.035em] text-[32px]"
          style={{
            color: stroke,
            opacity: 0,
            transform: "translateY(10px)",
            animation: "bootRise 0.6s ease forwards 1.3s",
          }}
        >
          Zephlyn
        </span>

        <span
          className="type-overline"
          style={{
            color: labelColor,
            opacity: 0,
            animation: "bootFade 0.5s ease forwards 1.6s",
          }}
        >
          Booting automation system
        </span>
      </div>

      <style>{`
        @keyframes echoDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes dotIn {
          to { opacity: 1; }
        }
        @keyframes bootRise {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bootFade {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
