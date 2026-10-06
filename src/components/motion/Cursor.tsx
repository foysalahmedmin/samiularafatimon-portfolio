"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";
import { cursorStore, type CursorKind } from "./cursorStore";

const labels: Record<CursorKind, string> = { default: "", link: "", play: "PLAY", drag: "DRAG", view: "VIEW" };
const sizes: Record<CursorKind, number> = { default: 36, link: 58, play: 76, drag: 76, view: 76 };

/**
 * A dot and a ring that follow fine pointers. The real cursor stays. Elements opt in with
 * data-cursor="link|play|drag|view"; scenes can call cursorStore.set(). Off on touch and reduced motion.
 */
export function Cursor() {
  const { ready, reduced, finePointer } = useMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ready || reduced || !finePointer) return;
    const dotEl = dot.current;
    const ringEl = ring.current;
    const labelEl = label.current;
    if (!dotEl || !ringEl || !labelEl) return;

    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.05, ease: "none" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.05, ease: "none" });
    const ringX = gsap.quickTo(ringEl, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ringEl, "y", { duration: 0.35, ease: "power3.out" });

    const show = () => gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.2 });
    const hide = () => gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.2 });

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      show();
    };
    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest?.("[data-cursor], a, button, summary, [role='button']");
      if (!target) return cursorStore.set("default");
      const declared = target.getAttribute("data-cursor") as CursorKind | null;
      cursorStore.set(declared && declared in labels ? declared : "link");
    };

    const unsubscribe = cursorStore.subscribe((kind) => {
      const size = sizes[kind];
      labelEl.textContent = labels[kind];
      gsap.to(ringEl, {
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        backgroundColor: kind === "default" ? "rgba(31,181,221,0)" : "rgba(31,181,221,0.14)",
        duration: 0.35,
        ease: "glide",
      });
    });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", hide);
    return () => {
      unsubscribe();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", hide);
    };
  }, [ready, reduced, finePointer]);

  if (!ready || reduced || !finePointer) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={ring}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-signal/60 opacity-0"
        style={{ width: 36, height: 36, marginLeft: -18, marginTop: -18 }}
      >
        <span ref={label} className="font-mono text-[10px] tracking-[0.18em] text-signal" />
      </div>
      <div ref={dot} className="fixed top-0 left-0 -mt-1 -ml-1 size-2 rounded-full bg-signal opacity-0" />
    </div>
  );
}
