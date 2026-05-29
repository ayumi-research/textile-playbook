// Usability overlay for the playbook reader — adds:
//  1) Jump-to-lesson menu (top-right, always visible)
//  2) Keyboard hint pill (bottom, fades after 3s)
//  3) Progress bar (top, always visible)
//  4) Print-friendly styles injected once
//
// Consumes: useBookNav pages, buildPages pages array.
// Exposes: <BookHUD pages, page, setPage, theme />

(function() {
  // Inject print stylesheet once
  if (typeof document !== 'undefined' && !document.getElementById('book-print-style')) {
    const s = document.createElement('style');
    s.id = 'book-print-style';
    s.textContent = `
      @media print {
        html, body { background: #fff !important; }
        .book-hud, .book-clickzone, .book-pagenav { display: none !important; }
        .book-paper { box-shadow: none !important; width: 100% !important; height: auto !important; aspect-ratio: unset !important; page-break-after: always; }
      }
    `;
    document.head.appendChild(s);
  }
})();

// Dark mode: the reader is fully inline-styled from a single THEME constant
// where `ink` doubles as both text color and the fill of solid black blocks,
// so a plain variable swap can't work. Inverting the paper card recolors every
// element at once, keeps contrast intact, and (with hue-rotate) preserves the
// blue accent. Paper cream → near-black, white text on black blocks → dark text
// on light blocks. Target dark palette per spec (ink #e8e8e3 / paper #141414).
(function() {
  if (typeof document !== 'undefined' && !document.getElementById('book-dark-style')) {
    const s = document.createElement('style');
    s.id = 'book-dark-style';
    s.textContent = `
      .book-paper.book-dark { filter: invert(1) hue-rotate(180deg); }
      .book-paper.book-dark img, .book-paper.book-dark video { filter: invert(1) hue-rotate(180deg); }
      @media print { .book-paper.book-dark { filter: none !important; } }
    `;
    document.head.appendChild(s);
  }
})();

