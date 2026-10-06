"use client";

import { useRef, type CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import type { ProcessStage } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type ProcessSceneProps = {
  head: { kicker: string; title: string; lede?: string | undefined };
  stages: ProcessStage[];
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The five stages as a real sequence (so they are numbered). On desktop the section pins and a
 * playhead moves along a rail while each stage wipes in; on phones it is a plain vertical list.
 */
export function ProcessScene({ head, stages }: ProcessSceneProps) {
  const scene = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const el = scene.current;
      if (!el || !ready || reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-stage]", el);
        const clips = gsap.utils.toArray<HTMLElement>("[data-stage-clip]", el);
        gsap.set(panels.slice(1), { clipPath: "inset(100% 0 0 0)" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: `+=${panels.length * 60}%`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        });
        tl.to("[data-playhead]", { left: "100%", duration: panels.length - 1 }, 0);
        panels.forEach((panel, i) => {
          if (i === 0) return;
          tl.to(panel, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "cut" }, i - 1 + 0.05);
          tl.to(panels[i - 1] as HTMLElement, { opacity: 0.12, duration: 0.9 }, i - 1 + 0.05);
        });
        clips.forEach((clip, i) => {
          tl.to(clip, { color: "var(--tone-accent)", borderColor: "var(--tone-accent)", duration: 0.1 }, Math.max(0, i - 0.55));
        });
      });
      return () => mm.revert();
    },
    { scope: scene, dependencies: [ready, reduced, stages.length] },
  );

  return (
    <Section tone="light" id="process" exitParallax={false} padded={false}>
      <div
        ref={scene}
        className="flex min-h-svh flex-col justify-center gap-12 pt-[calc(var(--sheet-r)+5rem)] pb-24 md:h-svh md:gap-10 md:pt-[calc(var(--sheet-r)+4rem)] md:pb-16"
      >
        <Container>
          <SectionHead head={head} withCta={false} />
        </Container>

        <Container className="relative flex-1 md:min-h-[17rem]">
          <ol className="grid gap-px md:relative md:block md:h-full">
            {stages.map((stage, i) => (
              <li
                key={stage.id}
                data-stage
                className="grid gap-5 border-t border-(color:--tone-line) bg-(color:--tone-bg) py-8 md:absolute md:inset-0 md:grid-cols-[minmax(8rem,0.5fr)_1fr_0.8fr] md:items-start md:gap-10 md:py-10"
              >
                <span className="reframe text-[clamp(4rem,10vw,9rem)] leading-[0.85] font-extrabold text-(color:--tone-accent)" style={{ "--wdth": 125 } as CSSProperties}>
                  {pad(i + 1)}
                </span>
                <div className="flex flex-col gap-4">
                  <h3 className="reframe text-[clamp(1.7rem,3.6vw,3.1rem)] leading-[1.02] font-bold text-balance" style={{ "--wdth": 104 } as CSSProperties}>
                    {stage.title}
                  </h3>
                  <p className="max-w-[44ch] text-(color:--tone-muted)">{stage.summary}</p>
                </div>
                <p className="font-mono text-xs tracking-[0.14em] text-(color:--tone-muted) uppercase md:justify-self-end">
                  {stage.meta}
                </p>
              </li>
            ))}
          </ol>
        </Container>

        <Container className="hidden md:block">
          <div className="relative h-11 border-y border-(color:--tone-line)" aria-hidden="true">
            <ul className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }}>
              {stages.map((stage, i) => (
                <li key={stage.id} className="flex items-center border-l border-(color:--tone-line) pl-3 first:border-l-0">
                  <span data-stage-clip className="rounded-[5px] border border-(color:--tone-line) px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.1em] text-(color:--tone-muted) uppercase">
                    {pad(i + 1)} {stage.title.split(" ")[0]}
                  </span>
                </li>
              ))}
            </ul>
            <span data-playhead className="absolute top-0 bottom-0 left-0 w-0.5 bg-(color:--tone-accent)" />
          </div>
        </Container>
      </div>
    </Section>
  );
}
