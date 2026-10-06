"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type MagneticProps = {
  /** How far the content follows the pointer, as a fraction of the offset. */
  pull?: number;
  /** Pointer distance (px) from the box edge at which the pull starts. */
  radius?: number;
  className?: string;
  children: ReactNode;
};

/** The child drifts toward the pointer when it is near. Fine pointers only. */
export function Magnetic({ pull = 0.25, radius = 80, className, children }: MagneticProps) {
  const host = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const { ready, reduced, finePointer } = useMotion();

  useGSAP(
    () => {
      const hostEl = host.current;
      const innerEl = inner.current;
      if (!hostEl || !innerEl || !ready || reduced || !finePointer) return;
      const x = gsap.quickTo(innerEl, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(innerEl, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = hostEl.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const near =
          Math.abs(dx) < rect.width / 2 + radius && Math.abs(dy) < rect.height / 2 + radius;
        x(near ? dx * pull : 0);
        y(near ? dy * pull : 0);
      };
      const onLeave = () => {
        x(0);
        y(0);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      hostEl.addEventListener("pointerleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        hostEl.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: host, dependencies: [ready, reduced, finePointer, pull, radius] },
  );

  return (
    <span ref={host} className={cn("inline-flex", className)}>
      <span ref={inner} className="inline-flex will-change-transform">
        {children}
      </span>
    </span>
  );
}
