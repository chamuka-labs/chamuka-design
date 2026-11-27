# `@chamuka/docs`

Storybook 8 (`react-vite`) for Daybreak v2. Archivo via `@chamuka/tokens/fonts.css`; IBM Plex via `@fontsource`. Tailwind v4 via `@tailwindcss/vite` and `@source` on `packages/ui/src`.

Stories must cover every public `@chamuka/ui` export used in apps, including Accordion and Combobox. The Theme toolbar (Dark default / Light / System) sets `ThemeProvider` and `<html data-theme>`. `Foundations/Themes` renders both themes side by side. Do not import `@chamuka/ui/styles.css` here — the `@source` path is the one consuming apps should copy.
