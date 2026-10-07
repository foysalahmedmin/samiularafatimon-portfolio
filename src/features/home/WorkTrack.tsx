"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { WorkCard } from "@/features/work/WorkCard";
import type { Link, ResolvedWorkItem, WorkCategory } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type WorkTrackProps = {
  head: { kicker: string; title: string; lede?: string | undefined; cta?: Link | undefined };
  items: ResolvedWorkItem[];
  categories: WorkCategory[];
  watchLabel: string;
};

/**
 * Selected work. On desktop the section pins and the row of cards slides sideways as you scroll;
 * on phones it is a native swipeable row (no scroll hijacking on touch).
 */
export function WorkTrack({ head, items, categories, watchLabel }: WorkTrackProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const wrapEl = wrap.current;
      const trackEl = track.current;
      if (!wrapEl || !trackEl || !ready || reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
        const slide = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrapEl,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-work-media]", trackEl).forEach((media) => {
          const card = media.closest("[data-work-card]");
          if (!card) return;
          gsap.fromTo(
            media,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: wrap, dependencies: [ready, reduced, items.length] },
  );

  const categoryOf = (id: string) => categories.find((c) => c.id === id);

  return (
    <Section tone="dark" chapter="Work" id="work" exitParallax={false} padded={false}>
      <div ref={wrap} className="flex min-h-svh flex-col justify-center gap-12 pt-[calc(var(--sheet-r)+5.5rem)] pb-24 md:h-svh md:gap-14 md:pt-[calc(var(--sheet-r)+5rem)] md:pb-20">
        <Container>
          <SectionHead head={head} />
        </Container>
        <div
          ref={track}
          className="flex w-max gap-5 px-(--gutter) max-md:w-full max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pb-4 md:gap-7"
        >
          {items.map((item) => (
            <WorkCard key={item.id} item={item} category={categoryOf(item.category)} watchLabel={watchLabel} variant="track" />
          ))}
        </div>
        <div className="mx-auto hidden w-full max-w-(--container) px-(--gutter) md:block" aria-hidden="true">
          <div className="h-px w-full bg-(color:--tone-line)">
            <span ref={bar} className="block h-px origin-left scale-x-0 bg-(color:--tone-accent)" />
          </div>
        </div>
      </div>
    </Section>
  );
}
