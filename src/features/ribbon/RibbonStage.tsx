"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { ResolvedImage } from "@/lib/content";
import { useMotion } from "@/lib/motion/MotionProvider";
import { routes } from "@/lib/routes";
import type { RibbonFrame } from "./FilmRibbon";
import { RibbonCss } from "./RibbonCss";

// The WebGL scene is a separate chunk that only loads when the visitor can run it.
const FilmRibbon = dynamic(() => import("./FilmRibbon"), { ssr: false });

type RibbonStageProps = { frames: ResolvedImage[]; className?: string };

/** Chooses the right version of the ribbon: WebGL (tier A), CSS 3D (B) or a still composition (C). */
export function RibbonStage({ frames, className }: RibbonStageProps) {
  const { ready, tier } = useMotion();
  const router = useRouter();
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [downgraded, setDowngraded] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? true), {
      rootMargin: "120px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ribbonFrames: RibbonFrame[] = frames.map((frame) => ({
    src: frame.src,
    width: frame.width,
    height: frame.height,
    label: frame.alt,
  }));
  const effective = downgraded && tier === "a" ? "b" : tier;

  return (
    <div ref={host} aria-hidden="true" className={cn("pointer-events-auto", className)}>
      {!ready ? null : effective === "a" ? (
        <FilmRibbon
          frames={ribbonFrames}
          active={visible}
          onSelect={() => router.push(routes.work)}
          onFallback={() => setDowngraded(true)}
        />
      ) : (
        <RibbonCss frames={ribbonFrames} animated={effective === "b"} />
      )}
    </div>
  );
}
