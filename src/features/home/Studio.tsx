import type { CSSProperties } from "react";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Link, ResolvedStat } from "@/lib/content";

type StudioProps = {
  head: { kicker: string; title: string; lede?: string | undefined; cta?: Link | undefined };
  stats: ResolvedStat[];
  serviceNames: string[];
};

/** The agency band: where bigger jobs go, with its own numbers and a drifting list of what it makes. */
export function Studio({ head, stats, serviceNames }: StudioProps) {
  return (
    <Section tone="light" id="studio">
      <Container>
        <SectionHead head={{ kicker: head.kicker, title: head.title, lede: head.lede }} withCta={false} />
        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1fr] md:items-start">
          <Reveal as="ul" type="rise" stagger className="grid gap-px overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line) bg-(color:--tone-line)">
            {stats.map((stat) => (
              <li key={stat.id} className="flex items-baseline justify-between gap-6 bg-(color:--tone-bg) px-6 py-5">
                <span className="text-[0.98rem] text-(color:--tone-muted)">{stat.label}</span>
                <span className="reframe text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tabular-nums" style={{ "--wdth": 108 } as CSSProperties}>
                  {stat.display}
                </span>
              </li>
            ))}
          </Reveal>
          {head.cta ? (
            <Reveal type="rise" className="md:justify-self-end">
              <Button href={head.cta.href} size="lg">
                {head.cta.label}
              </Button>
            </Reveal>
          ) : null}
        </div>
      </Container>
      <div className="mt-20 border-y border-(color:--tone-line) py-5">
        <Marquee
          items={serviceNames}
          speed={40}
          className="[--marquee-gap:2.5rem]"
          itemClassName="font-mono text-[0.85rem] tracking-[0.14em] uppercase text-(color:--tone-muted) after:ml-10 after:text-(color:--tone-accent) after:content-['●']"
        />
      </div>
    </Section>
  );
}
