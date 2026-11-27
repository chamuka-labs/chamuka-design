# Daybreak v2

Status: approved for web surfaces (chamuka-labs.github.io). `@chamuka/tokens` and `@chamuka/ui` implement v2 (see "Packages" below). Two themes: dark (default) and light "paper".
Supersedes Daybreak v1 (`../daybreak/`) for web surfaces once approved. The mark is unchanged.

## Why v2

v1 was polite. It had cream paper, five equal colours, rounded cards with soft shadows and Sora at modest sizes. Everything had the same volume, so nothing led and the site looked like a template.

v2 keeps the identity and changes the posture. We studied centralhq.com for posture only and took none of its copy, logos or assets. What makes it feel premium:

- **One loud thing per screen.** Huge, condensed, uppercase display type (100–152px, line-height 0.9) does the work that colour and decoration did in v1.
- **A dark, warm ground.** A near-black with a brown cast and cream text, never pure white. It reads as considered rather than "dark mode".
- **One hot accent, used sparingly.** A single saturated red appears on the primary CTA, the numbered section labels and hairline rules. Nothing else is coloured.
- **Mono as the voice of the interface.** Nav, buttons, labels and numbering are set in small, tracked, uppercase mono. That gives an instrument-panel feel.
- **Structure from hairlines, not shadows.** 1px warm-grey borders, near-square corners (2–4px), panels in a barely lighter ground, and a faint grain or hatch texture inside panels.
- **Big vertical rhythm.** 150–200px between sections, a 1100–1200px container, and a two-column "label left, artefact right" section pattern.
- **Real artefacts as imagery.** Product UI and diagrams sit inside framed panels. There are no 3D blobs.
- **Restraint in motion.** Hover changes edges and colour. Nothing bounces, and nothing moves on its own.

v2 applies those principles to Chamuka Labs. It's founder-led, short, specific and slightly dry. The bold type carries the confidence, so the copy never has to.

## Identity anchor

**Ember #E24E1B stays.** On the v2 ground it measures 4.8:1, which passes AA even for small text, so it can do the job Central's red does without becoming a different brand. Moving to a pure red would erase the "sun" in the mark and the work done on the v1 assets. The change is in *how much* ember appears, not *which* ember. In v1 it shared the stage with gold, slate, coral, forest and mineral. In v2 it's the only chrome colour.

## Palette

### Ground and text (95% of every surface)

| Token | Hex | Use | Contrast on ground |
|---|---|---|---|
| `--db-ground` | #12100E | Page | n/a |
| `--db-ground-2` | #1A1714 | Panels, cards | n/a |
| `--db-ground-3` | #211D19 | Raised: inputs, chips, hover | n/a |
| `--db-line` | #34302A | Hairlines | 1.45:1 (decorative) |
| `--db-line-strong` | #4A443B | Panel and input edges | 1.97:1 |
| `--db-line-focus` | #8F8678 | Hovered edges | 5.3:1 |
| `--db-cream` | #F2EAD9 | Primary text, display | 15.9:1 |
| `--db-stone` | #A39A89 | Secondary text | 6.8:1 |
| `--db-dust` | #8F8678 | Meta, captions | 5.3:1 |
| `--db-ash` | #7E7668 | Muted display only (24px+) | 4.2:1 (AA large) |

### Accent (about 5%)

| Token | Hex | Use |
|---|---|---|
| `--db-ember` | #E24E1B | Primary button fill, section numbers, rules |
| `--db-ember-hi` | #F06A3A | Ember text on raised surfaces, hover fill, focus ring |
| `--db-ember-lo` | #B8380F | Ember text on paper (4.9:1). Not a fill: ink on it is 3.3:1. |
| `--db-on-ember` | #12100E | Text on ember (4.8:1). Cream on ember fails (3.3:1). |

### Signal (diagrams and status only)

Gold #E6B422, slate #7FA0D4 (v1 #2B4C7E lifted for dark), mineral #3FB39F, forest #5E9C7E, coral #E8789C. All of them pass 5:1+ on the ground. Use them only inside diagrams, as status dots or to tag a project. Never use them for buttons, links or headings.

### Paper

Paper #F2EAD9 with ink #12100E is for print, OG cards and the occasional inverse band. One per page at most.

## Type

