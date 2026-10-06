"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type CountUpProps = { value: number; suffix?: string; className?: string };

/** Renders the final number in the HTML, and counts up to it when it scrolls into view. */
export function CountUp({ value, suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready || reduced) return;
      const state = { n: 0 };
      el.textContent = `0${suffix}`;
      gsap.to(state, {
        n: value,
        duration: 1.4,
        ease: "glide",
        snap: { n: 1 },
        onUpdate: () => {
          el.textContent = `${state.n}${suffix}`;
        },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref, dependencies: [ready, reduced, value, suffix] },
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value}
      {suffix}
    </span>
  );
}
