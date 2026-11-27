# `@chamuka/tokens`

Daybreak v2. DTCG JSON in `src/tokens` is the source of truth; it mirrors `brand/daybreak-v2/tokens.css` and `src/tokens.test.ts` fails if they drift. `src/build.ts` emits `dist/tokens.css`, `dist/theme.css`, `dist/fonts.css` (+ `dist/fonts/`) and `src/generated.ts`.

- `palette.json` → raw `--db-*` (fixed). `roles.json` → `--db-bg`, `--db-fg`, `--db-accent-text` … per theme. `daybreak.json` → type, space, layout, radius, motion (`--db-*`).
- `alias.json` → shadcn names (`--background`, `--primary`, `--ring` …) and v1 names (`--ember`, `--paper`, `--muted` …, deprecated) mapped onto roles. Re-declared on every theme scope so nested `data-theme` works.
- `tokens.css`: dark roles on `:root`, `[data-theme="dark"]`, `.dark`; light on `prefers-color-scheme: light` (unless dark is forced) and on `[data-theme="light"]`, `.light`.
- `theme.css`: Tailwind v4 `@theme inline`. Removes shadow utilities, caps radii at 4px.
- `preset`: Tailwind v3 preset. Pair with `tokens.css`. `content` must include `@chamuka/ui/dist/**/*.js`.

To change a value, change `brand/daybreak-v2/tokens.css` and the JSON together. Never add shadows, a second accent, or side borders. Do not put component styles here.
