"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { readCapabilities, serverCapabilities, type Capabilities } from "./capabilities";
import { gsap, registerGsap, ScrollTrigger } from "./gsap";

type MotionValue = Capabilities & {
  /** The smooth-scroll instance, or null (reduced motion, touch, or not ready yet). */
  lenis: Lenis | null;
  /** True once capabilities are known on the client. Wait for it before creating animations. */
  ready: boolean;
};

const MotionContext = createContext<MotionValue>({ ...serverCapabilities, lenis: null, ready: false });

export const useMotion = () => useContext(MotionContext);

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const [value, setValue] = useState<MotionValue>({ ...serverCapabilities, lenis: null, ready: false });

  useEffect(() => {
    registerGsap();
    const caps = readCapabilities();

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | undefined;
    if (!caps.reduced) {
      // Lenis smooths wheel/trackpad scrolling; touch stays native (syncTouch: false).
      lenis = new Lenis({ lerp: 0.1, autoRaf: false, syncTouch: false, anchors: { offset: -72 } });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    lenisRef.current = lenis;

    const root = document.documentElement;
    root.classList.add("motion-ready");
    root.dataset.tier = caps.tier;
    // One-time sync of what the browser can do (it is unknown on the server), so a state update here is intended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue({ ...caps, lenis, ready: true });

    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
      root.classList.remove("motion-ready");
    };
  }, []);

  // New page: start at the top and re-measure every trigger once the new DOM is in.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const memo = useMemo(() => value, [value]);
  return <MotionContext.Provider value={memo}>{children}</MotionContext.Provider>;
}

/** Locks page scrolling while an overlay (menu, lightbox) is open. */
export function useScrollLock(locked: boolean) {
  const { lenis } = useMotion();
  useEffect(() => {
    if (!locked) return;
    lenis?.stop();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
      lenis?.start();
    };
  }, [locked, lenis]);
}
