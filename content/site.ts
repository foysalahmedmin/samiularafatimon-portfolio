import type { Site } from "./schema/site";

export const site: Site = {
  name: "Samiul Arafat Imon",
  monogram: "SAI",
  role: "Video editor",
  tagline: "I cut footage into stories people finish watching.",
  description:
    "Video editor and founder of Montage Motion. Short-form, YouTube, podcast and commercial edits for creators and brands worldwide.",
  location: {
    city: "Dhaka",
    country: "Bangladesh",
    timezone: "Asia/Dhaka",
    offsetLabel: "GMT+6",
  },
  careerStartYear: {
    value: 2016,
    needsReview: true,
    reviewNote: "Only the old portfolio states 2016 as the start of freelancing. Confirm the year.",
  },
  availability: {
    open: true,
    label: "Taking new projects",
    needsReview: true,
    reviewNote: "Placeholder. Replace with a real booking window (for example 'Booking November') or confirm this wording.",
  },
  timelineRuntimeSec: 90,
  contact: {
    email: "imonofficial2@gmail.com",
    whatsapp: {
      number: "8801786546949",
      display: "+880 1786 546 949",
      prefill: "Hi Imon, I found your portfolio and I'd like to talk about a video project.",
    },
    calendly: "https://calendly.com/imonofficial2/30min",
    responseTime: "within 24 hours",
  },
  socials: [
    {
      platform: "instagram",
      label: "Instagram",
      handle: "@_samiul_arafat",
      url: "https://www.instagram.com/_samiul_arafat",
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      handle: "samiul-arafat",
      url: "https://www.linkedin.com/in/samiul-arafat",
      needsReview: true,
      reviewNote: "Taken from the old portfolio; could not be checked from outside. Confirm the profile URL.",
    },
    {
      platform: "youtube",
      label: "YouTube",
      handle: "@samiularafatimon",
      url: "https://www.youtube.com/@samiularafatimon",
      needsReview: true,
      reviewNote: "Taken from the old portfolio; could not be checked from outside. Confirm the channel URL.",
    },
    {
      platform: "fiverr",
      label: "Fiverr",
      handle: "samiularafat",
      url: "https://www.fiverr.com/samiularafat",
      needsReview: true,
      reviewNote: "Taken from the old portfolio; could not be checked from outside. Confirm the profile URL.",
    },
  ],
  agency: {
    name: "Montage Motion",
    url: "https://montagemotion.com",
    pitch:
      "Montage Motion is the video editing studio I founded. It handles podcasts, shorts, talking-head series, SaaS explainers, promos and thumbnails for creators and brands.",
    founded: {
      value: 2021,
      needsReview: true,
      reviewNote: "Only the old portfolio states 2021. Confirm.",
    },
    address: "House 11, Road 24, 2 Modina Nagar, Avenue 5, Dhaka 1216",
  },
  nav: [
    { label: "Work", href: "/work" },
    { label: "Case studies", href: "/case-studies" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
  ],
  footer: {
    groups: [
      {
        title: "Explore",
        links: [
          { label: "Work", href: "/work" },
          { label: "Case studies", href: "/case-studies" },
          { label: "Services", href: "/services" },
          { label: "About", href: "/about" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    credits: [
      { role: "Edited by", value: "Samiul Arafat Imon" },
      { role: "Studio", value: "Montage Motion", href: "https://montagemotion.com" },
      { role: "Based in", value: "Dhaka, Bangladesh" },
      { role: "Say hello", value: "imonofficial2@gmail.com", href: "mailto:imonofficial2@gmail.com" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    copyright: "© {year} Samiul Arafat Imon. All rights reserved.",
  },
};
