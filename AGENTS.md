# Chamuka design system — agent guide

This repository is **chamuka-labs/chamuka-design** (Daybreak), brand infrastructure for Chamuka Labs — not a product. Consume this pack from lab apps; do not invent a parallel palette, type ramp, or component set.

**Chamuka Labs is an applied AI lab: we ship AI-native products, put research into practice, and build tools for AI agents.**

**Voice:** founder-led, short, specific, slightly dry; a tinkerer speaking for the lab. Lead with the lab, then name the outputs. DrawIt, FormIt, Play, Waypoint, Vmette and others are experiments or infrastructure, not launched products. DrawIt is an experiment under agent and human interaction. “From thoughts to form” is DrawIt’s line only. If you write “research”, mean applied engineering — no papers, benchmarks, evaluation work, or research results. Do not claim other chamuka-labs repos are already open source. Full rules: [`brand/docs/voice.md`](./brand/docs/voice.md).

Before writing UI, read this file, then the package `AGENTS.md` for the package you are changing. Machine-readable inventory: [`manifest.json`](./manifest.json), [`llms.txt`](./llms.txt), and the shadcn registry under [`registry/`](./registry).

## Install (GitHub Packages)

Packages currently publish to GitHub Packages, not npmjs. Public npm can come later. In the consuming app:

```
@chamuka:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

See [`.npmrc.example`](./.npmrc.example). Then:

```bash
pnpm add @chamuka/tokens @chamuka/ui @chamuka/icons
```

`GITHUB_TOKEN` needs `read:packages`. Grant the consuming repo access to the packages after the first publish from `main`.

## Tailwind — required for `@chamuka/ui`

Components are styled with Tailwind utility classes (`bg-primary`, `text-muted-foreground`). CSS variables live in `@chamuka/tokens`. You must scan the UI package **or** import the precompiled fallback.

### Tailwind v4 (preferred)

```css
@import "tailwindcss";
@import "@chamuka/tokens/tokens.css";
@import "@chamuka/tokens/theme.css";
@import "@chamuka/tokens/fonts.css"; /* Archivo display face; load IBM Plex Sans/Mono via @fontsource */
@source "../node_modules/@chamuka/ui/dist/**/*.js";
```

`theme.css` is `@theme inline`, so utilities reference the variables directly and follow nested `data-theme` scopes. It exposes the v2 roles (`bg-bg`, `bg-surface`, `bg-raised`, `border-border-strong`, `text-fg-2`, `text-accent-text`, `outline-focus`, `bg-sig-forest` …) and the shadcn names (`bg-primary`, `text-muted-foreground`, `bg-accent` = hover surface). Tailwind's shadow utilities are removed and radii are capped at 4px. Type: `text-hero`, `text-d1`…`text-d4`, `text-lead`, `text-label`, `font-display` (use with `font-extrabold uppercase [font-stretch:72%]`).

If you cannot `@source` the package, import the compiled fallback instead of scanning:

```css
@import "@chamuka/ui/styles.css";
```

That file already includes Tailwind + tokens. Do not also `@source` in that case.

### Tailwind v3

```ts
import type { Config } from "tailwindcss";
import chamuka from "@chamuka/tokens/preset";

export default {
  presets: [chamuka],
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@chamuka/ui/dist/**/*.js"],
} satisfies Config; // the preset sets darkMode to [data-theme="dark"]; colours are variables, so no dark: variants are needed
```

```ts
import "@chamuka/tokens/tokens.css";
```

## UI SDK (behaviour layer)

Interactive components wrap [UI SDK](https://github.com/vercel-labs/ui) (`@ui-sdk/core` + `@ui-sdk/react`, Apache-2.0, pinned at **0.1.0-beta.2**). Public props stay on `@chamuka/ui`. Do **not** import UI SDK types from this package; do **not** re-export them.

| When you need to… | Do this |
|---|---|
| Restyle a Chamuka component | Change Tailwind classes / `cva` variants in `packages/ui/src`. Keep the wrapper's public props. |
| Extend behaviour (keyboard, focus, popup, ARIA) | Use UI SDK. Install the skill, then compose with `definePrimitive` / `createParts`. Do not hand-roll `role="dialog"` etc. |
| Add a component UI SDK does not ship well | Fall back to Radix and record why in `packages/ui/src/catalog.ts` (`behaviour: "radix"` + `behaviourReason`). |

Give agents the UI SDK skill and packaged docs:

```bash
npx skills add vercel-labs/ui --skill ui-sdk
```

Before using UI SDK in this repo, follow that skill if it is installed, and read `node_modules/@ui-sdk/react/docs/llms.txt`. To build a **new** primitive, search `node_modules/@ui-sdk/react/docs/core.md` by heading and read `rendering.md` next to it. Upstream AGENTS.md: https://github.com/vercel-labs/ui/blob/main/AGENTS.md

Pinned exact versions (no `^` / `~`) because the SDK is beta and subject to [Vercel public beta terms](https://vercel.com/docs/release-phases/public-beta-agreement).

`asChild` on Chamuka wrappers maps to UI SDK's `render={<Child />}`. UI SDK popups do not use portals; `DialogPortal` / `DropdownMenuPortal` / `TooltipProvider` are compatibility no-ops.

## shadcn registry

After merge to `main`:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/chamuka-labs/chamuka-design/main/registry/button.json
```

