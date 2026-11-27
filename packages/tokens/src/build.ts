/**
 * Compile DTCG JSON (src/tokens) into:
 *   dist/tokens.css  — Daybreak v2 palette + roles (dark default, light "paper"), compat aliases, Tailwind v4 @theme
 *   dist/theme.css   — Tailwind v4 `@theme inline` only (import after tokens.css)
 *   dist/fonts.css   — Archivo @font-face (+ dist/fonts/*.woff2)
 *   src/generated.ts — typed values
 *
 * Theme selection (same contract as brand/daybreak-v2/tokens.css):
 *   no attribute            -> follows prefers-color-scheme (dark when there is no preference)
 *   [data-theme="dark"|"light"] or .dark/.light on any element -> forced for that subtree
 */
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cssName } from "./css-name";

const ROOT = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = join(ROOT, "tokens");
const DIST = join(ROOT, "..", "dist");
const GENERATED = join(ROOT, "generated.ts");
const FONT_SRC = join(ROOT, "..", "..", "..", "brand", "daybreak-v2", "fonts");

type TokenNode = { $value?: unknown; $description?: string; $deprecated?: unknown };
type FlatToken = {
  path: string;
  value: unknown;
  description?: string;
  deprecated?: string;
};
type Theme = "dark" | "light";

function walk(node: unknown, prefix: string[], acc: FlatToken[]): void {
  if (!node || typeof node !== "object") return;
  if ("$value" in (node as object)) {
    const t = node as TokenNode;
    const dep = t.$deprecated;
    acc.push({
      path: prefix.join("."),
      value: t.$value,
      description: t.$description,
      deprecated:
        dep === undefined || dep === false
          ? undefined
          : dep === true
            ? "deprecated"
            : String(dep),
    });
    return;
  }
  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    if (!key.startsWith("$")) walk(child, [...prefix, key], acc);
  }
}

function loadTokens(): FlatToken[] {
  const acc: FlatToken[] = [];
  for (const file of readdirSync(TOKENS_DIR).sort()) {
    if (file.endsWith(".json"))
      walk(JSON.parse(readFileSync(join(TOKENS_DIR, file), "utf8")), [], acc);
  }
  return acc;
}

const flat = loadTokens();
const byPath = new Map(flat.map((t) => [t.path, t]));
const group = (prefix: string) => flat.filter((t) => t.path.startsWith(`${prefix}.`));
const REF = /^\{([^}]+)\}$/;
const GENERIC = new Set([
  "ui-sans-serif",
  "system-ui",
  "sans-serif",
  "ui-monospace",
  "monospace",
  "serif",
]);

function format(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.every((n) => typeof n === "number"))
      return `cubic-bezier(${value.join(", ")})`;
    return value.map((v) => (GENERIC.has(String(v)) ? String(v) : `"${v}"`)).join(", ");
  }
  return String(value);
}

/** CSS value: references become var(--x); literals are formatted. */
function css(token: FlatToken): string {
  const m = typeof token.value === "string" ? token.value.match(REF) : null;
  return m?.[1] ? `var(${cssName(m[1])})` : format(token.value);
}

/** Fully resolved value for a theme (role refs follow that theme). */
function resolve(value: unknown, theme: Theme, stack: string[] = []): unknown {
  if (typeof value !== "string") return value;
  const m = value.match(REF);
  if (!m?.[1]) return value;
  let ref = m[1];
  if (ref.startsWith("role.") && !/^role\.(dark|light)\./.test(ref))
    ref = `role.${theme}.${ref.slice(5)}`;
  if (stack.includes(ref)) throw new Error(`Cycle: ${[...stack, ref].join(" -> ")}`);
  const token = byPath.get(ref);
  if (!token) throw new Error(`Unresolved token reference {${ref}}`);
  return resolve(token.value, theme, [...stack, ref]);
}

function line(token: FlatToken, indent = "  "): string {
  const notes = [
    token.deprecated
      ? `@deprecated ${token.deprecated === "deprecated" ? "" : token.deprecated}`.trim()
      : "",
    token.description ?? "",
  ]
    .filter(Boolean)
    .join(" — ");
  return `${indent}${cssName(token.path)}: ${css(token)};${notes ? ` /* ${notes} */` : ""}`;
}

const lines = (tokens: FlatToken[], indent = "  ") =>
  tokens.map((t) => line(t, indent)).join("\n");

