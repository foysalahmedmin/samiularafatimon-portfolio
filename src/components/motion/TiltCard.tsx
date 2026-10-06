"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";
import { tilt } from "@/lib/motion/tokens";

type TiltCardProps = { className?: string; children: ReactNode; max?: number };

/** A card that leans toward the pointer in 3D. Fine pointers only; elsewhere it is a plain box. */
export function TiltCard({ className, children, max = tilt.maxDeg }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { ready, reduced, finePointer } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready || reduced || !finePointer) return;
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
      gsap.set(el, { transformPerspective: tilt.perspective, transformStyle: "preserve-3d" });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        ry(px * max * 2);
        rx(-py * max * 2);
        el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
        el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref, dependencies: [ready, reduced, finePointer, max] },
  );

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
