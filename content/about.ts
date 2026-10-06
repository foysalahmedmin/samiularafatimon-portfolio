import type { About } from "./schema/pages";

export const about: About = {
  needsReview: true,
  reviewNote:
    "Story copy is drafted from the old portfolio and the studio site. Imon should approve the wording and the voice.",
  hero: {
    kicker: "About",
    title: "Editor first, founder second.",
    lede: "I'm Samiul Arafat Imon, a video editor from Dhaka. I cut for creators and brands around the world, and I run Montage Motion, the studio that grew out of that work.",
  },
  portrait: "imon-portrait",
  statement: "A good edit is invisible. The story just keeps moving.",
  story: [
    "I started as a freelance video editor with a simple aim: make stories that move people. Client by client, that turned into a craft, and then into a team.",
    "Montage Motion is that team: a full-service video editing studio for creators and brands.",
    "My edits run from YouTube Shorts and Reels to long-form channels, podcasts, brand commercials and explainers. The tools change; the job doesn't. Find the story in the footage, cut everything that isn't it, and make it feel inevitable.",
  ],
  facts: [
    { label: "Based in", value: "Dhaka, Bangladesh" },
    { label: "Studio", value: "Montage Motion" },
    { label: "Works with", value: "Creators, podcasters, SaaS teams and brands worldwide" },
  ],
  milestonesTitle: "The timeline so far",
  milestones: [
    {
      year: 2016,
      title: "Started freelancing",
      description: "Began editing for independent clients as a freelance video editor.",
      needsReview: true,
      reviewNote: "From the old portfolio. Confirm.",
    },
    {
      year: 2018,
      title: "First 100 clients",
      description: "Reached 100 satisfied clients on Fiverr.",
      needsReview: true,
      reviewNote: "From the old portfolio. Confirm.",
    },
    {
      year: 2020,
      title: "Fiverr Top Rated Seller",
      description: "Earned the Top Rated Seller badge.",
      needsReview: true,
      reviewNote: "From the old portfolio. Confirm and check the wording of the badge.",
    },
    {
      year: 2021,
      title: "Founded Montage Motion",
      description: "Launched the studio to take on larger projects with a growing team.",
      needsReview: true,
      reviewNote: "From the old portfolio. Confirm.",
    },
    {
      year: 2022,
      title: "Clients in 30+ countries",
      description: "Work for clients across more than thirty countries.",
      needsReview: true,
      reviewNote: "From the old portfolio. Confirm the number.",
    },
    {
      year: 2023,
      title: "A full creative team",
      description: "The studio grew into a team of editors, designers and animators.",
      needsReview: true,
      reviewNote: "Old portfolio says 20+ people; the studio's own site says 12+. Confirm and reword.",
    },
    {
      year: 2024,
      title: "700+ clients",
      description: "Passed 700 clients with a five-star record.",
      needsReview: true,
      reviewNote: "From the old portfolio. The studio site says 1000+ clients. Confirm which applies to Imon personally.",
    },
    {
      year: 2025,
      title: "50K YouTube subscribers",
      description: "The YouTube channel passed 50K subscribers, sharing editing tips and behind-the-scenes work.",
      needsReview: true,
      reviewNote: "From the old portfolio; the channel could not be checked. Confirm.",
    },
  ],
  tools: {
    title: "What I cut with",
    items: [
      { name: "Premiere Pro", kind: "edit" },
      { name: "DaVinci Resolve", kind: "color" },
      { name: "After Effects", kind: "motion" },
      { name: "Final Cut Pro", kind: "edit" },
      { name: "Photoshop", kind: "design" },
      { name: "Lightroom", kind: "design" },
    ],
  },
  education: {
    title: "Education",
    items: [
      { name: "Govt. Titumir College", needsReview: true, reviewNote: "From the old portfolio. Confirm." },
      { name: "University of Dhaka", needsReview: true, reviewNote: "From the old portfolio. Confirm." },
    ],
  },
  cta: {
    title: "Have a project in mind?",
    lede: "Tell me what you're making and who it's for. I'll tell you how I'd cut it.",
    button: { label: "Book a call", href: "https://calendly.com/imonofficial2/30min" },
  },
};
