import { z } from "zod";
import { caseStudySchema, serviceSchema } from "@content/schema/collections";
import { mediaList, mediaManifest } from "@content/schema/media";
import {
  aboutSchema,
  clientsSchema,
  contactSchema,
  faqSchema,
  homeSchema,
  legalSchema,
  pricingSchema,
  processSchema,
  seoSchema,
  statsSchema,
  testimonialsSchema,
  uiSchema,
  workSchema,
} from "@content/schema/pages";
import { siteSchema } from "@content/schema/site";

/** One schema per key of the raw content object. */
export const contentSchemas = {
  site: siteSchema,
  home: homeSchema,
  about: aboutSchema,
  stats: statsSchema,
  clients: clientsSchema,
  processStages: processSchema,
  pricing: pricingSchema,
  faq: faqSchema,
  testimonials: testimonialsSchema,
  work: workSchema,
  contact: contactSchema,
  legal: legalSchema,
  seo: seoSchema,
  ui: uiSchema,
  media: mediaList,
  mediaManifest,
  services: z.array(serviceSchema).min(1),
  caseStudies: z.array(caseStudySchema).min(1),
} as const;

export type ContentKey = keyof typeof contentSchemas;
export type ParsedContent = { [K in ContentKey]: z.output<(typeof contentSchemas)[K]> };
