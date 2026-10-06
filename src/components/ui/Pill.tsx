import { cn } from "@/lib/cn";

/** Availability pill: a pulsing REC dot and a short label. */
export function Pill({ label, className, live = true }: { label: string; className?: string; live?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-(color:--tone-line) px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.08em] uppercase",
        className,
      )}
    >
      <span className="relative flex size-2">
        {live ? <span className="rec-pulse absolute inset-0 rounded-full bg-rec" /> : null}
        <span className="relative size-2 rounded-full bg-rec" />
      </span>
      {label}
    </span>
  );
}
