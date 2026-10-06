"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { Close, Menu } from "@/components/ui/Icons";
import { SmartLink } from "@/components/ui/Link";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Link, ServiceCard } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useMotion, useScrollLock } from "@/lib/motion/MotionProvider";

type HeaderProps = {
  name: string;
  monogram: string;
  nav: Link[];
  services: ServiceCard[];
  servicesHref: string;
  availability: { open: boolean; label: string };
  cta: Link;
  labels: { openMenu: string; closeMenu: string; menuTitle: string; services: string };
};

export function Header({ name, monogram, nav, services, servicesHref, availability, cta, labels }: HeaderProps) {
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const { lenis, ready } = useMotion();
  // An overlay is "open for" a path: when the route changes it is closed automatically.
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [servicesFor, setServicesFor] = useState<string | null>(null);
  const menuOpen = menuFor === pathname;
  const servicesOpen = servicesFor === pathname;
  const setMenuOpen = useCallback((open: boolean) => setMenuFor(open ? pathname : null), [pathname]);
  const setServicesOpen = useCallback((open: boolean) => setServicesFor(open ? pathname : null), [pathname]);
  const closeTimer = useRef<number | undefined>(undefined);

  useScrollLock(menuOpen);

  // Shrink after a little scroll; hide on the way down, show on the way up.
  useEffect(() => {
    const el = root.current;
    if (!el || !ready) return;
    let last = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      el.dataset.compact = y > 80 ? "true" : "false";
      const focusInside = el.contains(document.activeElement) && document.activeElement !== document.body;
      if (y > window.innerHeight * 1.2 && delta > 8 && !focusInside) hidden = true;
      else if (delta < -4 || y < 40) hidden = false;
      el.dataset.hidden = hidden && !menuOpen && !servicesOpen ? "true" : "false";
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    lenis?.on("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      lenis?.off("scroll", onScroll);
    };
  }, [ready, lenis, menuOpen, servicesOpen]);

  // Escape closes the services panel.
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [servicesOpen, setServicesOpen]);

  const openServices = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }, [setServicesOpen]);
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 120);
  }, [setServicesOpen]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <header
        ref={root}
        data-hidden="false"
        data-compact="false"
        className={cn(
          "site-header group/header fixed inset-x-0 top-0 z-50 border-b border-transparent",
          "data-[compact=true]:border-(color:--chrome-line) data-[compact=true]:bg-(color:--chrome-bg) data-[compact=true]:backdrop-blur-md",
          "data-[hidden=true]:-translate-y-full",
        )}
        style={{ viewTransitionName: "site-header" }}
      >
        <div className="mx-auto flex h-[76px] w-full max-w-(--container) items-center justify-between gap-6 px-(--gutter) transition-[height] duration-(--dur-ui) group-data-[compact=true]/header:h-[60px]">
          <SmartLink href="/" className="reframe text-[1.05rem] font-bold tracking-[-0.01em]" style={{ "--wdth": 112 } as CSSProperties} data-cursor="link">
            <span className="hidden sm:inline">{name}</span>
            <span className="sm:hidden">{monogram}.</span>
          </SmartLink>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {nav.map((item) =>
              item.href === servicesHref ? (
                <div key={item.href} className="relative" onMouseEnter={openServices} onMouseLeave={scheduleClose}>
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onClick={() => setServicesOpen(!servicesOpen)}
                    onFocus={openServices}
                    className={cn("u-link text-[0.95rem]", isActive(item.href) && "[background-size:100%_1px] [background-position:0_100%]")}
                  >
                    {item.label}
                  </button>
                  {servicesOpen ? (
                    <div
                      onMouseEnter={openServices}
                      onMouseLeave={scheduleClose}
                      className="absolute top-full left-1/2 mt-4 w-[34rem] -translate-x-1/2 rounded-(--radius-lg) border border-(color:--chrome-line) bg-(color:--c-console) p-3 text-(color:--c-bone) shadow-2xl"
                    >
                      <ul className="grid grid-cols-2 gap-1">
                        {services.map((service) => (
                          <li key={service.slug}>
                            <SmartLink
                              href={`${servicesHref}/${service.slug}`}
                              className="flex gap-3 rounded-(--radius-md) p-3 transition-colors hover:bg-white/5 focus-visible:bg-white/5"
                            >
                              <Glyph kind={service.glyph} className="mt-0.5 text-(color:--c-signal)" />
                              <span>
                                <span className="block text-[0.95rem] font-medium">{service.shortTitle}</span>
                                <span className="mt-0.5 block text-[0.8rem] leading-snug text-(color:--c-mist)">{service.summary}</span>
                              </span>
                            </SmartLink>
                          </li>
                        ))}
                      </ul>
                      <SmartLink href={servicesHref} className="u-link mx-3 mt-2 mb-1 inline-block text-[0.85rem] text-(color:--c-signal)">
                        {item.label}
                      </SmartLink>
                    </div>
                  ) : null}
                </div>
              ) : (
                <SmartLink
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn("u-link text-[0.95rem]", isActive(item.href) && "[background-size:100%_1px] [background-position:0_100%]")}
                >
                  {item.label}
                </SmartLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-4">
            {availability.open ? <Pill label={availability.label} className="hidden xl:inline-flex" /> : null}
            <span className="hidden sm:block">
              <Button href={cta.href} variant="primary">
                {cta.label}
              </Button>
            </span>
            <button
              type="button"
              aria-label={labels.openMenu}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="grid size-11 place-items-center rounded-full border border-(color:--chrome-line) lg:hidden"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <MobileMenu
          nav={nav}
          services={services}
          servicesHref={servicesHref}
          cta={cta}
          labels={labels}
          availability={availability}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
    </>
  );
}

