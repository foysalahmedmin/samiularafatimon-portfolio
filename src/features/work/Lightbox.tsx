"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Close, Play } from "@/components/ui/Icons";
import { Glyph } from "@/components/ui/Glyph";
import type { ResolvedWorkItem, WorkCategory } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion, useScrollLock } from "@/lib/motion/MotionProvider";

type LightboxProps = {
  item: ResolvedWorkItem;
  category: WorkCategory | undefined;
  labels: { close: string; previous: string; next: string; play: string; videoUnavailable: string; openOriginal: string };
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
};

/**
 * The house lights go down: the page dims, the player opens as a match cut from the card.
 * YouTube loads only after you press play (no third-party requests before that).
 */
export function Lightbox({ item, category, labels, onClose, onStep }: LightboxProps) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const { reduced } = useMotion();
  const media = item.media;

  useScrollLock(true);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(root.current, { opacity: 0, duration: 0.35, ease: "none" });
      gsap.from(frame.current, { clipPath: "inset(0 0 100% 0)", scale: 0.94, duration: 0.6, ease: "cut" });
    },
    { scope: root },
  );

  // Focus trap, Escape, arrow keys.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = () => Array.from(el.querySelectorAll<HTMLElement>("button, a[href], iframe, video")).filter((n) => n.offsetParent !== null);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose();
      if (event.key === "ArrowRight") return onStep(1);
      if (event.key === "ArrowLeft") return onStep(-1);
      if (event.key !== "Tab") return;
      const nodes = focusable();
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [onClose, onStep]);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      data-lenis-prevent
      className="fixed inset-0 z-[80] flex flex-col bg-[rgb(3_8_12/0.94)] px-[var(--gutter)] py-6 text-(color:--c-bone) backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between pb-4">
        <span className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-(color:--c-mist) uppercase">
          {category ? <Glyph kind={category.glyph} className="size-5 text-(color:--c-signal)" /> : null}
          {category?.label}
          {item.client ? <span>· {item.client}</span> : null}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="grid size-11 place-items-center rounded-full border border-white/20 transition-colors hover:border-(color:--c-signal)"
        >
          <Close />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center gap-5">
        <div
          ref={frame}
          className="relative w-full overflow-hidden rounded-(--radius-lg) border border-white/10 bg-black"
          style={{ aspectRatio: media.aspect.replace(":", " / "), maxHeight: "72vh" }}
        >
          {started && media.kind === "youtube" ? (
            <iframe
              src={`${media.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={item.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : started && media.kind === "video" ? (
            <video
              src={media.src}
              poster={media.poster.src}
              controls
              autoPlay
              playsInline
              onError={() => setFailed(true)}
              className="absolute inset-0 size-full object-contain"
            />
          ) : (
            <>
              <Image
                src={(media.kind === "youtube" ? media.thumbnail : media.poster).src}
                alt=""
                fill
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setStarted(true)}
                aria-label={`${labels.play}: ${item.title}`}
                className="group absolute inset-0 grid place-items-center bg-black/30"
              >
                <span className="grid size-20 place-items-center rounded-full bg-(color:--c-bone) text-(color:--c-ink) transition-transform duration-(--dur-ui) ease-(--ease-glide) group-hover:scale-110 md:size-24">
                  <Play size={28} />
                </span>
              </button>
            </>
          )}
          {failed ? (
            <p role="alert" className="absolute inset-x-0 bottom-0 bg-black/85 p-4 text-center text-sm">
              {labels.videoUnavailable}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="reframe text-[clamp(1.3rem,2.4vw,2rem)] font-bold" style={{ "--wdth": 104 } as CSSProperties}>
            {item.title}
          </h2>
          <div className="flex items-center gap-3">
            {media.kind === "youtube" ? (
              <a href={media.watchUrl} target="_blank" rel="noopener noreferrer" className="u-link text-sm text-(color:--c-signal)">
                {labels.openOriginal}
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label={labels.previous}
              className="grid size-11 place-items-center rounded-full border border-white/20 transition-colors hover:border-(color:--c-signal)"
            >
              <ArrowRight className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label={labels.next}
              className="grid size-11 place-items-center rounded-full border border-white/20 transition-colors hover:border-(color:--c-signal)"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
