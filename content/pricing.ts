import type { Pricing } from "./schema/pages";

const book = { label: "Book a call", href: "https://calendly.com/imonofficial2/30min" };

export const pricing: Pricing = {
  hero: {
    kicker: "Pricing",
    title: "Pick a package, then we'll scope it.",
    lede: "Every project is quoted after a short call, because length, style and volume change the work. These packages show what each level includes.",
  },
  popularLabel: "Most popular",
  packages: [
    {
      id: "starter",
      name: "Starter",
      price: "Custom",
      unit: "per project",
      summary: "One video, edited cleanly.",
      features: ["Up to 5-minute video", "Basic colour grading", "1 revision included", "3-day delivery"],
      cta: book,
      needsReview: true,
      reviewNote:
        "The old portfolio listed these packages with 'Custom' prices. Decide whether to publish 'from' prices.",
    },
    {
      id: "pro",
      name: "Pro",
      price: "Custom",
      unit: "per project",
      summary: "Longer videos with motion graphics.",
      features: [
        "Up to 15-minute video",
        "Advanced colour grading",
        "Motion graphics included",
        "3 revisions included",
        "2-day delivery",
      ],
      popular: true,
      cta: book,
    },
    {
      id: "agency",
      name: "Agency",
      price: "Custom",
      unit: "per project",
      summary: "A full production package with a dedicated editor.",
      features: [
        "Unlimited video length",
        "Full production package",
        "Dedicated editor assigned",
        "Unlimited revisions",
        "Priority delivery",
      ],
      cta: book,
    },
  ],
  retainers: {
    title: "Ongoing content? Montage Motion offers monthly plans.",
    lede: "For a steady stream of Reels and Shorts, the studio runs monthly plans.",
    plans: [
      {
        name: "Starter plan",
        price: "$199",
        unit: "per month",
        summary: "For creators testing the waters.",
        features: [
          "5 Reels or Shorts per month",
          "Basic editing: cuts, captions, music",
          "Standard turnaround: 3–4 days",
          "1 free revision",
        ],
      },
      {
        name: "Growth plan",
        price: "$399",
        unit: "per month",
        summary: "For creators and brands building consistency.",
        features: [
          "15 Reels or Shorts per month",
          "Advanced editing: transitions, motion graphics, effects",
          "Fast turnaround: 2–3 days",
          "2 revisions per video",
          "Thumbnail design included",
        ],
      },
    ],
    cta: { label: "See the studio's plans", href: "https://montagemotion.com/shorts-editing" },
    needsReview: true,
    reviewNote:
      "Prices are from montagemotion.com. Its thumbnail page shows a different, inconsistent pair ($300 / $200). Confirm the current plans and whether to show them here.",
  },
  quote: {
    title: "Something bigger?",
    lede: "Series, launches and long-running channels are scoped individually. Tell me what you have and I'll send a quote.",
    cta: { label: "Request a quote", href: "/contact" },
  },
};
