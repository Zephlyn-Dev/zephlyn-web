"use client";

/**
 * Two professional flow diagrams. Theme-aware via CSS variables — fills
 * and strokes use semantic tokens that flip between light + dark.
 */

import * as React from "react";

const NODE_RX = 8;
const NODE_W = 122;
const NODE_H = 30;

type Variant = "neutral" | "danger" | "primary" | "success";

function variantStroke(v: Variant) {
  switch (v) {
    case "danger":   return "var(--zeph-danger-500)";
    case "primary":  return "var(--primary)";
    case "success":  return "var(--zeph-success-500)";
    default:         return "var(--border)";
  }
}
function variantBadgeBg(v: Variant) {
  switch (v) {
    case "danger":   return "color-mix(in srgb, var(--zeph-danger-500) 18%, transparent)";
    case "primary":  return "color-mix(in srgb, var(--primary) 22%, transparent)";
    case "success":  return "color-mix(in srgb, var(--zeph-success-500) 22%, transparent)";
    default:         return "color-mix(in srgb, var(--primary) 18%, transparent)";
  }
}
function variantBadgeText(v: Variant) {
  switch (v) {
    case "danger":   return "var(--zeph-danger-500)";
    case "primary":  return "var(--primary)";
    case "success":  return "var(--zeph-success-500)";
    default:         return "var(--primary)";
  }
}

function NodeRect({
  x,
  y,
  label,
  initials,
  variant = "neutral",
}: {
  x: number;
  y: number;
  label: string;
  initials: string;
  variant?: Variant;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={NODE_RX}
        fill="var(--card)"
        stroke={variantStroke(variant)}
        strokeWidth="1"
      />
      <rect
        x={x + 6}
        y={y + 6}
        width={18}
        height={18}
        rx={5}
        fill={variantBadgeBg(variant)}
      />
      <text
        x={x + 6 + 9}
        y={y + 6 + 13}
        textAnchor="middle"
        fontSize="9.5"
        fontFamily="var(--zeph-font-mono)"
        fontWeight="600"
        fill={variantBadgeText(variant)}
      >
        {initials}
      </text>
      <text
        x={x + 32}
        y={y + 19}
        textAnchor="start"
        fontSize="10.5"
        fontFamily="var(--zeph-font-body)"
        fontWeight="500"
        fill="var(--foreground)"
      >
        {label}
      </text>
    </g>
  );
}

function ColumnLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text
      x={x}
      y={y}
      fontSize="9"
      fontFamily="var(--zeph-font-mono)"
      fill="var(--primary)"
      opacity="0.7"
      letterSpacing="0.18em"
    >
      {label}
    </text>
  );
}

/* ============================================================
   DISCONNECTED — Problem scene
   Phone notification stack — every "dropped lead" is rendered as the
   actual artifact a contractor sees daily: a missed call, an unplayed
   voicemail, an unread SMS, a website form left sitting in the inbox,
   an Angi lead claimed too late. Each row uses the channel's own
   vocabulary and icon so contractors recognise it on sight rather
   than translating an abstract "ticket".
   ============================================================ */

type ArtifactKind =
  | "missed-call"
  | "voicemail"
  | "sms"
  | "form"
  | "google"
  | "facebook"
  | "angi"
  | "past-customer"
  | "review"
  | "referral"
  | "estimate";

const ARTIFACTS: Array<{
  id: string;
  kind: ArtifactKind;
  app: string;       // channel name shown on the card chrome
  title: string;     // headline
  body: string;      // description line
}> = [
  { id: "n1",  kind: "missed-call",   app: "Phone",         title: "Missed calls",              body: "Voicemail, after-hours rings, the line nobody picked up." },
  { id: "n2",  kind: "voicemail",     app: "Voicemail",     title: "Voicemails",                body: "Played late or never. The lead has already moved on." },
  { id: "n3",  kind: "google",        app: "Google Ads",    title: "Google Ads leads",          body: "Lead-form drops that arrive at an inbox nobody owns." },
  { id: "n4",  kind: "facebook",      app: "Facebook",      title: "Meta lead ads",             body: "Sit inside Facebook Business Manager until somebody logs in." },
  { id: "n5",  kind: "sms",           app: "Messages",      title: "Text replies",              body: "Customer texts to the business line — and back to who?" },
  { id: "n6",  kind: "form",          app: "Website",       title: "Website forms",             body: "Quote requests routed to a shared inbox, then forgotten." },
  { id: "n7",  kind: "angi",          app: "Angi",          title: "Angi / marketplace leads",  body: "Claim windows, lead-share fees, a separate dashboard." },
  { id: "n8",  kind: "past-customer", app: "Past customer", title: "Past-customer follow-ups",  body: "Annual checkups, warranty calls, repeat-job reminders." },
  { id: "n9",  kind: "review",        app: "Reviews",       title: "Post-job review asks",      body: "A reminder somebody has to remember to send." },
  { id: "n10", kind: "referral",      app: "Referral",      title: "Word-of-mouth referrals",   body: "Neighbor flags the truck; the lead lives in a tech's head." },
  { id: "n11", kind: "estimate",      app: "Estimate sent", title: "Open estimates",            body: "Quote sent, then nothing — until the customer goes cold." },
];

