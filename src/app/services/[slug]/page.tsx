import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactSection } from "@/features/shared/ContactSection";
import { ServiceView } from "@/features/services/ServiceView";
import { getImage, getService, getServiceSlugs, getSite, getUi, getWorkPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/routes";

export async function generateStaticParams() {
  return (await getServiceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return pageMetadata({ ...service.seo, path: routes.service(slug) });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, ui, site, work, fallbackImage] = await Promise.all([
    getService(slug),
    getUi(),
    getSite(),
    getWorkPage(),
    getImage("reel-poster"),
  ]);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.seo.description,
            provider: { "@type": "Person", name: site.name },
            areaServed: "Worldwide",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          },
        ]}
      />
      <ServiceView
        service={service}
        ui={ui}
        bookCall={{ label: ui.bookCall, href: site.contact.calendly }}
        categories={work.categories}
        fallbackImage={fallbackImage}
      />
      <ContactSection />
    </>
  );
}
