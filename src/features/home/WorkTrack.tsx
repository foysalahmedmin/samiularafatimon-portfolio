"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Glyph } from "@/components/ui/Glyph";
import { SmartLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Link, ResolvedWorkItem, WorkCategory } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type WorkTrackProps = {
  head: { kicker: string; title: string; lede?: string | undefined; cta?: Link | undefined };
  items: ResolvedWorkItem[];
  categories: WorkCategory[];
  watchLabel: string;
};

/** A card that plays a silent preview while the pointer is on it. */
function WorkCard({ item, category, watchLabel }: { item: ResolvedWorkItem; category: WorkCategory | undefined; watchLabel: string }) {
  const { finePointer, reduced } = useMotion();
  const [hover, setHover] = useState(false);
  const preview = item.media.kind === "video" ? item.media.preview : undefined;

  return (
    <article
      data-work-card
      data-cursor="play"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="group relative h-[min(50vh,440px)] shrink-0 snap-center overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line) bg-(color:--tone-surface)"
      style={{ aspectRatio: item.aspect.replace(":", " / ") }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          data-work-media
          src={item.thumbnail.src}
          alt={item.thumbnail.alt}
          fill
          sizes="(min-width: 768px) 780px, 86vw"
          placeholder="blur"
          blurDataURL={item.thumbnail.blurDataURL}
          className="scale-[1.14] object-cover transition-transform duration-(--dur-scene) ease-(--ease-glide) group-hover:scale-[1.2]"
        />
      </div>
      {hover && preview && finePointer && !reduced ? (
        <video
          src={preview}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover"
          aria-hidden="true"
        />
      ) : null}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(5,13,20,0.88))]" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 md:p-7">
        <span className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] text-(color:--c-bone)/80 uppercase">
          {category ? <Glyph kind={category.glyph} className="size-5 text-(color:--c-signal)" /> : null}
          {category?.label}
          {item.client ? <span className="text-(color:--c-bone)/50">· {item.client}</span> : null}
        </span>
        <h3 className="reframe text-[clamp(1.35rem,2.2vw,2rem)] leading-[1.05] font-bold text-(color:--c-bone)" style={{ "--wdth": 102 } as CSSProperties}>
          {item.title}
        </h3>
      </div>
      <SmartLink href={`/work?v=${item.id}`} aria-label={`${watchLabel}: ${item.title}`} className="absolute inset-0 z-10" />
    </article>
  );
}

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
            <WorkCard key={item.id} item={item} category={categoryOf(item.category)} watchLabel={watchLabel} />
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
