"use client";

import { useEffect } from "react";
import { useMotion } from "@/lib/motion/MotionProvider";

/**
 * Keeps <html data-header-tone> and <html data-bar-tone> in sync with the section that is
 * currently under the header and under the timeline bar, so the chrome re-colours itself
 * as the room goes dark and light.
 */
export function ChromeTone() {
  const { ready, lenis } = useMotion();

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    let frame = 0;

    const toneAt = (y: number): string => {
      const stack = document.elementsFromPoint(window.innerWidth / 2, y);
      const section = stack.find((el) => el.hasAttribute("data-tone"));
      return section?.getAttribute("data-tone") ?? "dark";
    };
    const update = () => {
      frame = 0;
      const header = toneAt(36);
      const bar = toneAt(window.innerHeight - 36);
      if (root.dataset.headerTone !== header) root.dataset.headerTone = header;
      if (root.dataset.barTone !== bar) root.dataset.barTone = bar;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    lenis?.on("scroll", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      lenis?.off("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ready, lenis]);

  return null;
}
