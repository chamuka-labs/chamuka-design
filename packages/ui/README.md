# `@chamuka/ui`

React 19 components for Chamuka products. **Look:** Tailwind utilities + `cva` + Daybreak tokens. **Behaviour:** [UI SDK](https://github.com/vercel-labs/ui) (`@ui-sdk/react` / `@ui-sdk/core` 0.1.0-beta.2) for interactive components, wrapped so public props stay stable.

Daybreak v2: dark by default, light "paper" via `ThemeProvider` (`data-theme` plus `.dark`/`.light`) or `prefers-color-scheme`. Ember is the only accent, controls are mono uppercase, edges are 1px hairlines, and there are no shadows.

## Install

Published on GitHub Packages (not npmjs yet). Copy the repo `.npmrc.example`, then `pnpm add @chamuka/ui @chamuka/tokens`.

```ts
import "@chamuka/tokens/tokens.css";
import "@chamuka/tokens/theme.css";
import "@chamuka/tokens/fonts.css";
import { ThemeProvider, Button, ToastProvider, TooltipProvider } from "@chamuka/ui";
```

Scan this package with Tailwind (`@source` / `content` glob on `node_modules/@chamuka/ui/dist/**/*.js`) or import `@chamuka/ui/styles.css` as a precompiled fallback.

```tsx
<ThemeProvider defaultTheme="system">
  <ToastProvider>
    <TooltipProvider>{children}</TooltipProvider>
  </ToastProvider>
</ThemeProvider>
```

## Components

**UI SDK:** Dialog, Popover, DropdownMenu, Select, Combobox, Tabs, Tooltip, Toast, Checkbox, RadioGroup, Switch, Accordion, Label.

**Plain:** Button, IconButton, Link, Input, Textarea, Card, Badge, Alert, Skeleton, Spinner, Stack, Container, ThemeProvider.

**Radix (presentational leftovers):** Avatar, Separator.

Primary buttons are an ember fill with ink text (4.8:1 in both themes; 6.2:1 on hover). Small ember text uses `text-accent-text`.

See [`AGENTS.md`](./AGENTS.md) and [`src/catalog.ts`](./src/catalog.ts).

## Accessibility

UI SDK supplies keyboard behaviour and ARIA on interactive components. Focus is a 2px `:focus-visible` outline in `--ring` (`#F06A3A` dark, `#A8340E` light) with a 2px offset. Motion respects `prefers-reduced-motion`. Pair every Checkbox, Switch, and Radio with a Label. IconButton requires `label`.
