import type { Metadata } from "next";
import { LegalView } from "@/features/legal/LegalView";
import { getLegal, getSeo, getSite } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({ ...(await getSeo("terms")), path: routes.terms });
}

export default async function TermsPage() {
  const [doc, site] = await Promise.all([getLegal("terms"), getSite()]);
  return <LegalView doc={doc} email={site.contact.email} />;
}
