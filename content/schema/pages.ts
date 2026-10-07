import { z } from "zod";
import { aspect, link, mediaId, review, sectionHead, seoMeta, slug } from "./common";

/* ───────────── Home ───────────── */

export const homeSchema = z.object({
  hero: z.object({
    kicker: z.string(),
    headline: z.string(),
    sub: z.string(),
    primaryCta: link,
    secondaryCta: link,
  }),
  proof: sectionHead.extend({ clientsLabel: z.string() }),
  reel: sectionHead.extend({ media: mediaId, caption: z.string() }),
  work: sectionHead,
  cases: sectionHead,
  services: sectionHead,
  process: sectionHead,
  about: sectionHead,
  words: sectionHead,
  studio: sectionHead,
  faq: sectionHead,
  contact: z.object({
    headline: z.string(),
    sub: z.string(),
    primaryCta: link,
    whatsappLabel: z.string(),
    emailLabel: z.string(),
  }),
});
export type Home = z.infer<typeof homeSchema>;

/* ───────────── About ───────────── */

export const aboutSchema = z.object({
  ...review,
  hero: z.object({ kicker: z.string(), title: z.string(), lede: z.string() }),
  portrait: mediaId,
  statement: z.string(),
  story: z.array(z.string()).min(1),
  facts: z.array(z.object({ label: z.string(), value: z.string(), ...review })),
  milestones: z.array(
    z.object({ year: z.number().int(), title: z.string(), description: z.string(), ...review }),
  ),
  tools: z.object({
    title: z.string(),
    items: z.array(z.object({ name: z.string(), kind: z.enum(["edit", "color", "motion", "design"]) })),
  }),
  education: z.object({ title: z.string(), items: z.array(z.object({ name: z.string(), ...review })) }),
  milestonesTitle: z.string(),
  cta: z.object({ title: z.string(), lede: z.string(), button: link }),
});
export type About = z.infer<typeof aboutSchema>;

/* ───────────── Stats & clients ───────────── */

export const statSchema = z
  .object({
    id: slug,
    kind: z.enum(["fixed", "years-since-career-start"]),
    value: z.number().nonnegative().optional(),
    suffix: z.string(),
    label: z.string(),
    scope: z.enum(["personal", "agency"]),
    featured: z.boolean(),
    ...review,
  })
  .refine((s) => s.kind !== "fixed" || typeof s.value === "number", {
    message: "a fixed stat needs a numeric `value`",
    path: ["value"],
  });
export type Stat = z.infer<typeof statSchema>;
export const statsSchema = z.array(statSchema).min(1);

export const clientSchema = z.object({
  slug,
  name: z.string(),
  industry: z.string(),
  caseStudy: slug.optional(),
  ...review,
});
export type Client = z.infer<typeof clientSchema>;
export const clientsSchema = z.array(clientSchema).min(1);

/* ───────────── Process ───────────── */

export const processSchema = z
  .array(z.object({ id: slug, title: z.string(), summary: z.string(), meta: z.string() }))
  .min(2);
export type ProcessStage = z.infer<typeof processSchema>[number];

/* ───────────── Pricing ───────────── */

export const pricingSchema = z.object({
  hero: z.object({ kicker: z.string(), title: z.string(), lede: z.string() }),
  packages: z
    .array(
      z.object({
        id: slug,
        name: z.string(),
        price: z.string(),
        unit: z.string(),
        summary: z.string(),
        features: z.array(z.string()).min(1),
        popular: z.boolean().optional(),
        cta: link,
        ...review,
      }),
    )
    .min(1),
  popularLabel: z.string(),
  retainers: z.object({
    kicker: z.string(),
    title: z.string(),
    lede: z.string(),
    plans: z.array(
      z.object({
        name: z.string(),
        price: z.string(),
        unit: z.string(),
        summary: z.string(),
        features: z.array(z.string()),
      }),
    ),
    cta: link,
    ...review,
  }),
  quote: z.object({ title: z.string(), lede: z.string(), cta: link }),
});
export type Pricing = z.infer<typeof pricingSchema>;

/* ───────────── FAQ ───────────── */

export const faqSchema = z.object({
  groups: z.array(
    z.object({
      id: slug,
      title: z.string(),
      items: z.array(z.object({ id: slug, q: z.string(), a: z.string(), ...review })).min(1),
    }),
  ),
});
export type Faq = z.infer<typeof faqSchema>;
export type FaqItem = Faq["groups"][number]["items"][number];

/* ───────────── Testimonials ───────────── */

export const testimonialSchema = z.object({
  id: slug,
  quote: z.string().min(20),
  name: z.string(),
  role: z.string(),
  org: z.string().optional(),
  photo: mediaId.optional(),
  source: z.enum(["case-study", "recommendation"]),
  caseStudy: slug.optional(),
  featured: z.boolean().optional(),
  ...review,
});
export type Testimonial = z.infer<typeof testimonialSchema>;
export const testimonialsSchema = z.array(testimonialSchema).min(1);

