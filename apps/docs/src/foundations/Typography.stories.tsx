import type { Meta, StoryObj } from "@storybook/react";
import { daybreak } from "@chamuka/tokens";

const meta: Meta = { title: "Foundations/Typography" };
export default meta;

const display = ["hero", "d1", "d2", "d3", "d4"] as const;
const body = ["lead", "body", "small"] as const;

export const Scale: StoryObj = {
  render: () => (
    <div>
      {display.map((step) => (
        <div key={step} className="sb-type-row">
          <p className="sb-label">
            {step} · Archivo 800 · 72% ·{" "}
            {daybreak[`text${step[0]!.toUpperCase()}${step.slice(1)}` as "textHero"]}
          </p>
          <p
            style={{
              fontFamily: "var(--db-font-display)",
              fontStretch: "var(--db-display-stretch)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "var(--db-tracking-display)",
              lineHeight: step === "d4" ? 1.15 : 0.9,
              fontSize: `var(--db-text-${step})`,
              margin: "4px 0 0",
            }}
          >
            Applied AI lab.
          </p>
        </div>
      ))}
      {body.map((step) => (
        <div key={step} className="sb-type-row">
          <p className="sb-label">{step} · IBM Plex Sans</p>
          <p
            style={{
              fontSize: `var(--db-text-${step})`,
              lineHeight: 1.6,
              margin: "4px 0 0",
              maxWidth: "64ch",
            }}
          >
            We ship products, put research to work, and build tools for agents.
          </p>
        </div>
      ))}
      <div className="sb-type-row">
        <p className="sb-label">label · IBM Plex Mono 13 · uppercase · 0.08em</p>
        <p className="sb-label" style={{ color: "var(--db-fg)" }}>
          <span style={{ color: "var(--db-accent-text)" }}>01</span>
          &nbsp;&nbsp;Experiments
        </p>
      </div>
    </div>
  ),
};
