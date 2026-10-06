import type { Client } from "./schema/pages";

/** Real clients, taken from Montage Motion's published case studies. */
export const clients: Client[] = [
  { slug: "pathao", name: "Pathao", industry: "Super app: mobility and delivery", caseStudy: "pathao" },
  {
    slug: "rich-from-anywhere",
    name: "Rich From Anywhere",
    industry: "Online education",
    caseStudy: "rich-from-anywhere",
  },
  { slug: "fafa-fitness", name: "Fafa Fitness", industry: "Fitness creator", caseStudy: "fafa-fitness" },
  { slug: "arkangel-university", name: "Arkangel University", industry: "Medical education" },
  { slug: "jetedco", name: "JetEdCo", industry: "Private aviation" },
  { slug: "elite-rentals-dubai", name: "Elite Rentals Dubai", industry: "Luxury rentals" },
];
