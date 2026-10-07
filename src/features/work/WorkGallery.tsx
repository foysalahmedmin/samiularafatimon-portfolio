"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { ResolvedWorkItem, WorkCategory } from "@/lib/content";
import { Flip, gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";
import { Lightbox } from "./Lightbox";
import { WorkCard } from "./WorkCard";

type WorkGalleryProps = {
  items: ResolvedWorkItem[];
  categories: WorkCategory[];
  labels: {
    all: string;
    empty: string;
    filter: string;
    watch: string;
    close: string;
    previous: string;
    next: string;
    play: string;
    videoUnavailable: string;
    openOriginal: string;
  };
};

/** Filterable grid of work. Filtering re-flows the grid with Flip; a card opens the lightbox (?v=id is deep-linkable). */
export function WorkGallery({ items, categories, labels }: WorkGalleryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { reduced } = useMotion();
  const [filter, setFilter] = useState("all");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = items.filter((item) => filter === "all" || item.category === filter);
  const openId = params.get("v");
  const open = openId ? items.find((item) => item.id === openId) : undefined;
  const categoryOf = (id: string) => categories.find((c) => c.id === id);

  const choose = (id: string) => {
    if (id === filter) return;
    if (!reduced) flipState.current = Flip.getState("[data-work-tile]");
    setFilter(id);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.5,
      ease: "cut",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.2 }),
    });
  }, [filter]);

  const close = useCallback(() => router.replace(pathname, { scroll: false }), [router, pathname]);
  const step = useCallback(
    (direction: 1 | -1) => {
      if (!open) return;
      const index = visible.findIndex((item) => item.id === open.id);
      const next = visible[(index + direction + visible.length) % visible.length];
      if (next) router.replace(`${pathname}?v=${next.id}`, { scroll: false });
    },
    [open, visible, router, pathname],
  );

  return (
    <Container className="pb-[var(--section-y)]">
      <div role="group" aria-label={labels.filter} className="mb-10 flex flex-wrap gap-2">
        {[{ id: "all", label: labels.all, glyph: undefined }, ...categories].map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={filter === category.id}
            onClick={() => choose(category.id)}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full border px-5 text-[0.92rem] transition-colors duration-(--dur-ui)",
              filter === category.id
                ? "border-(color:--tone-accent) bg-(color:--tone-accent) text-(color:--c-ink)"
                : "border-(color:--tone-line) text-(color:--tone-fg) hover:border-(color:--tone-accent)",
            )}
          >
            {category.glyph ? <Glyph kind={category.glyph} className="size-5" /> : null}
            {category.label}
          </button>
        ))}
      </div>

      <div ref={grid} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} data-work-tile className={cn(filter !== "all" && item.category !== filter && "hidden")}>
            <WorkCard item={item} category={categoryOf(item.category)} watchLabel={labels.watch} className="w-full" />
          </div>
        ))}
      </div>
      {visible.length === 0 ? <p className="mt-6 text-(color:--tone-muted)">{labels.empty}</p> : null}

      {open ? (
        <Lightbox
          key={open.id}
          item={open}
          category={categoryOf(open.category)}
          labels={labels}
          onClose={close}
          onStep={step}
        />
      ) : null}
    </Container>
  );
}
