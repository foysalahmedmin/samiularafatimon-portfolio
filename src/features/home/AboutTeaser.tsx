import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H2, Kicker, Lede, Mono } from "@/components/ui/Text";
import type { Link, ResolvedImage } from "@/lib/content";

type AboutTeaserProps = {
  head: { kicker: string; title: string; lede?: string | undefined; cta?: Link | undefined };
  portrait: ResolvedImage;
  story: string;
  facts: Array<{ label: string; value: string }>;
};

/** A short About: a portrait that wipes in and drifts at its own speed, then the story. */
export function AboutTeaser({ head, portrait, story, facts }: AboutTeaserProps) {
  return (
    <Section tone="light" chapter="About" id="about">
      <Container className="relative">
        <div className="grid items-center gap-14 md:grid-cols-[0.9fr_1fr] md:gap-20">
          <div className="relative">
            <Reveal type="wipe" className="relative z-10 overflow-hidden rounded-(--radius-lg)">
              <Parallax speed="medium" className="aspect-[4/5]">
                <Image
                  data-reveal-media
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  sizes="(min-width: 768px) 560px, 100vw"
                  placeholder="blur"
                  blurDataURL={portrait.blurDataURL}
                  className="object-cover object-[50%_30%]"
                />
              </Parallax>
            </Reveal>
          </div>

          <div className="flex flex-col gap-8">
            <Reveal type="fade">
              <Kicker>{head.kicker}</Kicker>
            </Reveal>
            <H2>{head.title}</H2>
            {head.lede ? (
              <Reveal type="rise" delay={0.1}>
                <Lede>{head.lede}</Lede>
              </Reveal>
            ) : null}
            <Reveal type="rise" delay={0.15}>
              <p className="max-w-[52ch] leading-[1.7] text-(color:--tone-fg)">{story}</p>
            </Reveal>
            <Reveal as="dl" type="rise" stagger className="grid gap-4 border-t border-(color:--tone-line) pt-6">
              {facts.map((fact) => (
                <div key={fact.label} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-6">
                  <dt>
                    <Mono className="text-(color:--tone-muted)">{fact.label}</Mono>
                  </dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </Reveal>
            {head.cta ? (
              <Reveal type="rise" className="self-start">
                <Button href={head.cta.href} variant="secondary">
                  {head.cta.label}
                </Button>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
