import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Check } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { H2, H3, Kicker, Lede } from "@/components/ui/Text";
import { PageHero } from "@/features/shared/PageHero";
import { cn } from "@/lib/cn";
import type { Pricing } from "@/lib/content";

/** Three packages, the studio's monthly plans, and a way to ask for something bigger. */
export function PricingView({ pricing }: { pricing: Pricing }) {
  return (
    <>
      <PageHero kicker={pricing.hero.kicker} title={pricing.hero.title} lede={pricing.hero.lede} />

      <Section tone="light" chapter="Packages" id="packages">
        <Container>
          <Reveal as="ul" type="rise" stagger className="grid gap-6 lg:grid-cols-3">
            {pricing.packages.map((pack) => (
              <li key={pack.id} className="flex">
                <TiltCard className="flex w-full">
                  <article
                    className={cn(
                      "relative flex w-full flex-col gap-7 rounded-(--radius-lg) border p-8 md:p-9",
                      pack.popular
                        ? "border-(color:--tone-accent) bg-(color:--c-ink) text-(color:--c-bone)"
                        : "border-(color:--tone-line) bg-(color:--tone-surface)",
                    )}
                    style={
                      pack.popular
                        ? ({
                            "--tone-fg": "var(--c-bone)",
                            "--tone-bg": "var(--c-ink)",
                            "--tone-muted": "var(--c-mist)",
                            "--tone-line": "rgb(233 241 245 / 0.14)",
                            "--tone-accent": "var(--c-signal)",
                          } as CSSProperties)
                        : undefined
                    }
                  >
                    {pack.popular ? (
                      <span className="absolute -top-3 left-8 rounded-full bg-(color:--c-signal) px-3 py-1 font-mono text-[0.68rem] tracking-[0.14em] text-(color:--c-ink) uppercase">
                        {pricing.popularLabel}
                      </span>
                    ) : null}
                    <div className="flex flex-col gap-3">
                      <H3 size="clamp(1.5rem,2.2vw,2rem)">{pack.name}</H3>
                      <p className="text-(color:--tone-muted)">{pack.summary}</p>
                    </div>
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="reframe text-[clamp(2.1rem,3.1vw,2.8rem)] leading-none font-extrabold" style={{ "--wdth": 112 } as CSSProperties}>
                        {pack.price}
                      </span>
                      <span className="font-mono text-xs tracking-[0.14em] whitespace-nowrap text-(color:--tone-muted) uppercase">{pack.unit}</span>
                    </p>
                    <ul className="flex flex-1 flex-col gap-3 border-t border-(color:--tone-line) pt-6">
                      {pack.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check size={18} className="mt-0.5 shrink-0 text-(color:--tone-accent)" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button href={pack.cta.href} variant={pack.popular ? "primary" : "secondary"}>
                      {pack.cta.label}
                    </Button>
                  </article>
                </TiltCard>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section tone="dark" chapter="Monthly" id="monthly">
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-5 md:max-w-[46rem]">
            <Reveal type="fade">
              <Kicker>{pricing.retainers.kicker}</Kicker>
            </Reveal>
            <H2>{pricing.retainers.title}</H2>
            <Reveal type="rise" delay={0.1}>
              <Lede>{pricing.retainers.lede}</Lede>
            </Reveal>
          </div>
          <Reveal as="ul" type="rise" stagger className="grid gap-6 md:grid-cols-2">
            {pricing.retainers.plans.map((plan) => (
              <li key={plan.name} className="flex flex-col gap-6 rounded-(--radius-lg) border border-(color:--tone-line) bg-(color:--tone-surface) p-8 md:p-9">
                <div className="flex flex-col gap-2">
                  <H3 size="clamp(1.4rem,2vw,1.8rem)">{plan.name}</H3>
                  <p className="text-(color:--tone-muted)">{plan.summary}</p>
                </div>
                <p className="flex items-baseline gap-2">
                  <span className="reframe text-[clamp(2.2rem,3.6vw,3.2rem)] leading-none font-extrabold" style={{ "--wdth": 112 } as CSSProperties}>
                    {plan.price}
                  </span>
                  <span className="font-mono text-xs tracking-[0.14em] text-(color:--tone-muted) uppercase">{plan.unit}</span>
                </p>
                <ul className="flex flex-col gap-3 border-t border-(color:--tone-line) pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={18} className="mt-0.5 shrink-0 text-(color:--tone-accent)" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </Reveal>
          <Reveal type="rise">
            <Button href={pricing.retainers.cta.href} variant="secondary">
              {pricing.retainers.cta.label}
            </Button>
          </Reveal>
        </Container>
      </Section>

      <Section tone="light" chapter="Quote" id="quote">
        <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4">
            <H2>{pricing.quote.title}</H2>
            <Reveal type="rise" delay={0.1}>
              <Lede>{pricing.quote.lede}</Lede>
            </Reveal>
          </div>
          <Reveal type="rise" delay={0.15}>
            <Button href={pricing.quote.cta.href} size="lg">
              {pricing.quote.cta.label}
            </Button>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