function ArtifactIcon({ kind }: { kind: ArtifactKind }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (kind) {
    case "missed-call":
      return (
        <svg {...common}>
          <path d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 6 6L15 13.5l4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4z" />
          <path d="M15 4l5 5M20 4l-5 5" />
        </svg>
      );
    case "voicemail":
      return (
        <svg {...common}>
          <circle cx="6.5" cy="13.5" r="3" />
          <circle cx="17.5" cy="13.5" r="3" />
          <path d="M6.5 16.5h11" />
        </svg>
      );
    case "sms":
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 1 1-3.2-6.4L21 5l-1 4 1 3z" />
          <path d="M8 11h.01M12 11h.01M16 11h.01" />
        </svg>
      );
    case "form":
      return (
        <svg {...common}>
          <rect x="4" y="3.5" width="16" height="17" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case "google":
      return (
        <svg {...common}>
          <path d="M22 12a10 10 0 1 1-3-7" />
          <path d="M22 4v6h-6" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M16 4h-3a3 3 0 0 0-3 3v3H7v4h3v6h4v-6h3l1-4h-4V7a1 1 0 0 1 1-1h3V4z" />
        </svg>
      );
    case "angi":
      return (
        <svg {...common}>
          <path d="M12 3l9 18H3l9-18z" />
          <path d="M9 17h6" />
        </svg>
      );
    case "past-customer":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case "review":
      return (
        <svg {...common}>
          <path d="M12 4l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-4 5.6-.8L12 4z" />
        </svg>
      );
    case "referral":
      return (
        <svg {...common}>
          <circle cx="7" cy="8" r="3" />
          <circle cx="17" cy="8" r="3" />
          <path d="M2 19a5 5 0 0 1 10 0M12 19a5 5 0 0 1 10 0" />
        </svg>
      );
    case "estimate":
      return (
        <svg {...common}>
          <rect x="4" y="3.5" width="16" height="17" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h3" />
          <path d="M16.5 14.5l2 2 3-3" />
        </svg>
      );
  }
}

