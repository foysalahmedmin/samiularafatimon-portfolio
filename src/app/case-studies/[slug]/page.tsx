import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { CaseStudyView } from "@/features/case-study/CaseStudyView";
import { ContactSection } from "@/features/shared/ContactSection";
import { getCaseStudy, getCaseStudySlugs, getSite, getUi } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";
import { routes } from "@/lib/routes";

export async function generateStaticParams() {
  return (await getCaseStudySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  return pageMetadata({ ...study.seo, path: routes.caseStudy(slug) });
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const [study, ui, site] = await Promise.all([getCaseStudy(slug), getUi(), getSite()]);
  if (!study) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: study.title,
          description: study.seo.description,
          image: study.hero.src,
          author: { "@type": "Person", name: site.name },
          about: { "@type": "Organization", name: study.client.name },
        }}
      />
      <CaseStudyView study={study} ui={ui} />
      <ContactSection />
    </>
  );
}
