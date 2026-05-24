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

      <DashboardChrome pill="Integrations · Common tools">
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
        </div>
      </DashboardChrome>
    </div>
  );
}
