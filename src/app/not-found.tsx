import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Display } from "@/components/ui/Text";
import { getSeo, getUi } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("notFound");
  return { ...pageMetadata({ ...seo, path: "/404" }), robots: { index: false, follow: true } };
}

/** The frame that isn't in the timeline. */
export default async function NotFound() {
  const ui = await getUi();
  return (
    <Section tone="dark" first padded={false} id="not-found" chapter="404">
      <Container className="flex min-h-svh flex-col justify-center gap-8 py-32">
        <Reveal type="fade">
          <p className="font-mono text-sm tracking-[0.14em] text-(color:--c-signal) tabular-nums">00:00:00:00 · 404</p>
        </Reveal>
        <Display as="h1" size="clamp(2.6rem, 8vw, 7rem)" width={118} className="max-w-[14ch]">
          {ui.notFound.title}
        </Display>
        <Reveal type="rise" delay={0.1}>
          <p className="max-w-[46ch] text-[1.15rem] text-(color:--tone-muted)">{ui.notFound.lede}</p>
        </Reveal>
        <Reveal type="rise" delay={0.15} className="flex flex-wrap gap-3">
          <Button href={routes.home}>{ui.notFound.home}</Button>
          <Button href={routes.work} variant="secondary">
            {ui.notFound.work}
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
