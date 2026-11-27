# `@chamuka/tokens`

Daybreak v2 design tokens for Chamuka Labs: a warm dark theme by default, a light "paper" theme, ember `#E24E1B` as the only accent, Archivo condensed display, IBM Plex Sans body and IBM Plex Mono labels. No shadows. Spec: [`brand/daybreak-v2/SPEC.md`](../../brand/daybreak-v2/SPEC.md).

The build emits:

- `tokens.css` — raw palette (`--db-ground`, `--db-ember` …), themed roles (`--db-bg`, `--db-fg`, `--db-accent-text`, `--db-focus` …), compatibility aliases (`--background`, `--primary` …; v1 names deprecated) and a Tailwind v4 `@theme inline` block
- `theme.css` — the Tailwind v4 `@theme inline` block on its own
- `fonts.css` — Archivo variable `@font-face` (OFL, shipped in `dist/fonts/`)
- `preset` — Tailwind v3 preset
- typed exports: `palette`, `roles`, `daybreak`, `semantic`, plus the v1 shapes

## Themes

Dark is the default. With no attribute the theme follows `prefers-color-scheme`. `data-theme="dark"` or `data-theme="light"` (or `.dark` / `.light`) on `<html>` or any element forces it for that subtree.

## Consume

### CSS variables (any stack)

```ts
import "@chamuka/tokens/tokens.css";
import "@chamuka/tokens/fonts.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-mono/500.css";
```

### Tailwind v4

```css
@import "tailwindcss";
@import "@chamuka/tokens/tokens.css";
@import "@chamuka/tokens/theme.css";
@import "@chamuka/tokens/fonts.css";
@source "../node_modules/@chamuka/ui/dist/**/*.js";
```

Utilities: `bg-bg`, `bg-surface`, `bg-raised`, `text-fg`, `text-fg-2`, `text-fg-3`, `border-border`, `border-border-strong`, `border-border-hover`, `text-accent-text`, `bg-primary text-primary-foreground`, `hover:bg-primary-hover`, `outline-focus`, `bg-sig-forest`, `text-hero`, `text-d1`…`text-d4`, `text-lead`, `text-label`, `tracking-label`, `max-w-daybreak`.

### Tailwind v3

```ts
import type { Config } from "tailwindcss";
import chamuka from "@chamuka/tokens/preset";

export default {
  presets: [chamuka],
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@chamuka/ui/dist/**/*.js"],
} satisfies Config;
```

### TypeScript

```ts
import { palette, roles, semantic } from "@chamuka/tokens";

palette.ember; // "#E24E1B"
roles.dark.focus; // "#F06A3A"
roles.light.accentText; // "#A8340E"
semantic.light.primary; // "#E24E1B"
```

## Migrating from v1

v1 CSS names keep resolving, mapped onto v2 roles, and are marked `@deprecated` in the CSS and in `manifest.json`. Values change: surfaces are warm dark by default, `--shadow-*` are `none`, radii are 2px/4px, `--font-display` is Archivo, durations are 120/220/480ms. Prefer the `--db-*` roles in new code.
