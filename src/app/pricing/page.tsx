import type { Metadata } from "next";
import { FaqAccordion } from "@/features/home/FaqAccordion";
import { PricingView } from "@/features/pricing/PricingView";
import { ContactSection } from "@/features/shared/ContactSection";
import { getFaq, getHome, getPricing, getSeo } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ ...(await getSeo("pricing")), path: routes.pricing });
}

export default async function PricingPage() {
  const [pricing, faq, home] = await Promise.all([getPricing(), getFaq(), getHome()]);
  return (
    <>
      <PricingView pricing={pricing} />
      <FaqAccordion head={home.faq} items={faq.groups.flatMap((group) => group.items)} chapter="FAQ" />
      <ContactSection />
    </>
  );
}
