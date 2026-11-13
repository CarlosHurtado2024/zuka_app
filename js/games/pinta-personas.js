// Pinta a las personas (Álgebra, porcentajes). Un grupo de personitas que no son 100 (20, 25, 40, 8): se tocan para
// pintarlas hasta tener el porcentaje pedido. El porcentaje es «de cada 100», así que hay que pasarlo a este total:
// parte = total · p / 100. Tocar una pintada la despinta.
// params = { rounds: [{ total, pct, what }] }   state = { painted: [número | null por ronda] }

GAMES['pinta-personas'] = (() => {
  const want = r => (r.total * r.pct) / 100;
  const okRound = (k, r) => k === want(r);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okRound(state.painted?.[i], r));
    return { ok, solution: params.rounds.map(r => `${want(r)} de ${r.total}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const P = R.map(r => Array(r.total).fill(false)), touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [];

    function layout(w, h) { W = w; H = h; tabs = roundTabs(R.length, w); }
    // Cuadrícula de la ronda actual (se calcula igual al dibujar y al tocar, aunque aún no se haya redibujado).
    function grid() {
      const r = R[cur], cols = r.total <= 8 ? 4 : r.total <= 25 ? 5 : 8, rows = Math.ceil(r.total / cols);
      const top = 98, bot = H - 52, cw = (W - 24) / cols, ch = (bot - top) / rows;
      return { cols, cw, ch, s: Math.min(cw, ch) * 0.82,
        cells: Array.from({ length: r.total }, (_, i) => ({ x: 12 + (i % cols) * cw, y: top + Math.floor(i / cols) * ch, w: cw, h: ch })) };
    }
    const count = i => P[i].filter(Boolean).length;

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function person(x, y, s, col) {
        p.noStroke(); p.fill(col);
        p.circle(x, y - s * 0.28, s * 0.38);
        p.rect(x - s * 0.24, y - s * 0.06, s * 0.48, s * 0.46, s * 0.2, s * 0.2, s * 0.06, s * 0.06);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], k = count(cur), good = okRound(k, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (okRound(count(i), R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Q : C.line));
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, `Pinta al ${String(r.pct)} % del grupo`, W / 2, 56, W - 24, 15);
        p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, `${r.total} personas · ${r.what}`, W / 2, 78, W - 24, 12);
        // Personas en una cuadrícula que llena el espacio
        const { s, cells } = grid(), shown = locked && !good ? want(r) : null;
        cells.forEach((c, i) => {
          const on = shown == null ? P[cur][i] : i < shown;
          person(c.x + c.w / 2, c.y + c.h / 2, s, on ? (locked ? C.ok : C.sun) : C.mute);
        });
        const msg = locked && !good ? `Eran ${want(r)} de ${r.total}` : `pintadas: ${k} de ${r.total}`;
        p.fill(locked ? C.ok : C.ink); p.textStyle(p.BOLD); fitText(p, msg, W / 2, H - 26, W - 24, 15);
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const i = grid().cells.findIndex(c => hitBox(c, x, y));
        if (i >= 0) { P[cur][i] = !P[cur][i]; touched[cur] = true; api.ready(touched.every(Boolean)); api.sfx?.tap?.(); return false; }
      };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ painted: P.map((row, i) => (touched[i] ? row.filter(Boolean).length : null)) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