const legacyStatic = flat.filter((t) =>
  /^(color|font|fontWeight|fontSize|lineHeight|spacing|radius|shadow|motion|zIndex)\./.test(
    t.path,
  ),
);

const darkRoles = group("role.dark");
const lightRoles = group("role.light");
const darkKeys = darkRoles.map((t) => t.path.slice("role.dark.".length));
const lightKeys = lightRoles.map((t) => t.path.slice("role.light.".length));
if (darkKeys.join() !== lightKeys.join())
  throw new Error(
    "role.dark and role.light must define the same roles in the same order",
  );

const THEME_SCOPES = `:root,\n[data-theme],\n.dark,\n.light`;

function emitTheme(): string {
  const aliases = group("alias").map((t) => t.path.slice("alias.".length));
  // shadcn names win on collision (e.g. \`accent\` is the hover surface, not ember).
  const roleColors = darkKeys
    .filter(
      (k) =>
        typeof resolve(`{role.dark.${k}}`, "dark") === "string" &&
        /^#|^rgb/.test(String(resolve(`{role.dark.${k}}`, "dark"))),
    )
    .filter((k) => k !== "header-bg" && !aliases.includes(k));
  const out = [
    "  /* Daybreak v2 roles: bg-surface, text-fg-2, border-border-strong, text-accent-text, outline-focus … */",
    ...roleColors.map((k) => `  --color-${k}: var(--db-${k});`),
    "  /* Compatibility names (shadcn + v1) */",
    ...aliases.filter((a) => a !== "muted").map((a) => `  --color-${a}: var(--${a});`),
    "  --color-muted: var(--muted-bg);",
    ...group("color.neutral").map(
      (t) => `  --color-neutral-${t.path.split(".").pop()}: ${css(t)};`,
    ),
    "  /* Raw palette for specimens only. Components use roles. */",
    ...group("palette").map(
      (t) => `  --color-db-${t.path.slice(8)}: var(${cssName(t.path)});`,
    ),
    "",
    "  --font-display: var(--db-font-display);",
    "  --font-sans: var(--db-font-body);",
    "  --font-mono: var(--db-font-mono);",
    "  --text-hero: var(--db-text-hero);",
    "  --text-hero--line-height: var(--db-leading-display);",
    "  --text-d1: var(--db-text-d1);",
    "  --text-d1--line-height: var(--db-leading-display);",
    "  --text-d2: var(--db-text-d2);",
    "  --text-d2--line-height: var(--db-leading-display);",
    "  --text-d3: var(--db-text-d3);",
    "  --text-d3--line-height: 0.95;",
    "  --text-d4: var(--db-text-d4);",
    "  --text-d4--line-height: var(--db-leading-tight);",
    "  --text-lead: var(--db-text-lead);",
    "  --text-lead--line-height: 1.5;",
    "  --text-label: var(--db-text-label);",
    "  --text-label--line-height: 1.2;",
    "  --text-micro: var(--db-text-micro);",
    "  --text-micro--line-height: 1.4;",
    "  --tracking-display: var(--db-tracking-display);",
    "  --tracking-label: var(--db-tracking-label);",
    "  --leading-display: var(--db-leading-display);",
    "",
    "  --radius-xs: 2px;",
    `  --radius-sm: ${css(byPath.get("radius.sm")!)};`,
    `  --radius-md: ${css(byPath.get("radius.md")!)};`,
    `  --radius-lg: ${css(byPath.get("radius.lg")!)};`,
    `  --radius-xl: ${css(byPath.get("radius.xl")!)};`,
    "  --radius-2xl: 4px;",
    "  --radius-3xl: 4px;",
    "  --radius-4xl: 4px;",
    "",
    "  /* No shadows of any kind: removes shadow-*, inset-shadow-*, drop-shadow-*, text-shadow-* utilities. */",
    "  --shadow-*: initial;",
    "  --inset-shadow-*: initial;",
    "  --drop-shadow-*: initial;",
    "  --text-shadow-*: initial;",
    "",
    ...group("spacing")
      .filter((t) => t.path !== "spacing.0")
      .map((t) => `  --spacing-${t.path.slice(8)}: ${css(t)};`),
    "  --spacing-section: var(--db-section);",
    "  --container-daybreak: var(--db-container);",
    "",
    ...group("zIndex")
      .filter((t) => t.path !== "zIndex.base")
      .map((t) => `  --z-index-${t.path.slice(7)}: ${css(t)};`),
    "  --ease-daybreak: var(--db-ease);",
    "  --duration-fast: var(--db-dur-fast);",
    "  --duration-base: var(--db-dur);",
    "  --duration-slow: var(--db-dur-slow);",
  ];
  return `@theme inline {\n${out.join("\n")}\n}\n`;
}

