import type { Home } from "./schema/pages";

export const home: Home = {
  hero: {
    kicker: "Video editor · Founder, Montage Motion",
    headline: "I cut footage into stories people finish watching.",
    sub: "Short-form, YouTube, podcast and commercial edits for creators and brands — made by me, or by the Montage Motion team when the job needs more hands.",
    primaryCta: { label: "Book a call", href: "https://calendly.com/imonofficial2/30min" },
    secondaryCta: { label: "Watch the reel", href: "#reel" },
  },
  proof: {
    kicker: "Proof",
    title: "The track record, in numbers.",
    clientsLabel: "Creators and brands I've cut for",
  },
  reel: {
    kicker: "Reel",
    title: "See it moving.",
    lede: "A cut of recent work from the studio.",
    media: "reel-studio",
    caption: "Montage Motion studio reel",
  },
  work: {
    kicker: "Selected work",
    title: "Edits that kept people watching.",
    lede: "Podcasts, YouTube and short-form. Hover to preview, click to watch.",
    cta: { label: "See all work", href: "/work" },
  },
  cases: {
    kicker: "Case studies",
    title: "Three projects, start to finish.",
    lede: "The brief, what we made, and how it landed.",
    cta: { label: "All case studies", href: "/case-studies" },
  },
  services: {
    kicker: "Services",
    title: "What I edit.",
    lede: "Six formats. Each one gets its own approach, not a template.",
    cta: { label: "All services", href: "/services" },
  },
  process: {
    kicker: "Process",
    title: "From raw footage to delivered.",
    lede: "Five steps. No surprises.",
  },
  about: {
    kicker: "About",
    title: "Editor first, founder second.",
    lede: "I started as a freelance editor and built Montage Motion to take on bigger work.",
    cta: { label: "My story", href: "/about" },
  },
  words: {
    kicker: "Words",
    title: "What clients say.",
  },
  studio: {
    kicker: "The studio",
    title: "Need more than one pair of hands?",
    lede: "Montage Motion is the team behind the bigger projects: podcasts, series, launches and ongoing content.",
    cta: { label: "Meet Montage Motion", href: "https://montagemotion.com" },
  },
  faq: {
    kicker: "FAQ",
    title: "Questions, answered.",
  },
  contact: {
    headline: "Let's cut something good.",
    sub: "Tell me about the project. I reply within 24 hours.",
    primaryCta: { label: "Book a call", href: "https://calendly.com/imonofficial2/30min" },
    whatsappLabel: "Message on WhatsApp",
    emailLabel: "Email me",
  },
};
