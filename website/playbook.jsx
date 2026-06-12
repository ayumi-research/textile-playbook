// ================================================================================
// AI AGENTS: This file (playbook.jsx) renders the reader UI.
// Agents should NOT parse this file. Use the public endpoints instead:
//
//   /playbook.json  — Structured JSON (lessons, takeaways, rules, schema)
//   /playbook.md    — Full markdown (complete playbook, one file)
//   /llms.txt       — Canonical index (read this first)
//   /agents.html    — Agent guide (prompts, RAG setup, citation)
//
// This file renders the in-browser reader (reader.html). The content data
// comes from content.jsx, which mirrors /playbook.json.
// ================================================================================

// Theme — black/white, grid-dominant, monospace labels, single electric accent.

const THEME = {
  paper: '#fafaf7',
  paperEdge: '#e8e8e3',
  ink: '#0a0a0a',
  ink2: '#1c1c1c',
  mute: '#707070',
  rule: '#d4d4d0',
  accent: '#1a4eff',
  accentSoft: '#e6ecff',
  sans: '"Space Grotesk", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

const HALFTONE_SVG = (fg, bg) => `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
    <rect width='16' height='16' fill='${bg}'/>
    <circle cx='4' cy='4' r='1' fill='${fg}'/>
    <circle cx='12' cy='12' r='1' fill='${fg}'/>
   </svg>`
)}")`;

// ── Reading time ───────────────────────────────────────────────
// Recursively count words across every string in the lesson, ÷ 200 wpm.
function lessonMinutes(lesson) {
  const count = (n) => {
    if (n == null) return 0;
    if (typeof n === 'string') { const t = n.trim(); return t ? t.split(/\s+/).length : 0; }
    if (Array.isArray(n)) return n.reduce((a, x) => a + count(x), 0);
    if (typeof n === 'object') return Object.values(n).reduce((a, x) => a + count(x), 0);
    return 0;
  };
  return Math.max(1, Math.round(count(lesson) / 200));
}

// ── Page chrome ────────────────────────────────────────────────
function Chrome({ lesson, page, total, kind }) {
  if (kind === 'cover') return null;
  const label = kind === 'toc' ? 'Contents' : kind === 'colophon' ? 'End matter' : kind === 'paywall' ? 'Preview \u00B7 Unlock full book' : lesson ? `L${String(lesson.n).padStart(2, '0')} · ${lesson.title}` : '';
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, borderBottom: `1px solid ${THEME.ink}`, display: 'grid', gridTemplateColumns: '120px 1fr 120px', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.1, textTransform: 'uppercase', color: THEME.ink }}>
        <div style={{ padding: '12px 16px', borderRight: `1px solid ${THEME.ink}`, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, background: THEME.accent, borderRadius: '50%' }} />
          Playbook/01
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ padding: '12px 16px', borderLeft: `1px solid ${THEME.ink}`, textAlign: 'right' }}>{String(page + 1).padStart(3, '0')}/{String(total).padStart(3, '0')}</div>
      </div>
    </>
  );
}

// ── Shared atoms ───────────────────────────────────────────────
const Tag = ({ children, color = THEME.accent }) => (
  <span style={{ display: 'inline-block', padding: '3px 8px', background: color, color: '#fff', fontFamily: THEME.mono, fontSize: 9, letterSpacing: 0.15, textTransform: 'uppercase', fontWeight: 500 }}>{children}</span>
);

