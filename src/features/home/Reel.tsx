"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Play } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import type { ResolvedVideo } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";
import { timecode } from "@/lib/timecode";

type ReelProps = {
  head: { kicker: string; title: string; lede?: string | undefined };
  video: ResolvedVideo;
  caption: string;
  labels: { play: string; videoUnavailable: string };
};

function CropMarks() {
  const corner = "absolute size-5 border-(color:--c-bone)/70";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-4 md:inset-6">
      <span className={`${corner} top-0 left-0 border-t border-l`} />
      <span className={`${corner} top-0 right-0 border-t border-r`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} right-0 bottom-0 border-r border-b`} />
    </div>
  );
}

/** The reel: a monitor that grows into the frame as it arrives, with a silent loop until it is played. */
export function Reel({ head, video, caption, labels }: ReelProps) {
  const monitor = useRef<HTMLDivElement>(null);
  const loop = useRef<HTMLVideoElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const el = monitor.current;
      if (!el || !ready || reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          el,
          { scale: 0.86, borderRadius: 48 },
          {
            scale: 1,
            borderRadius: 24,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 96%", end: "center 58%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: monitor, dependencies: [ready, reduced] },
  );

  // The silent loop only runs while it is on screen.
  useEffect(() => {
    const el = loop.current;
    if (!el || reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void el.play().catch(() => undefined);
      else el.pause();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, playing]);

  // The timecode in the corner follows whatever is playing.
  useEffect(() => {
    const el = playing ? monitor.current?.querySelector("video") : loop.current;
    if (!el) return;
    let frame = 0;
    const tick = () => {
      if (clock.current) clock.current.textContent = timecode(Math.floor(el.currentTime * 24));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  return (
    <Section tone="dark" chapter="Reel" id="reel">
      <Container>
        <SectionHead head={head} withCta={false} />
      </Container>
      <div className="mx-auto mt-14 w-full max-w-(--container) px-(--gutter)">
        <div
          ref={monitor}
          data-cursor={playing ? "default" : "play"}
          className="relative aspect-video overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line) bg-black will-change-transform"
        >
          {playing ? (
            <video
              src={video.src}
              poster={video.poster.src}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 size-full object-contain"
              onError={() => setFailed(true)}
            />
          ) : (
            <>
              {video.preview && !reduced ? (
                <video
                  ref={loop}
                  src={video.preview}
                  poster={video.poster.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <Image
                  src={video.poster.src}
                  alt={video.poster.alt}
                  fill
                  sizes="(min-width: 1360px) 1360px, 100vw"
                  placeholder="blur"
                  blurDataURL={video.poster.blurDataURL}
                  className="object-cover"
                />
              )}
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,13,20,0.1),rgba(5,13,20,0.55))]" />
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`${labels.play}: ${video.title}`}
                className="group absolute inset-0 grid place-items-center"
              >
                <span className="grid size-20 place-items-center rounded-full bg-(color:--c-bone) text-(color:--c-ink) transition-transform duration-(--dur-ui) ease-(--ease-glide) group-hover:scale-110 md:size-28">
                  <Play size={30} />
                </span>
              </button>
              <CropMarks />
              <div className="pointer-events-none absolute top-6 left-6 flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.16em] text-(color:--c-bone) uppercase md:top-9 md:left-9">
                <span className="rec-pulse relative size-2 rounded-full bg-rec" /> REC
              </div>
              <span
                ref={clock}
                className="pointer-events-none absolute top-6 right-6 font-mono text-[0.78rem] tracking-[0.06em] text-(color:--c-signal) tabular-nums md:top-9 md:right-9"
              >
                00:00:00:00
              </span>
            </>
          )}
          {failed ? (
            <p role="alert" className="absolute inset-x-0 bottom-0 bg-black/80 p-4 text-center text-sm">
              {labels.videoUnavailable}
            </p>
          ) : null}
        </div>
        <p className="mt-4 font-mono text-xs tracking-[0.12em] text-(color:--tone-muted) uppercase">{caption}</p>
      </div>
    </Section>
  );
}
