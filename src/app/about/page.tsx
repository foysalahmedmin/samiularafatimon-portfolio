import type { CSSProperties } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { H3, Kicker, Mono } from "@/components/ui/Text";
import { Milestones } from "@/features/about/Milestones";
import { ContactSection } from "@/features/shared/ContactSection";
import { PageHero } from "@/features/shared/PageHero";
import { getAbout, getSeo, getSite } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ ...(await getSeo("about")), path: routes.about });
}

export default async function AboutPage() {
  const [about, site] = await Promise.all([getAbout(), getSite()]);
  const portrait = about.portrait;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: site.name,
            jobTitle: site.role,
            image: portrait.src,
            address: { "@type": "PostalAddress", addressLocality: site.location.city, addressCountry: site.location.country },
            worksFor: { "@type": "Organization", name: site.agency.name, url: site.agency.url },
            sameAs: site.socials.map((social) => social.url),
          },
        }}
      />
      <PageHero
        kicker={about.hero.kicker}
        title={about.hero.title}
        lede={about.hero.lede}
        aside={
          <Reveal type="wipe" className="overflow-hidden rounded-(--radius-lg)">
            <Parallax speed="medium" className="aspect-[4/5]">
              <Image
                data-reveal-media
                src={portrait.src}
                alt={portrait.alt}
                fill
                priority
                sizes="(min-width: 768px) 480px, 100vw"
                placeholder="blur"
                blurDataURL={portrait.blurDataURL}
                className="object-cover object-[50%_30%]"
              />
            </Parallax>
          </Reveal>
        }
      />

      <Section tone="light" chapter="Story" id="story">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <Reveal type="rise">
            <p className="reframe text-[clamp(1.8rem,3.6vw,3.2rem)] leading-[1.12] font-bold text-balance" style={{ "--wdth": 104 } as CSSProperties}>
              {about.statement}
            </p>
          </Reveal>
          <div className="flex flex-col gap-6">
            {about.story.map((paragraph) => (
              <Reveal key={paragraph} type="rise">
                <p className="max-w-[54ch] text-[1.12rem] leading-[1.7]">{paragraph}</p>
              </Reveal>
            ))}
            <Reveal as="dl" type="rise" stagger className="mt-4 grid gap-4 border-t border-(color:--tone-line) pt-6">
              {about.facts.map((fact) => (
                <div key={fact.label} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-6">
                  <dt>
                    <Mono className="text-(color:--tone-muted)">{fact.label}</Mono>
                  </dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      <Milestones kicker={about.hero.kicker} title={about.milestonesTitle} items={about.milestones} />

      <Section tone="light" chapter="Craft" id="craft">
        <Container className="grid gap-14 md:grid-cols-[1.2fr_1fr] md:gap-20">
          <div className="flex flex-col gap-6">
            <Reveal type="fade">
              <Kicker>{about.tools.title}</Kicker>
            </Reveal>
            <Reveal as="ul" type="rise" stagger className="flex flex-wrap gap-3">
              {about.tools.items.map((tool) => (
                <li key={tool.name} className="rounded-full border border-(color:--tone-line) px-5 py-3 text-[1.02rem]">
                  {tool.name}
                </li>
              ))}
            </Reveal>
          </div>
          <div className="flex flex-col gap-6">
            <Reveal type="fade">
              <Kicker>{about.education.title}</Kicker>
            </Reveal>
            <Reveal as="ul" type="rise" stagger className="flex flex-col divide-y divide-(color:--tone-line) border-y border-(color:--tone-line)">
              {about.education.items.map((item) => (
                <li key={item.name} className="py-4 text-[1.1rem]">
                  <H3 size="1.15rem">{item.name}</H3>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      <ContactSection />
    </>
  );
}
