"use client";

/**
 * Tools dashboard — condensed for single-viewport fit.
 * 3 compact tool groups in tight rows + 3 service cards below.
 */

import * as React from "react";
import { DashboardChrome } from "./dashboard-chrome";

const GROUPS: Array<{ title: string; tools: string[] }> = [
  {
    title: "Field service & dispatch",
    tools: ["ServiceTitan", "Jobber", "Housecall Pro", "FieldEdge", "RazorSync", "Workiz"],
  },
  {
    title: "CRM, comms & forms",
    tools: ["HubSpot", "Pipedrive", "Twilio", "OpenPhone", "Typeform", "Jotform"],
  },
  {
    title: "Money, ops & glue",
    tools: ["QuickBooks", "Stripe", "Slack", "Zapier", "Make", "Google Workspace"],
  },
];

const SERVICES: Array<{
  eyebrow: string;
  title: string;
  body: string;
  meta: string;
}> = [
  {
    eyebrow: "Audit",
    title: "Workflow audit",
    body: "Map current ops, find the 3 workflows that hurt most.",
    meta: "2-week sprint",
  },
  {
    eyebrow: "Buildout",
    title: "Workflow buildout",
    body: "3 workflows live, wired into your stack, documented.",
    meta: "3-week sprint",
  },
  {
    eyebrow: "Support",
    title: "Ongoing support",
    body: "Fixes, new automations, monthly check-in on outcomes.",
    meta: "Month-to-month",
  },
];

function ToolTile({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 min-w-0">
      <span className="size-5 rounded bg-accent text-accent-foreground grid place-items-center font-mono text-[9px] font-semibold shrink-0">
        {initials}
      </span>
      <span className="text-[10.5px] text-foreground truncate">{name}</span>
    </div>
  );
}

export function ToolsScene() {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="text-center max-w-[60ch]">
        <p className="type-overline text-primary inline-flex items-center gap-2">
          <span className="size-1 rounded-full bg-primary" />
          06 · Tools we connect
        </p>
        <h2 className="mt-2 font-display font-bold leading-[1.05] tracking-[-0.035em] text-foreground text-[clamp(1.5rem,3vw,2.4rem)]">
          Built on what
          <span className="text-primary"> you already run.</span>
        </h2>
      </div>

      <DashboardChrome
        pill="Integrations · 180+ connectors"
        label="3 GROUPS · 18 TOOLS · 3 SERVICES"
      >
        <div className="flex flex-col gap-3">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <p className="type-overline text-primary/85 mb-1.5 text-[10px]">
                {g.title}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {g.tools.map((t) => (
                  <ToolTile key={t} name={t} />
                ))}
              </div>
            </div>
          ))}

          {/* Services strip */}
          <div className="border-t border-border pt-3 mt-1 grid grid-cols-1 md:grid-cols-3 gap-2">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-md border border-border bg-background p-3 flex flex-col gap-1"
              >
                <p className="type-overline text-primary text-[9px]">{s.eyebrow}</p>
                <h3 className="text-[13px] font-semibold text-foreground tracking-[-0.005em]">
                  {s.title}
                </h3>
                <p className="text-[11px] leading-[1.45] text-muted-foreground">
                  {s.body}
                </p>
                <span className="mt-auto pt-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                  {s.meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DashboardChrome>
    </div>
  );
}
