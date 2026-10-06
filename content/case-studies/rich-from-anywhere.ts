import type { CaseStudy } from "../schema/collections";

export const richFromAnywhere: CaseStudy = {
  slug: "rich-from-anywhere",
  title: "Rich From Anywhere: a YouTube editing system",
  summary: "A consistent, energetic editing style for an online-education channel.",
  formats: ["Talking-head", "YouTube", "Short videos", "Content strategy"],
  services: ["youtube-video-editing", "short-form-video-editing"],
  client: {
    name: "Rich From Anywhere",
    industry: "Online education: digital marketing and advertising coaching",
    size: "10 employees",
    about:
      "Rich From Anywhere is an online education and coaching brand that helps entrepreneurs attract high-quality clients through Facebook and Instagram advertising. Through practical YouTube content, coaching programmes, courses and mentorship, it makes digital marketing strategies easier to understand and apply.",
    logo: "rfa-logo",
  },
  myRole: {
    value: "Led by Montage Motion",
    needsReview: true,
    reviewNote: "Describe Imon's exact role on this project (direction, editing, review), then remove this flag.",
  },
  hero: "rfa-hero",
  brief: {
    title: "Lessons worth watching to the end",
    body: [
      "Rich From Anywhere needed a consistent YouTube editing system that could match its energetic teaching style while keeping every video clear, polished and engaging.",
      "The talking-head lessons held valuable insights, but they needed tighter pacing, stronger visual emphasis and smoother storytelling to keep viewers watching.",
    ],
  },
  approach: {
    lede: "A streamlined editing approach focused on viewer retention, brand consistency and YouTube-ready delivery.",
    steps: [
      {
        title: "Clean graphics, clear subtitles",
        body: "A consistent visual system of clean graphics and accurate subtitles makes each lesson easier to follow.",
      },
      {
        title: "Smooth transitions",
        body: "Transitions keep the lessons flowing without pulling attention away from the teaching.",
      },
      {
        title: "Energetic pacing",
        body: "Pacing tuned to the channel's teaching style keeps viewers engaged from the opening to the final point.",
      },
    ],
  },
  deliverables: [
    "Talking-head YouTube episodes",
    "A branded graphics and subtitle system",
    "A pacing and transition style applied to every episode",
  ],
  result: {
    outcome:
      "Rich From Anywhere gained a consistent, professional editing style across its YouTube content. Stronger pacing, clear graphics, accurate subtitles and smooth transitions made each lesson easier to follow, and gave the channel a more engaging, recognisable look.",
    metrics: [
      {
        value: "100%",
        label: "Core editing improvements",
        note: "Applied to every episode",
        needsReview: true,
        reviewNote:
          "Published on the studio site but vague. Replace with real retention or growth numbers if Imon has them.",
      },
    ],
  },
  testimonial: "stephen-blackburn",
  next: "fafa-fitness",
  seo: {
    title: "Rich From Anywhere case study",
    description:
      "How a consistent editing system gave Rich From Anywhere's YouTube lessons clearer pacing and graphics. A Samiul Arafat Imon case study.",
    keywords: ["YouTube editing case study", "talking head video editing", "online education video"],
  },
};
