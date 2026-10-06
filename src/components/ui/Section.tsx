"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type SectionProps = {
  /** dark = footage, light = reading. The tone is set here, never per page. */
  tone: "dark" | "light";
  /** Name shown as a clip on the timeline bar. */
  chapter?: string;
  id?: string;
  /** The first section of a page has no overlap with a section above it. */
  first?: boolean;
  /**
   * Let the content lag behind as the next section slides up over it (desktop).
   * Turn off for sections that contain a pinned scene: a transform on an ancestor breaks pinning.
   */
  exitParallax?: boolean;
  /** Standard vertical padding. Turn off for full-bleed scenes that pad themselves. */
  padded?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

/**
 * A page section. Each one is a "sheet": it slides up over the previous section with rounded
 * top corners, and flips the room between dark and light. Components inside read --tone-* only.
 */
export function Section({
  tone,
  chapter,
  id,
  first = false,
  exitParallax = true,
  padded = true,
  className,
  innerClassName,
  children,
}: SectionProps) {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const rootEl = root.current;
      const innerEl = inner.current;
      if (!rootEl || !innerEl || !exitParallax || !ready || reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          innerEl,
          { y: 0 },
          {
            y: () => window.innerHeight * 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: rootEl,
              start: "bottom bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready, reduced, exitParallax] },
  );

  return (
    <section
      ref={root}
      id={id}
      data-tone={tone}
      data-chapter={chapter}
      className={cn(
        "relative bg-(color:--tone-bg) text-(color:--tone-fg)",
        !first && "-mt-(--sheet-r) rounded-t-(--sheet-r)",
        padded && (first ? "pt-(--section-y)" : "pt-[calc(var(--section-y)+var(--sheet-r))]"),
        padded && "pb-(--section-y)",
        className,
      )}
    >
      <div ref={inner} className={cn("relative", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
