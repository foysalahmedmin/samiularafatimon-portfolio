import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { socialIcons } from "@/components/ui/Icons";
import { SmartLink, TextLink } from "@/components/ui/Link";
import { Mono } from "@/components/ui/Text";
import type { Service, Site, Ui } from "@/lib/content";
import { routes } from "@/lib/routes";

type FooterProps = { site: Site; ui: Ui; services: Array<Pick<Service, "slug" | "shortTitle">> };

/** The footer is laid out as end credits: a role in small mono, a name in big type. */
export function Footer({ site, ui, services }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer data-footer>
      <Section tone="dark" exitParallax={false} className="pb-10">
        <div className="mx-auto w-full max-w-(--container) px-(--gutter)">
          <Reveal as="dl" type="rise" stagger className="divide-y divide-(color:--tone-line) border-y border-(color:--tone-line)">
            {site.footer.credits.map((credit) => (
              <div key={credit.role} className="grid gap-1 py-5 md:grid-cols-[14rem_1fr] md:items-baseline md:gap-8 md:py-7">
                <dt>
                  <Mono className="text-(color:--tone-muted)">{credit.role}</Mono>
                </dt>
                <dd className="reframe text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.05] font-bold" style={{ "--wdth": 108 } as CSSProperties}>
                  {credit.href ? (
                    <TextLink href={credit.href} externalLabel={ui.externalLink}>
                      {credit.value}
                    </TextLink>
                  ) : (
                    credit.value
                  )}
                </dd>
              </div>
            ))}
            <div className="grid gap-3 py-5 md:grid-cols-[14rem_1fr] md:items-baseline md:gap-8 md:py-7">
              <dt>
                <Mono className="text-(color:--tone-muted)">{site.footer.elsewhereTitle}</Mono>
              </dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-3">
                {site.socials.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <SmartLink
                      key={social.platform}
                      href={social.url}
                      externalLabel={ui.externalLink}
                      className="group inline-flex items-center gap-2 text-[1.05rem] text-(color:--tone-fg)"
                      data-cursor="link"
                    >
                      <Icon className="text-(color:--tone-accent)" />
                      <span className="u-link">{social.label}</span>
                    </SmartLink>
                  );
                })}
              </dd>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-[14rem_1fr_1fr] md:gap-8">
            <p className="font-mono text-xs tracking-[0.18em] text-(color:--tone-muted) uppercase">{site.monogram}.</p>
            <nav aria-label="Explore">
              <Mono className="text-(color:--tone-muted)">{site.footer.groups[0]?.title}</Mono>
              <ul className="mt-4 grid gap-2">
                {site.footer.groups[0]?.links.map((link) => (
                  <li key={link.href}>
                    <TextLink href={link.href}>{link.label}</TextLink>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Services">
              <Mono className="text-(color:--tone-muted)">{site.footer.servicesTitle}</Mono>
              <ul className="mt-4 grid gap-2">
                {services.map((service) => (
                  <li key={service.slug}>
                    <TextLink href={routes.service(service.slug)}>{service.shortTitle}</TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-(color:--tone-line) pt-6 text-[0.85rem] text-(color:--tone-muted) md:flex-row md:items-center md:justify-between">
            <p>{site.footer.copyright.replace("{year}", String(year))}</p>
            <ul className="flex gap-6">
              {site.footer.legal.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </footer>
  );
}
