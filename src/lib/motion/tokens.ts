/**
 * Motion tokens (Motion & UX spec §2). CSS twins live in src/styles/tokens.css.
 * Durations are in seconds because GSAP takes seconds.
 */
export const bezier = {
  cut: [0.76, 0, 0.24, 1],
  glide: [0.22, 1, 0.36, 1],
  ramp: [0.55, 0, 1, 0.45],
} as const;

/** Names registered with CustomEase in gsap.ts. */
export const ease = { cut: "cut", glide: "glide", ramp: "ramp", linear: "none" } as const;

export const dur = { micro: 0.16, ui: 0.28, reveal: 0.7, scene: 1.1 } as const;
export const dist = { nudge: 8, rise: 32, lift: 64 } as const;
export const stagger = { chars: 0.02, words: 0.05, lines: 0.09, items: 0.08, groups: 0.12 } as const;

/** Fraction of the container's height a layer travels each way across a viewport pass. */
export const parallax = { subtle: 0.08, medium: 0.16, strong: 0.3 } as const;
export type ParallaxSpeed = keyof typeof parallax;

export const tilt = { maxDeg: 6, perspective: 900 } as const;
export const timeline = { fps: 24 } as const;
