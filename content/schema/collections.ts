import { z } from "zod";
import { mediaId, review, seoMeta, slug } from "./common";

/* ───────────── Services ───────────── */

export const serviceSchema = z.object({
  slug,
  title: z.string(),
  shortTitle: z.string(),
  /** One-line summary used in lists and cards. */
  summary: z.string(),
  /** Aspect-ratio glyph shown beside the service: the format it delivers. */
  glyph: z.enum(["9:16", "16:9", "audio", "motion", "thumb"]),
  hero: z.object({ kicker: z.string(), title: z.string(), lede: z.string() }),
  audience: z.string(),
  included: z.array(z.object({ title: z.string(), description: z.string() })).min(3),
  steps: z.array(z.object({ title: z.string(), description: z.string() })).min(3),
  faq: z.array(z.object({ q: z.string(), a: z.string(), ...review })).min(2),
  relatedWork: z.array(slug),
  relatedCase: slug.optional(),
  agencyUrl: z.url(),
  seo: seoMeta,
});
export type Service = z.infer<typeof serviceSchema>;

/* ───────────── Case studies ───────────── */

export const caseStudySchema = z.object({
  slug,
  title: z.string(),
  summary: z.string(),
  /** Format chips shown on cards, e.g. "Short videos", "OVC". */
  formats: z.array(z.string()).min(1),
  services: z.array(slug),
  client: z.object({
    name: z.string(),
    industry: z.string(),
    size: z.string().optional(),
    location: z.string().optional(),
    about: z.string(),
    logo: mediaId.optional(),
  }),
  myRole: z.object({ value: z.string(), ...review }),
  hero: mediaId,
  brief: z.object({ title: z.string(), body: z.array(z.string()).min(1) }),
  approach: z.object({
    lede: z.string(),
    steps: z.array(z.object({ title: z.string(), body: z.string() })).min(2),
  }),
  deliverables: z.array(z.string()).min(1),
  result: z.object({
    outcome: z.string(),
    metrics: z.array(
      z.object({ value: z.string(), label: z.string(), note: z.string().optional(), ...review }),
    ),
  }),
  testimonial: slug.optional(),
  next: slug,
  seo: seoMeta,
  ...review,
});
export type CaseStudy = z.infer<typeof caseStudySchema>;

