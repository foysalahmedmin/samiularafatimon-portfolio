import type { CSSProperties } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Mono } from "@/components/ui/Text";
import type { Client, ResolvedStat } from "@/lib/content";

type ProofProps = {
  head: { kicker: string; title: string };
  clientsLabel: string;
  stats: ResolvedStat[];
  clients: Client[];
};

export function Proof({ head, clientsLabel, stats, clients }: ProofProps) {
  return (
    <Section tone="light" chapter="Proof" id="proof">
      <Container>
        <SectionHead head={head} withCta={false} />
        <Reveal as="ul" type="rise" stagger className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4 md:gap-x-10">
          {stats.map((stat) => (
            <li key={stat.id} className="border-t border-(color:--tone-line) pt-5">
              <div
                className="reframe text-[clamp(2.7rem,5.6vw,5.6rem)] leading-[0.95] font-extrabold tracking-[-0.03em]"
                style={{ "--wdth": 100 } as CSSProperties}
              >
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-4 max-w-[17ch] text-[0.98rem] leading-snug text-(color:--tone-muted)">{stat.label}</p>
            </li>
          ))}
        </Reveal>
      </Container>

      <div className="mt-24">
        <Container>
          <Reveal type="fade">
            <Mono className="text-(color:--tone-muted)">{clientsLabel}</Mono>
          </Reveal>
        </Container>
        <Marquee
          items={clients.map((client) => client.name)}
          speed={55}
          className="mt-6 [--marquee-gap:3.5rem]"
          itemClassName="reframe text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[1.05] font-extrabold text-transparent [-webkit-text-stroke:1.5px_var(--tone-fg)] after:ml-14 after:text-(color:--tone-accent) after:content-['/'] after:[-webkit-text-stroke:0]"
        />
      </div>
    </Section>
  );
}
