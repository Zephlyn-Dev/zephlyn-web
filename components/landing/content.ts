/**
 * Landing copy — single source of truth.
 *
 * All strings are clean literals: no space before any comma or period (the
 * mockup rendered artifacts like "business ," — fixed here). The contact
 * email is the shared founder inbox and the only address on public surfaces.
 */

export const CONTACT_EMAIL = "social@zephlyn.io";

export const HERO = {
  eyebrow: "Productized automation for small business",
  headline: "Your business, finally running itself.",
  subhead:
    "For small businesses still running on memory, sticky notes, and missed calls. Zephlyn connects your scattered tools and tasks into one flow that runs without you.",
  primaryCta: "Get in touch",
  secondaryCta: "See how it works",
};

export const SCATTER = {
  eyebrow: "The scatter",
  headline: "Right now, it all lives in your head.",
  lead: "Nothing's connected. Every task is a loose thread you have to hold onto yourself — and the moment you get busy, threads start slipping.",
  cards: [
    {
      title: "Bookings in a notebook",
      body: "Appointments written down, double-booked, or forgotten between the page and the calendar.",
    },
    {
      title: "Calls to voicemail",
      body: "You're on the job, the phone rings, nobody answers — and the lead quietly goes somewhere else.",
    },
    {
      title: "Inventory by hand",
      body: "Counted on a clipboard once in a while, never quite current, always a guess when it matters.",
    },
    {
      title: "The system is you",
      body: "The whole operation runs on what you remember. If you stop, it stops. That doesn't scale.",
    },
  ],
};

export const SERVICES = {
  eyebrow: "What we build",
  headline: "Three systems. One connected flow.",
  lead: "Three equal pillars. On their own, useful. Connected, they become the thing your business never had — a system that runs without you holding it together.",
  cards: [
    {
      no: "01",
      title: "Booking & scheduling",
      body: "Automated booking, confirmations, and reminders. No more back-and-forth, no more no-shows slipping through.",
      points: [
        "Online booking that fills your calendar",
        "Automatic confirmations and reminders",
        "Fewer gaps, fewer no-shows",
      ],
    },
    {
      no: "02",
      title: "Call & email response",
      body: "Automated responses so nothing goes unanswered when you're busy working. Every lead gets a reply.",
      points: [
        "Instant replies while you're on the job",
        "Every lead gets a response",
        "Messages triaged, not missed",
      ],
    },
    {
      no: "03",
      title: "Inventory & insights",
      body: "Live inventory tracking, workflow automation, dashboards, and metrics. See what's happening and where to optimize.",
      points: [
        "Real-time inventory counts",
        "Workflow automation behind the scenes",
        "One dashboard for what matters",
      ],
    },
  ],
};

export const CONNECTION = {
  eyebrow: "The connection",
  headline: "We connect what you already do into one flow.",
  lead: "You don't throw anything out. We connect the tools you already use, draw the lines between your scattered tasks, and hand you back a system that runs itself.",
  steps: [
    {
      no: "Step 01",
      title: "We map how you work",
      body: "We sit with how your business actually runs today — every task, every tool, every gap.",
    },
    {
      no: "Step 02",
      title: "We connect the dots",
      body: "We link the tools you already use and automate the manual steps in between them.",
    },
    {
      no: "Step 03",
      title: "It runs itself",
      body: "The flow runs in the background. You watch the dashboard instead of holding it all in your head.",
    },
  ],
};

export const HONESTY = {
  eyebrow: "Honesty",
  headline: "Let's be honest about fit.",
  lead: "We'd rather tell you the truth than win the wrong customer. Here's who we're built for — and who we're not.",
  forYou: {
    title: "This is for you if…",
    items: [
      "You have no systems yet — everything is manual and in your head.",
      "You're an owner drowning in manual admin instead of doing the work you're good at.",
      "You're losing leads to missed calls and slow replies.",
    ],
  },
  notYet: {
    title: "Probably not yet if…",
    items: [
      "You're already fully automated — you don't need us to start from scratch.",
      "You want a cheap, self-serve app to configure yourself.",
      "You'd rather build it in-house. Zephlyn is done-for-you, start to finish.",
    ],
  },
};

export const FAQ = {
  eyebrow: "Questions",
  headline: "The things you're wondering.",
  items: [
    {
      q: "How long does setup take?",
      a: "Most setups run two to four weeks. We map your workflow, connect your tools, and test everything before it goes live — and you keep working the whole time.",
    },
    {
      q: "Do I have to switch the tools I use?",
      a: "No. We connect the tools you already use wherever we can, and only suggest a change when something is actively holding you back. The goal is to build on what you have, not replace it.",
    },
    {
      q: "What if I'm not technical?",
      a: "That's exactly the point. Zephlyn is done-for-you — you don't configure anything. We build the system, you use it. If you can run your business, you can use what we hand you.",
    },
    {
      q: "What does it cost?",
      a: "It depends on how much we're connecting. We scope it with you up front, in plain numbers, before any work starts. No surprise pricing, no long lock-in.",
    },
    {
      q: "Is this a product or a service?",
      a: "A service that leaves you with a system. We build and maintain the automation; you own the workflow it runs. Think of us as the team that finally sets up the systems you never had time to.",
    },
    {
      q: "What if something breaks?",
      a: "We monitor what we build and fix issues fast. You're not handed a tool and left alone — we stay on it, because the whole promise is a system you can stop thinking about.",
    },
  ],
};

export const CTA = {
  headline: "Let's connect the dots.",
  subhead:
    "You bring the scattered pieces. We'll turn them into one system that runs itself.",
  primaryCta: "Get in touch",
  founders:
    "Two founders. Pre-revenue. Building this with our first customers — and we'd love for you to be one.",
};

export const FOOTER = {
  links: [
    { label: "The problem", href: "#problem" },
    { label: "Services", href: "#services" },
    { label: "How it works", href: "#how" },
    { label: "FAQ", href: "#faq" },
  ],
  copyright: "© 2026 Zephlyn. We give small businesses systems.",
};
