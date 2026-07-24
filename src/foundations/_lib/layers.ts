/** Bounded z-index scale so story chrome never fights slide content. */
export const LAYER = {
  base: 0,
  raised: 10,
  overlay: 100,
  storyChrome: 1000,
} as const;
