import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Glyph } from "@/components/ui/Glyph";
import { ArrowRight } from "@/components/ui/Icons";
import { SmartLink } from "@/components/ui/Link";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Link, ServiceCard } from "@/lib/content";
import { routes } from "@/lib/routes";

type ServiceIndexProps = {
  head: { kicker: string; title: string; lede?: string | undefined; cta?: Link | undefined };
  services: ServiceCard[];
  chapter?: boolean;
};

/**
 * Services as an editorial index. Each row carries the format it delivers as a small frame
 * glyph (9:16, 16:9, audio…) and its title re-frames from condensed to wide on hover.
 */
export function ServiceIndex({ head, services, chapter = true }: ServiceIndexProps) {
  return (
    <Section tone="light" chapter={chapter ? "Services" : undefined} id={chapter ? "services" : undefined}>
      <Container>
        <SectionHead head={head} />
        <Reveal as="ul" type="rise" stagger className="mt-14 border-b border-(color:--tone-line)">
          {services.map((service) => (
            <li key={service.slug} className="border-t border-(color:--tone-line)">
              <SmartLink
                href={routes.service(service.slug)}
                data-cursor="view"
                className="group grid items-center gap-x-8 gap-y-3 py-7 md:grid-cols-[3.5rem_1.4fr_1fr_2.5rem] md:py-9"
              >
                <Glyph kind={service.glyph} className="size-8 text-(color:--tone-accent)" />
                <span
                  className="reframe text-[clamp(1.85rem,4.2vw,3.6rem)] leading-[1] font-bold tracking-[-0.015em] [transition:--wdth_var(--dur-scene)_var(--ease-glide)] group-hover:[--wdth:125] group-focus-visible:[--wdth:125]"
                  style={{ "--wdth": 92 } as CSSProperties}
                >
                  {service.title}
                </span>
                <span className="max-w-[38ch] text-(color:--tone-muted)">{service.summary}</span>
                <ArrowRight className="hidden justify-self-end transition-transform duration-(--dur-ui) ease-(--ease-glide) group-hover:translate-x-1.5 md:block" size={26} />
              </SmartLink>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
