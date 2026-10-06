"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap, SplitText, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";
import { dist, dur, stagger } from "@/lib/motion/tokens";

export type RevealType = "mask" | "wipe" | "rise" | "fade";

/** Elements a reveal can wrap. Typed as one tag for JSX; any of these works at runtime. */
type RevealTag = "div" | "p" | "span" | "ul" | "ol" | "li" | "dl" | "section" | "h1" | "h2" | "h3" | "h4" | "blockquote" | "figure" | "nav";

type RevealProps = {
  as?: RevealTag;
  type?: RevealType;
  /** Seconds to wait once triggered. */
  delay?: number;
  /** ScrollTrigger start. Default: when the top reaches 88% of the viewport. */
  start?: string;
  /** Animate the direct children one after another instead of the element itself. */
  stagger?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
};

/**
 * The four reveals: mask (headlines), wipe (images and video), rise (text and cards), fade (small meta).
 * Content is visible without JS; below-the-fold copies are hidden by CSS only while the motion engine runs
 * (see globals.css), and reduced motion never hides anything.
 */
export function Reveal({
  as = "div",
  type = "rise",
  delay = 0,
  start = "top 88%",
  stagger: staggerChildren = false,
  className,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready || reduced) return;
      const trigger = { trigger: el, start, once: true } as const;

      if (type === "mask") {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { opacity: 1 });
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: dur.reveal + 0.1,
              ease: "glide",
              stagger: stagger.lines,
              delay,
              scrollTrigger: trigger,
            });
          },
        });
        return;
      }

      if (type === "wipe") {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)", opacity: 1 },
          { clipPath: "inset(0 0 0% 0)", duration: 1, ease: "cut", delay, scrollTrigger: trigger },
        );
        const media = el.querySelector("[data-reveal-media]");
        if (media) {
          gsap.fromTo(media, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: "glide", delay, scrollTrigger: trigger });
        }
        return;
      }

      if (type === "fade") {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, delay, scrollTrigger: trigger });
        return;
      }

      // rise
      if (staggerChildren) {
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          el.children,
          { y: dist.rise, opacity: 0 },
          { y: 0, opacity: 1, duration: dur.reveal, ease: "glide", delay, stagger: stagger.items, scrollTrigger: trigger },
        );
      } else {
        gsap.fromTo(
          el,
          { y: dist.rise, opacity: 0 },
          { y: 0, opacity: 1, duration: dur.reveal, ease: "glide", delay, scrollTrigger: trigger },
        );
      }
    },
    { scope: ref, dependencies: [ready, reduced, type, delay, start, staggerChildren] },
  );

  const Tag = as as "div";
  return (
    <Tag ref={ref} data-reveal={type} className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}
