import { about } from "./about";
import { caseStudies } from "./case-studies";
import { clients } from "./clients";
import { contact } from "./contact";
import { faq } from "./faq";
import { home } from "./home";
import { media } from "./media";
import mediaManifest from "./media.manifest.json";
import { pricing } from "./pricing";
import { processStages } from "./process";
import { seo } from "./seo";
import { services } from "./services";
import { site } from "./site";
import { stats } from "./stats";
import { testimonials } from "./testimonials";
import { ui } from "./ui";
import { work } from "./work";

/** Everything the site says, in one object. Only `src/lib/content` reads this. */
export const content = {
  site,
  home,
  about,
  stats,
  clients,
  processStages,
  pricing,
  faq,
  testimonials,
  work,
  contact,
  seo,
  ui,
  media,
  mediaManifest,
  services,
  caseStudies,
};

export type RawContent = typeof content;