function BookHUD({ pages, page, setPage, theme }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [hintVisible, setHintVisible] = React.useState(true);
  const [dark, setDark] = React.useState(() => {
    try { return localStorage.getItem('textile_dark') === '1'; } catch { return false; }
  });

  // Apply/persist dark mode by toggling a class on the .book-paper card.
  React.useEffect(() => {
    const el = document.querySelector('.book-paper');
    if (el) el.classList.toggle('book-dark', dark);
    try { localStorage.setItem('textile_dark', dark ? '1' : '0'); } catch {}
  }, [dark]);

  React.useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Build lesson→page index
  const lessonIndex = React.useMemo(() => {
    const out = [];
    pages.forEach((p, i) => {
      if (p.kind === 'lessonIntro') out.push({ n: p.lesson.n, title: p.lesson.title, page: i });
    });
    return out;
  }, [pages]);

  const tocPage = pages.findIndex(p => p.kind === 'toc');
  const coverPage = 0;
  const pct = ((page + 1) / pages.length) * 100;

  // Find current lesson (for active highlight)
  const currentLesson = React.useMemo(() => {
    for (let i = pages.length - 1; i >= 0; i--) {
      if (i <= page && (pages[i].kind === 'lessonIntro' || pages[i].kind === 'lessonSections')) {
        return pages[i].lesson.n;
      }
    }
    return null;
  }, [page, pages]);

  return (
    <>
      {/* Progress bar */}
      <div className="book-hud" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(0,0,0,0.06)', zIndex: 30, pointerEvents: 'none',
      }}>
        <div style={{ width: pct + '%', height: '100%', background: theme.accent, transition: 'width .2s ease' }} />
      </div>

      {/* Top-right menu buttons */}
      <div className="book-hud" style={{ position: 'absolute', top: 8, right: 10, zIndex: 40, display: 'flex', gap: 6 }}>
        <button
          onClick={() => setDark(d => !d)}
          title="Toggle dark mode"
          aria-pressed={dark}
          style={{
            background: dark ? theme.ink : '#fff', border: `1px solid ${theme.ink}`,
            color: dark ? '#fff' : theme.ink,
            padding: '5px 10px', fontFamily: theme.mono, fontSize: 10, letterSpacing: 0.15,
            textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500,
          }}
        >{dark ? '☀ Light' : '☾ Dark'}</button>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            background: menuOpen ? theme.accent : '#fff', border: `1px solid ${theme.ink}`,
            color: menuOpen ? '#fff' : theme.ink,
            padding: '5px 10px', fontFamily: theme.mono, fontSize: 10, letterSpacing: 0.15,
            textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500,
          }}
        >{menuOpen ? '× Close' : '☰ Jump to…'}</button>
      </div>

      {/* Jump menu */}
      {menuOpen && (
        <div className="book-hud" onClick={() => setMenuOpen(false)} style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 39,
          background: 'rgba(10,10,10,0.35)', display: 'flex', justifyContent: 'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 340, background: '#fff', borderLeft: `2px solid ${theme.ink}`, marginTop: 42,
            maxHeight: 'calc(100% - 60px)', overflowY: 'auto', boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.ink}`, background: theme.ink, color: '#fff' }}>
              <div style={{ fontFamily: theme.mono, fontSize: 9.5, letterSpacing: 0.2, textTransform: 'uppercase', color: theme.accent, marginBottom: 2 }}>Navigation</div>
              <div style={{ fontFamily: theme.sans || 'inherit', fontSize: 15, fontWeight: 600 }}>Jump to any section</div>
            </div>

            {[
              { label: 'Cover', page: coverPage, n: null },
              { label: 'Contents', page: tocPage, n: null },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => { setPage(item.page); setMenuOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', border: 'none',
                  borderBottom: `1px solid rgba(0,0,0,0.08)`, background: '#fff', cursor: 'pointer',
                  padding: '10px 16px', fontFamily: theme.mono, fontSize: 11, letterSpacing: 0.1,
                  textTransform: 'uppercase', color: theme.ink,
                }}
              >→ {item.label}</button>
            ))}

            <div style={{ padding: '10px 16px 6px', fontFamily: theme.mono, fontSize: 9.5, letterSpacing: 0.2, textTransform: 'uppercase', color: '#888', borderBottom: `1px solid rgba(0,0,0,0.08)`, background: '#fafaf7' }}>
              Lessons
            </div>

            {lessonIndex.map(L => {
              const active = L.n === currentLesson;
              return (
                <button
                  key={L.n}
                  onClick={() => { setPage(L.page); setMenuOpen(false); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', border: 'none',
                    borderBottom: `1px solid rgba(0,0,0,0.06)`,
                    background: active ? theme.accent + '15' : '#fff',
                    borderLeft: active ? `3px solid ${theme.accent}` : '3px solid transparent',
                    cursor: 'pointer', padding: '10px 16px 10px 14px',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: theme.mono, fontSize: 11, color: theme.accent, fontWeight: 600, minWidth: 24 }}>
                      {String(L.n).padStart(2, '0')}
                    </span>
                    <span style={{ fontFamily: theme.sans || 'inherit', fontSize: 12.5, color: theme.ink, lineHeight: 1.3, fontWeight: active ? 600 : 500 }}>
                      {L.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      {hintVisible && page < 2 && (
        <div className="book-hud" style={{
          position: 'absolute', bottom: 52, left: '50%', transform: 'translateX(-50%)',
          background: theme.ink, color: '#fff', padding: '6px 14px',
          fontFamily: theme.mono, fontSize: 10, letterSpacing: 0.15, textTransform: 'uppercase',
          zIndex: 25, pointerEvents: 'none',
          animation: 'book-hint-fade 4s ease forwards',
        }}>
          Tip: use <span style={{ color: theme.accent }}>←</span> <span style={{ color: theme.accent }}>→</span> or click the edges · <span style={{ color: theme.accent }}>☰</span> to jump
        </div>
      )}

      {/* Key Takeaway badge on lesson pages — last section of each lesson block */}
    </>
  );
}

// Inject the fade animation once
(function() {
  if (typeof document !== 'undefined' && !document.getElementById('book-hint-anim')) {
    const s = document.createElement('style');
    s.id = 'book-hint-anim';
    s.textContent = `
      @keyframes book-hint-fade {
        0%, 70% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
      }
    `;
    document.head.appendChild(s);
  }
})();

window.BookHUD = BookHUD;
