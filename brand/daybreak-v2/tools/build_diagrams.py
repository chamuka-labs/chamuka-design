"""Build Daybreak v2 diagrams for chamuka-labs.github.io in dark and light.

Rules (SPEC.md > Diagrams): 8px grid, 1px hairline boxes on half-pixel coordinates,
1.5px connectors whose arrowheads end exactly on the target edge, no shadows or filters,
no side/accent bars, text measured with the real IBM Plex metrics and embedded as a subset
so it renders identically everywhere. Fails loudly if any text overflows its box.

Run (needs fonttools and brotli):
    python brand/daybreak-v2/tools/build_diagrams.py /path/to/chamuka-labs.github.io
Writes assets/v2/*.svg (dark) and assets/v2/light/*.svg (light) into that site checkout,
reading IBM Plex woff2 files from its fonts/files/.
"""
import base64, io, os, sys
from fontTools.ttLib import TTFont
from fontTools import subset

if len(sys.argv) < 2:
    sys.exit('usage: build_diagrams.py SITE_DIR')
ROOT = os.path.abspath(sys.argv[1])
FONTS = {
    ('sans', 400): 'ibm-plex-sans-latin-400-normal.woff2',
    ('sans', 600): 'ibm-plex-sans-latin-600-normal.woff2',
    ('mono', 400): 'ibm-plex-mono-latin-400-normal.woff2',
}
FAMILY = {'sans': 'DB Plex Sans', 'mono': 'DB Plex Mono'}
_tt = {k: TTFont(os.path.join(ROOT, 'fonts/files', v)) for k, v in FONTS.items()}

def text_width(s, size, face='sans', weight=400, tracking=0.0):
    f = _tt[(face, weight)]
    cmap = f.getBestCmap(); hmtx = f['hmtx']; upm = f['head'].unitsPerEm
    w = sum(hmtx[cmap.get(ord(c), cmap.get(ord('?')))][0] for c in s)
    return w * size / upm + tracking * size * max(len(s) - 1, 0)

THEMES = {
    'dark': dict(box='#211D19', box2='#1A1714', edge='#4A443B', group='#34302A', fg='#F2EAD9', fg2='#A39A89',
                 fg3='#8F8678', line='#8F8678', accent='#E24E1B', accent_text='#F06A3A', ok='#3FB39F', bar='#4A443B'),
    'light': dict(box='#FCF9F2', box2='#F8F3E8', edge='#C4B8A0', group='#D9CEB8', fg='#12100E', fg2='#4F483E',
                  fg3='#5C5449', line='#5C5449', accent='#E24E1B', accent_text='#A8340E', ok='#1F7A6B', bar='#D9CEB8'),
}

