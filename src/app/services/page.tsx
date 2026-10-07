import type { Metadata } from "next";
import { ServiceIndex } from "@/features/home/ServiceIndex";
import { ProcessScene } from "@/features/home/ProcessScene";
import { ContactSection } from "@/features/shared/ContactSection";
import { PageHero } from "@/features/shared/PageHero";
import { getHome, getProcess, getSeo, getServices } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ ...(await getSeo("services")), path: routes.services });
}

export default async function ServicesPage() {
  const [home, services, stages] = await Promise.all([getHome(), getServices(), getProcess()]);
  return (
    <>
      <PageHero kicker={home.services.kicker} title={home.services.title} lede={home.services.lede} />
      <ServiceIndex services={services} chapter />
      <ProcessScene head={home.process} stages={stages} />
      <ContactSection />
    </>
  );
}
