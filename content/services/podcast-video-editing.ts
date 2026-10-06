import type { Service } from "../schema/collections";

export const podcastVideoEditing: Service = {
  slug: "podcast-video-editing",
  title: "Podcast video editing",
  shortTitle: "Podcast editing",
  summary: "Interview, solo and narrative shows, cleaned and cut to broadcast quality.",
  glyph: "audio",
  hero: {
    kicker: "Podcast editing",
    title: "Podcast edits people actually finish.",
    lede: "Interview, solo or narrative: cleaned, balanced and cut so every episode sounds broadcast-ready and keeps listeners listening.",
  },
  audience: "Podcast hosts and production teams who want polished video and audio episodes, plus clips for social.",
  included: [
    {
      title: "Full episode editing",
      description: "Errors, awkward silences and filler words removed, levels balanced, and the conversation left natural.",
    },
    {
      title: "Intros and outros",
      description: "A signature open and close with voiceover, music and transitions that make the show recognisable.",
    },
    {
      title: "Music and sound effects",
      description: "Background music and effects that suit the tone of the show, kept subtle and on-brand.",
    },
    {
      title: "Social clips",
      description: "The best moments turned into Reels, Shorts and TikToks with captions, pointing back to the full episode.",
    },
    {
      title: "Formats and export",
      description: "MP3 for Spotify and Apple Podcasts, video for YouTube and audiograms for social, ready to publish.",
    },
    {
      title: "Audio restoration",
      description: "Background noise, echo and hum removed so the voice stays clear, even from a home recording.",
    },
  ],
  steps: [
    {
      title: "Share your raw files",
      description: "Upload the recordings with notes on cuts, music preferences or specific edits.",
    },
    {
      title: "I edit and enhance",
      description: "Audio is prepared, errors and pauses are corrected, and intro, outro and music are added.",
    },
    {
      title: "Review and release",
      description: "Listen, leave feedback, and receive the finished episode with clips in every format you need.",
    },
  ],
  faq: [
    {
      q: "What file formats do you accept?",
      a: "MP3, WAV, M4A and most audio formats. Video files work too if you run a video podcast.",
    },
    {
      q: "Can you make social clips from my episodes?",
      a: "Yes. I pull the strongest moments into short clips with captions and formatting for Instagram, TikTok and YouTube Shorts.",
    },
    {
      q: "Do you remove filler words and long pauses?",
      a: "Yes. The ums, ahs and dead air go, without making the conversation sound choppy.",
    },
    {
      q: "Do interview shows get edited differently from solo shows?",
      a: "Yes. Interviews need both voices balanced and different pacing; solo shows usually need tighter editing. I adjust to your format.",
    },
  ],
  relatedWork: ["panel-reveal", "hmrc-crackdown"],
  agencyUrl: "https://montagemotion.com/podcast-editing-services",
  seo: {
    title: "Podcast video editing",
    description:
      "Podcast video editing by Samiul Arafat Imon: clean audio, tight pacing, intros, music and social clips for interview, solo and narrative shows.",
    keywords: ["podcast video editing", "podcast editor", "video podcast editing", "podcast clips"],
  },
};
