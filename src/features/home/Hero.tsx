"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { RibbonStage } from "@/features/ribbon/RibbonStage";
import { ribbonStore } from "@/features/ribbon/ribbonStore";
import type { Link, ResolvedImage } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/MotionProvider";

type HeroProps = {
  name: string;
  kicker: string;
  headline: string;
  sub: string;
  primary: Link;
  secondary: Link;
  frames: ResolvedImage[];
};

/**
 * The title card. The name is set as stacked lines whose width axis is fitted to the column
 * (type that reframes), a film ribbon of real frames turns behind it, and scrolling dollies the
 * camera in and unrolls the ribbon into a strip while the hero is pinned.
 */
export function Hero({ name, kicker, headline, sub, primary, secondary, frames }: HeroProps) {
  const pin = useRef<HTMLDivElement>(null);
  const nameBox = useRef<HTMLHeadingElement>(null);
  const { ready, reduced } = useMotion();
  const words = name.split(" ");

  // Fit each line of the name to the column by changing only the width axis.
  useEffect(() => {
    const box = nameBox.current;
    if (!box) return;
    const lines = Array.from(box.querySelectorAll<HTMLElement>("[data-name-line]"));
    const fit = () => {
      const target = box.clientWidth;
      for (const line of lines) {
        let low = 62;
        let high = 125;
        let best = 62;
        for (let i = 0; i < 7; i += 1) {
          const mid = (low + high) / 2;
          line.style.setProperty("--wdth", String(mid));
          if (line.offsetWidth <= target) {
            best = mid;
            low = mid;
          } else high = mid;
        }
        line.style.setProperty("--wdth", String(best));
      }
    };
    fit();
    void document.fonts?.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const el = pin.current;
      if (!el || !ready) return;
      const booting = !document.documentElement.classList.contains("boot-skip");
      const start = booting ? 1.15 : 0.1;

      if (!reduced) {
        gsap.set("[data-hero-in]", { opacity: 1 });
        gsap.from("[data-hero-line]", { yPercent: 108, duration: 1.1, ease: "glide", stagger: 0.09, delay: start });
        gsap.from("[data-hero-rise]", { y: 28, opacity: 0, duration: 0.9, ease: "glide", stagger: 0.08, delay: start + 0.35 });
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              ribbonStore.progress = self.progress;
            },
          },
        });
        tl.to("[data-hero-fade]", { opacity: 0, y: -48, duration: 0.55 }, 0).to(
          "[data-hero-name]",
          { yPercent: -10, scale: 0.92, opacity: 0.18, duration: 1, transformOrigin: "0% 50%" },
          0,
        );
        return () => {
          ribbonStore.progress = 0;
        };
      });
      mm.add("(max-width: 767px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            ribbonStore.progress = self.progress * 0.5;
          },
        });
        return () => {
          trigger.kill();
          ribbonStore.progress = 0;
        };
      });
      return () => mm.revert();
    },
    { scope: pin, dependencies: [ready, reduced] },
  );

  return (
    <Section tone="dark" first padded={false} exitParallax={false} chapter="Title" id="title">
      <div ref={pin} className="relative isolate flex min-h-svh flex-col overflow-hidden md:h-svh">
        <RibbonStage frames={frames} className="absolute inset-0 -z-10" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_78%_44%,rgba(31,181,221,0.16),transparent_70%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--c-ink)_0%,rgba(5,13,20,0.55)_38%,transparent_70%)] md:block" />

        <div className="mx-auto flex w-full max-w-(--container) flex-1 flex-col justify-between gap-6 px-(--gutter) pt-[96px] pb-[84px] md:pt-[100px]">
          <p
            data-reveal="hero"
            data-hero-in
            data-hero-fade
            className="font-mono text-xs tracking-[0.18em] text-(color:--tone-muted) uppercase"
          >
            <span data-hero-rise className="inline-block">
              {kicker}
            </span>
          </p>

          <h1
            ref={nameBox}
            data-hero-name
            className="reframe w-full max-w-[min(100%,62rem)] text-[clamp(3rem,min(11vw,16vh),10.5rem)] leading-[0.86] font-extrabold tracking-[-0.025em] md:w-[56%]"
            style={{ "--wdth": 125 } as CSSProperties}
          >
            <span className="sr-only">{name}, video editor</span>
            <span aria-hidden="true" className="block">
              {words.map((word) => (
                <span key={word} data-reveal="hero" data-hero-in className="block overflow-hidden pb-[0.06em]">
                  <span data-hero-line data-name-line className="reframe inline-block" style={{ "--wdth": 125 } as CSSProperties}>
                    {word}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className="flex flex-col gap-7 md:max-w-[34rem]" data-hero-fade>
            <div data-reveal="hero" data-hero-in className="flex flex-col gap-4">
              <p data-hero-rise className="reframe text-[clamp(1.35rem,2.3vw,2rem)] leading-[1.12] font-bold text-balance" style={{ "--wdth": 104 } as CSSProperties}>
                {headline}
              </p>
              <p data-hero-rise className="max-w-[46ch] text-[1.02rem] leading-[1.55] text-(color:--tone-muted) text-pretty [@media(max-height:790px)]:hidden">
                {sub}
              </p>
            </div>
            <div data-reveal="hero" data-hero-in className="flex flex-wrap items-center gap-3">
              <span data-hero-rise>
                <Button href={primary.href} size="lg">
                  {primary.label}
                </Button>
              </span>
              <span data-hero-rise>
                <Button href={secondary.href} variant="secondary" size="lg">
                  {secondary.label}
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
