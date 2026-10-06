import { cn } from "@/lib/cn";

type GlyphKind = "9:16" | "16:9" | "audio" | "motion" | "thumb";

/**
 * The format a service or work item delivers, drawn as a tiny frame. It carries real
 * information (aspect ratio, audio, motion), so it replaces decorative icons.
 */
export function Glyph({ kind, className, title }: { kind: GlyphKind; className?: string; title?: string }) {
  const common = {
    viewBox: "0 0 32 32",
    width: 28,
    height: 28,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn("shrink-0", className),
    role: title ? "img" : undefined,
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
  };

  switch (kind) {
    case "9:16":
      return (
        <svg {...common}>
          <rect x="10" y="4" width="12" height="24" rx="2.5" />
          <path d="M14 8h4" />
        </svg>
      );
    case "16:9":
      return (
        <svg {...common}>
          <rect x="3" y="9" width="26" height="14.5" rx="2.5" />
          <path d="M14 13.5v5l4.2-2.5-4.2-2.5Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "audio":
      return (
        <svg {...common}>
          <path d="M5 16v0M9 12v8M13 8v16M17 11v10M21 6v20M25 13v6M29 16v0" />
        </svg>
      );
    case "motion":
      return (
        <svg {...common}>
          <circle cx="9" cy="21" r="4" />
          <rect x="17" y="6" width="9" height="9" rx="1.5" />
          <path d="M5 8c5-5 11-3 12 3" />
        </svg>
      );
    case "thumb":
      return (
        <svg {...common}>
          <rect x="4" y="7" width="24" height="18" rx="2.5" />
          <path d="m4 21 6-5 5 4 4-3 9 6" />
          <circle cx="21.5" cy="12.5" r="1.6" />
        </svg>
      );
  }
}
