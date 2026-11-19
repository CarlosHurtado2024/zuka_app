// Arma la gráfica (Preuniversitario, pu-gr-1; spec 2026-11-18-preuda-razonamiento-completo): una tabla de datos arriba y una
// gráfica de barras vacía abajo, con su escala. Se sube cada barra hasta su dato; la escala no siempre va de 1 en 1.
// params = { rounds: [{ rows: [[rótulo, valor]], hi, step, snap }] }   state = { rounds: [{ h: [altura por barra] }] }
GAMES['arma-barras'] = (() => {
  const ok = (s, r) => r.rows.every((row, i) => s.h[i] === row[1]);
  const game = roundsGame({
    aspect: 1.35,
    init: r => ({ h: r.rows.map(row => (row[1] === 0 ? r.snap : 0)) }),
    ok,
    solution: r => r.rows.map(row => `${row[0]}: ${row[1]}`).join(', '),
    prompt: () => 'Pasa la tabla a la gráfica',
    foot: () => 'Sube cada barra hasta su dato',
    layout(G) { G.b = { x: 44, y: 150, w: G.W - 60, h: G.H - 268 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { h: r.rows.map(row => row[1]) } : G.s, good = ok(s, r), n = r.rows.length, cw = (G.W - 32) / n;
      r.rows.forEach((row, i) => {
        const x = 16 + i * cw, right = s.h[i] === row[1];
        p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, right ? C.ok : C.card, right ? 60 : 200)); p.rect(x + 2, 92, cw - 4, 40, 6);
        TK.label(p, C, row[0], x + cw / 2, 103, C.mute, 9, cw - 6);
        TK.label(p, C, String(row[1]), x + cw / 2, 121, C.ink, 13, cw - 6);
      });
      const Y = GRAF.axes(p, C, G.b, 0, r.hi, r.step); G.Y = Y;
      G.cols = GRAF.bars(p, C, G.b, s.h, null, Y, { col: i => (s.h[i] === r.rows[i][1] && good ? C.ok : C.sky) });
      G.cols.forEach(c => RK.knob(p, C, c.cx, c.top, C.brand));
      RK.strip(p, C, G.fb, good ? '$\\text{la gráfica coincide con la tabla}$' : `$\\text{${s.h.join(' · ')}}$`, { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const i = GRAF.colAt(G.cols || [], x); if (i < 0 || y < G.b.y - 20 || y > G.b.y + G.b.h + 10) return false; G.grab = i; game.move(G, y); return true; },
    drag(G, x, y) { if (G.grab < 0) return false; game.move(G, y); return true; },
    release(G) { G.grab = -1; },
    demo: G => (G.cols ? { from: { x: G.cols[0].cx, y: G.cols[0].top }, to: { x: G.cols[0].cx, y: G.cols[0].top - 70 }, text: 'Sube la barra', ty: G.b.y + 10 } : null),
    peek: G => ({ b: G.b, cols: G.cols }),
  });
  game.move = (G, y) => { const r = G.r, b = G.b, raw = (b.y + b.h - y) / b.h * r.hi, v = Math.max(0, Math.min(r.hi, Math.round(raw / r.snap) * r.snap)); if (v !== G.s.h[G.grab] || !G.touched[G.cur]) { G.s.h[G.grab] = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ h: r.rows.map(row => row[1]) }) });
})();
