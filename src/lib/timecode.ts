import { timeline } from "@/lib/motion/tokens";

const pad = (n: number) => String(n).padStart(2, "0");

/** HH:MM:SS:FF for a frame count at the timeline's frame rate. */
export function timecode(frame: number, fps: number = timeline.fps): string {
  const ff = frame % fps;
  const total = Math.floor(frame / fps);
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}:${pad(ff)}`;
}