export function DisconnectedFlow() {
  return (
    <div className="w-full" role="img" aria-label="The 11 places a lead can land before it reaches your CRM">
      {/* Card grid — visual taxonomy of inbound lead sources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {ARTIFACTS.map((n) => (
          <article
            key={n.id}
            className="relative rounded-lg border border-border bg-card/85 p-3 flex flex-col gap-1.5 shadow-sm overflow-hidden"
          >
            {/* Channel row — icon · channel name */}
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center justify-center size-6 rounded-md shrink-0"
                style={{
                  color: "var(--primary)",
                  background: "color-mix(in srgb, var(--primary) 14%, transparent)",
                }}
              >
                <ArtifactIcon kind={n.kind} />
              </span>
              <span className="text-[10.5px] font-mono uppercase tracking-[0.1em] text-muted-foreground truncate flex-1">
                {n.app}
              </span>
            </div>

            {/* Title */}
            <p className="text-[12.5px] leading-snug text-foreground font-semibold line-clamp-2">
              {n.title}
            </p>

            {/* Body */}
            <p className="text-[11.5px] leading-snug text-muted-foreground line-clamp-2">
              {n.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   CONNECTED — Workflow scene
   ============================================================ */

const CONNECTED_SOURCES = [
  { id: "google", label: "Google Ads",   initials: "G", y: 60 },
  { id: "fb",     label: "Facebook",     initials: "F", y: 110 },
  { id: "phone",  label: "Phone",        initials: "☏", y: 160 },
  { id: "web",    label: "Web form",     initials: "W", y: 210 },
  { id: "angi",   label: "Angi",         initials: "A", y: 260 },
];

const STEPS = [
  { id: "capture",  label: "Lead capture", initials: "1", y: 90 },
  { id: "route",    label: "Route + tag",  initials: "2", y: 160 },
  { id: "schedule", label: "Schedule",     initials: "3", y: 230 },
];

const CRMS = [
  { id: "stitan",   label: "ServiceTitan", initials: "ST", y: 60 },
  { id: "hubspot",  label: "HubSpot",      initials: "Hb", y: 110 },
  { id: "jobber",   label: "Jobber",       initials: "Jo", y: 160 },
  { id: "housecall",label: "Housecall Pro",initials: "Hc", y: 210 },
  { id: "quick",    label: "QuickBooks",   initials: "Qb", y: 260 },
];

const SOURCE_X = 18;
const STEP_X = 280;
const CRM_X = 540;

const S_TO_T: Array<[string, string]> = [
  ["google", "capture"],
  ["fb", "capture"],
  ["phone", "route"],
  ["web", "route"],
  ["angi", "schedule"],
];
const T_TO_C: Array<[string, string]> = [
  ["capture", "stitan"],
  ["capture", "hubspot"],
  ["route", "hubspot"],
  ["route", "jobber"],
  ["schedule", "housecall"],
  ["schedule", "quick"],
];

function findNodeY(arr: Array<{ id: string; y: number }>, id: string) {
  return arr.find((n) => n.id === id)?.y ?? 0;
}

function curvePath(x1: number, y1: number, x2: number, y2: number) {
  const dx = (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export function ConnectedFlow() {
  return (
    <div className="w-full">
      <svg
        viewBox="0 0 700 320"
        className="w-full h-auto"
        role="img"
        aria-label="Sources flowing through workflows into CRMs"
      >
        <defs>
          <pattern
            id="dotgrid-c"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.7" fill="var(--border)" opacity="0.6" />
          </pattern>
          {/*
            userSpaceOnUse — needed because some workflow→CRM lines are
            perfectly horizontal (route→jobber, both at y=160). When a
            <path> has a zero-height bounding box and the gradient uses
            the default objectBoundingBox units, the stroke renders as
            nothing. Switching to userSpaceOnUse anchors the gradient to
            the SVG canvas (280→700px across the workflow→CRM column).
          */}
          <linearGradient
            id="flowStroke"
            gradientUnits="userSpaceOnUse"
            x1="280" y1="0"
            x2="700" y2="0"
          >
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--zeph-success-500)" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="700" height="320" fill="url(#dotgrid-c)" />

        <ColumnLabel x={SOURCE_X} y={24} label="SOURCES IN" />
        <ColumnLabel x={STEP_X} y={24} label="WORKFLOWS" />
        <ColumnLabel x={CRM_X} y={24} label="CRM · OPS" />

        {/* Source → Step */}
        {S_TO_T.map(([sId, tId], i) => {
          const sy = findNodeY(CONNECTED_SOURCES, sId);
          const ty = findNodeY(STEPS, tId);
          const d = curvePath(SOURCE_X + NODE_W, sy, STEP_X, ty);
          return (
            <g key={`s2t-${i}`}>
              <path
                d={d}
                fill="none"
                stroke="var(--primary)"
                strokeOpacity="0.4"
                strokeWidth="1.2"
              />
              <circle r="3" fill="var(--primary)">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                  path={d}
                />
              </circle>
            </g>
          );
        })}

        {/* Step → CRM */}
        {T_TO_C.map(([tId, cId], i) => {
          const sy = findNodeY(STEPS, tId);
          const ty = findNodeY(CRMS, cId);
          const d = curvePath(STEP_X + NODE_W, sy, CRM_X, ty);
          return (
            <g key={`t2c-${i}`}>
              <path
                d={d}
                fill="none"
                stroke="url(#flowStroke)"
                strokeWidth="1.2"
              />
              <circle r="3" fill="var(--zeph-purple-200)">
                <animateMotion
                  dur="3.2s"
                  repeatCount="indefinite"
                  begin={`${1.4 + i * 0.4}s`}
                  path={d}
                />
              </circle>
            </g>
          );
        })}

        {CONNECTED_SOURCES.map((s) => (
          <NodeRect
            key={s.id}
            x={SOURCE_X}
            y={s.y - NODE_H / 2}
            label={s.label}
            initials={s.initials}
            variant="neutral"
          />
        ))}
        {STEPS.map((s) => (
          <NodeRect
            key={s.id}
            x={STEP_X}
            y={s.y - NODE_H / 2}
            label={s.label}
            initials={s.initials}
            variant="primary"
          />
        ))}
        {CRMS.map((s) => (
          <NodeRect
            key={s.id}
            x={CRM_X}
            y={s.y - NODE_H / 2}
            label={s.label}
            initials={s.initials}
            variant="success"
          />
        ))}

        <text
          x="350"
          y="308"
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--zeph-font-mono)"
          fill="var(--muted-foreground)"
          letterSpacing="0.14em"
        >
          ALL 11 SOURCES  ·  3 WORKFLOWS  ·  5 SYSTEMS  ·  EVERY SIGNAL CONNECTED
        </text>
      </svg>
    </div>
  );
}
