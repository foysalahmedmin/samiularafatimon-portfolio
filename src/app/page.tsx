import type { CSSProperties } from "react";

// Temporary: proves fonts, tokens and the width axis. Replaced in Phase 3.
const wdth = (value: number) => ({ "--wdth": value }) as CSSProperties;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-[var(--container)] flex-col justify-center gap-10 px-[var(--gutter)] py-24">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-mist">Foundation · Phase 0</p>
      <h1
        className="reframe text-[clamp(2.75rem,10vw,9rem)] leading-[0.92] font-extrabold"
        style={wdth(125)}
      >
        Samiul Arafat Imon
      </h1>
      <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 text-3xl font-extrabold">
        <span className="reframe" style={wdth(62)}>
          Condensed 9:16
        </span>
        <span className="reframe" style={wdth(100)}>
          Regular
        </span>
        <span className="reframe" style={wdth(125)}>
          Expanded 16:9
        </span>
      </div>
      <p className="max-w-prose text-lg text-mist">
        Body copy in DM Sans on Ink. <span className="font-mono text-signal">00:00:00:00</span>
      </p>
    </main>
  );
}