class D:
    def __init__(self, name, w, h, title, desc):
        self.name, self.w, self.h, self.title, self.desc = name, w, h, title, desc
        self.ops = []; self.chars = {k: set() for k in FONTS}; self.k = 1.0
    # -- primitives (theme resolved at render) --
    def box(self, x, y, w, h, fill='box', stroke='edge', rx=4, dash=None):
        assert x % 8 == 0 and y % 8 == 0 and w % 8 == 0 and h % 8 == 0, (self.name, 'off-grid box', x, y, w, h)
        self.ops.append(('rect', x + .5, y + .5, w - 1, h - 1, fill, stroke, rx, dash)); return (x, y, w, h)
    def bar(self, x, y, w, h=4, fill='bar'):
        self.ops.append(('rect', x, y, w, h, fill, None, 2, None))
    def text(self, x, y, s, size=13, face='sans', weight=400, color='fg', anchor='start', within=None, tracking=0.0, upper=False):
        if upper: s = s.upper()
        size = round(size * self.k, 2)
        tw = text_width(s, size, face, weight, tracking)
        if within is not None:
            bx, bw = within
            left = x if anchor == 'start' else (x - tw / 2 if anchor == 'middle' else x - tw)
            if left < bx + 8 - 0.01 or left + tw > bx + bw - 8 + 0.01:
                sys.exit(f'OVERFLOW in {self.name}: "{s}" width {tw:.1f} in box x={bx} w={bw}')
        self.chars[(face, weight)].update(s)
        self.ops.append(('text', x, y, s, size, face, weight, color, anchor, tracking)); return tw
    def arrow(self, pts, color='line', head=True):
        """Orthogonal connector. Last point is the exact target edge; head tip lands there."""
        self.ops.append(('arrow', pts, color, head))
    def line(self, pts, color='group', dash=None):
        self.ops.append(('line', pts, color, dash))
    def dot(self, cx, cy, r, color):
        self.ops.append(('dot', cx, cy, r, color))

    def render(self, theme):
        t = THEMES[theme]; col = lambda k: t.get(k, k) if k else 'none'
        out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" height="{self.h}" fill="none" role="img" aria-labelledby="t d">',
               f'<title id="t">{self.title}</title><desc id="d">{self.desc}</desc>', '<style>']
        for (face, weight), chars in self.chars.items():
            if not chars: continue
            out.append(f"@font-face{{font-family:'{FAMILY[face]}';font-weight:{weight};src:url(data:font/woff2;base64,{subset_font(face, weight, chars)}) format('woff2')}}")
        out.append('text{font-kerning:normal}</style>')
        dy = 0
        for op in self.ops:
            k = op[0]
            if k == 'shift':
                dy += op[1]; out.append(f'<g transform="translate(0 {op[1]})">'); continue
            if k == 'rect':
                _, x, y, w, h, fill, stroke, rx, dash = op
                s = f' stroke="{col(stroke)}" stroke-width="1"' if stroke else ''
                if dash: s += f' stroke-dasharray="{dash}"'
                out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{col(fill)}"{s}/>')
            elif k == 'text':
                _, x, y, s, size, face, weight, color, anchor, tr = op
                ls = f' letter-spacing="{tr*size:.2f}"' if tr else ''
                esc = s.replace('&', '&amp;').replace('<', '&lt;')
                out.append(f'<text x="{x}" y="{y}" font-family="{FAMILY[face]}, {"IBM Plex Mono, monospace" if face=="mono" else "IBM Plex Sans, Helvetica, Arial, sans-serif"}" font-size="{size}" font-weight="{weight}" fill="{col(color)}" text-anchor="{anchor}"{ls}>{esc}</text>')
            elif k == 'arrow':
                _, pts, color, head = op
                (x1, y1), (x2, y2) = pts[-2], pts[-1]
                L = 7; W = 4
                dx, dy = (x2 > x1) - (x2 < x1), (y2 > y1) - (y2 < y1)
                body = list(pts[:-1]) + [(x2 - dx * L, y2 - dy * L)] if head else pts
                d = 'M' + ' L'.join(f'{px} {py}' for px, py in body)
                out.append(f'<path d="{d}" stroke="{col(color)}" stroke-width="1.5" stroke-linejoin="round"/>')
                if head:
                    bx, by = x2 - dx * L, y2 - dy * L
                    p1 = (bx - dy * W, by + dx * W); p2 = (bx + dy * W, by - dx * W)
                    out.append(f'<path d="M{x2} {y2} L{p1[0]} {p1[1]} L{p2[0]} {p2[1]} Z" fill="{col(color)}"/>')
            elif k == 'line':
                _, pts, color, dash = op
                d = 'M' + ' L'.join(f'{px} {py}' for px, py in pts)
                da = f' stroke-dasharray="{dash}"' if dash else ''
                out.append(f'<path d="{d}" stroke="{col(color)}" stroke-width="1"{da}/>')
            elif k == 'dot':
                _, cx, cy, r, color = op
                out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{col(color)}"/>')
        out.extend(['</g>'] * sum(1 for o in self.ops if o[0] == 'shift'))
        out.append('</svg>')
        return '\n'.join(out)

_sub_cache = {}
def subset_font(face, weight, chars):
    key = (face, weight, ''.join(sorted(chars)))
    if key in _sub_cache: return _sub_cache[key]
    f = TTFont(os.path.join(ROOT, 'fonts/files', FONTS[(face, weight)]))
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern', 'liga']; opts.name_IDs = []; opts.notdef_outline = True
    s = subset.Subsetter(opts); s.populate(text=''.join(chars)); s.subset(f)
    buf = io.BytesIO(); f.flavor = 'woff2'; f.save(buf)
    _sub_cache[key] = base64.b64encode(buf.getvalue()).decode(); return _sub_cache[key]

