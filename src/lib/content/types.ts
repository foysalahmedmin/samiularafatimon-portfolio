import type { CaseStudy, Service } from "@content/schema/collections";
import type { Aspect } from "@content/schema/common";
import type { Stat, Testimonial, WorkItem } from "@content/schema/pages";

/** A still image, ready to hand to next/image. */
export type ResolvedImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
  decorative: boolean;
};

export type ResolvedVideo = {
  kind: "video";
  id: string;
  title: string;
  aspect: Aspect;
  src: string;
  poster: ResolvedImage;
  /** Short silent clip for hover, or undefined. */
  preview: string | undefined;
};

export type ResolvedYoutube = {
  kind: "youtube";
  id: string;
  title: string;
  aspect: Aspect;
  videoId: string;
  thumbnail: ResolvedImage;
  watchUrl: string;
  embedUrl: string;
};

export type ResolvedPlayable = ResolvedVideo | ResolvedYoutube;

export type ResolvedStat = Omit<Stat, "kind" | "value"> & {
  value: number;
  /** "10", "1000+", "50K+" */
  display: string;
};

export type ResolvedWorkItem = Omit<WorkItem, "media" | "thumbnail"> & {
  media: ResolvedPlayable;
  thumbnail: ResolvedImage;
};

export type ResolvedTestimonial = Omit<Testimonial, "photo"> & { photo: ResolvedImage | undefined };

export type CaseStudyCard = {
  slug: string;
  title: string;
  summary: string;
  formats: string[];
  clientName: string;
  industry: string;
  hero: ResolvedImage;
};

export type ResolvedCaseStudy = Omit<CaseStudy, "hero" | "client" | "testimonial"> & {
  hero: ResolvedImage;
  client: Omit<CaseStudy["client"], "logo"> & { logo: ResolvedImage | undefined };
  testimonial: ResolvedTestimonial | undefined;
  serviceLinks: Array<Pick<Service, "slug" | "title" | "shortTitle">>;
  nextCase: CaseStudyCard;
};

export type ServiceCard = Pick<Service, "slug" | "title" | "shortTitle" | "summary" | "glyph">;

export type ResolvedService = Service & {
  relatedWorkItems: ResolvedWorkItem[];
  relatedCaseCard: CaseStudyCard | undefined;
};

export type NavigationData = {
  nav: Array<{ label: string; href: string }>;
  services: ServiceCard[];
};
