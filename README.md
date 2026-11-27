# Chamuka Daybreak

[![CI](https://github.com/chamuka-labs/chamuka-design/actions/workflows/ci.yml/badge.svg)](https://github.com/chamuka-labs/chamuka-design/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

Daybreak, the Chamuka Labs design system: tokens, React components, brand assets.

**Chamuka Labs is an applied AI lab: we ship AI-native products, put research into practice, and build tools for AI agents.**

Daybreak is brand infrastructure for [Chamuka Labs](https://chamuka.ai): tokens, components, and marks, not a product. **DrawIt**, FormIt, Play, Waypoint, Vmette and others are experiments or infrastructure, not launched products. DrawIt is an experiment under agent and human interaction (a canvas you and the model both edit).

This repository is public. Clone it, open issues, and send pull requests. See [CONTRIBUTING.md](./CONTRIBUTING.md).

**DrawIt's line is "From thoughts to form."** Use that only for DrawIt, never as a line for Chamuka Labs.

## Quick start

Requires Node 22+ and [pnpm](https://pnpm.io) 10.

```bash
pnpm install
pnpm build
pnpm test
pnpm --filter @chamuka/docs dev
```

Storybook (component and token docs) runs at http://localhost:6006.

## Packages

| Package | What it is |
|---|---|
| [`@chamuka/tokens`](./packages/tokens) | DTCG JSON → CSS variables, Tailwind v4 `@theme`, v3 preset |
| [`@chamuka/ui`](./packages/ui) | React 19 components (Tailwind look, [UI SDK](https://github.com/vercel-labs/ui) behaviour) |
| [`@chamuka/icons`](./packages/icons) | Daybreak mark and lockups as React |

Also in this repo: [`/brand`](./brand) (logo masters, print, voice), [`/templates`](./templates) (GitHub, OG, slides, email), [`apps/docs`](./apps/docs) (Storybook).

Agents working in other apps: start at [`AGENTS.md`](./AGENTS.md) and [`llms.txt`](./llms.txt). Machine-readable inventory: [`manifest.json`](./manifest.json). shadcn registry: [`registry/`](./registry).

## Use in an app

Packages currently publish to **GitHub Packages** (`npm.pkg.github.com`), not npmjs. Public npm can come later. Until then, copy [`.npmrc.example`](./.npmrc.example):

```
@chamuka:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then `pnpm add @chamuka/tokens @chamuka/ui @chamuka/icons`. `GITHUB_TOKEN` needs `read:packages`.

You can also copy a component from the registry (no package install):

```bash
npx shadcn@latest add https://raw.githubusercontent.com/chamuka-labs/chamuka-design/main/registry/button.json
```

### Tailwind v4

```css
@import "tailwindcss";
@import "@chamuka/tokens/tokens.css";
@import "@chamuka/tokens/theme.css";
@import "@chamuka/tokens/fonts.css";
@source "../node_modules/@chamuka/ui/dist/**/*.js";
```

The packages implement **Daybreak v2** ([spec](./brand/daybreak-v2/SPEC.md), live reference: https://chamuka-labs.github.io/). Dark is the default; the light "paper" theme follows `prefers-color-scheme` or `data-theme="light"`. `tokens.css` defines the `--db-*` palette and roles plus shadcn and (deprecated) v1 aliases. `theme.css` is a Tailwind v4 `@theme inline` block, so `bg-primary`, `bg-surface` and `text-muted-foreground` work and follow nested themes. If you cannot scan the package, `@import "@chamuka/ui/styles.css"` instead of `@source`.

### Tailwind v3

```ts
import type { Config } from "tailwindcss";
import chamuka from "@chamuka/tokens/preset";

export default {
  presets: [chamuka],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@chamuka/ui/dist/**/*.js",
  ],
} satisfies Config;
```

```ts
import "@chamuka/tokens/tokens.css";
```

### React

```tsx
import { ThemeProvider, Button, ToastProvider, TooltipProvider } from "@chamuka/ui";
import { LockupHorizontal } from "@chamuka/icons";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system">
      <ToastProvider>
        <TooltipProvider>
          <LockupHorizontal title="Chamuka Labs" height={32} />
          <Button>Save</Button>
          {children}
        </TooltipProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

Interactive components (Dialog, Select, Tabs, …) wrap UI SDK 0.1.0-beta.2. Presentational components are plain React + Tailwind. See `AGENTS.md` for the per-component table.

## Brand regeneration

```bash
python brand/scripts/_build.py
python brand/scripts/_templates.py
python brand/scripts/_surfaces.py
```

If the palette changes, update both the Python `PALETTE` and `packages/tokens/src/tokens`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

Report vulnerabilities to [security@chamuka.ai](mailto:security@chamuka.ai). See [SECURITY.md](SECURITY.md).

## Licence and trademarks

Code, tokens, components, and templates are **[Apache License 2.0](./LICENSE)** (copyright Chamuka Labs).

The Chamuka, Chamuka Labs, DrawIt, FormIt, and Play names and the Daybreak logos are **not** licensed for others to use as their own brand or to imply endorsement. Others may use them to refer to the projects. **Forks must rebrand.** See [`TRADEMARKS.md`](./TRADEMARKS.md).

---

Part of [Chamuka Labs](https://chamuka.ai), an applied AI lab.
