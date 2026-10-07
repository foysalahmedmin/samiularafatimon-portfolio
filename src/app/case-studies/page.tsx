import type { Metadata } from "next";
import { CaseStack } from "@/features/home/CaseStack";
import { ContactSection } from "@/features/shared/ContactSection";
import { PageHero } from "@/features/shared/PageHero";
import { getCaseStudies, getHome, getSeo, getUi } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ ...(await getSeo("caseStudies")), path: routes.caseStudies });
}

export default async function CaseStudiesPage() {
  const [cases, home, ui] = await Promise.all([getCaseStudies(), getHome(), getUi()]);
  return (
    <>
      <PageHero kicker={home.cases.kicker} title={home.cases.title} lede={home.cases.lede} />
      <CaseStack cases={cases} labels={{ readCase: ui.readCase, client: ui.caseStudy.client }} />
      <ContactSection />
    </>
  );
}
