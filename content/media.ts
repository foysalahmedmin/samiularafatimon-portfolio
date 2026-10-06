import type { MediaItem } from "./schema/media";

const R2 = "https://pub-6a9bd81559354e09b0ca799ba12301c8.r2.dev";
const source = `${R2}/production`;

/**
 * Every image and video the site uses. Add an entry here, run `pnpm media:sync`,
 * and reference it by `id` from other content files. Alt text is mandatory.
 */
export const media: MediaItem[] = [
  /* ── Imon ── */
  {
    kind: "image",
    id: "imon-portrait",
    file: "imon-portrait.jpg",
    local: "assets/source/profile.jpg",
    maxWidth: 1800,
    alt: "Samiul Arafat Imon smiling at a laptop outdoors, wearing a black cap, with green hills and a cloudy sky behind.",
  },

  /* ── Reel ── */
  {
    kind: "image",
    id: "reel-poster",
    file: "reel-poster.jpg",
    local: "assets/source/reel-poster.jpg",
    maxWidth: 1920,
    alt: "A frame from the Montage Motion studio reel.",
  },
  {
    kind: "video",
    id: "reel-studio",
    src: `${R2}/intro.mp4`,
    poster: "reel-poster",
    preview: "studio-reel.mp4",
    previewStartSec: 2,
    previewHeight: 720,
    aspect: "16:9",
    title: "Montage Motion studio reel",
    needsReview: true,
    reviewNote: "Temporary: this is the studio's intro video. Replace with Imon's own showreel.",
  },

  /* ── Case study: Pathao ── */
  {
    kind: "image",
    id: "pathao-hero",
    file: "pathao-hero.jpg",
    origin: `${source}/montagemotion-1785852438182-83100-Pathao.jpg`,
    maxWidth: 1800,
    credit: "Montage Motion",
    alt: "Pathao campaign artwork: two riders in red helmets looking at a phone in front of city buildings, with the Pathao logo above.",
  },
  {
    kind: "image",
    id: "pathao-logo",
    file: "pathao-logo.jpg",
    origin: `${source}/montagemotion-1785852670769-18619-Pathao_copy.jpg`,
    maxWidth: 600,
    alt: "Pathao logo.",
  },

  /* ── Case study: Rich From Anywhere ── */
  {
    kind: "image",
    id: "rfa-hero",
    file: "rfa-hero.jpg",
    origin: `${source}/montagemotion-1785840719859-88363-Rich_From_anywhere.jpg`,
    maxWidth: 1800,
    credit: "Montage Motion",
    alt: "Rich From Anywhere campaign artwork: a presenter pointing at the channel name, with a row of short-video thumbnails below.",
  },
  {
    kind: "image",
    id: "rfa-logo",
    file: "rfa-logo.jpg",
    origin: `${source}/montagemotion-1785841169250-42813-Frame_2147228384.jpg`,
    maxWidth: 600,
    alt: "Rich From Anywhere logo: the two founders back to back inside a circle.",
  },
  {
    kind: "image",
    id: "rfa-stephen",
    file: "rfa-stephen.png",
    origin: `${source}/montagemotion-1785842929362-49502-Screenshot_2026-08-04_at_5.28.37%C3%A2%C2%80%C2%AFPM.png`,
    maxWidth: 600,
    alt: "Portrait of Stephen Blackburn, co-founder of Rich From Anywhere.",
  },

  /* ── Case study: Fafa Fitness ── */
  {
    kind: "image",
    id: "fafa-hero",
    file: "fafa-hero.jpg",
    origin: `${source}/montagemotion-1785846235136-28769-Fafa_Fitness.jpg`,
    maxWidth: 1800,
    credit: "Montage Motion",
    alt: "Fafa Fitness campaign artwork: a fitness creator flexing in a gym, with a row of short-video thumbnails.",
  },
  {
    kind: "image",
    id: "fafa-logo",
    file: "fafa-logo.jpg",
    origin: `${source}/montagemotion-1785846799718-42754-fafa.jpg`,
    maxWidth: 600,
    alt: "Fafa Fitness profile image: the creator flexing outdoors in front of palm trees.",
  },
  {
    kind: "image",
    id: "fafa-portrait",
    file: "fafa-portrait.jpg",
    origin: `${source}/montagemotion-1785847665017-77512-3tR_9eNV.jpg`,
    maxWidth: 600,
    alt: "Portrait of Fafa, founder of Fafa Fitness, on a beach.",
  },

  /* ── Work: thumbnails ── */
  {
    kind: "image",
    id: "thumb-panel-reveal",
    file: "thumb-panel-reveal.jpg",
    origin: `${R2}/montagemotion-thm2.jpg`,
    maxWidth: 1280,
    alt: "Thumbnail for 'Panel Reveal': three men at a podcast table with microphones and a laptop.",
  },
  {
    kind: "image",
    id: "thumb-will-ai-replace",
    file: "thumb-will-ai-replace.jpg",
    origin: `${R2}/montagemotion-thm3.jpg`,
    maxWidth: 1280,
    alt: "Thumbnail for 'Will AI Replace Video Editors?': a presenter in a cap beside a glowing robot.",
  },
  {
    kind: "image",
    id: "thumb-neo-reactionary",
    file: "thumb-neo-reactionary.jpg",
    origin: `${R2}/montagemotion-thumx.jpg`,
    maxWidth: 1280,
    alt: "Thumbnail for 'Neo-Reactionary': a man's portrait beside a stone bust on a dark gold background.",
  },
  {
    kind: "image",
    id: "thumb-ten-thousand-contest",
    file: "thumb-ten-thousand-contest.jpg",
    origin: `${R2}/montagemotion-thm4.jpg`,
    maxWidth: 1280,
    alt: "Thumbnail for 'Do Not Join This $10,000 Contest': a presenter with open hands against a dark background.",
  },
  {
    kind: "image",
    id: "thumb-crazy-genius",
    file: "thumb-crazy-genius.jpg",
    origin: `${R2}/montagemotion-thm6.jpg`,
    maxWidth: 1280,
    alt: "Thumbnail for 'Crazy Genius': a man holding a mask of his own smiling face over a binary-code background.",
  },
  {
    kind: "image",
    id: "thumb-hmrc-crackdown",
    file: "thumb-hmrc-crackdown.jpg",
    origin: `${R2}/montagemotion-thm1.jpg`,
    maxWidth: 1280,
    alt: "Thumbnail for 'HMRC Crackdown! Are You at Risk?': a woman in a leather jacket at a podcast microphone beside bold black text.",
  },

  /* ── Work: players ── */
  {
    kind: "youtube",
    id: "yt-panel-reveal",
    videoId: "CBz1vr6AOJ4",
    title: "Panel Reveal",
    thumbnail: "thumb-panel-reveal",
    aspect: "16:9",
  },
  {
    kind: "video",
    id: "video-will-ai-replace",
    src: `${R2}/videos/wor-2.mp4`,
    poster: "thumb-will-ai-replace",
    preview: "will-ai-replace.mp4",
    previewStartSec: 12,
    aspect: "16:9",
    title: "Will AI Replace Video Editors?",
  },
  {
    kind: "video",
    id: "video-neo-reactionary",
    src: `${R2}/videos/wor-1.mp4`,
    poster: "thumb-neo-reactionary",
    preview: "neo-reactionary.mp4",
    previewStartSec: 12,
    aspect: "16:9",
    title: "Neo-Reactionary",
  },
  {
    kind: "video",
    id: "video-ten-thousand-contest",
    src: `${R2}/videos/wor-3.mp4`,
    poster: "thumb-ten-thousand-contest",
    preview: "ten-thousand-contest.mp4",
    previewStartSec: 12,
    aspect: "16:9",
    title: "Do Not Join This $10,000 Contest",
  },
  {
    kind: "youtube",
    id: "yt-crazy-genius",
    videoId: "lm7q1t7L8zE",
    title: "Crazy Genius",
    thumbnail: "thumb-crazy-genius",
    aspect: "16:9",
  },
  {
    kind: "youtube",
    id: "yt-hmrc-crackdown",
    videoId: "05Nz8U-CWs0",
    title: "HMRC Crackdown! Are You at Risk?",
    thumbnail: "thumb-hmrc-crackdown",
    aspect: "16:9",
  },
];
