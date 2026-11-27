---
"@chamuka/tokens": minor
"@chamuka/ui": minor
---

Move the packages to Daybreak v2 (`brand/daybreak-v2/SPEC.md`).

**Tokens.** New `--db-*` raw palette and themed roles generated from DTCG JSON and tested for parity with `brand/daybreak-v2/tokens.css`. Dark is the default; the light "paper" theme applies on `prefers-color-scheme: light` or `data-theme="light"` / `.light`, on `<html>` or any element. shadcn names (`--background`, `--primary`, `--ring` …) now map onto v2 roles. v1 names (`--ember`, `--paper`, `--ink`, `--mist`, `--muted`, `--success`, `--neutral-*`, `--accent-drawit` …) still resolve and are marked deprecated. New `fonts.css` (Archivo), new TS exports `palette`, `roles`, `daybreak`. Tailwind v4 theme is now `@theme inline`, removes every shadow utility and caps radii at 4px. The v3 preset uses the same variables.

**UI.** Components use the v2 roles: ember as the only accent with ink text, IBM Plex Mono uppercase controls, condensed display titles, 1px hairlines, 2px/4px radii, 2px focus outlines (`#F06A3A` dark, `#A8340E` light) and no shadows. Status (Alert, Badge, error Toast) is an 8px signal dot plus the edge instead of a tinted fill. `ThemeProvider` defaults to `"system"` and resolves to dark when there is no preference.

No exported names were removed, but the look changes everywhere:

- Default surfaces are warm dark (`#12100E`), not paper. Pass `defaultTheme="light"` or set `data-theme="light"` to keep a light UI.
- `--shadow-*` are `none` and Tailwind `shadow-*` utilities no longer exist.
- `--radius-*` are 2px/4px (`--radius` is 4px). `rounded-xl` and larger render at 4px.
- `--font-display` is Archivo (load `@chamuka/tokens/fonts.css`); Sora is gone.
- Durations are 120/220/480ms with `cubic-bezier(0.2, 0.7, 0.1, 1)`.
- `--destructive` is ember; the destructive Button is an ember-edged outline that fills on hover.
- Focus uses `outline` instead of `ring`/`ring-offset`.
- `color.*` TS values are the v2 light-theme equivalents (for example `color.paper` is `#F2EAD9`, `color.ink` is `#12100E`).
