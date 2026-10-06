import type { Service } from "../schema/collections";

export const youtubeVideoEditing: Service = {
  slug: "youtube-video-editing",
  title: "YouTube & talking-head editing",
  shortTitle: "YouTube & talking-head",
  summary: "Long-form episodes, courses and interviews, cut so people watch to the end.",
  glyph: "16:9",
  hero: {
    kicker: "YouTube & talking-head",
    title: "Talking-head videos people watch to the end.",
    lede: "Course lessons, interviews and channel episodes, edited so mistakes disappear, graphics land cleanly and the audio stays clear from start to finish.",
  },
  audience: "YouTubers, course creators, coaches and founders who publish talking-head or interview video.",
  included: [
    {
      title: "Multi-camera editing",
      description: "Smooth angle switches and synced cameras turn interviews and presentations into a clear visual flow.",
    },
    {
      title: "Jump-cut cover",
      description: "Awkward pauses and slips are hidden with B-roll, cutaways and transitions that keep viewers engaged.",
    },
    {
      title: "Lower thirds and graphics",
      description: "Name tags, titles and on-screen text reinforce key points without cluttering the frame.",
    },
    {
      title: "Audio clean-up",
      description: "Background noise removed, levels balanced, and music that supports the voice instead of drowning it.",
    },
    {
      title: "Colour correction",
      description: "Footage matched across cameras and lighting so the whole video looks consistent.",
    },
    {
      title: "Platform-ready export",
      description: "Correct formats, aspect ratios and compression for YouTube, LinkedIn, Instagram or your course platform.",
    },
  ],
  steps: [
    {
      title: "Share the footage and goals",
      description: "Upload your clips with a short brief: goals, brand guidelines and anything specific to cut or emphasise.",
    },
    {
      title: "I edit and refine",
      description: "The edit is built to your style, with graphics, captions and audio handled in the same pass.",
    },
    {
      title: "You approve",
      description: "Review the cut, request changes, and I finalise the files for delivery and publishing.",
    },
  ],
  faq: [
    {
      q: "What do I need to send?",
      a: "Raw talking-head clips, any B-roll or graphics you want included, your logo, and notes on sections to cut or emphasise. Footage from any camera works, including smartphones.",
    },
    {
      q: "Do you remove filler words and long pauses?",
      a: "Yes, along with repeated takes and dead air, while keeping your delivery natural. If you prefer a rawer, conversational feel, I'll leave more in.",
    },
    {
      q: "Can you add captions?",
      a: "Yes. Accurate captions help accessibility and engagement, because many people watch without sound.",
    },
    {
      q: "Do you work with ongoing channels?",
      a: "Yes. Many clients publish weekly or monthly. A regular package keeps costs predictable and the style consistent.",
    },
  ],
  relatedWork: ["will-ai-replace-video-editors", "do-not-join-this-10000-contest", "crazy-genius"],
  relatedCase: "rich-from-anywhere",
  agencyUrl: "https://montagemotion.com/talking-head-video-editing-services",
  seo: {
    title: "YouTube & talking-head editing",
    description:
      "YouTube and talking-head video editing by Samiul Arafat Imon: multi-camera cuts, graphics, audio clean-up and colour correction for creators and courses.",
    keywords: ["YouTube video editing", "talking head video editor", "course video editing", "freelance YouTube editor"],
  },
};
