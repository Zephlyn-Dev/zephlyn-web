"use client";

/**
 * Page scroll progress (0..1) as a ref, so the render loop can read it every
 * frame without triggering React re-renders. The camera smooths/eases this
 * value itself; reveal logic reads it raw.
 */

import * as React from "react";

export function useScrollProgress() {
  const ref = React.useRef(0);
  React.useEffect(() => {
    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      ref.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return ref;
}