function MobileMenu({
  nav,
  services,
  servicesHref,
  cta,
  labels,
  availability,
  onClose,
}: Pick<HeaderProps, "nav" | "services" | "servicesHref" | "cta" | "labels" | "availability"> & { onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-menu-item]", { yPercent: 100, opacity: 0, duration: 0.7, ease: "glide", stagger: 0.07, delay: 0.1 });
      gsap.from(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "cut" });
    },
    { scope: root },
  );

  // Focus trap + Escape.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const focusable = () =>
      Array.from(el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")).filter((n) => n.offsetParent !== null);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab") return;
      const nodes = focusable();
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={labels.menuTitle}
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-(color:--c-ink) px-(--gutter) pt-5 pb-10 text-(color:--c-bone)"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.18em] text-(color:--c-mist) uppercase">{labels.menuTitle}</span>
        <button
          type="button"
          aria-label={labels.closeMenu}
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full border border-white/15"
        >
          <Close />
        </button>
      </div>
      <nav aria-label="Primary" className="mt-10 flex flex-col">
        {nav.map((item) => (
          <div key={item.href} className="overflow-hidden border-b border-white/10">
            <SmartLink
              href={item.href}
              data-menu-item
              className="reframe block py-4 text-[clamp(2.25rem,11vw,4rem)] leading-none font-extrabold"
              style={{ "--wdth": 112 } as CSSProperties}
            >
              {item.label}
            </SmartLink>
          </div>
        ))}
      </nav>
      <ul className="mt-6 grid grid-cols-1 gap-1 text-[0.95rem] text-(color:--c-mist)">
        {services.map((service) => (
          <li key={service.slug} data-menu-item>
            <SmartLink href={`${servicesHref}/${service.slug}`} className="flex items-center gap-3 py-1.5">
              <Glyph kind={service.glyph} className="size-5 text-(color:--c-signal)" />
              {service.shortTitle}
            </SmartLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-5 pt-10" data-menu-item>
        {availability.open ? <Pill label={availability.label} className="self-start" /> : null}
        <Button href={cta.href} size="lg">
          {cta.label}
        </Button>
      </div>
    </div>
  );
}