| Role | Face | Setting |
|---|---|---|
| Display | **Archivo** variable (OFL), `font-stretch: 72%`, weight 800 | Uppercase, line-height 0.9, tracking -0.01em |
| Body | IBM Plex Sans 400/500/600 | 16px/1.6; lead 18–21px |
| Interface | IBM Plex Mono 400/500 | 13px uppercase, tracking 0.08em: nav, buttons, labels, numbering |

Sora is retired from web headings: at large sizes its geometric round forms read soft. Archivo's width axis gives a condensed grotesk close in spirit to the American Grotesk Condensed or Söhne pairing on the reference site, as one 90KB file with no licence cost. Plex stays for continuity with the v1 packages.

Display scale (fluid): hero 48→92 (one short headline, two lines max), d1 36→60 (section headings), d2 32→48, d3 24→32, d4 24. Body: hero lead 20→22, lead 18→21, body 16, small 15, label 13, micro 12.

Restraint: the hero headline is a short phrase ("Applied AI lab."), never a full sentence in caps. The full statement goes underneath as a normal-size lead.

## Space and layout

- 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- Section gap: `clamp(96px, 8vw + 48px, 192px)`.
- Container: 1200px, gutter 20–32px, 12 columns. Text measure is 60–68ch max.
- The section pattern is the **ledger**: a 5/7 split. The left column has a mono number and label in ember, a d2 condensed title and a muted condensed facet list. The right column has a framed panel holding the artefact. It stacks on mobile with the label first.

## Radii

0 for full-bleed and rules. 2px for buttons, chips and inputs. 4px for panels and cards. Pills only for 8px status dots. Nothing rounder.

## Elevation: none

**Daybreak v2 has no shadows of any kind.** That rules out `box-shadow`, `drop-shadow()`, `text-shadow`, glows, and SVG `<filter>` shadows, in CSS or in assets. Depth comes from two things only:

1. Fill steps: bg → surface → raised.
2. Uniform 1px hairlines in `--db-border`, `--db-border-strong` or `--db-border-hover`.

Focus uses `outline: 2px solid var(--db-focus)` with a 2px offset. It's an outline, not a shadow.

## Borders: uniform hairlines only

- **Every box, card, panel, image frame and diagram node gets the same 1px border on all four sides.** One colour, one weight.
- **No side or accent borders.** That means no thick left or right bars, no coloured top strips and no `border-left: 4px`. Swift calls this slop.
- **Emphasis.** To highlight one item, change the whole 1px edge to ember. The featured item gets an ember edge. Nothing else changes.
- **Dividers.** Hairline dividers inside a grid (the index strip, the cells grid) are fine, because they are the same 1px line as everywhere else.

## Texture

`--db-grain` is SVG noise at 3.5% alpha on the page. `--db-hatch` is 135° hairlines at 2.5% inside panels. Both are tiny inline data and cost no requests.

## Components

- **Button / primary.** Ember fill, ink text, mono 13px uppercase, 2px radius, 48px tall, 24px horizontal padding. Hover: ember-hi (ink text 6.2:1). Active: ember. (In v2 r1 the active fill was ember-lo, where ink measured 3.3:1. Fixed.) A trailing arrow moves 3px on hover.
- **Button / ghost.** Ground-3 fill, cream text and a strong-line edge. Hover: line-focus edge.
- **Link.** Cream with a 1px underline in line-focus and an ember underline on hover. Inside running text, use an underline offset of 3px.
- **Nav.** Mono 13px uppercase in stone. Hover: cream. The CTA is a small primary button. On mobile, a disclosure menu.
- **Label.** Mono 13px uppercase, a 2-digit number in ember, then the label in ember-hi or stone: `01  EXPERIMENTS`.
- **Panel.** Surface fill, hatch texture, 1px line edge, 4px radius, 24–48px padding. It frames diagrams and artefacts.
- **Card.** A panel with a d4 condensed title, body text in stone and a mono meta row. When linked, the edge goes line-focus on hover, the title goes ember-hi and a ↗ glyph nudges.
- **Badge.** Mono 12px uppercase, a 1px ember edge, ember-hi text, 2px radius. Use it for states such as "Coming soon as open source".
- **Facet list.** d4 condensed uppercase in ash with 1.15 leading. It's a scannable list of what a thing does.
- **Rule.** A 1px line, or a 2px ember rule 48px long above a section label.
- **Footer.** Quiet: the mark, the licence line, contact and elsewhere links on the grid, a 1px ember rule above, even padding. No big display wordmark and no marquee.
- **Code.** Plex Mono at 0.9em on ground-3 with 2px radius.

