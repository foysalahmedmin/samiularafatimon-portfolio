import type { Testimonial } from "./schema/pages";

const recommendationNote =
  "Copied from the testimonials on montagemotion.com. Confirm these can be reused on this site.";

export const testimonials: Testimonial[] = [
  {
    id: "stephen-blackburn",
    quote:
      "Montage Motion helped us create a polished and consistent style for our YouTube content. Their team understood our energetic approach, improved the pacing and visuals, and delivered professional videos that made our lessons clearer and more engaging.",
    name: "Stephen Blackburn",
    role: "Co-founder",
    org: "Rich From Anywhere",
    photo: "rfa-stephen",
    source: "case-study",
    caseStudy: "rich-from-anywhere",
    featured: true,
  },
  {
    id: "fafa",
    quote:
      "Montage Motion understood the energy I wanted my content to have. They made every video feel polished, engaging, and consistent without losing my personality. The editing process was smooth, and the final videos felt ready for Instagram and TikTok.",
    name: "Fafa",
    role: "Founder",
    org: "Fafa Fitness",
    photo: "fafa-portrait",
    source: "case-study",
    caseStudy: "fafa-fitness",
    featured: true,
  },
  {
    id: "julian-de-graaf",
    quote:
      "Montage Motion understood the premium look we wanted for our content. They turned our footage into polished, engaging videos that showcased our cars, yachts, and experiences while keeping everything consistent with our brand. The final content felt professional and ready for social media.",
    name: "Julian De Graaf",
    role: "CEO",
    org: "Elite Rentals Dubai",
    source: "case-study",
    featured: true,
  },
  {
    id: "jordan-strum",
    quote:
      "Montage Motion really understood what we were trying to communicate. They made our offer easier to understand and turned it into content that felt polished, engaging, and true to the JetEdCo brand. From the VSL to the short-form videos, everything felt professional and on-brand.",
    name: "Jordan Strum",
    role: "Founder & CEO",
    org: "JetEdCo",
    source: "case-study",
    featured: true,
  },
  {
    id: "mohamed-khan",
    quote:
      "Montage Motion made the entire process feel easy. They understood our message, presented our programmes clearly, and created professional videos that felt true to Arkangel University. The content gave us a stronger way to connect with prospective students across different markets.",
    name: "Dr Mohamed Khan",
    role: "Associate Dean",
    org: "Arkangel University",
    source: "case-study",
  },
  {
    id: "tomas-loucky",
    quote:
      "I can safely say that Samiul exceeded expectations! Not only did he deliver what he promised but he went above and beyond. He's easy to work with, produces top-notch quality, communicates well and delivered way ahead of schedule.",
    name: "Tomas Loucky",
    role: "Host of 'Produced By'",
    source: "recommendation",
    featured: true,
    needsReview: true,
    reviewNote: `${recommendationNote} The original quote continues; this is an excerpt.`,
  },
  {
    id: "gaurav-valani",
    quote:
      "I have worked with many editors in the past and not always had the best experience. From the first call that I had with Samiul, it was all positive and it hasn't been any other way since then. I expect us to be working with him for a very long time!",
    name: "Gaurav Valani",
    role: "Founder",
    org: "CareerSprout",
    source: "recommendation",
    needsReview: true,
    reviewNote: `${recommendationNote} This is an excerpt of a longer quote.`,
  },
  {
    id: "joe-eftihiou",
    quote:
      "Samiul and Montage Motion supported me with video editing for long-form and short-form YouTube videos. They put a lot of effort into the production, producing engaging video content. I was happy with the result and more than happy to share the content with my network.",
    name: "Joe Eftihiou",
    role: "Podcast Authority & Growth Consultant",
    source: "recommendation",
    needsReview: true,
    reviewNote: recommendationNote,
  },
  {
    id: "anita-sharifi",
    quote:
      "I wholeheartedly endorse Samiul Arafat for extraordinary video editing skills. His blend of creativity, technical finesse, and commitment to delivering high-quality work is truly impressive.",
    name: "Anita Sharifi",
    role: "Optimizing IT Strategy for Enterprises",
    source: "recommendation",
    needsReview: true,
    reviewNote: recommendationNote,
  },
];
