import type { ProcessStage } from "./schema/pages";

export const processStages: ProcessStage[] = [
  {
    id: "discover-and-align",
    title: "Discover & align",
    summary: "We start with a call about your goals, your audience and where the videos will live.",
    meta: "Free 30-minute call",
  },
  {
    id: "strategy-and-direction",
    title: "Strategy & creative direction",
    summary: "Content planning and a style guide: pacing, graphics, captions and music, agreed before the first cut.",
    meta: "Style guide and plan",
  },
  {
    id: "edit",
    title: "Edit",
    summary: "The edit itself: cutting, motion graphics and sound, built to the style guide.",
    meta: "Starts within 24–48 hours",
  },
  {
    id: "review-and-refine",
    title: "Review & refine",
    summary: "You watch, leave timestamped notes, and I revise until it's right.",
    meta: "Revision rounds included",
  },
  {
    id: "deliver",
    title: "Deliver",
    summary: "Final files in the formats you need, optimised for where they'll be published.",
    meta: "Every format you need",
  },
];
