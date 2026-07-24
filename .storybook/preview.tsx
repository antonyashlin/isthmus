import type { Preview } from "@storybook/nextjs-vite";

import { fontVariables } from "../src/lib/fonts";
import "../src/styles/globals.css";

// Storybook never renders src/app/layout.tsx, so the font variables must be put
// on <html> here too — they are declared at :root, where tokens.css reads them.
if (typeof document !== "undefined") {
  document.documentElement.className += ` ${fontVariables}`;
}

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          "Foundations",
          ["Overview", "Colours", "Typography", "Spacing", "Deck System"],
          "Components",
          "Decks",
        ],
      },
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: "todo" },
    viewport: {
      options: {
        slide: {
          name: "Slide (16:9)",
          styles: { width: "1280px", height: "720px" },
          type: "desktop",
        },
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