# ---------------------------------------------------------------- helpers
def node(d, x, y, w, h, title, sub=None, title_face='sans', accent=False, sub2=None, center=True):
    d.box(x, y, w, h, stroke='accent' if accent else 'edge')
    cx = x + w / 2 if center else x + 16
    anchor = 'middle' if center else 'start'
    lines = [l for l in (sub, sub2) if l]
    total = 18 + 18 * len(lines)
    ty = y + (h - total) / 2 + 14
    d.text(cx, ty, title, 14, title_face, 600 if title_face == 'sans' else 400, 'accent_text' if accent else 'fg', anchor, (x, w))
    for i, l in enumerate(lines):
        d.text(cx, ty + 18 * (i + 1), l, 12, 'sans', 400, 'fg2', anchor, (x, w))

def group(d, x, y, w, h, label):
    d.box(x, y, w, h, fill='box2', stroke='group')
    d.text(x + 16, y + 24, label, 10, 'mono', 400, 'fg3', 'start', (x, w), tracking=0.08, upper=True)

# ---------------------------------------------------------------- diagrams
def formit():
    d = D('formit', 520, 160, 'FormIt', 'A multi-page form with text, single-choice and multiple-choice questions. Forms move from draft to published to archived and are shared by a public link.')
    # page 1
    d.box(16, 24, 144, 112)
    d.text(32, 48, 'Page 1', 14, 'sans', 600, 'fg', 'start', (16, 144))
    rows = [('Text', 'text'), ('Single choice', 'radio'), ('Multiple choice', 'check')]
    for i, (lab, kind) in enumerate(rows):
        yy = 72 + i * 20
        if kind == 'text': d.box(32, yy - 8, 16, 8, fill='box2', rx=2)
        elif kind == 'radio': d.ops.append(('rect', 36.5, yy - 7.5, 7, 7, 'box2', 'fg3', 3.5, None))
        else: d.ops.append(('rect', 36.5, yy - 7.5, 7, 7, 'box2', 'fg3', 1, None))
        d.text(56, yy, lab, 12, 'sans', 400, 'fg2', 'start', (16, 144))
    d.arrow([(160, 80), (192, 80)])
    d.box(192, 24, 136, 112)
    d.text(208, 48, 'Page 2', 14, 'sans', 600, 'fg', 'start', (192, 136))
    for i in range(3):
        d.bar(208, 64 + i * 20, [88, 72, 96][i])
    d.arrow([(328, 80), (360, 80)])
    d.box(360, 24, 144, 112, stroke='accent')
    d.text(376, 48, 'Public link', 14, 'sans', 600, 'accent_text', 'start', (360, 144))
    for i, s in enumerate(['Draft', 'Published', 'Archived']):
        yy = 76 + i * 20
        d.dot(380, yy - 4, 3, 'accent' if i == 1 else 'fg3')
        d.text(392, yy, s, 12, 'sans', 400, 'fg2', 'start', (360, 144))
    return d

def waypoint():
    d = D('waypoint', 520, 160, 'Waypoint', 'A local profile feeds sourced research; roles come out labelled direct, adjacent or stretch, with the evidence kept. Data stays on the machine.')
    node(d, 16, 40, 128, 80, 'Profile', 'Local CV')
    d.arrow([(144, 80), (184, 80)])
    node(d, 184, 40, 136, 80, 'Research', 'Sourced roles')
    d.arrow([(320, 80), (360, 80)])
    d.box(360, 24, 144, 112, stroke='accent')
    for i, s in enumerate(['Direct', 'Adjacent', 'Stretch']):
        yy = 50 + i * 22
        d.dot(380, yy - 4.5, 3, 'accent' if i == 0 else 'fg3')
        d.text(392, yy, s, 13, 'sans', 600 if i == 0 else 400, 'fg', 'start', (360, 144))
    d.line([(376, 104.5), (488, 104.5)])
    d.text(376, 124, 'Evidence kept', 12, 'sans', 400, 'fg2', 'start', (360, 144))
    return d