## Imagery

- **Hero.** One photograph: a warm, low-light still life in ember light. It sits in a 1px hairline frame with a 4px radius, with no shadow, overlay or tint. The same image is used in both themes. On paper it reads as a dark plate, which is intended.
  - Export AVIF, then WebP, then a JPG fallback at 576, 864 and 1152 wide.
  - Set width and height, use `fetchpriority="high"` and don't lazy-load it.
- **Product.** Show the product with real screenshots captured at 2x, never redrawn UI. Capture each theme the product offers. Frame them in a 1px hairline with a mono caption bar.
- **Diagrams.** Generate them from one source for both themes.
  - Lay boxes on an 8px grid and draw 1px strokes on half-pixel coordinates. Connectors are 1.5px, and each arrowhead tip lands exactly on its target edge.
  - Embed the text as a subset of IBM Plex, measured so it never overflows its box. Leave at least 8px inside the box edge.
  - At most one ember-edged node per diagram.
  - Content must come from the project README. No invented features.

## Motion

Use only 120ms, 220ms or 480ms, eased with `cubic-bezier(0.2, 0.7, 0.1, 1)`. Animate colour, edge and a ≤4px translate. Nothing animates on load. `prefers-reduced-motion: reduce` zeroes the durations.

## Light theme ("paper")

The same system on paper. Type, scale, spacing, radii, components and layout are identical. Only the semantic colour roles change, and ember stays the only accent.

### How themes work

`tokens.css` has two layers:

1. **Raw palette.** Fixed values that are never themed (`--db-ground`, `--db-cream`, `--db-ember`, `--db-paper`, `--db-ink` and the rest).
2. **Semantic roles.** These are what components use: `--db-bg`, `--db-surface`, `--db-raised`, `--db-border`, `--db-border-strong`, `--db-border-hover`, `--db-fg`, `--db-fg-2`, `--db-fg-3`, `--db-fg-large`, `--db-accent`, `--db-accent-hover`, `--db-accent-press`, `--db-on-accent`, `--db-accent-text`, `--db-accent-text-hover`, `--db-sig-*`, `--db-header-bg`, `--db-focus`, `--db-grain` and `--db-hatch`.

Selection:

- With no attribute, the theme follows `prefers-color-scheme`.
- `<html data-theme="light|dark">` forces a theme.
- The light block is written twice, once inside the media query and once for `[data-theme="light"]`. Keep the two copies identical.

Components must use semantic roles only, never raw palette values. The exception is literal colour specimens such as swatches.

### Light palette

| Role | Hex | On bg #F2EAD9 | On surface #F8F3E8 | On raised #EAE0CC |
|---|---|---|---|---|
| `--db-bg` (paper) | #F2EAD9 | n/a | n/a | n/a |
| `--db-surface` (panels and cards sit *lighter* than the page) | #F8F3E8 | n/a | n/a | n/a |
| `--db-raised` (ghost buttons, code, hovered cards) | #EAE0CC | n/a | n/a | n/a |
| `--db-border` | #D9CEB8 | 1.30 (decorative) | n/a | n/a |
| `--db-border-strong` | #C4B8A0 | 1.64 (decorative) | n/a | n/a |
| `--db-fg` (ink) | #12100E | 15.86 | 17.16 | 14.49 |
| `--db-fg-2` | #4F483E | 7.53 | 8.15 | 6.88 |
| `--db-fg-3` (also the hover edge) | #5C5449 | 6.22 | 6.73 | 5.69 |
| `--db-fg-large` (24px+ only) | #7A7163 | 4.02 | 4.34 | 3.67 (AA large) |
| `--db-accent-text` (ember as small text) | #A8340E | 5.55 | 6.00 | 5.07 |
| `--db-accent-text-hover` | #9C2F0C | 6.21 | 6.72 | 5.67 |
| `--db-accent` (fills, rules) | #E24E1B | 3.29: non-text and 24px+ only | n/a | n/a |

### Ember on light

