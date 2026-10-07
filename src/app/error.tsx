"use client";

import { useEffect, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Kicker } from "@/components/ui/Text";
import { useUiCopy } from "@/components/ui/UiCopy";

/** Something broke while rendering: say so, and offer a retry. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const ui = useUiCopy();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section tone="dark" first padded={false} id="error" chapter="Error">
      <Container className="flex min-h-svh flex-col justify-center gap-8 py-32">
        <Kicker>{error.digest ?? "Error"}</Kicker>
        <h1 className="reframe max-w-[16ch] text-[clamp(2.6rem,7vw,6rem)] leading-[1.04] font-extrabold text-balance" style={{ "--wdth": 112 } as CSSProperties}>
          {ui.error.title}
        </h1>
        <p className="max-w-[46ch] text-[1.15rem] text-(color:--tone-muted)">{ui.error.lede}</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>{ui.error.retry}</Button>
          <Button href="/" variant="secondary">
            {ui.notFound.home}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
