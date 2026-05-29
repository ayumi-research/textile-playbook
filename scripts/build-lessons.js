#!/usr/bin/env node
/* ============================================================================
 * build-lessons.js — static pre-render for the Textile Playbook reader.
 *
 * The interactive reader (playbook.html) renders client-side from content.jsx,
 * so it ships an empty shell to crawlers and no-JS clients. This script reads
 * the same data model out of content.jsx and emits real, readable HTML:
 *
 *   website/lessons/1.html … 9.html   — one file per lesson, full text
 *   website/lessons/index.html        — lesson listing
 *   website/sitemap.xml               — sitemap (home, lessons, agents, reader)
 *
 * No build tooling / no dependencies — plain Node, output is served as-is.
 *
 * Run:  node scripts/build-lessons.js
 * ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Paths ───────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'website');
const LESSONS_DIR = path.join(SITE, 'lessons');
const CONTENT_JSX = path.join(SITE, 'content.jsx');

const ORIGIN = 'https://textileplaybook.com';
const TODAY = '2026-05-29';        // sitemap <lastmod> / dateModified
const PUBLISHED = '2026-05-01';    // Article datePublished (book date: May 2026)

// ── Load the data model out of content.jsx ───────────────────────────────────
// content.jsx is plain JS (no JSX): it declares consts and assigns to `window`.
// We run it in a tiny sandbox and read the globals back off our fake `window`.
function loadContent() {
  const code = fs.readFileSync(CONTENT_JSX, 'utf8');
  const win = {};
  // eslint-disable-next-line no-new-func
  new Function('window', code)(win);
  if (!win.LESSONS || !win.BOOK || !win.TOC || !win.TAKEAWAYS) {
    throw new Error('content.jsx did not expose BOOK/TOC/LESSONS/TAKEAWAYS');
  }
  return { BOOK: win.BOOK, TOC: win.TOC, LESSONS: win.LESSONS, TAKEAWAYS: win.TAKEAWAYS };
}

// ── Tiny HTML helpers ─────────────────────────────────────────────────────────
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');
const cell = (v) => Array.isArray(v) ? v.map(esc).join(' — ') : esc(v);

// Trim a string to ~max chars on a word boundary (for meta descriptions).
function clamp(str, max = 155) {
  const s = String(str).replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const i = cut.lastIndexOf(' ');
  return (i > 40 ? cut.slice(0, i) : cut).replace(/[\s,;:.—-]+$/, '') + '…';
}

// ── Reading time ──────────────────────────────────────────────────────────────
// Walk every string in a lesson, count words, divide by 200 wpm.
function countWords(node) {
  if (node == null) return 0;
  if (typeof node === 'string') {
    const t = node.trim();
    return t ? t.split(/\s+/).length : 0;
  }
  if (Array.isArray(node)) return node.reduce((n, x) => n + countWords(x), 0);
  if (typeof node === 'object') return Object.values(node).reduce((n, x) => n + countWords(x), 0);
  return 0;
}
function readingTime(lesson) {
  const words = countWords(lesson);
  return Math.max(1, Math.round(words / 200));
}

// ── Section renderers (mirror playbook.jsx visual structure) ──────────────────
function secHead(kind, title, sub) {
  return `<div class="sechead"><span class="tag">${esc(kind)}</span>`
    + `<div class="sechead-t"><h2>${esc(title)}</h2>`
    + (sub ? `<div class="sechead-sub">${esc(sub)}</div>` : '')
    + `</div></div>`;
}

function renderTable(s, kind = 'table') {
  const head = s.cols.map((c) => `<th>${esc(c)}</th>`).join('');
  const body = s.rows.map((r) =>
    `<tr>${r.map((c) => `<td>${cell(c)}</td>`).join('')}</tr>`).join('');
  return `<section class="sec">${secHead(kind, s.heading, s.sub)}`
    + `<table class="t"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
    + (s.footnote ? `<p class="foot">→ ${esc(s.footnote)}</p>` : '')
    + `</section>`;
}

function renderRule(s) {
  let inner = `<div class="rule-head"><span class="tag">rule</span><strong>${esc(s.heading)}</strong></div>`;
  if (s.body) inner += `<div class="rule-body">${esc(s.body)}</div>`;
  if (s.list) {
    inner += `<dl class="rule-list">` + s.list.map((row) =>
      `<dt>${esc(row[0])}</dt><dd>${esc(row[1])}</dd>`).join('') + `</dl>`;
  }
  return `<section class="sec"><div class="rule-box">${inner}</div></section>`;
}

function renderStory(s) {
  const rows = s.blocks.map((b) =>
    `<div class="kv-row"><div class="kv-k">${esc(b.label)}</div><div class="kv-v">${esc(b.body)}</div></div>`).join('');
  return `<section class="sec">${secHead('case', s.heading)}<div class="box kv">${rows}</div></section>`;
}

function renderBullets(s) {
  const items = s.items.map((it, i) =>
    `<div class="bullet"><div class="bullet-k">${String(i + 1).padStart(2, '0')} · ${esc(it[0])}</div>`
    + `<div class="bullet-v">${esc(it[1])}</div></div>`).join('');
  return `<section class="sec">${secHead('list', s.heading, s.sub)}<div class="box cols2">${items}</div></section>`;
}

function colList(col, accent) {
  const items = col.items.map((it) =>
    `<div class="col-li">→ ${cell(it)}</div>`).join('');
  return `<div class="col"><div class="colhead${accent ? ' accent' : ''}">${esc(col.title)}</div><div class="col-body">${items}</div></div>`;
}

function renderSideBySide(s) {
  let html = `<section class="sec">${secHead('compare', s.heading)}`
    + `<div class="box cols2">${colList(s.a, false)}${colList(s.b, true)}</div>`;
  if (s.script) {
    html += `<div class="script-box"><div class="script-k">Script</div>`
      + `<div class="script-v">${esc(s.script)}</div>`
      + (s.scriptNote ? `<div class="script-note">${esc(s.scriptNote)}</div>` : '') + `</div>`;
  }
  return html + `</section>`;
}

function renderEconomics(s) {
  const cards = s.cards.map((c) => {
    const rows = c.rows.map((r) =>
      `<div class="econ-row"><span class="econ-k">${esc(r[0])}</span><span class="econ-v">${esc(r[1])}</span></div>`).join('');
    return `<div class="econ-card"><div class="econ-title">${esc(c.title)}</div>${rows}`
      + (c.note ? `<div class="econ-note">${esc(c.note)}</div>` : '') + `</div>`;
  }).join('');
  return `<section class="sec">${secHead('math', s.heading)}<div class="econ-grid">${cards}</div>`
    + (s.footer ? `<div class="banner">→ ${esc(s.footer)}</div>` : '') + `</section>`;
}

function renderList(s) {
  const items = s.items.map((it, i) =>
    `<li><span class="li-n">${String(i + 1).padStart(2, '0')}</span><span>${cell(it)}</span></li>`).join('');
  return `<section class="sec">${secHead('list', s.heading)}<ol class="box numlist">${items}</ol>`
    + (s.note ? `<div class="banner dark">▪ ${esc(s.note)}</div>` : '') + `</section>`;
}

function renderThreeCol(s) {
  const cols = s.cols.map((c, i) => {
    const items = c.items.map((it) =>
      `<div class="tc-li"><div class="tc-k">${esc(it[0])}</div><div class="tc-v">${esc(it[1])}</div></div>`).join('');
    return `<div class="col"><div class="colhead${i === 1 ? ' accent' : ''}">${esc(c.title)}</div><div class="col-body">${items}</div></div>`;
  }).join('');
  return `<section class="sec">${secHead('technique', s.heading)}<div class="box cols3">${cols}</div>`
    + (s.footnote ? `<p class="foot">→ ${esc(s.footnote)}</p>` : '') + `</section>`;
}

function renderPara(s) {
  return `<section class="sec">${secHead('note', s.heading)}<p class="para">${esc(s.body)}</p></section>`;
}

function renderCompare(s) {
  const col = (c, accent) => {
    const stats = c.stats.map((st) =>
      `<div class="cmp-stat"><span>${esc(st[0])}</span><span>${esc(st[1])}</span></div>`).join('');
    return `<div class="col${accent ? ' soft' : ''}"><div class="colhead${accent ? ' accent' : ''}">${esc(c.label)}</div>`
      + `<div class="col-body"><div class="cmp-title">${esc(c.title)}</div>${stats}</div></div>`;
  };
  return `<section class="sec">${secHead('example', s.heading)}`
    + `<div class="box cols2">${col(s.a, false)}${col(s.b, true)}</div>`
    + (s.footer ? `<div class="banner dark">${esc(s.footer)}</div>` : '') + `</section>`;
}

function renderAsks(s) {
  const items = s.items.map((q, i) =>
    `<div class="ask"><span class="ask-n">Q${String(i + 1).padStart(2, '0')}</span>“${esc(q)}”</div>`).join('');
  return `<section class="sec">${secHead('scripts', s.heading)}<div class="box">${items}</div>`
    + (s.redflag ? `<div class="redflag"><div class="redflag-k">▲ Red flag</div><div>${esc(s.redflag)}</div></div>` : '')
    + `</section>`;
}

function renderQuestions(s) {
  const items = s.items.map((q, i) => {
    const levels = q.levels.map((lv, j) =>
      `<div class="qlevel qlevel-${j}"><div class="qlevel-k">${esc(lv[0])}</div><div>${esc(lv[1])}</div></div>`).join('');
    return `<div class="qcard"><div class="qhead"><span class="tag">Q${i + 1}</span><span>${esc(q.q)}</span></div>`
      + `<div class="qlevels">${levels}</div>`
      + (q.gap ? `<div class="qgap">→ ${esc(q.gap)}</div>` : '') + `</div>`;
  }).join('');
  return `<section class="sec">${secHead('interview', s.heading)}${items}</section>`;
}

function renderRubric(s) {
  const head = s.cols.map((c) => `<th>${esc(c)}</th>`).join('');
  const body = s.rows.map((r) =>
    `<tr>${r.map((c, j) => `<td${j === 1 ? ' class="hl"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('');
  let html = `<section class="sec">${secHead('rubric', s.heading)}`
    + `<table class="t"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  if (s.scores) {
    html += `<div class="box cols3 scores">` + s.scores.map((sc, i) =>
      `<div class="score score-${i}"><div class="score-n">${esc(sc[0])}</div><div>${esc(sc[1])}</div></div>`).join('') + `</div>`;
  }
  return html + `</section>`;
}

function renderTraps(s) {
  const items = s.items.map((t) => {
    let body = '';
    if (t.pitch) body += `<div class="trap-pitch">Pitch: ${esc(t.pitch)}</div>`;
    if (t.reality) {
      body += `<div class="trap-reality">` + t.reality.map((r) =>
        `<div class="trap-r"><span class="trap-r-k">${esc(r[0])}</span><span>${esc(r[1])}</span></div>`).join('') + `</div>`;
    }
    if (t.math) body += t.math.map((m) =>
      `<div class="trap-math"><span class="trap-math-k">${esc(m[0])}</span>${esc(m[1])}</div>`).join('');
    if (t.actual) body += `<div class="trap-actual">${esc(t.actual)}</div>`;
    if (t.hidden) body += `<div class="trap-hidden">${esc(t.hidden)}</div>`;
    body += `<div class="trap-rule"><span class="trap-rule-k">Rule</span>${esc(t.rule)}</div>`;
    return `<div class="trap"><div class="trap-head"><div class="trap-n">${esc(t.n)}</div>`
      + `<div class="trap-title"><strong>${esc(t.title)}</strong><span>${esc(t.sub)}</span></div></div>`
      + `<div class="trap-body">${body}</div></div>`;
  }).join('');
  return `<section class="sec">${secHead('traps', s.heading)}${items}</section>`;
}

function renderChecklist(s) {
  const items = s.items.map((it) =>
    `<div class="check"><span class="check-box"></span><div><div class="check-t">${esc(it[0])}</div>`
    + `<div class="check-d">${esc(it[1])}</div></div></div>`).join('');
  return `<section class="sec">${secHead('checklist', s.heading, s.sub)}<div class="box cols2">${items}</div>`
    + (s.note ? `<div class="banner accent">▪ ${esc(s.note)}</div>` : '') + `</section>`;
}

function renderScript(s) {
  const rows = [['Client', s.client], ['Means', s.translation], ['You say', s.response], ['Frame', s.frame]]
    .filter((r) => r[1]).map((r, i) =>
      `<div class="kv-row${i === 2 ? ' hl' : ''}"><div class="kv-k">${esc(r[0])}</div><div class="kv-v">${esc(r[1])}</div></div>`).join('');
  return `<section class="sec">${secHead('script', s.heading)}<div class="box kv">${rows}</div></section>`;
}

function renderTimeline(s) {
  const rows = s.items.map((it, i) =>
    `<div class="tl-row"><div class="tl-lvl tl-lvl-${i}">${esc(it.level)}</div>`
    + `<div class="tl-phrase">${esc(it.phrase)}</div><div class="tl-mean">${esc(it.meaning)}</div></div>`).join('');
  return `<section class="sec">${secHead('signals', s.heading)}<div class="box tl">${rows}</div></section>`;
}

function renderBuffer(s) {
  const rows = s.rows.map((r) =>
    `<div class="kv-row"><div class="kv-k">${esc(r[0])}</div><div class="kv-v">${esc(r[1])}</div></div>`).join('');
  return `<section class="sec">${secHead('buffer', s.heading)}<div class="box kv">${rows}</div>`
    + (s.footer ? `<div class="banner accent">→ ${esc(s.footer)}</div>` : '') + `</section>`;
}

function renderHours(s) {
  const rows = s.rows.map((r) =>
    `<div class="kv-row"><div class="kv-k accent">${esc(r[0])}</div><div class="kv-v">${esc(r[1])}</div></div>`).join('');
  return `<section class="sec">${secHead('48h', s.heading)}<div class="box kv">${rows}</div>`
    + (s.footer ? `<div class="banner dark">▪ ${esc(s.footer)}</div>` : '') + `</section>`;
}

function renderExample(s) {
  const lines = s.lines.map((l) =>
    `<tr><td>${esc(l[0])}</td><td class="num">${esc(l[1])}</td><td class="note">${esc(l[2])}</td></tr>`).join('');
  const total = `<tr class="total"><td>${esc(s.total[0])}</td><td class="num">${esc(s.total[1])}</td><td>${esc(s.total[2])}</td></tr>`;
  const trap = s.trap.map((t, i) =>
    `<div class="col${i === 1 ? ' soft' : ''}"><div class="colhead${i === 1 ? ' accent' : ''}">Supplier ${esc(t[0])}</div>`
    + `<div class="col-body"><div class="ex-amt">${esc(t[1])}</div><div class="ex-note">${esc(t[2])}</div></div></div>`).join('');
  return `<section class="sec">${secHead('calc', s.heading)}`
    + `<table class="t"><thead><tr><th>Line item</th><th class="num">Amount</th><th>Note</th></tr></thead>`
    + `<tbody>${lines}${total}</tbody></table>`
    + `<p class="foot">→ The comparison trap</p>`
    + `<div class="box cols3">${trap}</div></section>`;
}

const RENDERERS = {
  table: renderTable, rule: renderRule, story: renderStory, bullets: renderBullets,
  sidebyside: renderSideBySide, economics: renderEconomics, list: renderList,
  threecol: renderThreeCol, paragraph: renderPara, compare: renderCompare,
  asks: renderAsks, questions: renderQuestions, rubric: renderRubric, traps: renderTraps,
  checklist: renderChecklist, script: renderScript, timeline: renderTimeline,
  buffer: renderBuffer, hours: renderHours, example: renderExample,
};

function renderSection(s) {
  const fn = RENDERERS[s.kind];
  if (!fn) {
    console.warn(`  ! unknown section kind: ${s.kind}`);
    return '';
  }
  return fn(s);
}

// ── Shared stylesheet (one string, inlined into every page) ───────────────────
const STYLE = `
  :root{
    --paper:#fafaf7;--paper-alt:#f3f3ee;--ink:#0a0a0a;--ink2:#1c1c1c;--mute:#707070;
    --rule:#d4d4d0;--accent:#1a4eff;--accent-soft:#e6ecff;
    --sans:'Space Grotesk',system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,monospace;
  }
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;background:var(--paper);color:var(--ink);font-family:var(--sans);
    -webkit-font-smoothing:antialiased;}
  a{color:inherit;}
  .wrap{max-width:880px;margin:0 auto;padding:0 24px;}

  /* Top bar */
  .topbar{display:grid;grid-template-columns:1fr auto;border-bottom:1px solid var(--ink);
    font-family:var(--mono);font-size:10.5px;letter-spacing:.1px;text-transform:uppercase;
    background:var(--paper);position:sticky;top:0;z-index:50;}
  .topbar>div{padding:12px 24px;display:flex;align-items:center;gap:8px;}
  .topbar>div+div{border-left:1px solid var(--ink);}
  .topbar a{text-decoration:none;color:var(--ink);}
  .topbar a:hover{color:var(--accent);}
  .topbar .dot{width:8px;height:8px;background:var(--accent);border-radius:50%;display:inline-block;}

  /* Lesson hero */
  .lhero{background:var(--ink);color:#fff;border-bottom:4px solid var(--accent);}
  .lhero-in{max-width:880px;margin:0 auto;padding:34px 24px;display:flex;gap:22px;align-items:center;}
  .lhero-n{font-family:var(--mono);font-size:84px;font-weight:700;color:var(--accent);line-height:.9;letter-spacing:-4px;}
  .lhero-k{font-family:var(--mono);font-size:11px;letter-spacing:.2px;text-transform:uppercase;color:#aaa;margin-bottom:4px;}
  .lhero h1{font-size:clamp(26px,4.4vw,34px);font-weight:600;line-height:1.05;letter-spacing:-.7px;margin:0;}

  /* Meta (summary / saves / bottom line / reading time) */
  .meta{padding:30px 0 8px;}
  .meta-row{display:grid;grid-template-columns:130px 1fr;gap:16px;border-top:1px solid var(--ink);padding:14px 0;}
  .meta-k{font-family:var(--mono);font-size:10px;letter-spacing:.2px;text-transform:uppercase;color:var(--accent);}
  .meta .summary{font-size:16px;font-weight:500;line-height:1.5;}
  .meta .saves{font-size:13.5px;line-height:1.55;color:var(--mute);}
  .bottomline{background:var(--ink);color:#fff;padding:14px 18px;display:grid;grid-template-columns:130px 1fr;gap:16px;margin-top:6px;}
  .bottomline .meta-k{color:var(--accent);}
  .bottomline .bl-v{font-size:15px;font-weight:500;line-height:1.4;}
  .rt{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px;
    letter-spacing:.15px;text-transform:uppercase;color:var(--mute);margin-top:18px;}
  .rt span{padding:3px 8px;border:1px solid var(--rule);}

  /* Section scaffolding */
  .body{padding:18px 0 10px;}
  .sec{margin-bottom:26px;}
  .sechead{display:flex;gap:10px;align-items:baseline;border-top:2px solid var(--ink);padding-top:10px;margin-bottom:14px;}
  .sechead-t{flex:1;}
  .sechead h2{font-size:20px;font-weight:600;letter-spacing:-.3px;line-height:1.15;margin:0;}
  .sechead-sub{font-family:var(--mono);font-size:10px;color:var(--mute);letter-spacing:.1px;margin-top:2px;}
  .tag{display:inline-block;padding:3px 8px;background:var(--accent);color:#fff;font-family:var(--mono);
    font-size:9px;letter-spacing:.15px;text-transform:uppercase;font-weight:500;white-space:nowrap;}
  .box{border:1px solid var(--ink);background:#fff;}
  .foot{margin:8px 0 0;font-family:var(--mono);font-size:10px;color:var(--mute);line-height:1.5;}
  .banner{margin-top:10px;padding:9px 12px;background:var(--accent);color:#fff;font-size:13px;font-weight:500;text-align:center;}
  .banner.dark{background:var(--ink);}
  .banner.accent{background:var(--accent);}
  .para{font-size:13.5px;line-height:1.6;margin:0;padding:2px 0;}

  /* Tables */
  table.t{width:100%;border-collapse:collapse;border:1px solid var(--ink);}
  table.t thead th{background:var(--ink);color:#fff;font-family:var(--mono);font-size:9.5px;letter-spacing:.15px;
    text-transform:uppercase;font-weight:500;text-align:left;padding:6px 10px;border-right:1px solid #555;}
  table.t thead th:last-child{border-right:none;}
  table.t td{padding:9px 10px;border-top:1px solid var(--rule);border-right:1px solid var(--rule);
    font-size:11.5px;line-height:1.45;vertical-align:top;}
  table.t td:last-child{border-right:none;}
  table.t tbody tr:nth-child(even){background:var(--paper);}
  table.t td:first-child{font-weight:600;font-size:12px;}
  table.t td.num{font-family:var(--mono);text-align:right;font-weight:500;}
  table.t th.num{text-align:right;}
  table.t td.note{font-family:var(--mono);font-size:10.5px;color:var(--mute);}
  table.t td.hl{background:var(--accent-soft);}
  table.t tr.total td{background:var(--accent);color:#fff;font-weight:600;font-size:13px;border-right-color:rgba(255,255,255,.25);}
  table.t tr.total td.num{font-size:14px;}

  /* Rule */
  .rule-box{background:var(--ink);color:#fff;padding:16px;}
  .rule-head{display:flex;gap:8px;align-items:baseline;margin-bottom:10px;}
  .rule-head strong{font-size:18px;font-weight:600;letter-spacing:-.2px;}
  .rule-body{color:var(--accent);font-size:14px;font-weight:500;margin-bottom:12px;}
  .rule-list{display:grid;grid-template-columns:160px 1fr;gap:8px 16px;margin:0;}
  .rule-list dt{font-family:var(--mono);font-size:10px;letter-spacing:.15px;text-transform:uppercase;color:var(--accent);}
  .rule-list dd{margin:0;font-size:12.5px;line-height:1.45;color:#eee;}

  /* Key/value rows (story, script, buffer, hours) */
  .kv .kv-row{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid var(--rule);}
  .kv .kv-row:last-child{border-bottom:none;}
  .kv-k{padding:10px 12px;background:var(--ink);color:#fff;font-family:var(--mono);font-size:10px;
    letter-spacing:.15px;text-transform:uppercase;}
  .kv-k.accent{background:var(--accent);}
  .kv-v{padding:10px 12px;font-size:12.5px;line-height:1.5;}
  .kv .kv-row.hl .kv-v{background:var(--accent-soft);}

  /* Columns (cols2/cols3) */
  .cols2{display:grid;grid-template-columns:1fr 1fr;}
  .cols3{display:grid;grid-template-columns:repeat(3,1fr);}
  .cols2>.col,.cols2>.bullet,.cols2>.check{border-right:1px solid var(--rule);}
  .cols2>*:nth-child(2n){border-right:none;}
  .cols3>.col{border-right:1px solid var(--ink);}
  .cols3>.col:last-child{border-right:none;}
  .col.soft{background:var(--accent-soft);}
  .colhead{padding:8px 12px;background:var(--ink);color:#fff;font-family:var(--mono);font-size:10px;
    letter-spacing:.15px;text-transform:uppercase;}
  .colhead.accent{background:var(--accent);}
  .col-body{padding:12px;}
  .col-li{font-size:12px;line-height:1.5;padding:5px 0;border-bottom:1px solid var(--rule);}
  .col-li:last-child{border-bottom:none;}

  /* Bullets */
  .bullet{padding:10px 12px;border-bottom:1px solid var(--rule);}
  .cols2>.bullet:nth-last-child(-n+2){border-bottom:none;}
  .bullet-k{font-family:var(--mono);font-size:9.5px;letter-spacing:.15px;text-transform:uppercase;color:var(--accent);margin-bottom:3px;}
  .bullet-v{font-size:12px;line-height:1.4;}

  /* Numbered list */
  ol.numlist{list-style:none;margin:0;padding:0;}
  ol.numlist li{display:flex;gap:10px;padding:8px 12px;border-bottom:1px solid var(--rule);font-size:12px;line-height:1.5;}
  ol.numlist li:last-child{border-bottom:none;}
  ol.numlist li:nth-child(even){background:var(--paper);}
  .li-n{font-family:var(--mono);font-size:10px;color:var(--accent);font-weight:500;flex-shrink:0;width:20px;}

  /* Three-col items */
  .tc-li{margin-bottom:8px;padding-bottom:8px;border-bottom:1px dotted var(--rule);}
  .tc-li:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}
  .tc-k{font-family:var(--mono);font-size:9.5px;letter-spacing:.12px;text-transform:uppercase;color:var(--accent);margin-bottom:2px;}
  .tc-v{font-size:11.5px;line-height:1.45;}

  /* Economics */
  .econ-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .econ-card{border:1px solid var(--ink);background:#fff;}
  .econ-title{padding:8px 12px;border-bottom:1px solid var(--ink);font-weight:600;font-size:13px;}
  .econ-row{display:flex;justify-content:space-between;padding:6px 12px;border-bottom:1px solid var(--rule);}
  .econ-k{font-family:var(--mono);font-size:10px;color:var(--mute);text-transform:uppercase;}
  .econ-v{font-family:var(--mono);font-size:12px;font-weight:500;}
  .econ-note{padding:8px 12px;background:var(--accent-soft);font-size:11px;line-height:1.4;}

  /* Compare */
  .cmp-title{font-size:13px;font-weight:500;margin-bottom:10px;line-height:1.35;}
  .cmp-stat{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dotted var(--rule);
    font-family:var(--mono);font-size:11px;}
  .cmp-stat:last-child{border-bottom:none;}
  .cmp-stat span:first-child{color:var(--mute);}

  /* Asks */
  .ask{padding:10px 12px;border-bottom:1px solid var(--rule);font-size:13px;line-height:1.5;}
  .ask:last-child{border-bottom:none;}
  .ask-n{font-family:var(--mono);font-size:10px;color:var(--accent);margin-right:8px;}
  .redflag{margin-top:10px;padding:12px;background:var(--ink);color:#fff;}
  .redflag-k{font-family:var(--mono);font-size:9.5px;letter-spacing:.15px;text-transform:uppercase;color:var(--accent);margin-bottom:4px;}
  .redflag div:last-child{font-size:12px;line-height:1.45;}

  /* Questions */
  .qcard{border:1px solid var(--ink);margin-bottom:10px;}
  .qhead{padding:8px 12px;background:var(--ink);color:#fff;display:flex;gap:10px;align-items:baseline;font-size:12.5px;line-height:1.4;}
  .qlevels{display:grid;grid-template-columns:repeat(3,1fr);}
  .qlevel{padding:10px;border-right:1px solid var(--rule);font-size:11px;line-height:1.4;}
  .qlevel:last-child{border-right:none;}
  .qlevel-0{background:var(--accent-soft);}
  .qlevel-2{background:var(--paper);}
  .qlevel-k{font-family:var(--mono);font-size:9.5px;letter-spacing:.15px;text-transform:uppercase;font-weight:500;margin-bottom:4px;}
  .qlevel-0 .qlevel-k{color:var(--accent);}
  .qlevel-1 .qlevel-k{color:var(--mute);}
  .qgap{padding:6px 12px;background:var(--paper);border-top:1px solid var(--rule);font-family:var(--mono);font-size:10px;color:var(--mute);line-height:1.5;}

  /* Rubric scores */
  .scores{margin-top:10px;}
  .score{padding:10px;border-right:1px solid var(--rule);}
  .score:last-child{border-right:none;}
  .score-0{background:var(--accent);color:#fff;}
  .score-1{background:var(--accent-soft);}
  .score-2{background:var(--paper);}
  .score-n{font-family:var(--mono);font-size:14px;font-weight:600;}
  .score div:last-child{font-size:11px;margin-top:2px;}

  /* Traps */
  .trap{border:1px solid var(--ink);margin-bottom:10px;background:#fff;}
  .trap-head{display:grid;grid-template-columns:50px 1fr;background:var(--ink);color:#fff;}
  .trap-n{padding:8px 10px;background:var(--accent);font-family:var(--mono);font-size:16px;font-weight:700;text-align:center;display:flex;align-items:center;justify-content:center;}
  .trap-title{padding:8px 12px;}
  .trap-title strong{font-size:13.5px;font-weight:600;display:block;line-height:1.2;}
  .trap-title span{font-family:var(--mono);font-size:9.5px;letter-spacing:.15px;text-transform:uppercase;color:var(--accent);}
  .trap-body{padding:12px;}
  .trap-pitch{font-size:12px;font-style:italic;color:var(--mute);margin-bottom:8px;}
  .trap-reality{border:1px solid var(--rule);margin-bottom:8px;}
  .trap-r{display:grid;grid-template-columns:60px 1fr;border-bottom:1px solid var(--rule);}
  .trap-r:last-child{border-bottom:none;}
  .trap-r-k{padding:5px 8px;background:var(--accent);color:#fff;font-family:var(--mono);font-size:11px;font-weight:600;}
  .trap-r span:last-child{padding:5px 10px;font-size:11.5px;}
  .trap-math{font-family:var(--mono);font-size:11px;margin-bottom:4px;}
  .trap-math-k{color:var(--accent);font-weight:600;margin-right:8px;}
  .trap-actual{font-family:var(--mono);font-size:10.5px;line-height:1.5;background:var(--paper);padding:8px;margin-bottom:6px;}
  .trap-hidden{font-size:11.5px;line-height:1.5;margin-bottom:6px;}
  .trap-rule{background:var(--ink);color:#fff;padding:6px 10px;font-size:12px;font-weight:500;}
  .trap-rule-k{color:var(--accent);font-family:var(--mono);font-size:10px;margin-right:8px;letter-spacing:.15px;text-transform:uppercase;}

  /* Checklist */
  .check{padding:10px;border-bottom:1px solid var(--rule);display:flex;gap:10px;}
  .cols2>.check:nth-last-child(-n+2){border-bottom:none;}
  .check-box{width:14px;height:14px;border:1.5px solid var(--ink);background:var(--accent);flex-shrink:0;margin-top:2px;}
  .check-t{font-size:12px;font-weight:600;}
  .check-d{font-size:11px;color:var(--mute);line-height:1.4;}

  /* Timeline */
  .tl-row{display:grid;grid-template-columns:130px 1fr 1.2fr;border-bottom:1px solid var(--rule);}
  .tl-row:last-child{border-bottom:none;}
  .tl-lvl{padding:8px 12px;color:#fff;font-family:var(--mono);font-size:10px;letter-spacing:.15px;text-transform:uppercase;font-weight:500;}
  .tl-lvl-0{background:#b00020;}.tl-lvl-1{background:#d97706;}.tl-lvl-2{background:var(--accent);}
  .tl-phrase{padding:8px 12px;font-size:12.5px;font-weight:500;border-right:1px solid var(--rule);}
  .tl-mean{padding:8px 12px;font-size:11.5px;color:var(--mute);line-height:1.4;}

  /* Example trap amounts */
  .ex-amt{font-family:var(--mono);font-size:16px;font-weight:600;margin-bottom:4px;}
  .col.soft .ex-amt{color:var(--accent);}
  .ex-note{font-size:11px;color:var(--mute);line-height:1.4;}

  /* Script */
  .script-box{margin-top:10px;padding:12px;background:var(--accent-soft);border-left:3px solid var(--accent);}
  .script-k{font-family:var(--mono);font-size:9.5px;letter-spacing:.15px;text-transform:uppercase;color:var(--accent);margin-bottom:4px;}
  .script-v{font-size:13px;line-height:1.45;}
  .script-note{margin-top:4px;font-family:var(--mono);font-size:10px;color:var(--mute);}

  /* Prev / next + reader CTA */
  .lnav{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--ink);margin:30px 0;}
  .lnav a{padding:16px 18px;text-decoration:none;display:flex;flex-direction:column;gap:4px;background:#fff;transition:background .12s ease;}
  .lnav a:hover{background:var(--accent-soft);}
  .lnav a.next{text-align:right;border-left:1px solid var(--ink);}
  .lnav-k{font-family:var(--mono);font-size:9.5px;letter-spacing:.15px;text-transform:uppercase;color:var(--accent);}
  .lnav-t{font-size:13px;font-weight:600;line-height:1.25;}
  .reader-cta{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;
    background:var(--ink);color:#fff;padding:18px 22px;margin:30px 0;text-decoration:none;}
  .reader-cta:hover{background:var(--ink2);}
  .reader-cta .k{font-family:var(--mono);font-size:10px;letter-spacing:.15px;text-transform:uppercase;color:var(--accent);}
  .reader-cta .t{font-size:18px;font-weight:600;letter-spacing:-.3px;}

  /* Index page */
  .ix-hero{padding:48px 0 36px;}
  .ix-hero h1{font-size:clamp(40px,7vw,72px);font-weight:700;letter-spacing:-2.5px;line-height:.9;margin:0 0 16px;}
  .ix-hero h1 .p{color:var(--accent);}
  .ix-hero p{font-size:17px;line-height:1.5;color:var(--ink2);max-width:620px;margin:0;}
  .ix-list{border-top:1px solid var(--ink);border-left:1px solid var(--ink);margin-bottom:30px;}
  .ix-item{display:grid;grid-template-columns:64px 1fr auto;border-right:1px solid var(--ink);border-bottom:1px solid var(--ink);
    text-decoration:none;background:#fff;transition:background .12s ease;}
  .ix-item:hover{background:var(--accent-soft);}
  .ix-n{padding:18px;font-family:var(--mono);font-size:15px;font-weight:600;color:var(--accent);border-right:1px solid var(--rule);}
  .ix-main{padding:16px 18px;}
  .ix-t{font-size:17px;font-weight:600;letter-spacing:-.3px;line-height:1.2;margin-bottom:4px;}
  .ix-l{font-size:12.5px;color:var(--mute);line-height:1.45;}
  .ix-arr{padding:18px;display:flex;align-items:center;font-family:var(--mono);font-size:11px;color:var(--accent);text-transform:uppercase;}

  /* Footer */
  .foot-bar{border-top:1px solid var(--ink);font-family:var(--mono);font-size:10px;letter-spacing:.15px;
    text-transform:uppercase;color:var(--ink);display:grid;grid-template-columns:repeat(3,1fr);}
  .foot-bar>div{padding:16px 24px;border-right:1px solid var(--ink);}
  .foot-bar>div:last-child{border-right:none;text-align:right;}
  .foot-bar a{text-decoration:none;}
  .foot-bar a:hover{color:var(--accent);}
  .foot-bar .lic{color:var(--accent);}

  @media (max-width:640px){
    .cols2,.cols3,.econ-grid,.qlevels,.lnav,.ix-item,.foot-bar,.tl-row{grid-template-columns:1fr;}
    .cols2>*,.cols3>.col{border-right:none;}
    .lnav a.next{text-align:left;border-left:none;border-top:1px solid var(--ink);}
    .tl-phrase{border-right:none;}
    .meta-row,.bottomline,.kv .kv-row,.rule-list,.trap-head,.trap-r,.ix-item{grid-template-columns:1fr;}
    .lhero-n{font-size:64px;}
    .foot-bar>div{border-right:none;border-bottom:1px solid var(--ink);text-align:left;}
  }
`;

// ── Page templates ────────────────────────────────────────────────────────────
function pageHead({ title, description, canonical, jsonld }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${escAttr(description)}">
<link rel="canonical" href="${escAttr(canonical)}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" href="/favicon.ico">
<meta property="og:type" content="article">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(description)}">
<meta property="og:url" content="${escAttr(canonical)}">
<meta property="og:site_name" content="The Textile Playbook">
<meta property="og:image" content="${ORIGIN}/favicon.svg">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escAttr(title)}">
<meta name="twitter:description" content="${escAttr(description)}">
<link rel="stylesheet" href="/fonts/local-fonts.css">
<style>${STYLE}</style>
${jsonld ? `<script type="application/ld+json">\n${JSON.stringify(jsonld, null, 2)}\n</script>` : ''}
</head>`;
}

function topbar() {
  return `<div class="topbar">
  <div><span class="dot"></span> textileplaybook.com / <a href="/">home</a> · <a href="/lessons/">lessons</a></div>
  <div><a href="/agents.html">For AI agents →</a></div>
</div>`;
}

function footerBar() {
  return `<footer class="foot-bar">
  <div><a href="/">textileplaybook.com</a></div>
  <div class="lic"><a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="license">◆ CC BY-SA 4.0</a></div>
  <div><a href="/impressum.html">Imprint</a> · <a href="/privacy-policy.html">Privacy</a></div>
</footer>`;
}

function lessonPage(lesson, takeaway, prev, next) {
  const n = lesson.n;
  const title = `Lesson ${n}: ${lesson.title} — The Textile Playbook`;
  const description = clamp(lesson.summary);
  const canonical = `${ORIGIN}/lessons/${n}.html`;
  const rt = readingTime(lesson);

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: lesson.title,
    headline: `Lesson ${n}: ${lesson.title}`,
    description: clamp(lesson.summary, 300),
    url: canonical,
    datePublished: PUBLISHED,
    dateModified: TODAY,
    inLanguage: 'en',
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    isAccessibleForFree: true,
    author: { '@type': 'Organization', name: 'The Textile Playbook' },
    publisher: { '@type': 'Organization', name: 'The Textile Playbook' },
    isPartOf: { '@type': 'Book', name: 'The Textile Playbook', url: `${ORIGIN}/` },
  };

  const sections = lesson.sections.map(renderSection).join('\n');

  const prevLink = prev
    ? `<a class="prev" href="/lessons/${prev.n}.html"><span class="lnav-k">← Lesson ${prev.n}</span><span class="lnav-t">${esc(prev.title)}</span></a>`
    : `<a class="prev" href="/lessons/"><span class="lnav-k">← Index</span><span class="lnav-t">All nine lessons</span></a>`;
  const nextLink = next
    ? `<a class="next" href="/lessons/${next.n}.html"><span class="lnav-k">Lesson ${next.n} →</span><span class="lnav-t">${esc(next.title)}</span></a>`
    : `<a class="next" href="/lessons/"><span class="lnav-k">Index →</span><span class="lnav-t">All nine lessons</span></a>`;

  return `${pageHead({ title, description, canonical, jsonld })}
<body>
${topbar()}
<header class="lhero">
  <div class="lhero-in">
    <div class="lhero-n">${String(n).padStart(2, '0')}</div>
    <div>
      <div class="lhero-k">Lesson ${n} of 9 · The Textile Playbook</div>
      <h1>${esc(lesson.title)}</h1>
    </div>
  </div>
</header>
<main class="wrap">
  <div class="meta">
    <div class="meta-row"><div class="meta-k">Quick summary</div><div class="summary">${esc(lesson.summary)}</div></div>
    <div class="meta-row"><div class="meta-k">Why it saves</div><div class="saves">${esc(lesson.saves)}</div></div>
    ${takeaway ? `<div class="bottomline"><div class="meta-k">Bottom line</div><div class="bl-v">${esc(takeaway)}</div></div>` : ''}
    <div class="rt"><span>≈ ${rt} min read</span></div>
  </div>

  <a class="reader-cta" href="/playbook.html" onclick="try{localStorage.setItem('textile_page',String(${2 + (n - 1) * 2}))}catch(e){}">
    <span><span class="k">Prefer the paged experience?</span><br><span class="t">Open in interactive reader →</span></span>
    <span class="k">Keyboard nav · jump menu</span>
  </a>

  <div class="body">
${sections}
  </div>

  <nav class="lnav">
    ${prevLink}
    ${nextLink}
  </nav>
</main>
${footerBar()}
</body>
</html>
`;
}

function indexPage(lessons, toc, takeaways) {
  const title = 'All nine lessons — The Textile Playbook';
  const description = 'The complete Textile Playbook: nine lessons on techniques, pricing, suppliers, timelines, prototypes, and crisis playbooks for buying branded apparel in the EU.';
  const canonical = `${ORIGIN}/lessons/`;

  const tocByN = Object.fromEntries(toc.map((t) => [t.n, t]));

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'The Textile Playbook — Lessons',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: lessons.length,
    itemListElement: lessons.map((L) => ({
      '@type': 'ListItem',
      position: L.n,
      url: `${ORIGIN}/lessons/${L.n}.html`,
      name: L.title,
    })),
  };

  const items = lessons.map((L) => {
    const learn = (tocByN[L.n] && tocByN[L.n].l) || '';
    const take = takeaways[L.n] || learn;
    return `<a class="ix-item" href="/lessons/${L.n}.html">
      <div class="ix-n">${String(L.n).padStart(2, '0')}</div>
      <div class="ix-main"><div class="ix-t">${esc(L.title)}</div><div class="ix-l">${esc(take)}</div></div>
      <div class="ix-arr">Read →</div>
    </a>`;
  }).join('\n');

  return `${pageHead({ title, description, canonical, jsonld })}
<body>
${topbar()}
<main class="wrap">
  <div class="ix-hero">
    <h1>The nine lessons<span class="p">.</span></h1>
    <p>How marketing agencies buy branded apparel in the EU without losing their minds — techniques, pricing, suppliers, timelines, and what to do when it goes wrong. Free, CC BY-SA 4.0.</p>
  </div>
  <div class="ix-list">
${items}
  </div>
  <a class="reader-cta" href="/playbook.html">
    <span><span class="k">Prefer the paged experience?</span><br><span class="t">Open the interactive reader →</span></span>
    <span class="k">Cover · contents · all lessons</span>
  </a>
</main>
${footerBar()}
</body>
</html>
`;
}

// ── Sitemap ───────────────────────────────────────────────────────────────────
function sitemap(lessons) {
  const urls = [
    { loc: `${ORIGIN}/`, pri: '1.0' },
    { loc: `${ORIGIN}/lessons/`, pri: '0.9' },
    ...lessons.map((L) => ({ loc: `${ORIGIN}/lessons/${L.n}.html`, pri: '0.8' })),
    { loc: `${ORIGIN}/playbook.html`, pri: '0.6' },
    { loc: `${ORIGIN}/agents.html`, pri: '0.5' },
  ];
  const body = urls.map((u) =>
    `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>${u.pri}</priority>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// ── Main ───────────────────────────────────────────────────────────────────────
function main() {
  const { BOOK, TOC, LESSONS, TAKEAWAYS } = loadContent();
  fs.mkdirSync(LESSONS_DIR, { recursive: true });

  LESSONS.forEach((lesson, i) => {
    const prev = i > 0 ? LESSONS[i - 1] : null;
    const next = i < LESSONS.length - 1 ? LESSONS[i + 1] : null;
    const html = lessonPage(lesson, TAKEAWAYS[lesson.n], prev, next);
    const out = path.join(LESSONS_DIR, `${lesson.n}.html`);
    fs.writeFileSync(out, html);
    console.log(`  ✓ lessons/${lesson.n}.html  (${(html.length / 1024).toFixed(1)} KB, ≈${readingTime(lesson)} min)`);
  });

  fs.writeFileSync(path.join(LESSONS_DIR, 'index.html'), indexPage(LESSONS, TOC, TAKEAWAYS));
  console.log('  ✓ lessons/index.html');

  fs.writeFileSync(path.join(SITE, 'sitemap.xml'), sitemap(LESSONS));
  console.log('  ✓ sitemap.xml');

  console.log(`\nDone — ${LESSONS.length} lessons + index + sitemap (${BOOK.title}).`);
}

main();
