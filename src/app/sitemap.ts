import type { MetadataRoute } from "next";
import { env } from "@/config/env.server";
import { getCaseStudySlugs, getServiceSlugs } from "@/lib/content";
import { routes, staticPaths } from "@/lib/routes";

/** Every public page. Privacy and Terms are listed too; they are real pages people look for. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, cases] = await Promise.all([getServiceSlugs(), getCaseStudySlugs()]);
  const now = new Date();
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${env.siteUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  });

  return [
    ...staticPaths.map((path) => entry(path, path === routes.home ? 1 : 0.7)),
    ...services.map((slug) => entry(routes.service(slug), 0.8)),
    ...cases.map((slug) => entry(routes.caseStudy(slug), 0.8)),
  ];
}