def agent_run():
    d = D('agent-run', 520, 160, 'Agent Run', 'claude-run subcommands: retry with backoff, a verify-fix loop and a spec review, composed by a YAML pipeline.')
    group(d, 16, 16, 488, 128, 'pipeline · YAML')
    xs = [32, 192, 352]
    for x, (t, s) in zip(xs, [('retry', 'Rate-limit backoff'), ('verify', 'Fix loop'), ('review', 'Spec score')]):
        node(d, x, 56, 136, 72, t, s, title_face='mono')
    d.arrow([(168, 92), (192, 92)]); d.arrow([(328, 92), (352, 92)])
    return d

def skills():
    d = D('skills', 520, 160, 'Skills', 'A Claude Code plugin of SKILL.md files that follow the Agent Skills specification.')
    group(d, 16, 16, 488, 128, 'chamuka-skills · Claude Code plugin')
    for x, (a, b) in zip([32, 192, 352], [('Frontmatter', 'Instructions'), ('Patterns', 'References'), ('Agent Skills', 'specification')]):
        last = x == 352
        node(d, x, 56, 136, 72, 'SKILL.md', a, title_face='mono', sub2=b) if not last else node(d, x, 56, 136, 72, 'Agent Skills', 'Every SKILL.md', sub2='follows the spec', accent=True)
    return d

def plane():
    d = D('plane', 520, 216, 'Plane', 'Hard fork of jamsocket/plane: controller, drone and proxy, plus an in-sandbox daemon, an egress proxy and OCI images with tiered isolation.')
    node(d, 16, 16, 136, 48, 'controller')
    node(d, 192, 16, 136, 48, 'drone', accent=True)
    node(d, 368, 16, 136, 48, 'proxy')
    d.arrow([(152, 40), (192, 40)]); d.arrow([(368, 40), (328, 40)])
    d.arrow([(260, 64), (260, 96)])
    group(d, 16, 96, 488, 104, 'sandbox · tiered isolation')
    for x, t in zip([32, 192, 352], ['OCI image', 'agentd', 'egress proxy']):
        node(d, x, 136, 136, 48, t)
    return d

def vmette():
    d = D('vmette-architecture', 840, 448, 'Vmette architecture', 'An agent host talks to Vmette over MCP. Untrusted work runs in a hardware-isolated Linux microVM on the macOS host, with its own kernel. Only named directories are shared; network stays off until requested.')
    d.k = 1.15
    d.box(40, 16, 760, 80)
    d.text(64, 44, 'Agent host', 14, 'sans', 600, 'fg', 'start', (40, 760))
    d.text(64, 66, 'Claude Code, Cursor, and other MCP clients.', 12, 'sans', 400, 'fg2', 'start', (40, 760))
    d.text(64, 84, 'Native host tools still run on the Mac unless you restrict them.', 12, 'sans', 400, 'fg2', 'start', (40, 760))
    d.arrow([(420, 96), (420, 152)])
    d.text(432, 129, 'MCP · execute · workspace · desktop', 11, 'mono', 400, 'fg3', 'start')
    d.ops.append(('shift', 16))
    group(d, 40, 136, 760, 272, 'macOS host · Apple Virtualization.framework')
    d.box(64, 176, 432, 208, stroke='accent')
    d.text(88, 204, 'Linux microVM', 14, 'sans', 600, 'accent_text', 'start', (64, 432))
    d.text(88, 224, 'Own kernel. Hardware isolation, not a container.', 12, 'sans', 400, 'fg2', 'start', (64, 432))
    node(d, 88, 256, 384, 96, 'Untrusted agent work', 'Boots in about a second. Disappears when done.', center=False)
    node(d, 560, 176, 216, 80, 'virtio-fs shares', 'Only directories you name.', center=False)
    d.box(560, 280, 216, 104)
    d.text(576, 308, 'Network', 14, 'sans', 600, 'fg', 'start', (560, 216))
    d.text(576, 328, 'Default deny.', 12, 'sans', 400, 'fg2', 'start', (560, 216))
    d.text(576, 356, '--net to opt in', 11, 'mono', 400, 'accent_text', 'start', (560, 216))
    d.line([(496, 216.5), (560, 216.5)], color='edge', dash='3 3')
    d.line([(496, 332.5), (560, 332.5)], color='edge', dash='3 3')
    return d

