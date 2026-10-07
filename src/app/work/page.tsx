import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/ui/Section";
import { ContactSection } from "@/features/shared/ContactSection";
import { PageHero } from "@/features/shared/PageHero";
import { WorkGallery } from "@/features/work/WorkGallery";
import { getSeo, getUi, getWorkItems, getWorkPage } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ ...(await getSeo("work")), path: routes.work });
}

export default async function WorkPage() {
  const [page, items, ui] = await Promise.all([getWorkPage(), getWorkItems(), getUi()]);
  return (
    <>
      <PageHero kicker={page.hero.kicker} title={page.hero.title} lede={page.hero.lede} />
      <Section tone="dark" chapter="Gallery" id="gallery" padded={false} className="pt-[calc(var(--sheet-r)+3rem)]">
        <Suspense fallback={null}>
          <WorkGallery
            items={items}
            categories={page.categories}
            labels={{
              all: page.allLabel,
              empty: page.emptyLabel,
              filter: page.filterLabel,
              watch: ui.watch,
              close: ui.close,
              previous: ui.previous,
              next: ui.next,
              play: ui.play,
              videoUnavailable: ui.videoUnavailable,
              openOriginal: page.openOriginal,
            }}
          />
        </Suspense>
      </Section>
      <ContactSection />
    </>
  );
}
