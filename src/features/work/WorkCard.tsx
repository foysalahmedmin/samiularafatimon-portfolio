"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { SmartLink } from "@/components/ui/Link";
import { cn } from "@/lib/cn";
import type { ResolvedWorkItem, WorkCategory } from "@/lib/content";
import { useMotion } from "@/lib/motion/MotionProvider";
import { routes } from "@/lib/routes";

type WorkCardProps = {
  item: ResolvedWorkItem;
  category: WorkCategory | undefined;
  watchLabel: string;
  /** Home track: fixed height with parallax inside. Grid: fills its cell. */
  variant?: "track" | "grid";
  className?: string;
};

/** A work card. It plays a silent preview while a fine pointer is on it, and opens the lightbox on /work. */
export function WorkCard({ item, category, watchLabel, variant = "grid", className }: WorkCardProps) {
  const { finePointer, reduced } = useMotion();
  const [hover, setHover] = useState(false);
  const preview = item.media.kind === "video" ? item.media.preview : undefined;

  return (
    <article
      data-work-card
      data-work-tile
      data-cursor="play"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={cn(
        "group relative overflow-hidden rounded-(--radius-lg) border border-(color:--tone-line) bg-(color:--tone-surface)",
        variant === "track" && "h-[min(50vh,440px)] shrink-0 snap-center",
        className,
      )}
      style={{ aspectRatio: item.aspect.replace(":", " / ") }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          data-work-media
          src={item.thumbnail.src}
          alt={item.thumbnail.alt}
          fill
          sizes={variant === "track" ? "(min-width: 768px) 780px, 86vw" : "(min-width: 1280px) 440px, (min-width: 640px) 50vw, 100vw"}
          placeholder="blur"
          blurDataURL={item.thumbnail.blurDataURL}
          className={cn(
            "object-cover transition-transform duration-(--dur-scene) ease-(--ease-glide)",
            variant === "track" ? "scale-[1.14] group-hover:scale-[1.2]" : "group-hover:scale-[1.05]",
          )}
        />
      </div>
      {hover && preview && finePointer && !reduced ? (
        <video src={preview} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" aria-hidden="true" />
      ) : null}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(5,13,20,0.88))]" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 md:p-6">
        <span className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] text-(color:--c-bone)/80 uppercase">
          {category ? <Glyph kind={category.glyph} className="size-5 text-(color:--c-signal)" /> : null}
          {category?.label}
          {item.client ? <span className="text-(color:--c-bone)/50">· {item.client}</span> : null}
        </span>
        <h3
          className="reframe text-[clamp(1.2rem,1.9vw,1.75rem)] leading-[1.08] font-bold text-(color:--c-bone)"
          style={{ "--wdth": 102 } as CSSProperties}
        >
          {item.title}
        </h3>
      </div>
      <SmartLink
        href={`${routes.work}?v=${item.id}`}
        scroll={false}
        aria-label={`${watchLabel}: ${item.title}`}
        className="absolute inset-0 z-10"
      />
    </article>
  );
}
