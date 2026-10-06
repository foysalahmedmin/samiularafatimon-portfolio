import { z } from "zod";

export const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase-kebab-case");

/** An internal /path (optionally #hash), an https:// URL, mailto: or tel:. */
export const href = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || value.startsWith("#") || /^(https?:\/\/|mailto:|tel:)/.test(value),
    "must be an internal /path, a #hash, an https:// URL, mailto: or tel:",
  );

/**
 * Any record that states a fact can carry these. `pnpm content:check` lists every
 * `needsReview: true`; the production build refuses to ship while any remain.
 */
export const review = {
  needsReview: z.boolean().optional(),
  reviewNote: z.string().optional(),
};

/** Reference to an entry in content/media.ts. */
export const mediaId = z.string().min(1);

export const link = z.object({ label: z.string().min(1), href });
export type Link = z.infer<typeof link>;

export const aspect = z.enum(["16:9", "9:16", "1:1", "4:5", "3:2"]);
export type Aspect = z.infer<typeof aspect>;

/** Heading block used by every section: kicker (small label), title, optional lede and CTA. */
export const sectionHead = z.object({
  kicker: z.string().min(1),
  title: z.string().min(1),
  lede: z.string().optional(),
  cta: link.optional(),
});
export type SectionHead = z.infer<typeof sectionHead>;

export const seoMeta = z.object({
  title: z.string().min(3).max(60),
  description: z.string().min(60).max(165),
  keywords: z.array(z.string()).optional(),
});
export type SeoMeta = z.infer<typeof seoMeta>;
