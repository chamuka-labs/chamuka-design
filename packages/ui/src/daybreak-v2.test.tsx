import { render } from "@testing-library/react";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { ThemeProvider } from "./theme-provider";

const SRC = dirname(fileURLToPath(import.meta.url));
const sources = [
  ...readdirSync(SRC).filter((f) => f.endsWith(".tsx") && !f.includes(".test.")),
  ...readdirSync(join(SRC, "lib")).map((f) => `lib/${f}`),
].map((f) => [f, readFileSync(join(SRC, f), "utf8")] as const);

describe("Daybreak v2 rules in component source", () => {
  it.each(sources)("%s has no shadows", (_file, source) => {
    expect(source).not.toMatch(/\b(?:drop-|inset-|text-)?shadow(?:-[a-z0-9]+)?\b/);
  });
  it.each(sources)("%s has no side or accent borders", (_file, source) => {
    expect(source).not.toMatch(/\bborder-[lrse]-(?:[2-9]|\[)/);
    expect(source).not.toMatch(/\bborder-[tb]-[2-9]\b/);
  });
  it.each(sources)(
    "%s uses no ring-based focus and nothing rounder than 4px",
    (_file, source) => {
      expect(source).not.toMatch(/\bring-offset|focus-visible:ring/);
      expect(source).not.toMatch(/\brounded-(?:xl|2xl|3xl)\b/);
    },
  );
});

describe("ThemeProvider", () => {
  it("forces a theme with data-theme", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="light">
        <Button>Go</Button>
      </ThemeProvider>,
    );
    expect(container.firstElementChild?.getAttribute("data-theme")).toBe("light");
  });
  it("defaults to system, which resolves to dark without a light preference", () => {
    const { container } = render(
      <ThemeProvider>
        <span />
      </ThemeProvider>,
    );
    expect(container.firstElementChild?.getAttribute("data-theme")).toBe("dark");
  });
});

describe("Button", () => {
  it("uses the mono uppercase interface voice with an outline focus", () => {
    const { getByRole } = render(<Button>Save</Button>);
    const cls = getByRole("button").className;
    expect(cls).toContain("font-mono");
    expect(cls).toContain("uppercase");
    expect(cls).toContain("focus-visible:outline-ring");
    expect(cls).toContain("text-primary-foreground");
  });
});
