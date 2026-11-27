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
@source "../node_modules/@chamuka/ui/dist/**/*.js";
```

`theme.css` maps `--primary` onto `--color-primary` so `bg-primary` / `text-muted-foreground` resolve. Core `--muted` is Daybreak muted **ink**. The muted **surface** is `--muted-bg`; Tailwind `muted` uses that.

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
  darkMode: ["class"],
} satisfies Config;
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

Light tokens sit on `:root`. Dark overrides apply to `.dark` and `[data-theme="dark"]`. Ember `#E24E1B` on paper is 3.74:1 — AA **large** only. Do not use ember for small body text.

## Brand

Logo masters live in `/brand`. The Daybreak v2 web spec (dark and light themes, no shadows, hairline borders) is in `brand/daybreak-v2/SPEC.md`. The packages still ship v1 tokens until the migration lands. In product UI use `@chamuka/icons` (`Mark`, `LockupHorizontal`, …). Do not recolour the sun, horizon, or gold bar. Product chrome icons: Lucide, 1.5–2px, `currentColor`.

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
