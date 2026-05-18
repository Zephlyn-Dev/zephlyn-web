"use client";

/**
 * PageTransition — wraps each route's body content in a React 19
 * <ViewTransition> tied to Next 16's experimental viewTransition flag.
 *
 * Direction is driven by the `transitionTypes` prop on the Link / router
 * call that triggered the navigation: `nav-forward` slides old content
 * left and reveals new content from the right; `nav-back` does the
 * reverse. Initial loads and untyped navigations don't animate.
 *
 * The keyframes live in `app/globals.css` § View Transitions, and the
 * site header is anchored separately via `viewTransitionName:
 * "site-header"` so it never slides — that fixed reference makes the
 * directional motion read as "the content moved", not "everything did".
 */

import * as React from "react";
import { ViewTransition } from "react";

type Props = { children: React.ReactNode };

export function PageTransition({ children }: Props) {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
