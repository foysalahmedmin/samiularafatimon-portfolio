"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Ui } from "@/lib/content";

const UiCopyContext = createContext<Ui | null>(null);

/** Hands the site's microcopy to client components that cannot receive props (error boundaries). */
export function UiCopyProvider({ ui, children }: { ui: Ui; children: ReactNode }) {
  return <UiCopyContext.Provider value={ui}>{children}</UiCopyContext.Provider>;
}

export function useUiCopy(): Ui {
  const ui = useContext(UiCopyContext);
  if (!ui) throw new Error("useUiCopy needs a UiCopyProvider above it");
  return ui;
}