function emitTokensCss(): string {
  const aliasTokens = group("alias");
  return `/* Chamuka Daybreak v2 — design tokens (@chamuka/tokens)
   Generated from DTCG JSON in packages/tokens/src/tokens. Do not edit.
   Source of truth: brand/daybreak-v2/SPEC.md and tokens.css.

   Layers
   1. Raw palette   --db-ground, --db-cream, --db-ember …   fixed, never themed
   2. Roles         --db-bg, --db-fg, --db-accent-text …    themed; what components use
   3. Compat        --background, --primary, --ember …      shadcn + v1 names mapped onto roles

   Themes: dark is the default. No attribute follows prefers-color-scheme.
   data-theme="dark|light" (or .dark/.light) on <html> or any element forces it for that subtree.
   Fonts: import "@chamuka/tokens/fonts.css" for Archivo; IBM Plex via @fontsource. */

:root {
  /* ---------- Palette (raw) ---------- */
${lines(group("palette"))}

  /* ---------- Type, space, layout, radius, motion ---------- */
${lines(group("db"))}

  /* ---------- v1 names (static) ---------- */
${lines(legacyStatic)}
}

/* ===================== Roles: DARK (default) ===================== */
:root,
[data-theme="dark"],
.dark {
  color-scheme: dark;
${lines(darkRoles)}
}

/* ===================== Roles: LIGHT "paper" ===================== */
/* Written twice on purpose: system preference (unless dark is forced) and explicit light. Keep identical. */
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]):not(.dark) {
    color-scheme: light;
${lines(lightRoles, "    ")}
  }
}

[data-theme="light"],
.light {
  color-scheme: light;
${lines(lightRoles)}
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --db-dur-fast: 0ms;
    --db-dur: 0ms;
    --db-dur-slow: 0ms;
  }
}

/* ===================== Compatibility aliases ===================== */
/* Re-declared on every theme scope so a nested data-theme re-resolves them. */
${THEME_SCOPES} {
${lines(aliasTokens)}
}

/* Tailwind CSS v4 (ignored by browsers when not processed by Tailwind) */
${emitTheme()}`;
}

function emitThemeCss(): string {
  return `/* Tailwind CSS v4 theme for Daybreak v2 — import after tokens.css. Generated; do not edit.
   \`inline\` so utilities reference the role variables directly and follow nested data-theme scopes. */
${emitTheme()}`;
}

function emitFontsCss(): string {
  return `/* Archivo variable (OFL, @fontsource-variable/archivo 5.3.0) — Daybreak v2 display face.
   Use with font-stretch: 72% and weight 800. IBM Plex Sans / Mono: load via @fontsource. */
@font-face {
  font-family: "Archivo";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  font-stretch: 62% 125%;
  src: url("./fonts/archivo-latin-wdth-normal.woff2") format("woff2-variations");
}
`;
}

const js = (v: unknown) => JSON.stringify(v);
const camel = (s: string) => s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const obj = (entries: [string, unknown][], indent: string) =>
  entries
    .map(([k, v]) => `${indent}${/^[a-z_$][\w$]*$/i.test(k) ? k : js(k)}: ${js(v)},`)
    .join("\n");