const SecHead = ({ kind, title, sub }) => (
  <div style={{ marginBottom: 14, display: 'flex', gap: 10, alignItems: 'baseline', borderTop: `2px solid ${THEME.ink}`, paddingTop: 10 }}>
    <Tag>{kind}</Tag>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: THEME.sans, fontWeight: 600, fontSize: 20, color: THEME.ink, letterSpacing: -0.3, lineHeight: 1.15 }}>{title}</div>
      {sub && <div style={{ fontFamily: THEME.mono, fontSize: 10, color: THEME.mute, letterSpacing: 0.1, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

// ── Section renderers ──────────────────────────────────────────
function Table({ s, kind = 'table' }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind={kind} title={s.heading} sub={s.sub} />
      <div style={{ border: `1px solid ${THEME.ink}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: s.cols.map((_, i) => i === 0 ? '1.2fr' : '1fr').join(' '), background: THEME.ink, color: '#fff' }}>
          {s.cols.map((c, i) => (
            <div key={i} style={{ padding: '6px 10px', fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase', borderRight: i < s.cols.length - 1 ? `1px solid ${THEME.mute}` : 'none' }}>{c}</div>
          ))}
        </div>
        {s.rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: s.cols.map((_, j) => j === 0 ? '1.2fr' : '1fr').join(' '), borderBottom: i < s.rows.length - 1 ? `1px solid ${THEME.rule}` : 'none', background: i % 2 === 0 ? '#fff' : THEME.paper }}>
            {r.map((cell, j) => (
              <div key={j} style={{ padding: '9px 10px', fontFamily: j === 0 ? THEME.sans : THEME.sans, fontWeight: j === 0 ? 600 : 400, fontSize: j === 0 ? 12 : 11.5, color: THEME.ink, borderRight: j < r.length - 1 ? `1px solid ${THEME.rule}` : 'none', lineHeight: 1.45 }}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
      {s.footnote && <div style={{ marginTop: 8, fontFamily: THEME.mono, fontSize: 10, color: THEME.mute, lineHeight: 1.5 }}>→ {s.footnote}</div>}
    </div>
  );
}

function Rule({ s }) {
  return (
    <div style={{ marginBottom: 22, padding: 16, background: THEME.ink, color: '#fff' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: s.body || s.list ? 10 : 0 }}>
        <Tag color={THEME.accent}>rule</Tag>
        <div style={{ fontFamily: THEME.sans, fontSize: 18, fontWeight: 600, letterSpacing: -0.2 }}>{s.heading}</div>
      </div>
      {s.body && <div style={{ fontFamily: THEME.sans, fontSize: 14, fontWeight: 500, marginBottom: s.list ? 12 : 0, color: THEME.accent }}>{s.body}</div>}
      {s.list && (
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px 16px' }}>
          {s.list.map((row, i) => (
            <React.Fragment key={i}>
              <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.accent, paddingTop: 2 }}>{row[0]}</div>
              <div style={{ fontFamily: THEME.sans, fontSize: 12.5, lineHeight: 1.45, color: '#eee' }}>{row[1]}</div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

function Story({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="case" title={s.heading} />
      <div style={{ border: `1px solid ${THEME.ink}` }}>
        {s.blocks.map((b, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', borderBottom: i < s.blocks.length - 1 ? `1px solid ${THEME.rule}` : 'none' }}>
            <div style={{ padding: '10px 12px', background: THEME.ink, color: '#fff', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase' }}>{b.label}</div>
            <div style={{ padding: '10px 12px', fontFamily: THEME.sans, fontSize: 12.5, color: THEME.ink, lineHeight: 1.5 }}>{b.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bullets({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="list" title={s.heading} sub={s.sub} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${THEME.ink}` }}>
        {s.items.map((it, i) => (
          <div key={i} style={{ padding: '10px 12px', borderRight: i % 2 === 0 ? `1px solid ${THEME.rule}` : 'none', borderBottom: i < s.items.length - 2 ? `1px solid ${THEME.rule}` : 'none', background: '#fff' }}>
            <div style={{ fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.accent, marginBottom: 3 }}>{String(i + 1).padStart(2, '0')} · {it[0]}</div>
            <div style={{ fontFamily: THEME.sans, fontSize: 12, color: THEME.ink, lineHeight: 1.4 }}>{it[1]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SideBySide({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="compare" title={s.heading} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${THEME.ink}` }}>
        {[s.a, s.b].map((col, ci) => (
          <div key={ci} style={{ borderRight: ci === 0 ? `1px solid ${THEME.ink}` : 'none' }}>
            <div style={{ padding: '8px 12px', background: ci === 0 ? THEME.ink : THEME.accent, color: '#fff', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase' }}>{col.title}</div>
            <div style={{ padding: 12 }}>
              {col.items.map((it, i) => (
                <div key={i} style={{ fontFamily: THEME.sans, fontSize: 12, color: THEME.ink, lineHeight: 1.5, padding: '5px 0', borderBottom: i < col.items.length - 1 ? `1px solid ${THEME.rule}` : 'none' }}>
                  <span style={{ color: THEME.accent, marginRight: 6, fontFamily: THEME.mono, fontSize: 10 }}>→</span>
                  {typeof it === 'string' ? it : it.join(' — ')}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {s.script && (
        <div style={{ marginTop: 10, padding: 12, background: THEME.accentSoft, borderLeft: `3px solid ${THEME.accent}` }}>
          <div style={{ fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.accent, marginBottom: 4 }}>Script</div>
          <div style={{ fontFamily: THEME.sans, fontSize: 13, color: THEME.ink, lineHeight: 1.45 }}>{s.script}</div>
          {s.scriptNote && <div style={{ marginTop: 4, fontFamily: THEME.mono, fontSize: 10, color: THEME.mute }}>{s.scriptNote}</div>}
        </div>
      )}
    </div>
  );
}

function Economics({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="math" title={s.heading} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {s.cards.map((c, i) => (
          <div key={i} style={{ border: `1px solid ${THEME.ink}`, background: '#fff' }}>
            <div style={{ padding: '8px 12px', borderBottom: `1px solid ${THEME.ink}`, fontFamily: THEME.sans, fontWeight: 600, fontSize: 13, color: THEME.ink }}>{c.title}</div>
            {c.rows.map((r, j) => (
              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', borderBottom: j < c.rows.length - 1 ? `1px solid ${THEME.rule}` : 'none' }}>
                <span style={{ fontFamily: THEME.mono, fontSize: 10, color: THEME.mute, letterSpacing: 0.1, textTransform: 'uppercase' }}>{r[0]}</span>
                <span style={{ fontFamily: THEME.mono, fontSize: 12, color: THEME.ink, fontWeight: 500 }}>{r[1]}</span>
              </div>
            ))}
            {c.note && <div style={{ padding: '8px 12px', background: THEME.accentSoft, fontFamily: THEME.sans, fontSize: 11, color: THEME.ink, lineHeight: 1.4 }}>{c.note}</div>}
          </div>
        ))}
      </div>
      {s.footer && <div style={{ marginTop: 10, padding: '8px 12px', background: THEME.ink, color: '#fff', fontFamily: THEME.sans, fontSize: 13, fontWeight: 500, textAlign: 'center' }}>→ {s.footer}</div>}
    </div>
  );
}

function ListSec({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="list" title={s.heading} />
      <div style={{ border: `1px solid ${THEME.ink}` }}>
        {s.items.map((it, i) => (
          <div key={i} style={{ padding: '8px 12px', borderBottom: i < s.items.length - 1 ? `1px solid ${THEME.rule}` : 'none', display: 'flex', gap: 10, background: i % 2 === 0 ? '#fff' : THEME.paper }}>
            <span style={{ fontFamily: THEME.mono, fontSize: 10, color: THEME.accent, fontWeight: 500, width: 20, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ fontFamily: THEME.sans, fontSize: 12, color: THEME.ink, lineHeight: 1.5 }}>{typeof it === 'string' ? it : it.join(' — ')}</span>
          </div>
        ))}
      </div>
      {s.note && <div style={{ marginTop: 8, padding: '8px 12px', background: THEME.ink, color: '#fff', fontFamily: THEME.mono, fontSize: 11, lineHeight: 1.45 }}>▪ {s.note}</div>}
    </div>
  );
}

function ThreeCol({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="technique" title={s.heading} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1px solid ${THEME.ink}` }}>
        {s.cols.map((c, i) => (
          <div key={i} style={{ borderRight: i < 2 ? `1px solid ${THEME.ink}` : 'none' }}>
            <div style={{ padding: '8px 10px', background: i === 0 ? THEME.ink : i === 1 ? THEME.accent : THEME.ink2, color: '#fff', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase' }}>{c.title}</div>
            <div style={{ padding: 10 }}>
              {c.items.map((it, j) => (
                <div key={j} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: j < c.items.length - 1 ? `1px dotted ${THEME.rule}` : 'none' }}>
                  <div style={{ fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.12, textTransform: 'uppercase', color: THEME.accent, marginBottom: 2 }}>{it[0]}</div>
                  <div style={{ fontFamily: THEME.sans, fontSize: 11.5, color: THEME.ink, lineHeight: 1.45 }}>{it[1]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {s.footnote && <div style={{ marginTop: 8, fontFamily: THEME.mono, fontSize: 10, color: THEME.mute }}>→ {s.footnote}</div>}
    </div>
  );
}

function Para({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="note" title={s.heading} />
      <div style={{ fontFamily: THEME.sans, fontSize: 13.5, color: THEME.ink, lineHeight: 1.6, textWrap: 'pretty', padding: '4px 0' }}>{s.body}</div>
    </div>
  );
}

function Compare({ s }) {
  const cols = s.c ? [s.a, s.b, s.c] : [s.a, s.b];
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="example" title={s.heading} />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, 1fr)`, gap: 0, border: `1px solid ${THEME.ink}` }}>
        {cols.map((c, i) => (
          <div key={i} style={{ borderRight: i < cols.length - 1 ? `1px solid ${THEME.ink}` : 'none', background: i > 0 ? THEME.accentSoft : '#fff' }}>
            <div style={{ padding: '8px 12px', background: i > 0 ? THEME.accent : THEME.ink, color: '#fff', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase' }}>{c.label}</div>
            <div style={{ padding: 12 }}>
              <div style={{ fontFamily: THEME.sans, fontSize: 13, fontWeight: 500, color: THEME.ink, marginBottom: 10, lineHeight: 1.35 }}>{c.title}</div>
              {c.stats.map((st, j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: j < c.stats.length - 1 ? `1px dotted ${THEME.rule}` : 'none' }}>
                  <span style={{ fontFamily: THEME.mono, fontSize: 10, color: THEME.mute, letterSpacing: 0.1 }}>{st[0]}</span>
                  <span style={{ fontFamily: THEME.mono, fontSize: 11.5, color: THEME.ink, fontWeight: 500 }}>{st[1]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {s.footer && <div style={{ marginTop: 10, padding: '8px 12px', background: THEME.ink, color: '#fff', fontFamily: THEME.sans, fontSize: 13, fontWeight: 500, textAlign: 'center' }}>{s.footer}</div>}
    </div>
  );
}

function Asks({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="scripts" title={s.heading} />
      <div style={{ border: `1px solid ${THEME.ink}` }}>
        {s.items.map((q, i) => (
          <div key={i} style={{ padding: '10px 12px', borderBottom: `1px solid ${THEME.rule}`, fontFamily: THEME.sans, fontSize: 13, color: THEME.ink, lineHeight: 1.5, background: '#fff' }}>
            <span style={{ fontFamily: THEME.mono, fontSize: 10, color: THEME.accent, marginRight: 8 }}>Q{String(i + 1).padStart(2, '0')}</span>
            “{q}”
          </div>
        ))}
      </div>
      {s.redflag && (
        <div style={{ marginTop: 10, padding: 12, background: THEME.ink, color: '#fff' }}>
          <div style={{ fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.accent, marginBottom: 4 }}>▲ Red flag</div>
          <div style={{ fontFamily: THEME.sans, fontSize: 12, lineHeight: 1.45 }}>{s.redflag}</div>
        </div>
      )}
    </div>
  );
}

function Questions({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="interview" title={s.heading} />
      {s.items.map((q, i) => (
        <div key={i} style={{ marginBottom: 10, border: `1px solid ${THEME.ink}` }}>
          <div style={{ padding: '8px 12px', background: THEME.ink, color: '#fff', display: 'flex', gap: 10, alignItems: 'baseline' }}>
            <Tag color={THEME.accent}>Q{i + 1}</Tag>
            <div style={{ fontFamily: THEME.sans, fontSize: 12.5, lineHeight: 1.4 }}>{q.q}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: '#fff' }}>
            {q.levels.map((lv, j) => (
              <div key={j} style={{ padding: 10, borderRight: j < 2 ? `1px solid ${THEME.rule}` : 'none', background: j === 0 ? THEME.accentSoft : j === 1 ? '#fff' : THEME.paper }}>
                <div style={{ fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase', color: j === 0 ? THEME.accent : j === 1 ? THEME.mute : THEME.ink, marginBottom: 4, fontWeight: 500 }}>{lv[0]}</div>
                <div style={{ fontFamily: THEME.sans, fontSize: 11, color: THEME.ink, lineHeight: 1.4 }}>{lv[1]}</div>
              </div>
            ))}
          </div>
          {q.gap && <div style={{ padding: '6px 12px', background: THEME.paper, borderTop: `1px solid ${THEME.rule}`, fontFamily: THEME.mono, fontSize: 10, color: THEME.mute, lineHeight: 1.5 }}>→ {q.gap}</div>}
        </div>
      ))}
    </div>
  );
}

function Rubric({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="rubric" title={s.heading} />
      <div style={{ border: `1px solid ${THEME.ink}`, marginBottom: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', background: THEME.ink, color: '#fff' }}>
          {s.cols.map((c, i) => (
            <div key={i} style={{ padding: '6px 10px', fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase', borderRight: i < s.cols.length - 1 ? `1px solid ${THEME.mute}` : 'none' }}>{c}</div>
          ))}
        </div>
        {s.rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', borderBottom: i < s.rows.length - 1 ? `1px solid ${THEME.rule}` : 'none' }}>
            {r.map((cell, j) => (
              <div key={j} style={{ padding: '8px 10px', fontFamily: THEME.sans, fontSize: 11.5, color: THEME.ink, borderRight: j < r.length - 1 ? `1px solid ${THEME.rule}` : 'none', fontWeight: j === 0 ? 600 : 400, background: j === 1 ? THEME.accentSoft : '#fff', lineHeight: 1.4 }}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
      {s.scores && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1px solid ${THEME.ink}` }}>
          {s.scores.map((sc, i) => (
            <div key={i} style={{ padding: 10, borderRight: i < 2 ? `1px solid ${THEME.rule}` : 'none', background: i === 0 ? THEME.accent : i === 1 ? THEME.accentSoft : THEME.paper, color: i === 0 ? '#fff' : THEME.ink }}>
              <div style={{ fontFamily: THEME.mono, fontSize: 14, fontWeight: 600, letterSpacing: 0.05 }}>{sc[0]}</div>
              <div style={{ fontFamily: THEME.sans, fontSize: 11, marginTop: 2 }}>{sc[1]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Traps({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="traps" title={s.heading} />
      {s.items.map((t, i) => (
        <div key={i} style={{ marginBottom: 10, border: `1px solid ${THEME.ink}`, background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr auto', background: THEME.ink, color: '#fff' }}>
            <div style={{ padding: '8px 10px', background: THEME.accent, fontFamily: THEME.mono, fontSize: 16, fontWeight: 700, textAlign: 'center' }}>{t.n}</div>
            <div style={{ padding: '8px 12px' }}>
              <div style={{ fontFamily: THEME.sans, fontSize: 13.5, fontWeight: 600, lineHeight: 1.2 }}>{t.title}</div>
              <div style={{ fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.accent, marginTop: 2 }}>{t.sub}</div>
            </div>
          </div>
          <div style={{ padding: 12 }}>
            {t.pitch && <div style={{ fontFamily: THEME.sans, fontSize: 12, fontStyle: 'italic', color: THEME.mute, marginBottom: 8 }}>Pitch: {t.pitch}</div>}
            {t.reality && (
              <div style={{ border: `1px solid ${THEME.rule}`, marginBottom: 8 }}>
                {t.reality.map((r, j) => (
                  <div key={j} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', borderBottom: j < t.reality.length - 1 ? `1px solid ${THEME.rule}` : 'none' }}>
                    <div style={{ padding: '5px 8px', background: THEME.accent, color: '#fff', fontFamily: THEME.mono, fontSize: 11, fontWeight: 600 }}>{r[0]}</div>
                    <div style={{ padding: '5px 10px', fontFamily: THEME.sans, fontSize: 11.5, color: THEME.ink }}>{r[1]}</div>
                  </div>
                ))}
              </div>
            )}
            {t.math && t.math.map((m, j) => (
              <div key={j} style={{ fontFamily: THEME.mono, fontSize: 11, color: THEME.ink, marginBottom: 4 }}>
                <span style={{ color: THEME.accent, marginRight: 8, fontWeight: 600 }}>{m[0]}</span>{m[1]}
              </div>
            ))}
            {t.actual && <div style={{ fontFamily: THEME.mono, fontSize: 10.5, color: THEME.ink, marginBottom: 6, lineHeight: 1.5, background: THEME.paper, padding: 8 }}>{t.actual}</div>}
            {t.hidden && <div style={{ fontFamily: THEME.sans, fontSize: 11.5, color: THEME.ink, marginBottom: 6, lineHeight: 1.5 }}>{t.hidden}</div>}
            <div style={{ background: THEME.ink, color: '#fff', padding: '6px 10px', fontFamily: THEME.sans, fontSize: 12, fontWeight: 500 }}>
              <span style={{ color: THEME.accent, fontFamily: THEME.mono, fontSize: 10, marginRight: 8, letterSpacing: 0.15, textTransform: 'uppercase' }}>Rule</span>
              {t.rule}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Checklist({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="checklist" title={s.heading} sub={s.sub} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${THEME.ink}` }}>
        {s.items.map((it, i) => (
          <div key={i} style={{ padding: 10, borderRight: i % 2 === 0 ? `1px solid ${THEME.rule}` : 'none', borderBottom: i < s.items.length - 2 ? `1px solid ${THEME.rule}` : 'none', background: '#fff', display: 'flex', gap: 10 }}>
            <div style={{ width: 14, height: 14, border: `1.5px solid ${THEME.ink}`, flexShrink: 0, marginTop: 2, background: THEME.accent }} />
            <div>
              <div style={{ fontFamily: THEME.sans, fontSize: 12, fontWeight: 600, color: THEME.ink }}>{it[0]}</div>
              <div style={{ fontFamily: THEME.sans, fontSize: 11, color: THEME.mute, lineHeight: 1.4 }}>{it[1]}</div>
            </div>
          </div>
        ))}
      </div>
      {s.note && <div style={{ marginTop: 10, padding: '8px 12px', background: THEME.accent, color: '#fff', fontFamily: THEME.sans, fontSize: 12, fontWeight: 500 }}>▪ {s.note}</div>}
    </div>
  );
}

function Script({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="script" title={s.heading} />
      <div style={{ border: `1px solid ${THEME.ink}` }}>
        {[['Client', s.client], ['Means', s.translation], ['You say', s.response], ['Frame', s.frame]].filter(r => r[1]).map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', borderBottom: `1px solid ${THEME.rule}` }}>
            <div style={{ padding: '8px 10px', background: THEME.ink, color: '#fff', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase' }}>{r[0]}</div>
            <div style={{ padding: '8px 12px', fontFamily: THEME.sans, fontSize: 12, color: THEME.ink, lineHeight: 1.5, background: i === 2 ? THEME.accentSoft : '#fff' }}>{r[1]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="signals" title={s.heading} />
      <div style={{ border: `1px solid ${THEME.ink}` }}>
        {s.items.map((it, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1.2fr', borderBottom: i < s.items.length - 1 ? `1px solid ${THEME.rule}` : 'none' }}>
            <div style={{ padding: '8px 12px', background: i === 0 ? '#b00020' : i === 1 ? '#d97706' : THEME.accent, color: '#fff', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase', fontWeight: 500 }}>{it.level}</div>
            <div style={{ padding: '8px 12px', fontFamily: THEME.sans, fontSize: 12.5, color: THEME.ink, fontWeight: 500, borderRight: `1px solid ${THEME.rule}` }}>{it.phrase}</div>
            <div style={{ padding: '8px 12px', fontFamily: THEME.sans, fontSize: 11.5, color: THEME.mute, lineHeight: 1.4 }}>{it.meaning}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Buffer({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="buffer" title={s.heading} />
      <div style={{ border: `1px solid ${THEME.ink}` }}>
        {s.rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', borderBottom: i < s.rows.length - 1 ? `1px solid ${THEME.rule}` : 'none' }}>
            <div style={{ padding: '8px 12px', background: THEME.ink, color: '#fff', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.1, textTransform: 'uppercase' }}>{r[0]}</div>
            <div style={{ padding: '8px 12px', fontFamily: THEME.sans, fontSize: 12.5, color: THEME.ink, background: '#fff' }}>{r[1]}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, padding: '8px 12px', background: THEME.accent, color: '#fff', fontFamily: THEME.sans, fontSize: 13, fontWeight: 500, textAlign: 'center' }}>→ {s.footer}</div>
    </div>
  );
}

function Hours({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="48h" title={s.heading} />
      <div style={{ border: `1px solid ${THEME.ink}`, position: 'relative' }}>
        {s.rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', borderBottom: i < s.rows.length - 1 ? `1px solid ${THEME.rule}` : 'none', position: 'relative' }}>
            <div style={{ padding: '8px 12px', background: THEME.accent, color: '#fff', fontFamily: THEME.mono, fontSize: 11, fontWeight: 500 }}>{r[0]}</div>
            <div style={{ padding: '8px 12px', fontFamily: THEME.sans, fontSize: 12, color: THEME.ink, lineHeight: 1.45, background: '#fff' }}>{r[1]}</div>
          </div>
        ))}
      </div>
      {s.footer && <div style={{ marginTop: 10, padding: '8px 12px', background: THEME.ink, color: '#fff', fontFamily: THEME.sans, fontSize: 11.5, lineHeight: 1.5 }}>▪ {s.footer}</div>}
    </div>
  );
}

function Example({ s }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <SecHead kind="calc" title={s.heading} />
      <div style={{ border: `1px solid ${THEME.ink}`, marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', background: THEME.ink, color: '#fff' }}>
          <div style={{ padding: '6px 10px', fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase' }}>Line item</div>
          <div style={{ padding: '6px 10px', fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase', textAlign: 'right' }}>Amount</div>
          <div style={{ padding: '6px 10px', fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.15, textTransform: 'uppercase' }}>Note</div>
        </div>
        {s.lines.map((l, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', borderBottom: `1px solid ${THEME.rule}`, background: i % 2 === 0 ? '#fff' : THEME.paper }}>
            <div style={{ padding: '6px 10px', fontFamily: THEME.sans, fontSize: 12, color: THEME.ink }}>{l[0]}</div>
            <div style={{ padding: '6px 10px', fontFamily: THEME.mono, fontSize: 12, color: THEME.ink, fontWeight: 500, textAlign: 'right' }}>{l[1]}</div>
            <div style={{ padding: '6px 10px', fontFamily: THEME.mono, fontSize: 10.5, color: THEME.mute }}>{l[2]}</div>
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', background: THEME.accent, color: '#fff' }}>
          <div style={{ padding: '8px 10px', fontFamily: THEME.sans, fontSize: 13, fontWeight: 600 }}>{s.total[0]}</div>
          <div style={{ padding: '8px 10px', fontFamily: THEME.mono, fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{s.total[1]}</div>
          <div style={{ padding: '8px 10px', fontFamily: THEME.mono, fontSize: 11 }}>{s.total[2]}</div>
        </div>
      </div>
      <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.mute, marginBottom: 6 }}>→ The comparison trap</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1px solid ${THEME.ink}` }}>
        {s.trap.map((t, i) => (
          <div key={i} style={{ borderRight: i < 2 ? `1px solid ${THEME.ink}` : 'none', background: i === 1 ? THEME.accentSoft : '#fff' }}>
            <div style={{ padding: '6px 10px', background: i === 1 ? THEME.accent : THEME.ink, color: '#fff', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase' }}>Supplier {t[0]}</div>
            <div style={{ padding: 10 }}>
              <div style={{ fontFamily: THEME.mono, fontSize: 16, color: i === 1 ? THEME.accent : THEME.ink, fontWeight: 600, marginBottom: 4 }}>{t[1]}</div>
              <div style={{ fontFamily: THEME.sans, fontSize: 11, color: THEME.mute, lineHeight: 1.4 }}>{t[2]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S_MAP = {
  table: (p) => <Table {...p} />, rule: (p) => <Rule {...p} />, story: (p) => <Story {...p} />,
  bullets: (p) => <Bullets {...p} />, sidebyside: (p) => <SideBySide {...p} />,
  economics: (p) => <Economics {...p} />, list: (p) => <ListSec {...p} />,
  threecol: (p) => <ThreeCol {...p} />, paragraph: (p) => <Para {...p} />,
  compare: (p) => <Compare {...p} />, asks: (p) => <Asks {...p} />,
  questions: (p) => <Questions {...p} />, rubric: (p) => <Rubric {...p} />,
  traps: (p) => <Traps {...p} />, checklist: (p) => <Checklist {...p} />,
  script: (p) => <Script {...p} />, timeline: (p) => <Timeline {...p} />,
  buffer: (p) => <Buffer {...p} />, hours: (p) => <Hours {...p} />,
  example: (p) => <Example {...p} />,
};

// ── Page compositions ──────────────────────────────────────────
function CoverPage() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '40px 1fr 40px 1fr 40px' }}>
      {/* marker bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', borderBottom: `1px solid ${THEME.ink}` }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ borderRight: i < 11 ? `1px solid ${THEME.ink}` : 'none', background: i < 3 ? THEME.accent : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: THEME.mono, fontSize: 9, color: i < 3 ? '#fff' : THEME.ink, letterSpacing: 0.1 }}>{String(i + 1).padStart(2, '0')}</div>
        ))}
      </div>

      {/* big type */}
      <div style={{ padding: '40px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: `1px solid ${THEME.ink}` }}>
        <div style={{ fontFamily: THEME.mono, fontSize: 11, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.accent, marginBottom: 10 }}>{BOOK.publisher} / Manual 001</div>
        <div style={{ fontFamily: THEME.sans, fontWeight: 700, fontSize: 130, lineHeight: 0.88, color: THEME.ink, letterSpacing: -5 }}>
          The<br/>Textile<br/>Playbook.
        </div>
      </div>

      {/* meta bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${THEME.ink}`, background: THEME.ink, color: '#fff' }}>
        <div style={{ padding: '10px 16px', borderRight: `1px solid ${THEME.mute}`, fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.1, textTransform: 'uppercase' }}>Edition — {BOOK.edition}</div>
        <div style={{ padding: '10px 16px', borderRight: `1px solid ${THEME.mute}`, fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.1, textTransform: 'uppercase' }}>Date — {BOOK.date}</div>
        <div style={{ padding: '10px 16px', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.1, textTransform: 'uppercase' }}>Lessons — 09</div>
      </div>

      {/* subtitle block */}
      <div style={{ padding: '24px 50px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.mute, marginBottom: 10 }}>Subtitle</div>
          <div style={{ fontFamily: THEME.sans, fontSize: 22, fontWeight: 500, lineHeight: 1.2, color: THEME.ink, letterSpacing: -0.4 }}>{BOOK.subtitle}</div>
        </div>
        <div>
          <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.accent, marginBottom: 10 }}>Scope</div>
          <div style={{ fontFamily: THEME.sans, fontSize: 12.5, color: THEME.ink, lineHeight: 1.5 }}>{BOOK.market}</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Embroidery', 'Screen print', 'DTF', 'Transfer', 'DTG'].map(t => (
              <span key={t} style={{ padding: '3px 8px', border: `1px solid ${THEME.ink}`, fontFamily: THEME.mono, fontSize: 9.5, letterSpacing: 0.1, textTransform: 'uppercase', color: THEME.ink }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderTop: `1px solid ${THEME.ink}`, fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.ink }}>
        <div style={{ padding: '12px 16px', borderRight: `1px solid ${THEME.ink}` }}><a href="/impressum.html" target="_blank" rel="noopener" style={{ color: THEME.ink, textDecoration: 'none' }}>Imprint</a></div>
        <div style={{ padding: '12px 16px', borderRight: `1px solid ${THEME.ink}` }}><a href="/privacy-policy.html" target="_blank" rel="noopener" style={{ color: THEME.ink, textDecoration: 'none' }}>Privacy</a></div>
        <div style={{ padding: '12px 16px', borderRight: `1px solid ${THEME.ink}` }}><a href="/terms.html" target="_blank" rel="noopener" style={{ color: THEME.ink, textDecoration: 'none' }}>Terms</a></div>
        <div style={{ padding: '12px 16px', textAlign: 'right', color: THEME.accent }}>◆ 001 / 001</div>
      </div>
    </div>
  );
}

function TOCPage() {
  return (
    <div style={{ position: 'absolute', inset: '40px 0 40px 0', padding: '30px 50px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'baseline' }}>
        <Tag>index</Tag>
        <div style={{ fontFamily: THEME.sans, fontSize: 44, fontWeight: 700, color: THEME.ink, letterSpacing: -1, lineHeight: 1 }}>Contents.</div>
      </div>
      <div style={{ border: `1px solid ${THEME.ink}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1.2fr 80px', background: THEME.ink, color: '#fff', fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase' }}>
          <div style={{ padding: '6px 10px', borderRight: `1px solid ${THEME.mute}` }}>№</div>
          <div style={{ padding: '6px 10px', borderRight: `1px solid ${THEME.mute}` }}>Title</div>
          <div style={{ padding: '6px 10px', borderRight: `1px solid ${THEME.mute}` }}>Learn</div>
          <div style={{ padding: '6px 10px', textAlign: 'right' }}>Page</div>
        </div>
        {TOC.map((t, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1.2fr 80px', borderBottom: i < TOC.length - 1 ? `1px solid ${THEME.rule}` : 'none', background: i % 2 === 0 ? '#fff' : THEME.paper }}>
            <div style={{ padding: '10px 10px', fontFamily: THEME.mono, fontSize: 13, color: THEME.accent, fontWeight: 600, borderRight: `1px solid ${THEME.rule}` }}>{String(t.n).padStart(2, '0')}</div>
            <div style={{ padding: '10px 10px', fontFamily: THEME.sans, fontSize: 13, fontWeight: 500, color: THEME.ink, borderRight: `1px solid ${THEME.rule}`, lineHeight: 1.3 }}>{t.t}</div>
            <div style={{ padding: '10px 10px', fontFamily: THEME.sans, fontSize: 11.5, color: THEME.mute, borderRight: `1px solid ${THEME.rule}`, lineHeight: 1.4 }}>{t.l}</div>
            <div style={{ padding: '10px 10px', fontFamily: THEME.mono, fontSize: 12, color: THEME.ink, textAlign: 'right' }}>{String((i + 1) * 3 + 3).padStart(3, '0')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonIntroPage({ lesson }) {
  return (
    <div style={{ position: 'absolute', inset: '40px 0 40px 0', display: 'grid', gridTemplateRows: '140px 1fr auto', }}>
      <div style={{ padding: '30px 50px', background: THEME.ink, color: '#fff', display: 'flex', gap: 20, alignItems: 'center', borderBottom: `4px solid ${THEME.accent}` }}>
        <div style={{ fontFamily: THEME.mono, fontSize: 88, fontWeight: 700, color: THEME.accent, lineHeight: 1, letterSpacing: -4 }}>{String(lesson.n).padStart(2, '0')}</div>
        <div>
          <div style={{ fontFamily: THEME.mono, fontSize: 11, letterSpacing: 0.2, textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Lesson · ≈ {lessonMinutes(lesson)} min read</div>
          <div style={{ fontFamily: THEME.sans, fontSize: 30, fontWeight: 600, lineHeight: 1.05, letterSpacing: -0.7 }}>{lesson.title}</div>
        </div>
      </div>
      <div style={{ padding: '30px 50px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, marginBottom: 20, borderTop: `1px solid ${THEME.ink}`, paddingTop: 14 }}>
          <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.accent }}>Quick summary</div>
          <div style={{ fontFamily: THEME.sans, fontSize: 16, fontWeight: 500, lineHeight: 1.5, color: THEME.ink, textWrap: 'pretty' }}>{lesson.summary}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, borderTop: `1px solid ${THEME.ink}`, paddingTop: 14, marginBottom: 20 }}>
          <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.accent }}>Why it saves</div>
          <div style={{ fontFamily: THEME.sans, fontSize: 13.5, lineHeight: 1.55, color: THEME.mute, textWrap: 'pretty' }}>{lesson.saves}</div>
        </div>
        {typeof TAKEAWAYS !== 'undefined' && TAKEAWAYS[lesson.n] && (
          <div style={{ background: THEME.ink, color: '#fff', padding: '14px 18px', display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16 }}>
            <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.accent }}>Bottom line</div>
            <div style={{ fontFamily: THEME.sans, fontSize: 15, fontWeight: 500, lineHeight: 1.4, color: '#fff' }}>{TAKEAWAYS[lesson.n]}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function LessonSectionsPage({ lesson, sections, part, parts }) {
  return (
    <div style={{ padding: '24px 40px 40px' }}>
      <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
          <Tag>{parts > 1 ? `L${String(lesson.n).padStart(2, '0')} · ${part}/${parts}` : `L${String(lesson.n).padStart(2, '0')}`}</Tag>
          <div style={{ fontFamily: THEME.sans, fontSize: 14, fontWeight: 600, color: THEME.ink, letterSpacing: -0.2 }}>{lesson.title}</div>
        </div>
      </div>
      {sections.map((s, i) => (
        <React.Fragment key={i}>{S_MAP[s.kind] && S_MAP[s.kind]({ s })}</React.Fragment>
      ))}
    </div>
  );
}

function ColophonPage() {
  return (
    <div style={{ position: 'absolute', inset: '40px 0 40px 0', padding: '30px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <Tag>end</Tag>
        <div style={{ fontFamily: THEME.sans, fontSize: 80, fontWeight: 700, color: THEME.ink, letterSpacing: -3, lineHeight: 0.9, marginTop: 14 }}>
          End of<br/>manual.
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ border: `1px solid ${THEME.ink}`, padding: 14 }}>
          <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.accent, marginBottom: 6 }}>Typography</div>
          <div style={{ fontFamily: THEME.sans, fontSize: 13, color: THEME.ink, lineHeight: 1.45 }}>Space Grotesk — display, body, tables. JetBrains Mono — labels, data, prices.</div>
        </div>
        <div style={{ border: `1px solid ${THEME.ink}`, padding: 14, background: THEME.ink, color: '#fff' }}>
          <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.accent, marginBottom: 6 }}>For</div>
          <div style={{ fontFamily: THEME.sans, fontSize: 13, lineHeight: 1.45 }}>{BOOK.market}</div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${THEME.ink}`, paddingTop: 12, fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.ink, display: 'flex', justifyContent: 'space-between' }}>
        <span>{BOOK.publisher}</span>
        <span style={{ color: THEME.accent }}>◆ 001 / 001</span>
        <span>{BOOK.edition} · {BOOK.date}</span>
      </div>
    </div>
  );
}

// ── Paywall page (shown in preview mode only) ──────────────────
function PaywallPage() {
  const features = [
    ["Lessons 3\u20139", "Design for technique \u00B7 Suppliers \u00B7 Cheap traps \u00B7 Timelines \u00B7 Prototypes \u00B7 When it goes wrong \u00B7 Price benchmarks"],
    ["Pricing appendix", "EU market ranges for every technique, with red-flag quote patterns"],
    ["Supplier rubric", "3-question scoring grid \u2014 vet any supplier on one call"],
    ["Crisis playbooks", "Triage scripts \u00B7 48-hour emergency sourcing \u00B7 how to say \u201Cwe fucked up\u201D"],
    ["Share with your team", "One purchase · forward the access link · no seat limits, no per-user fees."],
  ];
  return (
    <div style={{ padding: '58px 60px 70px', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: THEME.sans, color: THEME.ink }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${THEME.ink}` }}>
        <span style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.accent }}>Preview ends here</span>
        <span style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.mute }}>· Paywall ·</span>
      </div>

      <div style={{ fontFamily: THEME.mono, fontSize: 11, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.accent, marginBottom: 14 }}>You’ve read 2 of 9 lessons.</div>
      <h1 style={{ fontFamily: THEME.sans, fontWeight: 700, fontSize: 58, lineHeight: 0.95, letterSpacing: -2, margin: '0 0 22px', textWrap: 'balance' }}>
        Unlock the<br/>full playbook<span style={{ color: THEME.accent }}>.</span>
      </h1>
      <p style={{ fontFamily: THEME.sans, fontSize: 15, lineHeight: 1.55, color: THEME.ink2, margin: '0 0 26px', maxWidth: 560, textWrap: 'pretty' }}>
        Seven more lessons, an EU pricing appendix, and the crisis playbooks — instant access in your browser. Shareable with your team, free updates for at least 3 years.
      </p>

      <div style={{ border: `1px solid ${THEME.ink}`, marginBottom: 18 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 18, padding: '11px 16px', borderTop: i === 0 ? 'none' : `1px solid ${THEME.rule}`, background: i % 2 === 0 ? '#fff' : THEME.paper }}>
            <div style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase', color: THEME.accent, paddingTop: 2 }}>{f[0]}</div>
            <div style={{ fontFamily: THEME.sans, fontSize: 13, lineHeight: 1.45, color: THEME.ink, textWrap: 'pretty' }}>{f[1]}</div>
          </div>
        ))}
      </div>

      <a href="/#buy" style={{ background: THEME.ink, color: '#fff', padding: '22px 26px', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, border: `1px solid ${THEME.ink}`, marginTop: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.2, textTransform: 'uppercase', color: THEME.accent }}>One-time · 3+ years access · share with your team</span>
          <span style={{ fontFamily: THEME.sans, fontWeight: 600, fontSize: 28, letterSpacing: -0.5 }}>Buy now — €89 →</span>
        </div>
        <span style={{ fontFamily: THEME.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase', color: '#ccc', textAlign: 'right', lineHeight: 1.5 }}>Paddle checkout<br/>EU VAT included</span>
      </a>

      <div style={{ marginTop: 14, display: 'flex', gap: 18, fontFamily: THEME.mono, fontSize: 10, color: THEME.mute, letterSpacing: 0.15, textTransform: 'uppercase' }}>
        <span>◆ Instant access</span>
        <span>◆ EU VAT included</span>
        <span>◆ 14-day refund</span>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
function Playbook() {
  const isPreview = React.useMemo(() => {
    // TODO: Switch to URL param check once Paddle payment flow is live:
    
    return false; // Open access — no paywall
  }, []);
  const pages = React.useMemo(() => {
    const full = buildPages(BOOK, TOC, LESSONS);
    if (!isPreview) return full;
    // Keep: cover, TOC, Lesson 1 (intro + all section pages), Lesson 2 (intro + all section pages), then paywall.
    const kept = [];
    let lessonsSeen = 0;
    for (const pg of full) {
      if (pg.kind === 'cover' || pg.kind === 'toc') { kept.push(pg); continue; }
      if (pg.kind === 'lessonIntro') {
        if (lessonsSeen >= 2) break;
        lessonsSeen += 1;
        kept.push(pg); continue;
      }
      if (pg.kind === 'lessonSections') {
        // only keep section pages for lessons 1 & 2 (already admitted via intro)
        if (pg.lesson && pg.lesson.n <= 2) kept.push(pg);
        continue;
      }
      // skip colophon etc. in preview
    }
    kept.push({ kind: 'paywall' });
    return kept;
  }, [isPreview]);

  const storageKey = isPreview ? 'textile_preview_page' : 'textile_page';
  const [page, setPage] = useBookNav(pages.length, storageKey);
  const P = pages[page];
  const theme = { ink: THEME.ink, accent: THEME.accent, mono: THEME.mono, nav: THEME.ink };

  // Reset scroll when page changes
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [page]);

  const isScrollable = P.kind === 'lessonSections';

  return (
    <div style={{ width: '100%', height: '100%', background: '#0a0a0a', display: 'flex', alignItems: 'stretch', justifyContent: 'center', fontFamily: THEME.sans }}>
      <div className="book-paper" style={{
        position: 'relative',
        width: 'min(94vw, 920px)',
        height: '100vh',
        maxHeight: '100vh',
        background: THEME.paper,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Chrome lives on top; it's fixed-height 40px */}
        <Chrome page={page} total={pages.length} kind={P.kind} lesson={P.lesson} />

        {/* Content area */}
        {isScrollable ? (
          <div
            ref={scrollRef}
            style={{
              position: 'absolute', top: 40, left: 0, right: 0, bottom: 0,
              overflowY: 'auto', overflowX: 'hidden',
              scrollBehavior: 'smooth',
            }}
          >
            {P.kind === 'lessonSections' && <LessonSectionsPage lesson={P.lesson} sections={P.sections} part={P.part} parts={P.parts} />}
            {/* bottom spacer so PageNav doesn't cover last row */}
            <div style={{ height: 80 }} />
          </div>
        ) : (
          <>
            {P.kind === 'cover' && <CoverPage />}
            {P.kind === 'toc' && <TOCPage />}
            {P.kind === 'lessonIntro' && <LessonIntroPage lesson={P.lesson} />}
            {P.kind === 'colophon' && <ColophonPage />}
            {P.kind === 'paywall' && <PaywallPage />}
          </>
        )}

        {/* Overlays */}
        <ClickZones page={page} total={pages.length} setPage={setPage} />
        <PageNav page={page} total={pages.length} setPage={setPage} theme={{...theme, sans: THEME.sans}} />
        <BookHUD pages={pages} page={page} setPage={setPage} theme={{...theme, sans: THEME.sans}} />
      </div>
    </div>
  );
}

window.Playbook = Playbook;
