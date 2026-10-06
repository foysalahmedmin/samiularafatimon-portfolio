import type { Service } from "../schema/collections";
import { motionGraphicsExplainers } from "./motion-graphics-explainers";
import { podcastVideoEditing } from "./podcast-video-editing";
import { promoCommercialVideo } from "./promo-commercial-video";
import { shortFormVideoEditing } from "./short-form-video-editing";
import { thumbnailDesign } from "./thumbnail-design";
import { youtubeVideoEditing } from "./youtube-video-editing";

/** Order here is the order shown on the site. */
export const services: Service[] = [
  shortFormVideoEditing,
  youtubeVideoEditing,
  podcastVideoEditing,
  motionGraphicsExplainers,
  promoCommercialVideo,
  thumbnailDesign,
];
