/**
 * The Isthmus deck authoring canvas. Slides are composed at this fixed size and
 * scaled to fit by the viewer, so every layout value in a slide is absolute px
 * on this canvas. 16:9, matching the master PDF (native 720×405 ×1.778).
 */
export const SLIDE = {
  width: 1280,
  height: 720,
  aspect: "16 / 9",
} as const;
