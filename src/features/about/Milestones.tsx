"use client";

import { useRef, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H2, Kicker } from "@/components/ui/Text";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type MilestonesProps = {
  kicker: string;
  title: string;
  items: Array<{ year: number; title: string; description: string }>;
};

/** A real timeline (so the years are the structure): a line fills as you scroll down it. */
export function Milestones({ kicker, title, items }: MilestonesProps) {
  const list = useRef<HTMLOListElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const el = list.current;
      if (!el || !ready || reduced) return;
      gsap.fromTo(
        "[data-timeline-fill]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 70%", scrub: true },
        },
      );
    },
    { scope: list, dependencies: [ready, reduced] },
  );

  return (
    <Section tone="dark" chapter="Timeline" id="timeline">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col gap-5">
          <Reveal type="fade">
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <H2>{title}</H2>
        </div>
        <ol ref={list} className="relative flex flex-col">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[9.2rem] hidden w-px bg-(color:--tone-line) md:block">
            <span data-timeline-fill className="absolute inset-0 origin-top bg-(color:--tone-accent)" />
          </span>
          {items.map((item) => (
            <Reveal as="li" key={item.year} type="rise" className="grid gap-2 border-t border-(color:--tone-line) py-8 md:grid-cols-[9rem_1fr_1.2fr] md:gap-8 md:border-t-0 md:py-9">
              <span className="reframe text-[clamp(2rem,3.6vw,3rem)] leading-none font-extrabold tabular-nums text-(color:--tone-accent)" style={{ "--wdth": 118 } as CSSProperties}>
                {item.year}
              </span>
              <h3 className="reframe text-[clamp(1.25rem,2vw,1.7rem)] leading-[1.12] font-bold md:pl-8" style={{ "--wdth": 102 } as CSSProperties}>
                {item.title}
              </h3>
              <p className="max-w-[44ch] text-(color:--tone-muted)">{item.description}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
