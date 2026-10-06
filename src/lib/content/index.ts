/**
 * The only door to the site's data. Pages and components import from here, never from
 * `content/`. Every function is async on purpose: today they read typed files, tomorrow
 * they can call a CMS without any component changing.
 */
import {
  resolveCaseStudy,
  resolveImage,
  resolvePlayable,
  resolveStat,
  resolveTestimonial,
  resolveWorkItem,
  toCaseCard,
} from "./resolve";
import { store } from "./store";
import type {
  CaseStudyCard,
  NavigationData,
  ResolvedCaseStudy,
  ResolvedImage,
  ResolvedPlayable,
  ResolvedService,
  ResolvedStat,
  ResolvedTestimonial,
  ResolvedWorkItem,
  ServiceCard,
} from "./types";
import type { RouteKey } from "@content/schema/pages";

export type {
  CaseStudyCard,
  NavigationData,
  ResolvedCaseStudy,
  ResolvedImage,
  ResolvedPlayable,
  ResolvedService,
  ResolvedStat,
  ResolvedTestimonial,
  ResolvedVideo,
  ResolvedWorkItem,
  ResolvedYoutube,
  ServiceCard,
} from "./types";
export type { Aspect, Link, SeoMeta } from "@content/schema/common";
export type { Service, CaseStudy } from "@content/schema/collections";
export type {
  About,
  Client,
  Contact,
  Faq,
  FaqItem,
  Home,
  Pricing,
  ProcessStage,
  RouteKey,
  Seo,
  Stat,
  Testimonial,
  Ui,
  Work,
  WorkCategory,
  WorkItem,
} from "@content/schema/pages";
export type { Site } from "@content/schema/site";

/* ── Site-wide ── */

export async function getSite() {
  return store().site;
}

export async function getUi() {
  return store().ui;
}

export async function getNavigation(): Promise<NavigationData> {
  const { site, services } = store();
  return { nav: site.nav, services: services.map(toServiceCard) };
}

export async function getSeo(route: RouteKey) {
  const { seo } = store();
  return { ...seo.routes[route], titleTemplate: seo.titleTemplate, defaultTitle: seo.defaultTitle };
}

export async function getSeoDefaults() {
  const { seo } = store();
  return { titleTemplate: seo.titleTemplate, defaultTitle: seo.defaultTitle };
}

/* ── Pages ── */

export async function getHome() {
  return store().home;
}

export async function getAbout() {
  const about = store().about;
  return { ...about, portrait: resolveImage(about.portrait) };
}

export async function getContact() {
  return store().contact;
}

export async function getPricing() {
  return store().pricing;
}

export async function getFaq() {
  return store().faq;
}

export async function getProcess() {
  return store().processStages;
}

/* ── Proof ── */

export async function getStats(options: { featuredOnly?: boolean } = {}): Promise<ResolvedStat[]> {
  const all = store().stats.map((s) => resolveStat(s));
  return options.featuredOnly ? all.filter((s) => s.featured) : all;
}

export async function getClients() {
  return store().clients;
}

export async function getTestimonials(
  options: { featuredOnly?: boolean } = {},
): Promise<ResolvedTestimonial[]> {
  const all = store().testimonials;
  return (options.featuredOnly ? all.filter((t) => t.featured) : all).map(resolveTestimonial);
}

/* ── Work ── */

export async function getWorkItems(options: { featuredOnly?: boolean } = {}): Promise<ResolvedWorkItem[]> {
  const { items } = store().work;
  return (options.featuredOnly ? items.filter((i) => i.featured) : items).map(resolveWorkItem);
}

export async function getWorkItem(id: string): Promise<ResolvedWorkItem | undefined> {
  const item = store().work.items.find((i) => i.id === id);
  return item ? resolveWorkItem(item) : undefined;
}

/** Work-page copy and only the categories that actually have work in them. */
export async function getWorkPage() {
  const work = store().work;
  const used = new Set(work.items.map((i) => i.category));
  return {
    hero: work.hero,
    allLabel: work.allLabel,
    emptyLabel: work.emptyLabel,
    categories: work.categories.filter((c) => used.has(c.id)),
  };
}

/* ── Services ── */

const toServiceCard = ({ slug, title, shortTitle, summary, glyph }: ServiceCard): ServiceCard => ({
  slug,
  title,
  shortTitle,
  summary,
  glyph,
});

export async function getServices(): Promise<ServiceCard[]> {
  return store().services.map(toServiceCard);
}

export async function getServiceSlugs(): Promise<string[]> {
  return store().services.map((s) => s.slug);
}

export async function getService(slug: string): Promise<ResolvedService | undefined> {
  const { services, work, caseStudies } = store();
  const service = services.find((s) => s.slug === slug);
  if (!service) return undefined;
  const relatedCase = service.relatedCase ? caseStudies.find((c) => c.slug === service.relatedCase) : undefined;
  return {
    ...service,
    relatedWorkItems: work.items.filter((i) => service.relatedWork.includes(i.id)).map(resolveWorkItem),
    relatedCaseCard: relatedCase ? toCaseCard(relatedCase) : undefined,
  };
}

/* ── Case studies ── */

export async function getCaseStudies(): Promise<CaseStudyCard[]> {
  return store().caseStudies.map(toCaseCard);
}

export async function getCaseStudySlugs(): Promise<string[]> {
  return store().caseStudies.map((c) => c.slug);
}

export async function getCaseStudy(slug: string): Promise<ResolvedCaseStudy | undefined> {
  const caseStudy = store().caseStudies.find((c) => c.slug === slug);
  return caseStudy ? resolveCaseStudy(caseStudy) : undefined;
}

/* ── Media ── */

/**
 * Frames for the hero film ribbon: the reel poster, the work thumbnails and the case-study
 * heroes, repeated if needed to fill `count` frames.
 */
export async function getRibbonFrames(count = 14): Promise<ResolvedImage[]> {
  const { work, caseStudies } = store();
  const pool = [
    resolveImage("reel-poster"),
    ...work.items.filter((i) => i.featured).map((i) => resolveImage(i.thumbnail)),
    ...caseStudies.map((c) => resolveImage(c.hero)),
    ...work.items.filter((i) => !i.featured).map((i) => resolveImage(i.thumbnail)),
  ];
  return Array.from({ length: count }, (_, i) => pool[i % pool.length]!);
}

export async function getImage(id: string): Promise<ResolvedImage> {
  return resolveImage(id);
}

export async function getPlayable(id: string): Promise<ResolvedPlayable> {
  return resolvePlayable(id);
}