Index: `https://raw.githubusercontent.com/chamuka-labs/chamuka-design/main/registry/registry.json`

Prefer installing `@chamuka/ui` in Chamuka Labs apps. Use the registry when an app must copy source.

## Theme

Wrap once:

```tsx
import { ThemeProvider, ToastProvider, TooltipProvider } from "@chamuka/ui";

<ThemeProvider defaultTheme="system">
  <ToastProvider>
    <TooltipProvider>{children}</TooltipProvider>
  </ToastProvider>
</ThemeProvider>
```

Daybreak v2 (`brand/daybreak-v2/SPEC.md`) — the live reference is https://chamuka-labs.github.io/.

- **Themes.** Dark (warm near-black `#12100E`, cream text) is the default. Light "paper" (`#F2EAD9`, ink text) swaps roles only. No attribute follows `prefers-color-scheme`; `data-theme="dark|light"` (or `.dark` / `.light`) on `<html>` or any element forces it for that subtree.
- **Tokens.** Raw palette `--db-*` (never themed) → roles `--db-bg`, `--db-surface`, `--db-raised`, `--db-border`, `--db-border-strong`, `--db-border-hover`, `--db-fg`, `--db-fg-2`, `--db-fg-3`, `--db-fg-large`, `--db-accent`, `--db-accent-hover`, `--db-accent-press`, `--db-on-accent`, `--db-accent-text`, `--db-accent-text-hover`, `--db-sig-*`, `--db-focus`. Components use roles only.
- **Compatibility.** shadcn names (`--background`, `--primary`, `--ring` …) are mapped onto roles. v1 names (`--ember`, `--paper`, `--ink`, `--mist`, `--muted`, `--success`, `--neutral-*`, `--accent-drawit` …) still resolve but are **deprecated**; `--shadow-*` are `none`.
- **Ember `#E24E1B` is the only accent**: primary fill, section numbers, rules, the emphasised item's 1px edge. Text on ember is ink, never cream or white. Small ember text uses `--db-accent-text` (`#A8340E` on paper).
- **Type.** Archivo condensed (72%, 800, uppercase) for display; IBM Plex Sans for body; IBM Plex Mono 13px uppercase, 0.08em tracking for buttons, labels, tabs and nav. Sora is retired.
- **Structure.** Uniform 1px hairlines; 2px radius on controls, 4px on panels. **No shadows of any kind. No side or accent borders** (no thick left bars, no coloured top strips).
- **Focus.** 2px outline, 2px offset: `#F06A3A` on dark, `#A8340E` on light. Never a box-shadow ring.
- Signal colours (gold, slate, mineral, forest, coral) are for diagrams and 8px status dots only.

## Brand

Logo masters live in `/brand`. The Daybreak v2 spec (dark and light themes, no shadows, hairline borders, quiet footer) is in `brand/daybreak-v2/SPEC.md`; `@chamuka/tokens` is generated to match its `tokens.css` and a test guards parity. In product UI use `@chamuka/icons` (`Mark`, `LockupHorizontal`, …). Do not recolour the sun, horizon, or gold bar. Product chrome icons: Lucide, 1.5–2px, `currentColor`.

## Commands

```bash
pnpm install
pnpm build
pnpm test
pnpm generate:agent   # regenerates manifest.json + registry/; CI checks git diff --exit-code
pnpm --filter @chamuka/docs dev
```

Do not publish to npmjs from a laptop. Do not push to `main`. Releases run on merge to `main` via Changesets → GitHub Packages. Public npm can come later.

## GitHub Packages scope

Package names stay `@chamuka/*` (brand scope). The GitHub owner is `chamuka-labs`. If `changeset publish` fails because GitHub Packages requires the owner as scope, that is an open follow-up — do not silently rename packages to `@chamuka-labs/*`.
