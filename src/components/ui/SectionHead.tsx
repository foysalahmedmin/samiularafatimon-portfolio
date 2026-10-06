import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import type { Link } from "@/lib/content";
import { Button } from "./Button";
import { H2, Kicker, Lede } from "./Text";

type Props = {
  head: { kicker: string; title: string; lede?: string | undefined; cta?: Link | undefined };
  /** Show the CTA next to the heading (desktop). */
  withCta?: boolean;
  className?: string;
  as?: "h1" | "h2";
};

/** Kicker, headline, optional lede and CTA. Every section opens the same way. */
export function SectionHead({ head, withCta = true, className, as = "h2" }: Props) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="flex max-w-[44rem] flex-col gap-5">
        <Reveal type="fade">
          <Kicker>{head.kicker}</Kicker>
        </Reveal>
        <H2 as={as}>{head.title}</H2>
        {head.lede ? (
          <Reveal type="rise" delay={0.1}>
            <Lede>{head.lede}</Lede>
          </Reveal>
        ) : null}
      </div>
      {withCta && head.cta ? (
        <Reveal type="rise" delay={0.15} className="shrink-0">
          <Button href={head.cta.href} variant="secondary">
            {head.cta.label}
          </Button>
        </Reveal>
      ) : null}
    </div>
  );
}
