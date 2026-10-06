"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { SmartLink } from "@/components/ui/Link";
import { cn } from "@/lib/cn";
import type { Link } from "@/lib/content";
import { ScrollTrigger } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";
import { timeline } from "@/lib/motion/tokens";
import { timecode } from "@/lib/timecode";

type Chapter = { id: string; label: string; top: number };

type TimelineBarProps = {
  runtimeSec: number;
  cta: Link;
  labels: { chapters: string; playhead: string };
};

/**
 * The page as an edit: scroll position becomes a timecode, sections become clips, and the
 * playhead is real navigation (drag it, click a clip, or use the arrow keys).
 */
export function TimelineBar({ runtimeSec, cta, labels }: TimelineBarProps) {
  const pathname = usePathname();
  const { ready, lenis } = useMotion();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [maxScroll, setMaxScroll] = useState(1);
  const bar = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const playhead = useRef<HTMLDivElement>(null);
  const clips = useRef<Array<HTMLAnchorElement | null>>([]);
  const activeIndex = useRef(-1);
  const dragging = useRef(false);

  // Measure the chapters (sections with data-chapter) on mount and whenever ScrollTrigger refreshes.
  useEffect(() => {
    if (!ready) return;
    const collect = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const found = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]")).map((el) => {
        const holder = el.closest<HTMLElement>(".pin-spacer") ?? el;
        return {
          id: el.id,
          label: el.dataset.chapter ?? "",
          top: holder.getBoundingClientRect().top + window.scrollY,
        };
      });
      setMaxScroll(max);
      setChapters(found.sort((a, b) => a.top - b.top));
    };
    const frame = requestAnimationFrame(collect);
    ScrollTrigger.addEventListener("refresh", collect);
    return () => {
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener("refresh", collect);
    };
  }, [ready, pathname]);

  const update = useCallback(() => {
    const y = window.scrollY;
    const p = Math.min(1, Math.max(0, y / maxScroll));
    const totalFrames = runtimeSec * timeline.fps;
    if (time.current) time.current.textContent = timecode(Math.round(p * totalFrames));
    if (playhead.current) playhead.current.style.left = `${p * 100}%`;
    if (bar.current) {
      bar.current.dataset.cta = y > window.innerHeight * 0.8 ? "true" : "false";
      const footer = document.querySelector("[data-footer]");
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
      bar.current.dataset.hidden = footerTop < window.innerHeight * 0.92 ? "true" : "false";
    }
    let index = -1;
    chapters.forEach((chapter, i) => {
      if (chapter.top - window.innerHeight * 0.35 <= y) index = i;
    });
    if (index !== activeIndex.current) {
      activeIndex.current = index;
      clips.current.forEach((clip, i) => {
        if (clip) clip.dataset.active = i === index ? "true" : "false";
      });
      playhead.current?.setAttribute("aria-valuetext", `${chapters[index]?.label ?? ""} ${time.current?.textContent ?? ""}`);
    }
  }, [chapters, maxScroll, runtimeSec]);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    lenis?.on("scroll", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      lenis?.off("scroll", update);
    };
  }, [update, lenis]);

  const goTo = useCallback(
    (y: number, immediate = false) => {
      if (lenis) lenis.scrollTo(y, { immediate, duration: Math.min(1.6, Math.max(0.8, Math.abs(y - window.scrollY) / 4000)) });
      else window.scrollTo({ top: y });
    },
    [lenis],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      const y = window.scrollY + 8;
      const target =
        direction === 1
          ? chapters.find((c) => c.top > y + window.innerHeight * 0.2)
          : [...chapters].reverse().find((c) => c.top < y - window.innerHeight * 0.2);
      goTo(target ? target.top : direction === 1 ? maxScroll : 0);
    },
    [chapters, goTo, maxScroll],
  );

  // J / L jump between chapters, like the edit-suite shortcuts, unless the visitor is typing.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      if (event.key === "l" || event.key === "L") step(1);
      if (event.key === "j" || event.key === "J") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const track = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!track) return;
    const p = Math.min(1, Math.max(0, (event.clientX - track.left) / track.width));
    goTo(p * maxScroll, true);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(maxScroll);
    }
  };

  const showChapters = chapters.length >= 3;
  const starts = chapters.map((c) => Math.min(1, c.top / maxScroll));

  return (
    <div
      ref={bar}
      data-cta="false"
      data-hidden="false"
      className={cn(
        "timeline-bar group/bar fixed bottom-4 left-1/2 z-40 w-[min(880px,calc(100vw-24px))] -translate-x-1/2",
        "h-11 rounded-[12px] border border-(color:--bar-line) bg-(color:--bar-bg) backdrop-blur-md",
        "transition-[transform,opacity] duration-(--dur-scene) ease-(--ease-cut)",
        "data-[hidden=true]:pointer-events-none data-[hidden=true]:translate-y-[140%] data-[hidden=true]:opacity-0",
      )}
      style={{ viewTransitionName: "timeline-bar" }}
    >
      <div className="flex h-full items-center gap-3 px-3 md:gap-4 md:px-4">
        <span ref={time} className="w-[11.4ch] shrink-0 font-mono text-[0.78rem] tracking-[0.04em] tabular-nums text-(color:--bar-accent)">
          00:00:00:00
        </span>

        <nav aria-label={labels.chapters} className="relative h-full min-w-0 flex-1">
          {showChapters ? (
            <ol className="absolute inset-y-[9px] inset-x-0 hidden md:block">
              {chapters.map((chapter, i) => {
                const left = starts[i] ?? 0;
                const right = starts[i + 1] ?? 1;
                return (
                  <li key={`${chapter.id}-${i}`} className="absolute inset-y-0" style={{ left: `${left * 100}%`, width: `${Math.max(0, right - left) * 100}%` }}>
                    <SmartLink
                      href={`#${chapter.id}`}
                      ref={(node: HTMLAnchorElement | null) => {
                        clips.current[i] = node;
                      }}
                      data-active="false"
                      title={chapter.label}
                      className="group/clip relative mx-px flex h-full items-center overflow-hidden text-ellipsis rounded-[5px] border border-(color:--bar-line) px-2 font-mono text-[0.62rem] tracking-[0.1em] whitespace-nowrap text-(color:--bar-muted) uppercase transition-colors data-[active=true]:border-(color:--bar-accent) data-[active=true]:text-(color:--bar-accent) hover:text-(color:--bar-fg)"
                    >
                      {chapter.label}
                    </SmartLink>
                  </li>
                );
              })}
            </ol>
          ) : (
            <span className="absolute inset-y-0 inset-x-0 hidden items-center md:flex">
              <span className="h-px w-full bg-(color:--bar-line)" />
            </span>
          )}

          {/* Mobile and few-chapter pages: a plain progress line. */}
          <span className={cn("absolute inset-y-0 inset-x-0 flex items-center", showChapters && "md:hidden", !showChapters && "md:hidden")}>
            <span className="h-px w-full bg-(color:--bar-line)" />
          </span>

          <div
            ref={playhead}
            role="slider"
            tabIndex={0}
            aria-label={labels.playhead}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            data-cursor="drag"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            className="absolute top-0 bottom-0 -ml-3 w-6 cursor-grab touch-none active:cursor-grabbing"
            style={{ left: "0%" }}
          >
            <span className="absolute inset-y-1 left-1/2 w-0.5 -translate-x-1/2 rounded bg-(color:--bar-accent)" />
            <span className="absolute -top-0.5 left-1/2 size-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-(color:--bar-accent)" />
          </div>
        </nav>

        <div className="relative flex h-full w-[7.2rem] shrink-0 items-center justify-end md:w-[9.5rem]">
          <span className="hidden font-mono text-[0.7rem] tracking-[0.08em] text-(color:--bar-muted) uppercase transition-opacity group-data-[cta=true]/bar:opacity-0 md:inline">
            J · L
          </span>
          <SmartLink
            href={cta.href}
            className="absolute right-0 inline-flex h-8 items-center rounded-full bg-(color:--bar-fg) px-4 text-[0.8rem] font-medium whitespace-nowrap text-(color:--bar-bg) opacity-0 transition-opacity group-data-[cta=true]/bar:opacity-100"
            tabIndex={-1}
          >
            {cta.label}
          </SmartLink>
        </div>
      </div>
    </div>
  );
}
