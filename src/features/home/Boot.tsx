"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { timecode } from "@/lib/timecode";

/**
 * The opening sequence: a timecode counts up while the name reframes from 9:16 to 16:9, then the
 * screen wipes away. Home only, first visit of a session, skippable. It is plain DOM in the
 * server HTML, and a CSS failsafe (globals.css) releases the page after four seconds if scripting fails.
 */
export function Boot({ name }: { name: string }) {
  const root = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const title = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (document.documentElement.classList.contains("boot-skip")) {
        el.style.display = "none";
        return;
      }
      try {
        sessionStorage.setItem("imon-boot", "1");
      } catch {
        /* private mode: the sequence simply plays again next time */
      }

      const counter = { frame: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onComplete: () => {
          el.style.display = "none";
        },
      });
      tl.to(counter, {
        frame: 47,
        duration: 0.95,
        snap: { frame: 1 },
        ease: "power2.in",
        onUpdate: () => {
          if (time.current) time.current.textContent = timecode(counter.frame);
        },
      })
        .fromTo(title.current, { "--wdth": 62, opacity: 0.2 }, { "--wdth": 125, opacity: 1, duration: 0.95, ease: "cut" }, 0)
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.45, ease: "cut" }, 1.0);

      const skip = () => tl.timeScale(5);
      window.addEventListener("pointerdown", skip, { once: true });
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("wheel", skip, { once: true, passive: true });
      return () => {
        window.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("wheel", skip);
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="boot-overlay fixed inset-0 z-[100] flex flex-col justify-between bg-(color:--c-ink) p-(--gutter) text-(color:--c-bone) [clip-path:inset(0)]"
    >
      <span className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase">
        <span className="rec-pulse relative size-2 rounded-full bg-rec" />
        REC
      </span>
      <p
        ref={title}
        className="reframe text-center text-[clamp(2rem,7vw,6.5rem)] leading-none font-extrabold"
        style={{ "--wdth": 62 } as CSSProperties}
      >
        {name}
      </p>
      <span ref={time} className="font-mono text-sm tracking-[0.06em] text-(color:--c-signal) tabular-nums">
        00:00:00:00
      </span>
    </div>
  );
}
