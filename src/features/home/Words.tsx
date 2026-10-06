"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { SmartLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { cn } from "@/lib/cn";
import type { ResolvedTestimonial } from "@/lib/content";
import { gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";
import { routes } from "@/lib/routes";

type WordsProps = {
  head: { kicker: string; title: string };
  items: ResolvedTestimonial[];
  labels: { previous: string; next: string; readCase: string };
};

const INTERVAL = 7000;

/** Client quotes, one at a time. Cuts (not fades) between them; pauses on hover or focus. */
export function Words({ head, items, labels }: WordsProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const first = useRef(true);
  const { ready, reduced } = useMotion();

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + items.length) % items.length), [items.length]);

  // Cut-wipe the new quote in.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!stage.current || reduced) return;
    gsap.fromTo(stage.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "cut" });
  }, [index, reduced]);

  // Auto-advance with a linear progress line. No autoplay for reduced motion.
  useEffect(() => {
    const bar = progress.current;
    if (!ready || reduced || paused || !bar) return;
    const tween = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: INTERVAL / 1000, ease: "none", onComplete: () => go(1) });
    return () => {
      tween.kill();
    };
  }, [index, paused, ready, reduced, go]);

  const current = items[index];
  if (!current) return null;
  const isActive = (i: number) => i === index;

  return (
    <Section tone="dark" chapter={undefined} id="words">
      <Container>
        <SectionHead head={head} withCta={false} />
        <div
          className="mt-14 grid gap-10 md:grid-cols-[1fr_auto] md:items-end"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div ref={stage} aria-live="polite" className="min-h-[18rem] md:min-h-[22rem]">
            <blockquote className="flex flex-col gap-8">
              <p className="reframe max-w-[28ch] text-[clamp(1.5rem,2.9vw,2.6rem)] leading-[1.16] font-bold text-balance md:max-w-[38ch]" style={{ "--wdth": 98 } as CSSProperties}>
                “{current.quote}”
              </p>
              <footer className="flex items-center gap-4">
                {current.photo ? (
                  <Image
                    src={current.photo.src}
                    alt={current.photo.alt}
                    width={56}
                    height={56}
                    className="size-14 rounded-full object-cover"
                  />
                ) : null}
                <div className="flex flex-col gap-0.5">
                  <cite className="text-[1.05rem] font-medium not-italic">{current.name}</cite>
                  <span className="text-[0.92rem] text-(color:--tone-muted)">
                    {current.role}
                    {current.org ? `, ${current.org}` : ""}
                  </span>
                </div>
                {current.caseStudy ? (
                  <SmartLink
                    href={routes.caseStudy(current.caseStudy)}
                    className="u-link ml-auto hidden items-center gap-2 text-[0.9rem] text-(color:--tone-accent) md:inline-flex"
                  >
                    {labels.readCase}
                    <ArrowRight size={16} />
                  </SmartLink>
                ) : null}
              </footer>
            </blockquote>
          </div>

          <div className="flex items-center gap-3 md:flex-col md:items-end">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.previous}
                className="grid size-12 place-items-center rounded-full border border-(color:--tone-line) transition-colors hover:border-(color:--tone-accent)"
              >
                <ArrowRight className="rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className="grid size-12 place-items-center rounded-full border border-(color:--tone-line) transition-colors hover:border-(color:--tone-accent)"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>

        <ol className="mt-12 flex gap-2" aria-hidden="true">
          {items.map((item, i) => (
            <li key={item.id} className="h-0.5 flex-1 overflow-hidden rounded bg-(color:--tone-line)">
              <span
                ref={isActive(i) ? progress : undefined}
                className={cn("block h-full origin-left bg-(color:--tone-accent)", isActive(i) ? "scale-x-0" : i < index ? "scale-x-100" : "scale-x-0")}
              />
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
