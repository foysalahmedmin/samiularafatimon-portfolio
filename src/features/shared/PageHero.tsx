import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Display, Kicker } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  kicker: string;
  title: string;
  lede?: string | undefined;
  /** Buttons or facts under the lede. */
  children?: ReactNode;
  /** A right-hand visual (portrait, glyph, frame). */
  aside?: ReactNode;
  tone?: "dark" | "light";
  chapter?: string;
  id?: string;
  className?: string;
};

/**
 * The first section of every inner page. Same structure everywhere, so the pages feel like one
 * film: kicker, big headline, one-sentence lede, then whatever the page needs.
 */
export function PageHero({
  kicker,
  title,
  lede,
  children,
  aside,
  tone = "dark",
  chapter = "Intro",
  id = "intro",
  className,
}: PageHeroProps) {
  return (
    <Section tone={tone} first padded={false} chapter={chapter} id={id} className={className}>
      <Container className="grid items-end gap-12 pt-[calc(var(--section-y)+32px)] pb-[calc(var(--section-y)*0.8)] md:grid-cols-[1.35fr_1fr]">
        <div className={cn("flex flex-col gap-7", !aside && "md:col-span-2")}>
          <Reveal type="fade">
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Display
            as="h1"
            size={aside ? "clamp(2.5rem, 5.4vw, 5rem)" : "clamp(2.7rem, 7.4vw, 6.6rem)"}
            width={aside ? 108 : 112}
          >
            {title}
          </Display>
          {lede ? (
            <Reveal type="rise" delay={0.1}>
              <p className="max-w-[56ch] text-[clamp(1.1rem,1.5vw,1.4rem)] leading-[1.55] text-(color:--tone-muted) text-pretty">
                {lede}
              </p>
            </Reveal>
          ) : null}
          {children ? (
            <Reveal type="rise" delay={0.18} className="flex flex-wrap items-center gap-3">
              {children}
            </Reveal>
          ) : null}
        </div>
        {aside ? <div className="relative md:self-center">{aside}</div> : null}
      </Container>
    </Section>
  );
}
