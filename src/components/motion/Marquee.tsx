"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type MarqueeProps = {
  items: string[];
  /** Base speed in pixels per second. */
  speed?: number;
  className?: string;
  itemClassName?: string;
};

/**
 * Endless row of words. It speeds up with scroll velocity and turns around when you scroll back up.
 * Decorative: screen readers get a plain list instead.
 */
export function Marquee({ items, speed = 60, className, itemClassName }: MarqueeProps) {
  const track = useRef<HTMLDivElement>(null);
  const { ready, reduced, lenis } = useMotion();

  useGSAP(
    () => {
      const el = track.current;
      if (!el || !ready || reduced) return;

      let x = 0;
      let direction = 1;
      let target = 1;
      let visible = true;
      let loop = el.scrollWidth / 2;
      const measure = () => {
        loop = el.scrollWidth / 2;
      };

      const tick = (_time: number, deltaMs: number) => {
        if (!visible || loop === 0) return;
        const velocity = lenis?.velocity ?? 0;
        if (Math.abs(velocity) > 0.5) target = velocity < 0 ? -1 : 1;
        direction += (target - direction) * 0.08;
        const boost = 1 + Math.min(Math.abs(velocity) / 20, 2.5);
        x -= speed * (deltaMs / 1000) * direction * boost;
        if (x <= -loop) x += loop;
        if (x > 0) x -= loop;
        el.style.transform = `translate3d(${x}px,0,0)`;
      };

      gsap.ticker.add(tick);
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true;
      });
      observer.observe(el);
      window.addEventListener("resize", measure);
      return () => {
        gsap.ticker.remove(tick);
        observer.disconnect();
        window.removeEventListener("resize", measure);
        el.style.transform = "";
      };
    },
    { scope: track, dependencies: [ready, reduced, lenis, speed] },
  );

  const row = (copy: number) =>
    items.map((item) => (
      <span key={`${copy}-${item}`} className={cn("shrink-0 whitespace-nowrap", itemClassName)}>
        {item}
      </span>
    ));

  return (
    <div className={cn("overflow-hidden", className)}>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div ref={track} aria-hidden="true" className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center gap-[var(--marquee-gap,3rem)] pr-[var(--marquee-gap,3rem)]">
          {row(0)}
        </div>
        <div className="flex shrink-0 items-center gap-[var(--marquee-gap,3rem)] pr-[var(--marquee-gap,3rem)]">
          {row(1)}
        </div>
      </div>
    </div>
  );
}
