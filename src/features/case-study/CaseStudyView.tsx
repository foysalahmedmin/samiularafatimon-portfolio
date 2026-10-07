import Image from "next/image";
import { ViewTransition, type CSSProperties } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Check } from "@/components/ui/Icons";
import { SmartLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { Display, H2, Kicker, Lede, Mono } from "@/components/ui/Text";
import { PinnedSteps } from "@/features/shared/PinnedSteps";
import type { ResolvedCaseStudy, Ui } from "@/lib/content";
import { routes } from "@/lib/routes";

type CaseStudyViewProps = { study: ResolvedCaseStudy; ui: Ui };

/** "556K" → { value: 556, suffix: "K" }, so numbers can count up. Anything else stays as text. */
function splitMetric(raw: string): { value: number; suffix: string } | null {
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(raw.trim());
  if (!match || match[1] === undefined) return null;
  return { value: Number(match[1]), suffix: match[2] ?? "" };
}

const wdth = (value: number) => ({ "--wdth": value }) as CSSProperties;

/** One case study, told in six scenes: intro, brief, approach, deliverables, result, next. */
export function CaseStudyView({ study, ui }: CaseStudyViewProps) {
  const t = ui.caseStudy;
  const facts = [
    { label: t.industry, value: study.client.industry },
    { label: t.format, value: study.formats.join(" · ") },
    { label: t.myRole, value: study.myRole.value },
  ];

  return (
    <>
      <Section tone="dark" first padded={false} chapter="Intro" id="intro">
        <Container className="flex flex-col gap-8 pt-[calc(var(--section-y)+32px)] pb-14">
          <Reveal type="fade">
            <Kicker>
              {t.client}: {study.client.name}
            </Kicker>
          </Reveal>
          <Display as="h1" size="clamp(2.6rem, 7vw, 6.2rem)" width={110} className="max-w-[18ch]">
            {study.title}
          </Display>
          <Reveal type="rise" delay={0.1}>
            <Lede>{study.summary}</Lede>
          </Reveal>
          <Reveal as="dl" type="rise" stagger delay={0.15} className="grid gap-6 border-t border-(color:--tone-line) pt-6 md:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-2">
                <dt>
                  <Mono className="text-(color:--tone-muted)">{fact.label}</Mono>
                </dt>
                <dd className="text-[1.05rem]">{fact.value}</dd>
              </div>
            ))}
          </Reveal>
        </Container>
        <Container className="pb-[calc(var(--section-y)*0.9)]">
          <ViewTransition name={`case-${study.slug}`} share="morph" default="none">
            <div className="relative aspect-[2/1] overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line)">
              <Parallax speed="subtle" position="absolute" className="inset-0">
                <Image
                  src={study.hero.src}
                  alt={study.hero.alt}
                  fill
                  priority
                  sizes="(min-width: 1360px) 1360px, 100vw"
                  placeholder="blur"
                  blurDataURL={study.hero.blurDataURL}
                  className="object-cover"
                />
              </Parallax>
            </div>
          </ViewTransition>
        </Container>
      </Section>

      <Section tone="light" chapter="Brief" id="brief">
        <Container className="grid gap-10 md:grid-cols-[0.8fr_1.4fr] md:gap-20">
          <div className="md:sticky md:top-32 md:self-start">
            <Reveal type="fade">
              <Kicker>{t.brief}</Kicker>
            </Reveal>
            <H2 className="mt-5">{study.brief.title}</H2>
          </div>
          <div className="flex flex-col gap-7">
            {study.brief.body.map((paragraph) => (
              <Reveal key={paragraph} type="rise">
                <p className="max-w-[40ch] text-[clamp(1.3rem,2.2vw,1.9rem)] leading-[1.35] font-medium text-balance">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <PinnedSteps
        tone="dark"
        id="approach"
        chapter="Approach"
        head={{ kicker: study.client.name, title: t.approach, lede: study.approach.lede }}
        steps={study.approach.steps.map((step) => ({ id: step.title, title: step.title, body: step.body }))}
      />

      <Section tone="light" chapter="Delivered" id="delivered">
        <Container className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
          <div className="flex flex-col gap-8">
            <Reveal type="fade">
              <Kicker>{t.deliverables}</Kicker>
            </Reveal>
            <Reveal as="ul" type="rise" stagger className="flex flex-col divide-y divide-(color:--tone-line) border-y border-(color:--tone-line)">
              {study.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-4 py-5 text-[1.1rem]">
                  <Check className="mt-1 shrink-0 text-(color:--tone-accent)" />
                  {item}
                </li>
              ))}
            </Reveal>
            {study.services.length > 0 ? (
              <Reveal type="fade" className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Mono className="text-(color:--tone-muted)">{t.services}</Mono>
                {study.serviceLinks.map((service) => (
                  <SmartLink key={service.slug} href={routes.service(service.slug)} className="u-link text-(color:--tone-accent)">
                    {service.shortTitle}
                  </SmartLink>
                ))}
              </Reveal>
            ) : null}
          </div>
          <div className="flex flex-col gap-6">
            <Reveal type="fade">
              <Kicker>{t.about}</Kicker>
            </Reveal>
            {study.client.logo ? (
              <Reveal type="rise">
                <Image
                  src={study.client.logo.src}
                  alt={study.client.logo.alt}
                  width={96}
                  height={96}
                  className="size-24 rounded-2xl border border-(color:--tone-line) object-cover"
                />
              </Reveal>
            ) : null}
            <Reveal type="rise" delay={0.05}>
              <p className="max-w-[52ch] leading-[1.7]">{study.client.about}</p>
            </Reveal>
            <Reveal as="dl" type="rise" delay={0.1} className="grid gap-3 text-[0.95rem] text-(color:--tone-muted)">
              {study.client.size ? <div>{study.client.size}</div> : null}
              {study.client.location ? <div>{study.client.location}</div> : null}
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="dark" chapter="Result" id="result">
        <Container className="flex flex-col gap-14">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.4fr] md:gap-20">
            <div>
              <Reveal type="fade">
                <Kicker>{t.result}</Kicker>
              </Reveal>
              <H2 className="mt-5">{t.outcome}</H2>
            </div>
            <Reveal type="rise">
              <p className="max-w-[46ch] text-[clamp(1.2rem,1.9vw,1.6rem)] leading-[1.45] text-pretty">{study.result.outcome}</p>
            </Reveal>
          </div>

          {study.result.metrics.length > 0 ? (
            <Reveal as="ul" type="rise" stagger className="grid gap-px overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line) bg-(color:--tone-line) [grid-template-columns:repeat(auto-fit,minmax(18rem,1fr))]">
              {study.result.metrics.map((metric) => {
                const parts = splitMetric(metric.value);
                return (
                  <li key={metric.label} className="flex flex-col gap-3 bg-(color:--tone-bg) p-8 md:p-10">
                    <span className="reframe text-[clamp(3.4rem,8vw,7rem)] leading-[0.95] font-extrabold" style={wdth(112)}>
                      {parts ? <CountUp value={parts.value} suffix={parts.suffix} /> : metric.value}
                    </span>
                    <span className="text-lg">{metric.label}</span>
                    {metric.note ? <span className="text-[0.92rem] text-(color:--tone-muted)">{metric.note}</span> : null}
                  </li>
                );
              })}
            </Reveal>
          ) : null}

          {study.testimonial ? (
            <Reveal as="figure" type="rise" className="grid gap-8 border-t border-(color:--tone-line) pt-12 md:grid-cols-[0.8fr_1.4fr] md:gap-20">
              <div className="flex items-center gap-4">
                {study.testimonial.photo ? (
                  <Image
                    src={study.testimonial.photo.src}
                    alt={study.testimonial.photo.alt}
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                  />
                ) : null}
                <figcaption className="flex flex-col">
                  <cite className="text-[1.05rem] font-medium not-italic">{study.testimonial.name}</cite>
                  <span className="text-[0.92rem] text-(color:--tone-muted)">
                    {study.testimonial.role}
                    {study.testimonial.org ? `, ${study.testimonial.org}` : ""}
                  </span>
                </figcaption>
              </div>
              <blockquote className="reframe text-[clamp(1.5rem,2.8vw,2.5rem)] leading-[1.18] font-bold text-balance" style={wdth(98)}>
                “{study.testimonial.quote}”
              </blockquote>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      <Section tone="light" chapter="Next" id="next" padded={false}>
        <Container className="pt-[calc(var(--section-y)+var(--sheet-r))] pb-[var(--section-y)]">
          <Reveal type="fade">
            <Kicker>{t.next}</Kicker>
          </Reveal>
          <ViewTransition name={`case-${study.nextCase.slug}`} share="morph" default="none">
            <SmartLink
              href={routes.caseStudy(study.nextCase.slug)}
              data-cursor="view"
              className="group relative mt-8 block overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line)"
            >
              <div className="relative aspect-[16/7] bg-ink">
                <Image
                  src={study.nextCase.hero.src}
                  alt={study.nextCase.hero.alt}
                  fill
                  sizes="(min-width: 1360px) 1360px, 100vw"
                  placeholder="blur"
                  blurDataURL={study.nextCase.hero.blurDataURL}
                  className="object-cover transition-transform duration-(--dur-scene) ease-(--ease-glide) group-hover:scale-[1.04]"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(5,13,20,0.85))]" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-(color:--c-bone) md:p-10">
                  <span className="font-mono text-xs tracking-[0.14em] uppercase opacity-80">{study.nextCase.clientName}</span>
                  <span className="reframe text-[clamp(1.6rem,3.6vw,3.2rem)] leading-[1.05] font-bold" style={wdth(106)}>
                    {study.nextCase.title}
                  </span>
                </div>
              </div>
            </SmartLink>
          </ViewTransition>
          <div className="mt-8">
            <Button href={routes.caseStudies} variant="secondary">
              {t.allCases}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
