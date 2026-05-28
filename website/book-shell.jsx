// Shared sections renderer adapted per-direction via a `theme` prop.
// Also: page shell + page-turn navigation logic.

// ─────────────────────────────────────────────────────────────
// Page nav — arrow keys, click zones, persistent localStorage
// ─────────────────────────────────────────────────────────────
function useBookNav(totalPages, storageKey) {
  const [page, setPage] = React.useState(() => {
    try {
      const v = parseInt(localStorage.getItem(storageKey) || "0", 10);
      return isNaN(v) ? 0 : Math.max(0, Math.min(totalPages - 1, v));
    } catch { return 0; }
  });
  React.useEffect(() => {
    try { localStorage.setItem(storageKey, String(page)); } catch {}
  }, [page, storageKey]);
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        setPage(p => Math.min(totalPages - 1, p + 1));
        e.preventDefault();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setPage(p => Math.max(0, p - 1));
        e.preventDefault();
      } else if (e.key === "Home") {
        setPage(0);
      } else if (e.key === "End") {
        setPage(totalPages - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);
  return [page, setPage];
}

// Pagination splits each lesson's sections across multiple pages.
// Each page carries: { kind: 'cover' | 'toc' | 'lessonIntro' | 'lessonSections' | 'colophon', ... }
// For 'lessonSections' we chunk sections to roughly fit a page (heuristic).
function buildPages(BOOK, TOC, LESSONS) {
  const pages = [];
  pages.push({ kind: "cover" });
  pages.push({ kind: "toc" });
  LESSONS.forEach(L => {
    pages.push({ kind: "lessonIntro", lesson: L });
    // One long scrolling page per lesson — no chunking, no clipping.
    pages.push({ kind: "lessonSections", lesson: L, sections: L.sections, part: 1, parts: 1 });
  });
  pages.push({ kind: "colophon" });
  return pages;
}

// ─────────────────────────────────────────────────────────────
// Navigation chrome
// ─────────────────────────────────────────────────────────────
function PageNav({ page, total, setPage, theme }) {
  const accent = theme.accent;
  const fg = theme.nav || theme.ink;
  return (
    <div className="book-pagenav" style={{
      position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 14, zIndex: 20, fontFamily: theme.mono,
      fontSize: 11, letterSpacing: 0.12, color: fg,
      pointerEvents: 'none',
      background: 'rgba(250,250,247,0.92)',
      border: `1px solid ${fg}`,
      padding: '4px 6px',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      <button
        onClick={() => setPage(Math.max(0, page - 1))}
        disabled={page === 0}
        style={{
          pointerEvents: 'auto', background: 'transparent', border: `1px solid ${fg}40`,
          color: fg, padding: '6px 12px', cursor: page === 0 ? 'default' : 'pointer',
          opacity: page === 0 ? 0.3 : 1, fontFamily: theme.mono, fontSize: 10,
          letterSpacing: 0.15, textTransform: 'uppercase',
        }}
      >← Prev</button>
      <span style={{ minWidth: 90, textAlign: 'center', textTransform: 'uppercase' }}>
        <span style={{ color: accent }}>{String(page + 1).padStart(3, '0')}</span>
        <span style={{ opacity: 0.5 }}> / {String(total).padStart(3, '0')}</span>
      </span>
      <button
        onClick={() => setPage(Math.min(total - 1, page + 1))}
        disabled={page === total - 1}
        style={{
          pointerEvents: 'auto', background: 'transparent', border: `1px solid ${fg}40`,
          color: fg, padding: '6px 12px', cursor: page === total - 1 ? 'default' : 'pointer',
          opacity: page === total - 1 ? 0.3 : 1, fontFamily: theme.mono, fontSize: 10,
          letterSpacing: 0.15, textTransform: 'uppercase',
        }}
      >Next →</button>
    </div>
  );
}

// Click zones on left/right edges for page turns
function ClickZones({ page, total, setPage }) {
  return (
    <>
      <div
        onClick={() => setPage(Math.max(0, page - 1))}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 60, width: '22%', cursor: page === 0 ? 'default' : 'w-resize', zIndex: 10 }}
      />
      <div
        onClick={() => setPage(Math.min(total - 1, page + 1))}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 60, width: '22%', cursor: page === total - 1 ? 'default' : 'e-resize', zIndex: 10 }}
      />
    </>
  );
}

window.useBookNav = useBookNav;
window.buildPages = buildPages;
window.PageNav = PageNav;
window.ClickZones = ClickZones;
