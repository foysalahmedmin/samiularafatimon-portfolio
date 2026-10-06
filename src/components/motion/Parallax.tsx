"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";
import { parallax, type ParallaxSpeed } from "@/lib/motion/tokens";

type ParallaxProps = {
  speed?: ParallaxSpeed;
  /** How the box is positioned. Use "absolute" to fill a positioned parent (add inset-0). */
  position?: "relative" | "absolute";
  /** Clip the moving layer to the box (images). Turn off for loose type. */
  clip?: boolean;
  className?: string;
  layerClassName?: string;
  children: ReactNode;
};

/**
 * One parallax primitive, three speeds. The layer is taller than the box by `speed` on both
 * sides and drifts from -travel to +travel while the box crosses the viewport, so edges never show.
 */
export function Parallax({
  speed = "medium",
  position = "relative",
  clip = true,
  className,
  layerClassName,
  children,
}: ParallaxProps) {
  const host = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();
  const factor = parallax[speed];

  useGSAP(
    () => {
      const hostEl = host.current;
      const layerEl = layer.current;
      if (!hostEl || !layerEl || !ready || reduced) return;

      const mm = gsap.matchMedia();
      const drift = (scale: number) => {
        const travel = () => hostEl.offsetHeight * factor * scale;
        gsap.fromTo(
          layerEl,
          { y: () => -travel() },
          {
            y: () => travel(),
            ease: "none",
            scrollTrigger: {
              trigger: hostEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      };
      mm.add("(min-width: 768px)", () => drift(1));
      mm.add("(max-width: 767px)", () => drift(0.5));
      return () => mm.revert();
    },
    { scope: host, dependencies: [ready, reduced, factor] },
  );

  return (
    <div ref={host} className={cn(position, clip && "overflow-hidden", className)}>
      <div
        ref={layer}
        className={cn("absolute inset-x-0 will-change-transform", layerClassName)}
        style={{ top: `-${factor * 100}%`, bottom: `-${factor * 100}%` }}
      >
        {children}
      </div>
    </div>
  );
}
