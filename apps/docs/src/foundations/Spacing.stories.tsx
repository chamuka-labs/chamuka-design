import type { Meta, StoryObj } from "@storybook/react";
import { spacing } from "@chamuka/tokens";

const meta: Meta = { title: "Foundations/Spacing" };
export default meta;

export const Scale: StoryObj = {
  render: () => (
    <div>
      {Object.entries(spacing).map(([step, value]) => (
        <div key={step} className="sb-space-row">
          <span style={{ width: 48 }}>{step}</span>
          <span style={{ width: 64 }}>{value}</span>
          <div
            style={{
              height: 12,
              width: value,
              background: "var(--db-accent)",
              borderRadius: 2,
            }}
          />
        </div>
      ))}
    </div>
  ),
};
