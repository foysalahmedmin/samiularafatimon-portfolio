import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Check } from "@/components/ui/Icons";
import { SmartLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { H2, H3, Kicker, Lede } from "@/components/ui/Text";
import { FaqAccordion } from "@/features/home/FaqAccordion";
import { PageHero } from "@/features/shared/PageHero";
import { PinnedSteps } from "@/features/shared/PinnedSteps";
import { WorkCard } from "@/features/work/WorkCard";
import { FormatMorph } from "./FormatMorph";
import type { ResolvedImage, ResolvedService, Ui, WorkCategory } from "@/lib/content";
import { routes } from "@/lib/routes";

type ServiceViewProps = {
  service: ResolvedService;
  ui: Ui;
  bookCall: { label: string; href: string };
  categories: WorkCategory[];
  fallbackImage: ResolvedImage;
};

/** One service page: what it is, what's included, how it works, proof, answers. */
export function ServiceView({ service, ui, bookCall, categories, fallbackImage }: ServiceViewProps) {
  const t = ui.service;
  const image = service.relatedWorkItems[0]?.thumbnail ?? service.relatedCaseCard?.hero ?? fallbackImage;
  const startRatio = service.glyph === "9:16" ? "9:16" : "16:9";

  return (
    <>
      <PageHero
        kicker={service.hero.kicker}
        title={service.hero.title}
        lede={service.hero.lede}
        aside={<FormatMorph image={image} start={startRatio} />}
      >
        <Button href={bookCall.href} size="lg">
          {bookCall.label}
        </Button>
        {service.relatedWorkItems.length > 0 ? (
          <Button href="#related" variant="secondary" size="lg">
            {t.relatedWork}
          </Button>
        ) : null}
      </PageHero>

      <Section tone="light" chapter="Included" id="included">
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-6 md:max-w-[44rem]">
            <Reveal type="fade">
              <Kicker>{t.included}</Kicker>
            </Reveal>
            <H2>{service.title}</H2>
            <Reveal type="rise" delay={0.1}>
              <Lede>
                <span className="text-(color:--tone-fg)">{t.forWhom}: </span>
                {service.audience}
              </Lede>
            </Reveal>
          </div>
          <Reveal as="ul" type="rise" stagger className="grid gap-px overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line) bg-(color:--tone-line) md:grid-cols-2 xl:grid-cols-3">
            {service.included.map((item) => (
              <li key={item.title} className="flex flex-col gap-3 bg-(color:--tone-bg) p-7 md:p-8">
                <Check className="text-(color:--tone-accent)" />
                <H3 size="clamp(1.2rem,1.7vw,1.5rem)">{item.title}</H3>
                <p className="text-(color:--tone-muted)">{item.description}</p>
              </li>
            ))}
          </Reveal>
        </Container>
      </Section>

      <PinnedSteps
        tone="dark"
        id="how"
        chapter="How it works"
        head={{ kicker: service.shortTitle, title: t.process }}
        steps={service.steps.map((step) => ({ id: step.title, title: step.title, body: step.description }))}
      />

      {service.relatedWorkItems.length > 0 ? (
        <Section tone="light" chapter="Work" id="related">
          <Container className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <Reveal type="fade">
                <Kicker>{service.shortTitle}</Kicker>
              </Reveal>
              <H2>{t.relatedWork}</H2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {service.relatedWorkItems.map((item) => (
                <WorkCard
                  key={item.id}
                  item={item}
                  category={categories.find((c) => c.id === item.category)}
                  watchLabel={ui.watch}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {service.relatedCaseCard ? (
        <Section tone="dark" chapter="Case study" id="case">
          <Container className="flex flex-col gap-8">
            <Reveal type="fade">
              <Kicker>{t.relatedCase}</Kicker>
            </Reveal>
            <SmartLink
              href={routes.caseStudy(service.relatedCaseCard.slug)}
              data-cursor="view"
              className="group grid overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line) bg-(color:--tone-surface) md:grid-cols-[1.4fr_1fr]"
            >
              <div className="relative min-h-64">
                <Image
                  src={service.relatedCaseCard.hero.src}
                  alt={service.relatedCaseCard.hero.alt}
                  fill
                  sizes="(min-width: 768px) 720px, 100vw"
                  placeholder="blur"
                  blurDataURL={service.relatedCaseCard.hero.blurDataURL}
                  className="object-cover transition-transform duration-(--dur-scene) ease-(--ease-glide) group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
                <span className="font-mono text-xs tracking-[0.14em] text-(color:--tone-muted) uppercase">
                  {service.relatedCaseCard.clientName}
                </span>
                <H3 size="clamp(1.5rem,2.6vw,2.4rem)">{service.relatedCaseCard.title}</H3>
                <p className="text-(color:--tone-muted)">{service.relatedCaseCard.summary}</p>
              </div>
            </SmartLink>
          </Container>
        </Section>
      ) : null}

      <FaqAccordion
        head={{ kicker: service.shortTitle, title: t.faq }}
        items={service.faq.map((item, i) => ({ id: `${i + 1}`, q: item.q, a: item.a }))}
        chapter="Questions"
      />

      <Section tone="light" id="studio">
        <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <Kicker>{t.onAgency}</Kicker>
            <H3 size="clamp(1.4rem,2.4vw,2.2rem)">{service.title}</H3>
          </div>
          <Button href={service.agencyUrl} variant="secondary" size="lg">
            {ui.visitStudio}
          </Button>
        </Container>
      </Section>
    </>
  );
}
