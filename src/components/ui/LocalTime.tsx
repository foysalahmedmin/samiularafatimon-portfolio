"use client";

import { useEffect, useRef } from "react";

/** The current time in a time zone, as HH:MM, updated every 15 seconds. */
export function LocalTime({ timezone, className }: { timezone: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone });
    const tick = () => {
      if (ref.current) ref.current.textContent = format.format(new Date());
    };
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timezone]);

  return (
    <span ref={ref} suppressHydrationWarning className={className}>
      --:--
    </span>
  );
}