function emitTs(): string {
  const strip = (prefix: string) => (t: FlatToken) => t.path.slice(prefix.length + 1);
  const palette = group("palette").map(
    (t) => [camel(strip("palette")(t)), resolve(t.value, "dark")] as [string, unknown],
  );
  const roles = (theme: Theme) =>
    group(`role.${theme}`).map(
      (t) =>
        [camel(strip(`role.${theme}`)(t)), resolve(t.value, theme)] as [string, unknown],
    );
  const semanticKeys = [
    "background",
    "foreground",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "muted-bg",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
    "border",
    "input",
    "ring",
  ];
  const semantic = (theme: Theme) =>
    semanticKeys.map(
      (k) =>
        [camel(k), resolve(byPath.get(`alias.${k}`)!.value, theme)] as [string, unknown],
    );
  const legacyColor = [
    "ember",
    "gold",
    "slate",
    "paper",
    "mist",
    "ink",
    "muted",
    "success",
    "warning",
    "danger",
    "info",
    "play",
    "forest",
    "mineral",
  ].map(
    (k) => [k, resolve(byPath.get(`alias.${k}`)!.value, "light")] as [string, unknown],
  );
  const neutral = group("color.neutral").map(
    (t) => [t.path.split(".").pop()!, t.value] as [string, unknown],
  );
  const simple = (prefix: string) =>
    group(prefix).map((t) => [strip(prefix)(t), t.value] as [string, unknown]);
  const db = group("db").map(
    (t) => [camel(strip("db")(t)), t.value] as [string, unknown],
  );

  return `/* Generated from DTCG JSON. Do not edit. */

/** Daybreak v2 raw palette (fixed). Components should use \`roles\`. */
export const palette = {
${obj(palette, "  ")}
} as const;

/** Daybreak v2 semantic roles per theme. Dark is the default. */
export const roles = {
  dark: {
${obj(roles("dark"), "    ")}
  },
  light: {
${obj(roles("light"), "    ")}
  },
} as const;

/** Daybreak v2 type, space, layout and motion scales (CSS values). */
export const daybreak = {
${obj(db, "  ")}
} as const;

/**
 * @deprecated v1 colour names, resolved to their v2 light ("paper") values.
 * Use \`palette\` and \`roles\` instead.
 */
export const color = {
${obj(legacyColor, "  ")}
  white: "#FFFFFF",
  neutral: {
${obj(neutral, "    ")}
  },
} as const;

/** shadcn-style semantic colours per theme, mapped onto v2 roles. */
export const semantic = {
  light: {
${obj(semantic("light"), "    ")}
    /** @deprecated Product accents are retired in v2. */
    productAccent: {
      drawit: ${js(resolve("{alias.accent-drawit}", "light"))},
      formit: ${js(resolve("{alias.accent-formit}", "light"))},
      play: ${js(resolve("{alias.accent-play}", "light"))},
      forest: ${js(resolve("{alias.accent-forest}", "light"))},
      mineral: ${js(resolve("{alias.accent-mineral}", "light"))},
    },
  },
  dark: {
${obj(semantic("dark"), "    ")}
  },
} as const;

export const fontFamily = {
${obj(simple("font"), "  ")}
} as const;

export const fontWeight = {
${obj(simple("fontWeight"), "  ")}
} as const;

export const fontSize = {
${obj(simple("fontSize"), "  ")}
} as const;

export const lineHeight = {
${obj(simple("lineHeight"), "  ")}
} as const;

export const spacing = {
${obj(simple("spacing"), "  ")}
} as const;

export const radius = {
${obj(simple("radius"), "  ")}
} as const;

/** @deprecated Daybreak v2 has no shadows. Every value is "none". */
export const shadow = {
${obj(simple("shadow"), "  ")}
} as const;

export const motion = {
  duration: {
${obj(simple("motion.duration"), "    ")}
  },
  easing: {
${obj(simple("motion.easing"), "    ")}
  },
} as const;

export const zIndex = {
${obj(simple("zIndex"), "  ")}
} as const;

export const tokens = {
  palette,
  roles,
  daybreak,
  color,
  semantic,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  spacing,
  radius,
  shadow,
  motion,
  zIndex,
} as const;

export type Tokens = typeof tokens;
export type ThemeName = keyof typeof roles;
`;
}

function main() {
  mkdirSync(join(DIST, "fonts"), { recursive: true });
  writeFileSync(join(DIST, "tokens.css"), emitTokensCss());
  writeFileSync(join(DIST, "theme.css"), emitThemeCss());
  writeFileSync(join(DIST, "fonts.css"), emitFontsCss());
  for (const f of ["archivo-latin-wdth-normal.woff2", "archivo-OFL.txt"]) {
    copyFileSync(join(FONT_SRC, f), join(DIST, "fonts", f));
  }
  writeFileSync(GENERATED, emitTs());
  console.log(
    "wrote dist/tokens.css, dist/theme.css, dist/fonts.css, dist/fonts/, src/generated.ts",
  );
}

main();
