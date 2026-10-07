import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LocalTime } from "@/components/ui/LocalTime";
import { Pill } from "@/components/ui/Pill";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Text";
import { ContactForm } from "@/features/contact/ContactForm";
import { CopyEmail } from "@/features/contact/CopyEmail";
import { PageHero } from "@/features/shared/PageHero";
import { getContact, getSeo, getSite } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ ...(await getSeo("contact")), path: routes.contact });
}

export default async function ContactPage() {
  const [contact, site] = await Promise.all([getContact(), getSite()]);
  const whatsapp = `https://wa.me/${site.contact.whatsapp.number}?text=${encodeURIComponent(site.contact.whatsapp.prefill)}`;

  return (
    <>
      <PageHero kicker={contact.hero.kicker} title={contact.hero.title} lede={contact.hero.lede} />
      <Section tone="light" chapter="Message" id="write">
        <Container className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <ContactForm form={contact.form} states={contact.states} />
          <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            <Kicker>{contact.alternatives.title}</Kicker>
            <div className="flex flex-col items-start gap-3">
              <Button href={site.contact.calendly}>{contact.alternatives.callLabel}</Button>
              <Button href={whatsapp} variant="secondary">
                {contact.alternatives.whatsappLabel}
              </Button>
            </div>
            <dl className="grid gap-5 border-t border-(color:--tone-line) pt-6">
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs tracking-[0.14em] text-(color:--tone-muted) uppercase">{contact.alternatives.emailLabel}</dt>
                <dd className="text-[1.15rem]">
                  <CopyEmail email={site.contact.email} copiedLabel={contact.alternatives.copiedLabel} />
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs tracking-[0.14em] text-(color:--tone-muted) uppercase">{contact.alternatives.whatsappLabel}</dt>
                <dd className="text-[1.15rem]">{site.contact.whatsapp.display}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs tracking-[0.14em] text-(color:--tone-muted) uppercase">{site.location.city}</dt>
                <dd className="font-mono text-[1.15rem] tabular-nums">
                  <LocalTime timezone={site.location.timezone} /> {site.location.offsetLabel}
                </dd>
              </div>
            </dl>
            {site.availability.open ? <Pill label={site.availability.label} className="self-start" /> : null}
            <p className="text-[0.9rem] text-(color:--tone-muted)">{contact.alternatives.responseNote}</p>
          </aside>
        </Container>
      </Section>
    </>
  );
}
