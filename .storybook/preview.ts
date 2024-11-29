import type { Preview } from "@storybook/react";

import { Roboto } from "../fonts/fonts"; // Adjust the path if necessary
import "../src/app/style/globals/globals.css";
import "../src/app/style/globals/utilities.css";

// Apply the font to the body or specific components
document.body.classList.add(Roboto.className); // or Roboto.className

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