def conduit():
    d = D('conduit', 840, 288, 'Conduit', 'An agent calls Conduit over REST or MCP. Conduit asks CredVault for a valid credential, then executes the declared action against provider APIs. Conduit does not store secrets.')
    d.k = 1.15
    node(d, 24, 72, 136, 80, 'Agent', 'Tool call')
    d.arrow([(160, 112), (248, 112)])
    d.text(204, 100, 'REST · MCP', 10, 'mono', 400, 'fg3', 'middle')
    d.box(248, 56, 224, 112, stroke='accent')
    d.text(272, 84, 'Conduit', 14, 'sans', 600, 'accent_text', 'start', (248, 224))
    for i, s_ in enumerate(['Declarative actions', 'Manifests, not code changes', 'No credential store']):
        d.text(272, 108 + i * 20, s_, 12, 'sans', 400, 'fg2', 'start', (248, 224))
    d.arrow([(472, 112), (552, 112)])
    d.text(512, 100, 'action', 10, 'mono', 400, 'fg3', 'middle')
    d.box(552, 56, 264, 112)
    d.text(576, 84, 'Provider APIs / MCP', 14, 'sans', 600, 'fg', 'start', (552, 264))
    d.text(576, 108, 'Manifest in. HTTP out.', 12, 'sans', 400, 'fg2', 'start', (552, 264))
    d.text(576, 128, 'Schema-typed actions, one engine.', 12, 'sans', 400, 'fg2', 'start', (552, 264))
    d.arrow([(360, 216), (360, 168)])
    d.text(372, 196, 'valid token', 10, 'mono', 400, 'fg3', 'start')
    node(d, 232, 216, 256, 56, 'CredVault', 'Per-user OAuth tokens and API keys')
    return d

def credvault():
    d = D('credvault', 840, 288, 'CredVault', 'Conduit asks CredVault for a user\'s token. CredVault keeps per-end-user OAuth tokens and API keys encrypted at rest, refreshes them with the provider on expiry and rotation, and returns a valid token.')
    d.k = 1.15
    node(d, 16, 104, 152, 80, 'Conduit', 'Asks for a token')
    d.arrow([(168, 128), (296, 128)])
    d.text(232, 116, 'token for user', 10, 'mono', 400, 'fg3', 'middle')
    d.arrow([(296, 160), (168, 160)])
    d.text(232, 182, 'valid token', 10, 'mono', 400, 'fg3', 'middle')
    d.box(296, 40, 280, 208, stroke='accent')
    d.text(320, 72, 'CredVault', 14, 'sans', 600, 'accent_text', 'start', (296, 280))
    rows = ['Per-end-user OAuth tokens', 'and API keys', 'Encrypted at rest', 'Valid across expiry', 'and rotation']
    ys = [100, 120, 152, 184, 204]
    for y, r in zip(ys, rows):
        d.text(320, y, r, 12, 'sans', 400, 'fg2', 'start', (296, 280))
    d.line([(320, 132.5), (552, 132.5)]); d.line([(320, 164.5), (552, 164.5)])
    d.arrow([(576, 144), (656, 144)])
    d.text(616, 132, 'refresh', 10, 'mono', 400, 'fg3', 'middle')
    node(d, 656, 104, 168, 80, 'OAuth providers', 'Token endpoints')
    return d

def main():
    out_dark = os.path.join(ROOT, 'assets/v2'); out_light = os.path.join(ROOT, 'assets/v2/light')
    for fn in (formit, waypoint, agent_run, skills, plane, vmette, conduit, credvault):
        d = fn()
        for theme, out in (('dark', out_dark), ('light', out_light)):
            # render twice so subset includes all chars (chars collected at build time already)
            svg = d.render(theme)
            assert 'shadow' not in svg and '<filter' not in svg
            open(os.path.join(out, d.name + '.svg'), 'w').write(svg)
        print('ok', d.name, d.w, d.h)

if __name__ == '__main__':
    main()
