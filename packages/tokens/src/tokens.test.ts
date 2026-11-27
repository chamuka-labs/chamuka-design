import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { roles } from "./generated";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const generated = readFileSync(join(ROOT, "dist/tokens.css"), "utf8");
const theme = readFileSync(join(ROOT, "dist/theme.css"), "utf8");
const brand = readFileSync(join(ROOT, "../../brand/daybreak-v2/tokens.css"), "utf8");

function props(block: string): Map<string, string> {
  const map = new Map<string, string>();
  const clean = block.replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean)))
    map.set(m[1]!.toLowerCase(), m[2]!.trim().replace(/\s+/g, " ").replace(/"/g, "'"));
  return map;
}

function block(css: string, header: string): string {
  const start = css.indexOf(header);
  if (start < 0) throw new Error(`Block not found: ${header}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth += 1;
    if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error("Unclosed block");
}

describe("Daybreak v2 parity with brand/daybreak-v2/tokens.css", () => {
  const cases: [string, string, string][] = [
    ["raw palette and scales", "\n:root {", "\n:root {"],
    [
      "dark roles",
      ':root,\n:root[data-theme="dark"] {',
      ':root,\n[data-theme="dark"],\n.dark {',
    ],
    [
      "light roles (system)",
      ':root:not([data-theme="dark"]) {',
      ':root:not([data-theme="dark"]):not(.dark) {',
    ],
    [
      "light roles (forced)",
      ':root[data-theme="light"] {',
      '[data-theme="light"],\n.light {',
    ],
  ];
  for (const [name, brandHeader, generatedHeader] of cases) {
    it(`matches ${name}`, () => {
      const want = props(block(brand, brandHeader));
      const got = props(block(generated, generatedHeader));
      expect(want.size).toBeGreaterThan(20);
      for (const [prop, value] of want) expect(got.get(prop), prop).toBe(value);
    });
  }
});

describe("v1 compatibility", () => {
  const v1 = [
    "accent",
    "accent-drawit",
    "accent-foreground",
    "accent-forest",
    "accent-formit",
    "accent-mineral",
    "accent-play",
    "background",
    "border",
    "card",
    "card-foreground",
    "danger",
    "destructive",
    "destructive-foreground",
    "ember",
    "font-display",
    "font-mono",
    "font-sans",
    "foreground",
    "forest",
    "gold",
    "info",
    "ink",
    "input",
    "mineral",
    "mist",
    "muted",
    "muted-bg",
    "muted-foreground",
    "neutral-50",
    "neutral-500",
    "neutral-950",
    "paper",
    "play",
    "popover",
    "popover-foreground",
    "primary",
    "primary-foreground",
    "radius",
    "radius-lg",
    "radius-md",
    "radius-sm",
    "radius-xl",
    "ring",
    "secondary",
    "secondary-foreground",
    "shadow-lg",
    "shadow-md",
    "shadow-sm",
    "slate",
    "success",
    "warning",
  ];
  const all = props(generated);
  it.each(v1)("still declares --%s", (name) => {
    expect(all.has(`--${name}`)).toBe(true);
  });
  it("keeps every Tailwind colour name from v1", () => {
    const t = props(block(theme, "@theme inline {"));
    for (const name of [
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
      "primary",
      "background",
      "border",
      "ring",
    ]) {
      expect(t.has(`--color-${name}`), name).toBe(true);
    }
  });
});

describe("no shadows, no rounded-xl", () => {
  it("has no box-shadow values", () => {
    expect(generated.replace(/\/\*[\s\S]*?\*\//g, "")).not.toMatch(/box-shadow/);
    for (const [name, value] of props(generated))
      if (name.startsWith("--shadow")) expect(value).toBe("none");
  });
  it("removes Tailwind shadow utilities", () => {
    expect(theme).toContain("--shadow-*: initial;");
    expect(theme).toContain("--drop-shadow-*: initial;");
  });
  it("caps radii at 4px", () => {
    for (const [name, value] of props(block(theme, "@theme inline {"))) {
      if (name.startsWith("--radius"))
        expect(Number.parseFloat(value)).toBeLessThanOrEqual(4);
    }
  });
});

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

describe("contrast (WCAG AA)", () => {
  for (const name of ["dark", "light"] as const) {
    const r = roles[name];
    it(`${name}: text roles pass 4.5:1 on bg, surface and raised`, () => {
      for (const ground of [r.bg, r.surface, r.raised]) {
        for (const fg of [r.fg, r.fg2, r.fg3, r.accentTextHover])
          expect(contrast(fg, ground)).toBeGreaterThanOrEqual(4.5);
      }
      // Small ember text: accent-text on bg/surface; on raised use accent-text-hover (spec).
      for (const ground of [r.bg, r.surface])
        expect(contrast(r.accentText, ground)).toBeGreaterThanOrEqual(4.5);
    });
    it(`${name}: ink on ember fills passes 4.5:1 (rest, hover, press)`, () => {
      for (const fill of [r.accent, r.accentHover, r.accentPress])
        expect(contrast(r.onAccent, fill)).toBeGreaterThanOrEqual(4.5);
    });
    it(`${name}: focus outline passes 3:1 on bg`, () => {
      expect(contrast(r.focus, r.bg)).toBeGreaterThanOrEqual(3);
    });
  }
  it("focus is #F06A3A on dark and #A8340E on light", () => {
    expect(roles.dark.focus).toBe("#F06A3A");
    expect(roles.light.focus).toBe("#A8340E");
  });
});
