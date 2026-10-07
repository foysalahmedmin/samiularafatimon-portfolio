import type { Work } from "./schema/pages";

const attribution = {
  needsReview: true,
  reviewNote:
    "Taken from montagemotion.com's portfolio. Confirm this is Imon's edit and that the client is happy for it to be shown.",
} as const;

export const work: Work = {
  hero: {
    kicker: "Work",
    title: "Edits that kept people watching.",
    lede: "Podcasts, long-form YouTube and short-form. Filter by format, hover to preview, click to watch.",
  },
  allLabel: "All work",
  emptyLabel: "No work in this category yet. Try All work.",
  filterLabel: "Filter by format",
  openOriginal: "Open on YouTube",
  categories: [
    { id: "short-form", label: "Short-form", glyph: "9:16" },
    { id: "long-form", label: "Long-form", glyph: "16:9" },
    { id: "podcast", label: "Podcast", glyph: "audio" },
    { id: "commercial", label: "Commercial", glyph: "16:9" },
    { id: "motion", label: "Motion", glyph: "motion" },
    { id: "thumbnail", label: "Thumbnails", glyph: "thumb" },
  ],
  items: [
    {
      id: "panel-reveal",
      title: "Panel Reveal",
      category: "podcast",
      client: "From My Left",
      aspect: "16:9",
      media: "yt-panel-reveal",
      thumbnail: "thumb-panel-reveal",
      featured: true,
      ...attribution,
    },
    {
      id: "will-ai-replace-video-editors",
      title: "Will AI Replace Video Editors?",
      category: "long-form",
      aspect: "16:9",
      media: "video-will-ai-replace",
      thumbnail: "thumb-will-ai-replace",
      featured: true,
      ...attribution,
    },
    {
      id: "neo-reactionary",
      title: "Neo-Reactionary",
      category: "long-form",
      aspect: "16:9",
      media: "video-neo-reactionary",
      thumbnail: "thumb-neo-reactionary",
      featured: false,
      needsReview: true,
      reviewNote:
        "Thumbnail shows a real public figure and a political topic. Confirm Imon wants this on a personal portfolio.",
    },
    {
      id: "do-not-join-this-10000-contest",
      title: "Do Not Join This $10,000 Contest",
      category: "long-form",
      aspect: "16:9",
      media: "video-ten-thousand-contest",
      thumbnail: "thumb-ten-thousand-contest",
      featured: true,
      ...attribution,
    },
    {
      id: "crazy-genius",
      title: "Crazy Genius",
      category: "long-form",
      client: "Avinash Ahluwalia",
      aspect: "16:9",
      media: "yt-crazy-genius",
      thumbnail: "thumb-crazy-genius",
      featured: true,
      ...attribution,
    },
    {
      id: "hmrc-crackdown",
      title: "HMRC Crackdown! Are You at Risk?",
      category: "podcast",
      client: "Pie",
      aspect: "16:9",
      media: "yt-hmrc-crackdown",
      thumbnail: "thumb-hmrc-crackdown",
      featured: true,
      ...attribution,
    },
  ],
};
