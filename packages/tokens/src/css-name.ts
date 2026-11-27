/**
 * Token path -> CSS custom property name. Shared by the build and the agent-artifact generator.
 *
 * - palette.*, db.*, role.<theme>.* and role.* refs  -> --db-*   (Daybreak v2, canonical)
 * - alias.*                                          -> --*      (shadcn + v1 compatibility names)
 * - everything else keeps its v1 name (--font-*, --spacing-*, --radius-*, --shadow-*, ...)
 */
export function cssName(path: string): string {
  const map: Record<string, string> = {
    "radius.default": "--radius",
    "font.display": "--font-display",
    "font.sans": "--font-sans",
    "font.mono": "--font-mono",
  };
  if (map[path]) return map[path];
  const seg = path.split(".");
  if (seg[0] === "palette" || seg[0] === "db") return `--db-${seg.slice(1).join("-")}`;
  if (seg[0] === "role") {
    const rest = seg[1] === "dark" || seg[1] === "light" ? seg.slice(2) : seg.slice(1);
    return `--db-${rest.join("-")}`;
  }
  if (seg[0] === "alias") return `--${seg.slice(1).join("-")}`;
  if (path.startsWith("color.neutral."))
    return `--neutral-${path.slice("color.neutral.".length)}`;
  if (path.startsWith("color.")) return `--${path.slice("color.".length)}`;
  if (path.startsWith("fontSize."))
    return `--font-size-${path.slice("fontSize.".length)}`;
  if (path.startsWith("lineHeight."))
    return `--line-height-${path.slice("lineHeight.".length)}`;
  if (path.startsWith("fontWeight."))
    return `--font-weight-${path.slice("fontWeight.".length)}`;
  if (path.startsWith("spacing.")) return `--spacing-${path.slice("spacing.".length)}`;
  if (path.startsWith("radius.")) return `--radius-${path.slice("radius.".length)}`;
  if (path.startsWith("shadow.")) return `--shadow-${path.slice("shadow.".length)}`;
  if (path.startsWith("motion.duration."))
    return `--duration-${path.slice("motion.duration.".length)}`;
  if (path.startsWith("motion.easing."))
    return `--easing-${path.slice("motion.easing.".length)}`;
  if (path.startsWith("zIndex.")) return `--z-${path.slice("zIndex.".length)}`;
  return `--${path.replaceAll(".", "-")}`;
}
