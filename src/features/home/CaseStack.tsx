"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { ViewTransition } from "react";
import { Parallax } from "@/components/motion/Parallax";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SmartLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import type { CaseStudyCard, Link } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";
import { routes } from "@/lib/routes";

type CaseStackProps = {
  head: { kicker: string; title: string; lede?: string | undefined; cta?: Link | undefined };
  cases: CaseStudyCard[];
  labels: { readCase: string; client: string };
};

/**
 * Three stories as a stack of cards. Each card sticks near the top while the next one slides up
 * over it; the covered card steps back (scale and shade) so the stack reads as depth.
 */
export function CaseStack({ head, cases, labels }: CaseStackProps) {
  const stack = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = stack.current;
      if (!root || !ready || reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-case-card]", root);
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const depth = cards.length - 1 - i;
          gsap.to(card, {
            scale: 1 - 0.045 * (depth + 1),
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 90%", end: "top 14%", scrub: true },
          });
          gsap.to(card.querySelector("[data-case-shade]"), {
            opacity: 0.55,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 90%", end: "top 14%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: stack, dependencies: [ready, reduced, cases.length] },
  );

  return (
    <Section tone="dark" chapter="Cases" id="cases" exitParallax={false}>
      <Container>
        <SectionHead head={head} />
        <div ref={stack} className="mt-16 flex flex-col gap-8 md:gap-[16vh]">
          {cases.map((item, index) => (
            <article
              key={item.slug}
              data-case-card
              className="group relative grid overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line) bg-(color:--tone-surface) md:sticky md:top-[13vh] md:min-h-[min(62vh,540px)] md:grid-cols-[1.5fr_1fr]"
              style={{ transformOrigin: "50% 0%" }}
            >
              <ViewTransition name={`case-${item.slug}`} share="morph" default="none">
                <div data-cursor="view" className="relative min-h-[16rem] md:min-h-[min(62vh,540px)]">
                  <Parallax speed="subtle" position="absolute" className="inset-0">
                    <Image
                      src={item.hero.src}
                      alt={item.hero.alt}
                      fill
                      sizes="(min-width: 768px) 720px, 100vw"
                      placeholder="blur"
                      blurDataURL={item.hero.blurDataURL}
                      className="object-cover transition-transform duration-(--dur-scene) ease-(--ease-glide) group-hover:scale-[1.04]"
                    />
                  </Parallax>
                </div>
              </ViewTransition>
              <div className="relative flex flex-col justify-between gap-10 p-6 md:p-10">
                <div className="flex flex-wrap gap-2">
                  {item.formats.map((format) => (
                    <span key={format} className="rounded-full border border-(color:--tone-line) px-3 py-1 font-mono text-[0.68rem] tracking-[0.1em] text-(color:--tone-muted) uppercase">
                      {format}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-xs tracking-[0.14em] text-(color:--tone-muted) uppercase">
                    {labels.client}: {item.clientName}
                  </p>
                  <h3 className="reframe text-[clamp(1.75rem,3.2vw,2.9rem)] leading-[1.02] font-bold text-balance" style={{ "--wdth": 104 } as CSSProperties}>
                    <SmartLink href={routes.caseStudy(item.slug)} className="after:absolute after:inset-0 after:z-10">
                      {item.title}
                    </SmartLink>
                  </h3>
                  <p className="max-w-[40ch] text-(color:--tone-muted)">{item.summary}</p>
                </div>
                <div className="relative z-20 self-start">
                  <Button href={routes.caseStudy(item.slug)} variant="secondary">
                    {labels.readCase}
                  </Button>
                </div>
              </div>
              <div
                data-case-shade
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30 bg-(color:--c-ink) opacity-0"
              />
              <span className="sr-only">{index + 1}</span>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
