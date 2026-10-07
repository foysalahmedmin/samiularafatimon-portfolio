"use client";

import { useState, useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { Plus } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { cn } from "@/lib/cn";
import type { FaqItem } from "@/lib/content";

type FaqAccordionProps = {
  head: { kicker: string; title: string };
  items: Array<Pick<FaqItem, "id" | "q" | "a">>;
  chapter?: string;
};

const subscribeHash = (notify: () => void) => {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
};
const readHash = () => window.location.hash;

/** One question open at a time. Opens with a height animation; each question is deep-linkable (#faq-id). */
export function FaqAccordion({ head, items, chapter }: FaqAccordionProps) {
  // `undefined` means "the visitor has not chosen yet": follow the URL hash (#faq-id) if there is one.
  const [chosen, setChosen] = useState<string | null | undefined>(undefined);
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");
  const fromHash = hash.startsWith("#faq-") ? hash.slice(5) : null;
  const open = chosen !== undefined ? chosen : items.some((item) => item.id === fromHash) ? fromHash : null;
  const setOpen = (id: string | null) => setChosen(id);

  return (
    <Section tone="light" id="faq" chapter={chapter}>
      <Container className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <SectionHead head={head} withCta={false} className="md:block" />
        <ul className="border-b border-(color:--tone-line)">
          {items.map((item) => {
            const isOpen = open === item.id;
            return (
              <li key={item.id} id={`faq-${item.id}`} className="border-t border-(color:--tone-line)">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-[clamp(1.1rem,1.6vw,1.4rem)] font-medium"
                  >
                    {item.q}
                    <Plus
                      className={cn(
                        "shrink-0 transition-transform duration-(--dur-ui) ease-(--ease-glide)",
                        isOpen && "rotate-45",
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  className={cn(
                    "grid transition-[grid-template-rows] duration-(--dur-ui) ease-(--ease-glide)",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[60ch] pb-7 leading-[1.7] text-(color:--tone-muted)">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
