"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Shows an email address; pressing it copies it and says so. */
export function CopyEmail({ email, copiedLabel, className }: { email: string; copiedLabel: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button type="button" onClick={copy} className={cn("u-link text-left", className)} data-cursor="link">
      {copied ? copiedLabel : email}
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
