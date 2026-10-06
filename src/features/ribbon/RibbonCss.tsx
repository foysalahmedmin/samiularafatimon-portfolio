"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { ribbonStore } from "./ribbonStore";
import type { RibbonFrame } from "./FilmRibbon";

type RibbonCssProps = {
  frames: RibbonFrame[];
  /** Tier B moves; tier C is a still composition. */
  animated: boolean;
  className?: string;
};

const SHOWN = 8;

/**
 * The same ribbon without WebGL: frames on a ring, tilted by the pointer, unrolling into a row
 * as the hero scrolls. Plain CSS 3D, so it is cheap on phones and fine without motion.
 */
export function RibbonCss({ frames, animated, className }: RibbonCssProps) {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const shown = frames.slice(0, SHOWN);

  useGSAP(
    () => {
      const rootEl = root.current;
      const ringEl = ring.current;
      if (!rootEl || !ringEl || !animated) return;

      const rotY = gsap.quickTo(ringEl, "rotationY", { duration: 0.8, ease: "power3.out" });
      const rotX = gsap.quickTo(ringEl, "rotationX", { duration: 0.8, ease: "power3.out" });
      const onMove = (event: PointerEvent) => {
        const rect = rootEl.getBoundingClientRect();
        rotY(((event.clientX - rect.left) / rect.width - 0.5) * 24);
        rotX(-((event.clientY - rect.top) / rect.height - 0.5) * 12);
      };
      rootEl.addEventListener("pointermove", onMove);

      const tick = () => {
        const u = Math.min(1, Math.max(0, (ribbonStore.progress - 0.38) / 0.6));
        rootEl.style.setProperty("--u", u.toFixed(3));
      };
      gsap.ticker.add(tick);
      return () => {
        rootEl.removeEventListener("pointermove", onMove);
        gsap.ticker.remove(tick);
      };
    },
    { scope: root, dependencies: [animated] },
  );

  return (
    <div
      ref={root}
      className={cn("relative size-full [perspective:1400px]", className)}
      style={{ "--u": 0, "--n": shown.length } as CSSProperties}
    >
      <div
        ref={ring}
        className="absolute top-1/2 left-1/2 size-0 [transform-style:preserve-3d]"
        style={{ transform: "translate3d(18vw, -4vh, 0) rotateX(-8deg) rotateY(-24deg)" }}
      >
        {shown.map((frame, i) => (
          <div
            key={`${frame.src}-${i}`}
            className="absolute overflow-hidden rounded-[4px] border border-white/10 bg-ink shadow-2xl"
            style={
              {
                "--i": i,
                width: "clamp(150px, 17vw, 260px)",
                aspectRatio: "16 / 9",
                marginLeft: "calc(clamp(150px, 17vw, 260px) / -2)",
                marginTop: "calc(clamp(150px, 17vw, 260px) * 9 / 16 / -2)",
                transform: [
                  "rotateY(calc((1 - var(--u)) * (var(--i) / var(--n)) * 360deg))",
                  "translateZ(calc((1 - var(--u)) * clamp(180px, 22vw, 340px)))",
                  "translateY(calc((1 - var(--u)) * (var(--i) - 3.5) * 22px))",
                  "translateX(calc(var(--u) * (var(--i) - 3.5) * clamp(160px, 18vw, 270px)))",
                ].join(" "),
                backfaceVisibility: "hidden",
              } as CSSProperties
            }
          >
            <Image src={frame.src} alt="" fill sizes="280px" className="object-cover" priority={i < 3} />
            <span className="absolute inset-x-0 top-0 h-1.5 bg-[repeating-linear-gradient(90deg,#02060a_0_8px,transparent_8px_16px)] opacity-80" />
            <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[repeating-linear-gradient(90deg,#02060a_0_8px,transparent_8px_16px)] opacity-80" />
          </div>
        ))}
      </div>
    </div>
  );
}
