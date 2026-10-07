import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H3, Mono } from "@/components/ui/Text";
import { PageHero } from "@/features/shared/PageHero";
import type { LegalDoc } from "@/lib/content";

/** Plain long-form text: privacy and terms. Reveals only; nothing moves that doesn't have to. */
export function LegalView({ doc, email }: { doc: LegalDoc; email: string }) {
  return (
    <>
      <PageHero kicker={doc.kicker} title={doc.title} lede={doc.lede} />
      <Section tone="light" id="document" chapter="Document">
        <Container className="grid gap-12 md:grid-cols-[0.6fr_1.4fr] md:gap-20">
          <Reveal type="fade" className="md:sticky md:top-28 md:self-start">
            <Mono className="text-(color:--tone-muted)">
              {doc.updatedLabel}: {doc.updated}
            </Mono>
          </Reveal>
          <div className="flex flex-col gap-12">
            {doc.sections.map((section) => (
              <Reveal key={section.id} as="section" type="rise" id={section.id} className="flex flex-col gap-4">
                <H3 as="h2" size="clamp(1.4rem,2.2vw,1.9rem)">
                  {section.heading}
                </H3>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="max-w-[62ch] leading-[1.75]">
                    {paragraph.replaceAll("{email}", email)}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
