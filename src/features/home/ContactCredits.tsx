import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LocalTime } from "@/components/ui/LocalTime";
import { Pill } from "@/components/ui/Pill";
import { Section } from "@/components/ui/Section";
import { Display, Kicker } from "@/components/ui/Text";
import { Reveal } from "@/components/motion/Reveal";
import type { Link } from "@/lib/content";

type ContactCreditsProps = {
  headline: string;
  sub: string;
  kicker: string;
  primary: Link;
  whatsapp: Link;
  email: Link;
  availability: { open: boolean; label: string };
  location: { city: string; timezone: string; offsetLabel: string };
};

/** The last scene: the ask, three ways to reach out, and the local time in Dhaka. */
export function ContactCredits({ headline, sub, kicker, primary, whatsapp, email, availability, location }: ContactCreditsProps) {
  return (
    <Section tone="dark" chapter="Contact" id="contact">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <Reveal type="fade">
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Display as="h2" width={118} size="clamp(3rem, 10vw, 9.5rem)" className="max-w-[14ch]">
            {headline}
          </Display>
          <Reveal type="rise" delay={0.1}>
            <p className="max-w-[44ch] text-[clamp(1.05rem,1.4vw,1.3rem)] text-(color:--tone-muted)">{sub}</p>
          </Reveal>
        </div>
        <Reveal type="rise" delay={0.15} className="flex flex-wrap items-center gap-3">
          <Button href={primary.href} size="lg">
            {primary.label}
          </Button>
          <Button href={whatsapp.href} variant="secondary" size="lg">
            {whatsapp.label}
          </Button>
          <Button href={email.href} variant="ghost" size="lg">
            {email.label}
          </Button>
        </Reveal>
        <Reveal type="fade" className="flex flex-wrap items-center gap-4 border-t border-(color:--tone-line) pt-6">
          {availability.open ? <Pill label={availability.label} /> : null}
          <span className="font-mono text-xs tracking-[0.14em] text-(color:--tone-muted) uppercase">
            {location.city} · <LocalTime timezone={location.timezone} className="tabular-nums text-(color:--tone-fg)" /> {location.offsetLabel}
          </span>
        </Reveal>
      </Container>
    </Section>
  );
}
