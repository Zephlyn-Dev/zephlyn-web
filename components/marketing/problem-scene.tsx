"use client";

/**
 * Problem dashboard — condensed. Headline + DisconnectedFlow diagram.
 * Fits in one viewport, no inner scroll.
 */

import * as React from "react";
import { DashboardChrome } from "./dashboard-chrome";
import { DisconnectedFlow } from "./flow-diagram";

export function ProblemScene() {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="text-center max-w-[60ch]">
        <p className="type-overline text-primary inline-flex items-center gap-2">
          <span className="size-1 rounded-full bg-primary" />
          02 · The problem
        </p>
        <h2 className="mt-2 font-display font-bold leading-[1.05] tracking-[-0.035em] text-foreground text-[clamp(1.5rem,3vw,2.4rem)]">
          Every shop has 11 lead sources.
          <span className="text-primary"> None of them talk.</span>
        </h2>
      </div>

      <DashboardChrome
        pill="Live · Apex HVAC — your owner's phone"
        label="11 UNREAD · 0 ROUTED · LOST REVENUE: $9,840 TODAY"
      >
        <DisconnectedFlow />
      </DashboardChrome>
    </div>
  );
}
