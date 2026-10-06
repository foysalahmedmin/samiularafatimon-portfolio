import { createElement, type CSSProperties, type ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

const DISPLAY_SIZE = "clamp(2.6rem, 8.2vw, 7.5rem)";
const H2_SIZE = "clamp(2rem, 5vw, 4.25rem)";
const H3_SIZE = "clamp(1.25rem, 2vw, 1.75rem)";

const frame = (width: number, fontSize: string): CSSProperties => ({ "--wdth": width, fontSize }) as CSSProperties;

/** Small uppercase label above a heading. It names the section, nothing more. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-xs tracking-[0.18em] uppercase text-(color:--tone-muted)", className)}>
      {children}
    </p>
  );
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "div";

type HeadingProps = {
  as?: HeadingTag;
  /** Width axis, 62 (condensed, 9:16) to 125 (expanded, 16:9). */
  width?: number;
  /** CSS font-size, e.g. "clamp(2rem, 5vw, 4rem)". Overrides the default for this heading level. */
  size?: string;
  className?: string;
  /** Reveal line by line when scrolled into view. */
  reveal?: boolean;
  children: ReactNode;
};

function Heading({
  tag: Tag,
  width,
  size,
  className,
  reveal,
  children,
}: Required<Pick<HeadingProps, "width" | "size" | "reveal">> &
  Pick<HeadingProps, "className" | "children"> & { tag: HeadingTag }) {
  if (!reveal) {
    return createElement(Tag, { className, style: frame(width, size) }, children);
  }
  return (
    <Reveal as={Tag} type="mask" className={className} style={frame(width, size)}>
      {children}
    </Reveal>
  );
}

/** Page-level headline. */
export function Display({ as = "h1", width = 118, size = DISPLAY_SIZE, className, reveal = true, children }: HeadingProps) {
  return (
    <Heading
      tag={as}
      width={width}
      size={size}
      reveal={reveal}
      className={cn("reframe font-extrabold leading-[1.04] tracking-[-0.02em] text-balance", className)}
    >
      {children}
    </Heading>
  );
}

/** Section heading. */
export function H2({ as = "h2", width = 108, size = H2_SIZE, className, reveal = true, children }: HeadingProps) {
  return (
    <Heading
      tag={as}
      width={width}
      size={size}
      reveal={reveal}
      className={cn("reframe font-bold leading-[1.08] tracking-[-0.015em] text-balance", className)}
    >
      {children}
    </Heading>
  );
}

export function H3({ as = "h3", width = 100, size = H3_SIZE, className, children }: Omit<HeadingProps, "reveal">) {
  return createElement(as, { className: cn("reframe leading-[1.1] font-bold", className), style: frame(width, size) }, children);
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "max-w-[58ch] text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.55] text-(color:--tone-muted) text-pretty",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Mono data text: timecodes, labels, captions. */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-[0.78rem] tracking-[0.08em] uppercase", className)}>{children}</span>;
}
