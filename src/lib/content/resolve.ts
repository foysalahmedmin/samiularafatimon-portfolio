import { store } from "./store";
import type {
  CaseStudyCard,
  ResolvedCaseStudy,
  ResolvedImage,
  ResolvedPlayable,
  ResolvedStat,
  ResolvedTestimonial,
  ResolvedWorkItem,
} from "./types";
import type { CaseStudy } from "@content/schema/collections";
import type { Stat, Testimonial, WorkItem } from "@content/schema/pages";

export const MEDIA_BASE = "/media/";
export const PREVIEW_BASE = "/media/previews/";

export function resolveImage(id: string): ResolvedImage {
  const { media, mediaManifest } = store();
  const item = media.find((m) => m.id === id);
  if (!item || item.kind !== "image") throw new Error(`Media "${id}" is not an image`);
  const meta = mediaManifest[id];
  if (!meta) throw new Error(`Media "${id}" has no size entry. Run pnpm media:sync`);
  return {
    id,
    src: `${MEDIA_BASE}${item.file}`,
    alt: item.decorative ? "" : item.alt,
    width: meta.width,
    height: meta.height,
    blurDataURL: meta.blurDataURL,
    decorative: item.decorative === true,
  };
}

export function resolvePlayable(id: string): ResolvedPlayable {
  const item = store().media.find((m) => m.id === id);
  if (!item || item.kind === "image") throw new Error(`Media "${id}" is not a video`);
  if (item.kind === "video") {
    return {
      kind: "video",
      id,
      title: item.title,
      aspect: item.aspect,
      src: item.src,
      poster: resolveImage(item.poster),
      preview: item.preview ? `${PREVIEW_BASE}${item.preview}` : undefined,
    };
  }
  return {
    kind: "youtube",
    id,
    title: item.title,
    aspect: item.aspect,
    videoId: item.videoId,
    thumbnail: resolveImage(item.thumbnail),
    watchUrl: `https://www.youtube.com/watch?v=${item.videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.videoId}`,
  };
}

export function resolveStat(stat: Stat, now = new Date()): ResolvedStat {
  const { site } = store();
  const value =
    stat.kind === "years-since-career-start"
      ? Math.max(0, now.getFullYear() - site.careerStartYear.value)
      : (stat.value ?? 0);
  return {
    id: stat.id,
    suffix: stat.suffix,
    label: stat.label,
    scope: stat.scope,
    featured: stat.featured,
    needsReview: stat.needsReview,
    reviewNote: stat.reviewNote,
    value,
    display: `${value}${stat.suffix}`,
  };
}

export function resolveWorkItem(item: WorkItem): ResolvedWorkItem {
  return { ...item, media: resolvePlayable(item.media), thumbnail: resolveImage(item.thumbnail) };
}

export function resolveTestimonial(testimonial: Testimonial): ResolvedTestimonial {
  return { ...testimonial, photo: testimonial.photo ? resolveImage(testimonial.photo) : undefined };
}

export function toCaseCard(caseStudy: CaseStudy): CaseStudyCard {
  return {
    slug: caseStudy.slug,
    title: caseStudy.title,
    summary: caseStudy.summary,
    formats: caseStudy.formats,
    clientName: caseStudy.client.name,
    industry: caseStudy.client.industry,
    hero: resolveImage(caseStudy.hero),
  };
}

export function resolveCaseStudy(caseStudy: CaseStudy): ResolvedCaseStudy {
  const { services, caseStudies, testimonials } = store();
  const testimonial = caseStudy.testimonial
    ? testimonials.find((t) => t.id === caseStudy.testimonial)
    : undefined;
  const next = caseStudies.find((c) => c.slug === caseStudy.next);
  if (!next) throw new Error(`Case study "${caseStudy.slug}" points at unknown next "${caseStudy.next}"`);
  return {
    ...caseStudy,
    hero: resolveImage(caseStudy.hero),
    client: {
      ...caseStudy.client,
      logo: caseStudy.client.logo ? resolveImage(caseStudy.client.logo) : undefined,
    },
    testimonial: testimonial ? resolveTestimonial(testimonial) : undefined,
    serviceLinks: services
      .filter((s) => caseStudy.services.includes(s.slug))
      .map(({ slug, title, shortTitle }) => ({ slug, title, shortTitle })),
    nextCase: toCaseCard(next),
  };
}
