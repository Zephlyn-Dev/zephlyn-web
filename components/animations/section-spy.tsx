"use client";

/**
 * SectionSpy — sets `data-active` on header nav anchors that point to the
 * section currently most-in-view.
 *
 * Uses a single IntersectionObserver across the tracked section ids.
 * The observer fires when sections cross a horizontal band centred 30 %
 * down the viewport, so the "active" section is what the reader is
 * actually reading, not just what touched the edge.
 *
 * The CSS `[data-active="true"]` rule (globals.css §6.9) handles the
 * visual — colour + underline reveal — so this component is just a
 * stateless wiring layer.
 */

import * as React from "react";

type Props = {
  /** Section ids to spy on, in DOM order. */
  sectionIds: string[];
  /** Selector for the nav-link elements (each one's href is matched
   *  against `#${id}` to decide which to mark active). */
  linkSelector?: string;
};

export function SectionSpy({
  sectionIds,
  linkSelector = "[data-section-spy] a",
}: Props) {
  React.useEffect(() => {
    if (!sectionIds.length) return;

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(linkSelector)
    );
    if (!links.length) return;

    // Cache the link for each id once, so the observer callback is just
    // a hash lookup, not a querySelectorAll per fire.
    const linkById = new Map<string, HTMLAnchorElement>();
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("#")) linkById.set(href.slice(1), link);
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    let activeId: string | null = null;
    const setActive = (id: string | null) => {
      if (id === activeId) return;
      activeId = id;
      for (const [sid, link] of linkById) {
        link.dataset.active = sid === id ? "true" : "false";
      }
    };

    // rootMargin shifts the intersection band: ignore the top 25 % and
    // the bottom 60 % of the viewport, so a section is "in view" when
    // its content sits in the middle / upper-middle reading area.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0% -60% 0%",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sectionIds, linkSelector]);

  return null;
}