- **Fills stay true #E24E1B.** Button text on ember is ink #12100E at **4.83:1**, and on the hover fill #F06A3A it's **6.17:1**. These are the same pairs as dark. Cream on ember (3.29) and white on ember (3.93) both fail, so they're never used.
- **Small ember text darkens.** True ember on paper is only 3.29:1, so small ember text uses `--db-accent-text` #A8340E, a darker ember at 5.55:1. True ember stays for fills, 2px rules, the 8px dot, and badge borders.
- **Pressed state.** In v2 dark, the pressed fill was #B8380F, where ink measured 3.26:1. That was a fail, and it's now fixed in both themes: `--db-accent-press` is #E24E1B.
- **Focus.** On light it's a 2px #A8340E outline with a 2px offset (5.6:1 against paper). On dark it's #F06A3A.

### Signal on light

The v1 originals return because they were designed for paper: slate #2B4C7E (7.2), forest #2F6B4F (5.3), mineral #1F7A6B (4.3), coral #B83A66 (4.6) and gold #A07800 (3.4). As before, they're for dots and diagrams only.

### Texture and depth on light

- Grain becomes black noise at 4.5% alpha, and the hatch becomes ink at 3.5%.
- Panels lift with a lighter fill instead of a darker one.

### Assets per theme

- **Dark:** `assets/v2/*.svg`. The diagrams are recoloured for the dark ground, the slate line in the lockup and mark is lifted to #7FA0D4, and the wordmark is cream.
- **Light:** `assets/v2/light/*.svg`. These are the v1 paper diagrams with a transparent backdrop, #FFFFFF boxes moved to #FCF9F2 and ink #12100E, plus the original lockup and mark.
- **Swapping:** each image appears twice, as `.only-dark` and `.only-light`, and CSS shows one. Below-the-fold images are `loading="lazy"`, so the hidden copy isn't fetched.
- **Logo:** the gold bar in the mark is about 1.6:1 on paper. That's acceptable for a logo, as it was in v1.

### Toggle (site pattern)

- It's a mono button in the nav labelled "Theme: System", "Theme: Light" or "Theme: Dark". Each press cycles system → light → dark, and the choice is stored as `localStorage['db-theme']`.
- An inline script in `<head>` sets `data-theme` before first paint, so the wrong theme never flashes.
- The button ships `hidden` and the script reveals it, so with JS off there's no dead control and the page follows the system.
- There are two `theme-color` metas with `media` attributes, which the script overrides when a theme is forced. `<meta name="color-scheme" content="dark light">` is set as well.

## Accessibility

- AA contrast for every text token, as tabulated above. `--db-ash` is for 24px+ only.
- Focus is visible on everything: a 2px outline in `--db-focus` with a 2px offset.
- Use a skip link, real headings and landmarks.
- The interface needs no JavaScript. The only script remembers a manual theme choice, and with JS off the page follows the system theme.

## Do

- Let one headline dominate each screen.
- Use ember only for the primary CTA, section numbers and rules.
- Frame real diagrams and artefacts in panels.
- Write short, specific, slightly dry copy. Name the boundary.
- Keep corners near square and edges hairline.

## Don't

- Don't use gradients, glows, glassmorphism or 3D blobs.
- Don't use a second accent in chrome. Gold, slate and the rest stay inside diagrams.
- Don't use pure white #FFF or pure black #000.
- Don't set cream text on ember. Use ink.
- Don't use rounded-xl cards.
- Don't use shadows of any kind (box, drop, text, SVG filter). Don't use side or accent borders, such as thick left bars or coloured top strips. Borders are uniform 1px hairlines.
- Don't show hype, metrics, logos walls, testimonials or invented clients. The reference site uses social proof; we don't have it and won't fake it.
- Don't copy the reference's copy, illustrations, logos or layout pixel for pixel.

## Files

- `tokens.css`: all tokens as CSS custom properties (`--db-*`), plus the Archivo `@font-face`.
- `fonts/archivo-latin-wdth-normal.woff2` and `fonts/archivo-OFL.txt`: from @fontsource-variable/archivo 5.3.0.
- Plex woff2 files are shipped by the site already (`fonts/files/`).

## Packages

`@chamuka/tokens` ships these tokens as `--db-*` (raw palette and roles, generated from DTCG JSON and tested for parity with this folder's `tokens.css`). shadcn names (`--background`, `--primary`, `--ring` …) and v1 names (`--ember`, `--paper`, `--muted` …) are kept as deprecated aliases mapped onto the roles, so v1 consumers keep working. `@chamuka/ui` components use the roles: hairline edges, 2px/4px radii, mono uppercase controls, focus outlines and no shadows.
