/**
 * Tailwind CSS v3 preset for Daybreak v2. Pair with `@chamuka/tokens/tokens.css` (and `fonts.css`).
 *
 * ```ts
 * import chamuka from "@chamuka/tokens/preset";
 * export default { presets: [chamuka], content: ["./src/**\/*.{ts,tsx}", "./node_modules/@chamuka/ui/dist/**\/*.js"] };
 * ```
 *
 * Colours are CSS variables, so light and dark follow `data-theme` / `prefers-color-scheme`
 * without `dark:` variants. Shadows are removed (every boxShadow / dropShadow value is `none`).
 */
const fontDisplay = ["Archivo", "Arial Narrow", "Helvetica Neue", "Arial", "sans-serif"];
const fontSans = ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"];
const fontMono = ["IBM Plex Mono", "ui-monospace", "monospace"];

const v = (name: string) => `var(--${name})`;
const none = {
  sm: "none",
  DEFAULT: "none",
  md: "none",
  lg: "none",
  xl: "none",
  "2xl": "none",
  inner: "none",
  none: "none",
};

const preset = {
  darkMode: ["class", '[data-theme="dark"]'] as ["class", string],
  theme: {
    extend: {
      colors: {
        /* Daybreak v2 roles */
        bg: v("db-bg"),
        surface: v("db-surface"),
        raised: v("db-raised"),
        "border-strong": v("db-border-strong"),
        "border-hover": v("db-border-hover"),
        fg: {
          DEFAULT: v("db-fg"),
          2: v("db-fg-2"),
          3: v("db-fg-3"),
          large: v("db-fg-large"),
        },
        "on-accent": v("db-on-accent"),
        "accent-text": { DEFAULT: v("db-accent-text"), hover: v("db-accent-text-hover") },
        focus: v("db-focus"),
        sig: {
          gold: v("db-sig-gold"),
          slate: v("db-sig-slate"),
          mineral: v("db-sig-mineral"),
          forest: v("db-sig-forest"),
          coral: v("db-sig-coral"),
        },
        /* shadcn names */
        background: v("background"),
        foreground: v("foreground"),
        card: { DEFAULT: v("card"), foreground: v("card-foreground") },
        popover: { DEFAULT: v("popover"), foreground: v("popover-foreground") },
        primary: {
          DEFAULT: v("primary"),
          foreground: v("primary-foreground"),
          hover: v("primary-hover"),
          press: v("primary-press"),
        },
        secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
        muted: { DEFAULT: v("muted-bg"), foreground: v("muted-foreground") },
        accent: { DEFAULT: v("accent"), foreground: v("accent-foreground") },
        destructive: {
          DEFAULT: v("destructive"),
          foreground: v("destructive-foreground"),
        },
        border: v("border"),
        input: v("input"),
        ring: v("ring"),
        /** @deprecated v1 names, mapped onto v2 roles. */
        ember: v("ember"),
        gold: v("gold"),
        slate: v("slate"),
        paper: v("paper"),
        mist: v("mist"),
        ink: v("ink"),
        success: v("success"),
        warning: v("warning"),
        danger: v("danger"),
        info: v("info"),
        play: v("play"),
        forest: v("forest"),
        mineral: v("mineral"),
        neutral: {
          50: "#FBF7F2",
          100: "#F3EBE0",
          200: "#E6D9C8",
          300: "#D0C0AA",
          400: "#B3A28A",
          500: "#8F8170",
          600: "#6B645C",
          700: "#524C46",
          800: "#3A3531",
          900: "#241F1C",
          950: "#17141C",
        },
      },
      fontFamily: {
        display: fontDisplay,
        sans: fontSans,
        mono: fontMono,
      },
      fontSize: {
        hero: [
          v("db-text-hero"),
          { lineHeight: "0.9", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        d1: [
          v("db-text-d1"),
          { lineHeight: "0.9", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        d2: [
          v("db-text-d2"),
          { lineHeight: "0.9", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        d3: [
          v("db-text-d3"),
          { lineHeight: "0.95", letterSpacing: "-0.01em", fontWeight: "800" },
        ],
        d4: [v("db-text-d4"), { lineHeight: "1.15", fontWeight: "800" }],
        lead: [v("db-text-lead"), { lineHeight: "1.5" }],
        label: ["13px", { lineHeight: "1.2", letterSpacing: "0.08em" }],
        micro: ["12px", { lineHeight: "1.4" }],
        /** @deprecated v1 scale names, mapped onto the v2 display scale. */
        display: [v("db-text-hero"), { lineHeight: "0.9", fontWeight: "800" }],
        h1: [v("db-text-d1"), { lineHeight: "0.9", fontWeight: "800" }],
        h2: [v("db-text-d2"), { lineHeight: "0.9", fontWeight: "800" }],
        h3: [v("db-text-d3"), { lineHeight: "0.95", fontWeight: "800" }],
        h4: [v("db-text-d4"), { lineHeight: "1.15", fontWeight: "800" }],
        body: ["16px", { lineHeight: "1.6" }],
        small: ["15px", { lineHeight: "1.5" }],
        caption: ["12px", { lineHeight: "1.4" }],
        code: ["14px", { lineHeight: "1.6" }],
      },
      letterSpacing: {
        display: "-0.01em",
        label: "0.08em",
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "2px",
        lg: "4px",
        xl: "4px",
        "2xl": "4px",
        "3xl": "4px",
      },
      boxShadow: none,
      dropShadow: none,
      transitionDuration: {
        fast: "120ms",
        base: "220ms",
        slow: "480ms",
      },
      transitionTimingFunction: {
        daybreak: "cubic-bezier(0.2, 0.7, 0.1, 1)",
      },
      maxWidth: {
        daybreak: "1200px",
      },
      zIndex: {
        dropdown: "50",
        sticky: "100",
        overlay: "200",
        modal: "300",
        toast: "400",
        tooltip: "500",
      },
    },
  },
};

export default preset;
