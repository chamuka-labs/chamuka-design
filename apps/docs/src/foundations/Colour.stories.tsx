import type { Meta, StoryObj } from "@storybook/react";
import { palette, roles } from "@chamuka/tokens";

const meta: Meta = {
  title: "Foundations/Colour",
};
export default meta;

function Swatch({
  name,
  value,
  cssVar,
}: {
  name: string;
  value: string;
  cssVar?: string;
}) {
  return (
    <div className="sb-swatch">
      <div
        className="sb-swatch-chip"
        style={{ background: cssVar ? `var(${cssVar})` : value }}
      />
      <div className="sb-swatch-meta">
        <strong>{name}</strong>
        <div>{value}</div>
      </div>
    </div>
  );
}

const kebab = (s: string) => s.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
const isColour = (v: string) => v.startsWith("#");

/** The live roles for the theme selected in the toolbar. Components only use these. */
export const Roles: StoryObj = {
  render: () => (
    <div className="grid gap-4">
      <p className="sb-label">Live roles · switch Theme in the toolbar</p>
      <div className="sb-swatch-grid">
        {Object.entries(roles.dark)
          .filter(([, v]) => isColour(v))
          .map(([name]) => (
            <Swatch
              key={name}
              name={`--db-${kebab(name)}`}
              value={`${roles.dark[name as keyof typeof roles.dark]} / ${roles.light[name as keyof typeof roles.light]}`}
              cssVar={`--db-${kebab(name)}`}
            />
          ))}
      </div>
    </div>
  ),
};

/** Ember is the only accent. Signal colours are for diagrams and status dots only. */
export const Accent: StoryObj = {
  render: () => (
    <div className="sb-swatch-grid">
      {(
        ["ember", "emberHi", "emberLo", "onEmber", "emberInk", "emberInkHi"] as const
      ).map((name) => (
        <Swatch key={name} name={`--db-${kebab(name)}`} value={palette[name]} />
      ))}
    </div>
  ),
};

export const Palette: StoryObj = {
  render: () => (
    <div className="sb-swatch-grid">
      {Object.entries(palette).map(([name, hex]) => (
        <Swatch key={name} name={`--db-${kebab(name)}`} value={hex} />
      ))}
    </div>
  ),
};
