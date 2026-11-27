import type { Preview } from "@storybook/react";
import { ThemeProvider, ToastProvider, TooltipProvider } from "@chamuka/ui";
import "@chamuka/tokens/fonts.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { createElement, useEffect, type ReactNode } from "react";
import "./preview.css";

/** Mirror the toolbar choice onto <html data-theme> so the canvas body and portals follow it. */
function ThemeSync({
  theme,
  children,
}: {
  theme: "dark" | "light" | "system";
  children?: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);
  return children;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Daybreak v2 theme: dark (default), light paper, or follow the system",
      defaultValue: "dark",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light (paper)" },
          { value: "system", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme =
        (["dark", "light", "system"] as const).find((t) => t === context.globals.theme) ??
        "dark";
      return createElement(
        ThemeSync,
        { theme, key: theme },
        createElement(
          ThemeProvider,
          {
            defaultTheme: theme,
          },
          createElement(
            ToastProvider,
            null,
            createElement(TooltipProvider, { delayDuration: 150 }, createElement(Story)),
          ),
        ),
      );
    },
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: ["Introduction", "Foundations", "Guidelines", "Components", "Brand"],
      },
    },
  },
};

export default preview;
