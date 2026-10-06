import { z } from "zod";
import { href, link, mediaId, review } from "./common";

export const socialPlatform = z.enum(["instagram", "linkedin", "youtube", "fiverr"]);

export const siteSchema = z.object({
  name: z.string().min(1),
  monogram: z.string().min(1).max(4),
  role: z.string().min(1),
  tagline: z.string().min(1),
  /** Default meta description, used when a route has none of its own. */
  description: z.string().min(60).max(165),
  location: z.object({
    city: z.string(),
    country: z.string(),
    timezone: z.string(),
    offsetLabel: z.string(),
  }),
  careerStartYear: z.object({ value: z.number().int().min(1990).max(2100), ...review }),
  availability: z.object({ open: z.boolean(), label: z.string().min(1), ...review }),
  /** Length of the "edit" the timeline bar maps scroll onto. */
  timelineRuntimeSec: z.number().int().positive(),
  contact: z.object({
    email: z.email(),
    whatsapp: z.object({ number: z.string().regex(/^\d{8,15}$/), display: z.string(), prefill: z.string() }),
    calendly: z.url(),
    responseTime: z.string(),
  }),
  socials: z.array(
    z.object({
      platform: socialPlatform,
      label: z.string(),
      handle: z.string(),
      url: z.url(),
      ...review,
    }),
  ),
  agency: z.object({
    name: z.string(),
    url: z.url(),
    pitch: z.string(),
    founded: z.object({ value: z.number().int(), ...review }),
    address: z.string(),
    logo: mediaId.optional(),
  }),
  nav: z.array(link).min(3),
  footer: z.object({
    groups: z.array(z.object({ title: z.string(), links: z.array(link) })),
    credits: z.array(z.object({ role: z.string(), value: z.string(), href: href.optional() })),
    legal: z.array(link),
    copyright: z.string().includes("{year}"),
  }),
});
export type Site = z.infer<typeof siteSchema>;
