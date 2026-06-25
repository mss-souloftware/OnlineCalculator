"use client";

import { useEffect } from "react";

/**
 * Broadcasts the embed's natural content height to the host page so it can size
 * the iframe to fit — the real fix for the fixed-height problem (a widget grows
 * taller as fields stack in narrow columns). Always runs; if the host isn't
 * listening the messages are simply ignored. The host opts in by including the
 * tiny listener script from the embed-code generator.
 *
 * Measures `#oc-embed-root` (natural height) rather than the document, whose
 * min-height fills the viewport and would over-report on short calculators.
 */
export function EmbedAutoResize() {
  useEffect(() => {
    const el = document.getElementById("oc-embed-root");
    if (!el) return;

    let last = 0;
    const post = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (height && height !== last) {
        last = height;
        window.parent?.postMessage({ type: "oc-embed-resize", height }, "*");
      }
    };

    post();
    const observer = new ResizeObserver(post);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}