/* ───────────── Work ───────────── */

export const workCategorySchema = z.object({
  id: slug,
  label: z.string(),
  glyph: z.enum(["9:16", "16:9", "audio", "motion", "thumb"]),
});
export type WorkCategory = z.infer<typeof workCategorySchema>;

export const workItemSchema = z.object({
  id: slug,
  title: z.string(),
  category: slug,
  client: z.string().optional(),
  aspect,
  media: mediaId,
  thumbnail: mediaId,
  featured: z.boolean(),
  summary: z.string().optional(),
  ...review,
});
export type WorkItem = z.infer<typeof workItemSchema>;

export const workSchema = z.object({
  hero: z.object({ kicker: z.string(), title: z.string(), lede: z.string() }),
  allLabel: z.string(),
  emptyLabel: z.string(),
  filterLabel: z.string(),
  openOriginal: z.string(),
  categories: z.array(workCategorySchema).min(1),
  items: z.array(workItemSchema).min(1),
});
export type Work = z.infer<typeof workSchema>;

/* ───────────── Contact ───────────── */

export const contactSchema = z.object({
  hero: z.object({ kicker: z.string(), title: z.string(), lede: z.string() }),
  form: z.object({
    nameLabel: z.string(),
    emailLabel: z.string(),
    projectTypeLabel: z.string(),
    budgetLabel: z.string(),
    messageLabel: z.string(),
    messagePlaceholder: z.string(),
    submitLabel: z.string(),
    sendingLabel: z.string(),
    optionalLabel: z.string(),
    projectTypes: z.array(z.string()).min(1),
    budgets: z.array(z.string()).min(1),
  }),
  states: z.object({
    success: z.string(),
    failure: z.string(),
    invalid: z.string(),
  }),
  alternatives: z.object({
    title: z.string(),
    callLabel: z.string(),
    whatsappLabel: z.string(),
    emailLabel: z.string(),
    copiedLabel: z.string(),
    responseNote: z.string(),
  }),
});
export type Contact = z.infer<typeof contactSchema>;

/* ───────────── Legal ───────────── */

export const legalDocSchema = z.object({
  ...review,
  kicker: z.string(),
  title: z.string(),
  lede: z.string(),
  updatedLabel: z.string(),
  updated: z.string(),
  sections: z.array(z.object({ id: slug, heading: z.string(), body: z.array(z.string()).min(1) })).min(1),
});
export const legalSchema = z.object({ privacy: legalDocSchema, terms: legalDocSchema });
export type LegalDoc = z.infer<typeof legalDocSchema>;
export type Legal = z.infer<typeof legalSchema>;

/* ───────────── SEO ───────────── */

export const routeKeys = [
  "home",
  "about",
  "work",
  "caseStudies",
  "services",
  "pricing",
  "contact",
  "privacy",
  "terms",
  "notFound",
] as const;
export type RouteKey = (typeof routeKeys)[number];

export const seoSchema = z.object({
  titleTemplate: z.string().includes("%s"),
  defaultTitle: z.string(),
  routes: z.object(Object.fromEntries(routeKeys.map((key) => [key, seoMeta])) as Record<RouteKey, typeof seoMeta>),
});
export type Seo = z.infer<typeof seoSchema>;

/* ───────────── UI microcopy ───────────── */

export const uiSchema = z.object({
  skipToContent: z.string(),
  openMenu: z.string(),
  closeMenu: z.string(),
  menuTitle: z.string(),
  chaptersLabel: z.string(),
  playheadLabel: z.string(),
  backToTop: z.string(),
  previous: z.string(),
  next: z.string(),
  play: z.string(),
  pause: z.string(),
  mute: z.string(),
  unmute: z.string(),
  close: z.string(),
  watch: z.string(),
  readCase: z.string(),
  viewWork: z.string(),
  bookCall: z.string(),
  visitStudio: z.string(),
  externalLink: z.string(),
  loading: z.string(),
  notFound: z.object({ title: z.string(), lede: z.string(), home: z.string(), work: z.string() }),
  error: z.object({ title: z.string(), lede: z.string(), retry: z.string() }),
  videoUnavailable: z.string(),
  stats: z.object({ title: z.string() }),
  caseStudy: z.object({
    client: z.string(),
    industry: z.string(),
    format: z.string(),
    myRole: z.string(),
    services: z.string(),
    brief: z.string(),
    approach: z.string(),
    deliverables: z.string(),
    result: z.string(),
    outcome: z.string(),
    next: z.string(),
    allCases: z.string(),
    about: z.string(),
  }),
  service: z.object({
    included: z.string(),
    forWhom: z.string(),
    process: z.string(),
    relatedWork: z.string(),
    relatedCase: z.string(),
    faq: z.string(),
    onAgency: z.string(),
  }),
});
export type Ui = z.infer<typeof uiSchema>;
