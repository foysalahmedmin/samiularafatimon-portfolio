"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ResolvedImage } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type FormatMorphProps = { image: ResolvedImage; start: "9:16" | "16:9" };

const SHAPES = {
  "9:16": { width: "33%", height: "100%" },
  "16:9": { width: "100%", height: "56%" },
} as const;

/**
 * A frame that re-frames itself between vertical (9:16) and horizontal (16:9) on a loop: the
 * brand's width-axis idea, drawn as a picture. Still when motion is reduced.
 */
export function FormatMorph({ image, start }: FormatMorphProps) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const { ready, reduced } = useMotion();
  const other = start === "9:16" ? "16:9" : "9:16";

  useGSAP(
    () => {
      const el = frame.current;
      if (!el || !ready || reduced) return;
      gsap.set(el, { xPercent: -50, yPercent: -50, ...SHAPES[start] });
      const tl = gsap.timeline({ repeat: -1, defaults: { duration: 1.1, ease: "cut" } });
      tl.to({}, { duration: 1.6 })
        .call(() => {
          if (label.current) label.current.textContent = other;
        })
        .to(el, SHAPES[other])
        .to({}, { duration: 1.6 })
        .call(() => {
          if (label.current) label.current.textContent = start;
        })
        .to(el, SHAPES[start]);
    },
    { scope: root, dependencies: [ready, reduced, start, other] },
  );

  return (
    <div ref={root} aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[28rem]">
      <div
        ref={frame}
        className="absolute top-1/2 left-1/2 overflow-hidden rounded-xl border border-(color:--tone-line) bg-(color:--tone-surface) shadow-2xl"
        style={{ ...SHAPES[start], transform: "translate(-50%, -50%)" }}
      >
        <Image src={image.src} alt="" fill sizes="448px" placeholder="blur" blurDataURL={image.blurDataURL} className="object-cover" />
      </div>
      <span ref={label} className="absolute bottom-0 left-0 font-mono text-xs tracking-[0.18em] text-(color:--tone-accent)">
        {start}
      </span>
    </div>
  );
}
