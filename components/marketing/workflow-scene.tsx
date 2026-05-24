"use client";

/**
 * Workflow dashboard — condensed. Headline + ConnectedFlow diagram.
 * Fits in one viewport, no inner scroll.
 */

import * as React from "react";
import { DashboardChrome } from "./dashboard-chrome";
import { ConnectedFlow } from "./flow-diagram";

export function WorkflowScene() {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="text-center max-w-[64ch]">
        <p className="type-overline text-primary inline-flex items-center gap-2">
          <span className="size-1 rounded-full bg-primary" />
          04 · What we automate
        </p>
        <h2 className="mt-2 font-display font-bold leading-[1.05] tracking-[-0.035em] text-foreground text-[clamp(1.5rem,3vw,2.4rem)]">
          Your day, rebuilt as
          <span className="text-primary"> connected workflows.</span>
        </h2>
      </div>

      <DashboardChrome pill="Workflow · Lead → Booked Job">
        {/* On narrow viewports the 700px-wide SVG would shrink labels into
            unreadability. Wrap in a horizontal-scroll container with a
            preserved min-width and a soft fade hint on the right edge so
            mobile users know it scrolls. */}
        <div
          className="relative -mx-1 sm:mx-0 overflow-x-auto"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, black 0%, black 92%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, black 0%, black 92%, transparent 100%)",
          }}
        >
          <div className="min-w-[640px] px-1 sm:min-w-0 sm:px-0">
            <ConnectedFlow />
          </div>
        </div>
      </DashboardChrome>
    </div>
  );
}
