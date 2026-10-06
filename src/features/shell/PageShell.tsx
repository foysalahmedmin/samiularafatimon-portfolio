import type { ReactNode } from "react";
import { ChromeTone } from "@/components/motion/ChromeTone";
import { Cursor } from "@/components/motion/Cursor";
import { getNavigation, getServices, getSite, getUi } from "@/lib/content";
import { routes } from "@/lib/routes";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { TimelineBar } from "./TimelineBar";

/** Header, timeline bar, footer and the invisible helpers every page shares. */
export async function PageShell({ children }: { children: ReactNode }) {
  const [site, ui, navigation, services] = await Promise.all([getSite(), getUi(), getNavigation(), getServices()]);
  const cta = { label: ui.bookCall, href: site.contact.calendly };

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-(color:--c-signal) px-5 py-3 font-medium text-(color:--c-ink) focus:translate-y-0"
      >
        {ui.skipToContent}
      </a>
      <Header
        name={site.name}
        monogram={site.monogram}
        nav={navigation.nav}
        services={navigation.services}
        servicesHref={routes.services}
        availability={site.availability}
        cta={cta}
        labels={{
          openMenu: ui.openMenu,
          closeMenu: ui.closeMenu,
          menuTitle: ui.menuTitle,
          services: site.nav.find((item) => item.href === routes.services)?.label ?? "",
        }}
      />
      <main id="main">{children}</main>
      <Footer site={site} ui={ui} services={services} />
      <TimelineBar
        runtimeSec={site.timelineRuntimeSec}
        cta={cta}
        labels={{ chapters: ui.chaptersLabel, playhead: ui.playheadLabel }}
      />
      <ChromeTone />
      <Cursor />
    </>
  );
}
