/** Typed route helpers. Never hard-code a path in a component. */
export const routes = {
  home: "/",
  about: "/about",
  work: "/work",
  caseStudies: "/case-studies",
  services: "/services",
  pricing: "/pricing",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  caseStudy: (slug: string) => `/case-studies/${slug}`,
  service: (slug: string) => `/services/${slug}`,
} as const;

/** Every fixed path; dynamic ones come from `/services/<slug>` and `/case-studies/<slug>`. */
export const staticPaths: readonly string[] = [
  routes.home,
  routes.about,
  routes.work,
  routes.caseStudies,
  routes.services,
  routes.pricing,
  routes.contact,
  routes.privacy,
  routes.terms,
];

export const serviceBase = "/services/";
export const caseStudyBase = "/case-studies/";
