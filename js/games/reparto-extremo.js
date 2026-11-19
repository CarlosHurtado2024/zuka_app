// El reparto extremo (Preuniversitario, pu-ar-4; spec 2026-11-18-preuda-razonamiento-completo): se reparten dulces entre varios
// niños, cada uno con una cantidad DISTINTA y al menos 1. Se sube o se baja la columna de cada niño; el juego cuenta el total.
// Para el máximo de uno, los demás reciben lo mínimo posible; para el menor máximo, todo se reparte lo más parejo que se pueda.
// params = { rounds: [{ n, total, ask: 'max' | 'minmax' }] }   state = { rounds: [{ h: [cantidad por niño] }] }
GAMES['reparto-extremo'] = (() => {
  const target = r => { const base = r.n * (r.n - 1) / 2; if (r.ask === 'max') return r.total - base; let m = r.n; while (m * (m + 1) / 2 - (m - r.n) * (m - r.n + 1) / 2 < r.total) m++; return m; };
  const valid = (r, h) => h.every(v => v >= 1) && new Set(h).size === h.length && h.reduce((a, b) => a + b, 0) === r.total;
  const ok = (s, r) => valid(r, s.h) && Math.max(...s.h) === target(r);
  const answer = r => { const n = r.n; if (r.ask === 'max') return { h: [...Array.from({ length: n - 1 }, (_, i) => i + 1), target(r)] }; const m = target(r); const h = Array.from({ length: n }, (_, i) => m - i); let extra = h.reduce((a, b) => a + b, 0) - r.total; for (let i = n - 1; i >= 0 && extra > 0; i--) { const room = h[i] - (i === n - 1 ? 1 : h[i + 1] + 1); const t = Math.min(room, extra); h[i] -= t; extra -= t; } return { h }; };
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ h: Array(r.n).fill(1) }),
    ok,
    solution: r => answer(r).h.join(', '),
    prompt: r => (r.ask === 'max' ? `${r.total} dulces, ${r.n} niños, todos distintos: ¿lo máximo de uno?` : `${r.total} dulces, ${r.n} niños, todos distintos: ¿el menor máximo?`),
    foot: () => 'Sube o baja la columna de cada niño',
    layout(G) { G.b = { x: 30, y: 110, w: G.W - 50, h: G.H - 240 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), top = r.total, b = G.b;
      const Y = GRAF.axes(p, C, b, 0, top, Math.max(1, Math.ceil(top / 6)));
      const dup = s.h.filter((x, i) => s.h.indexOf(x) !== i);
      G.cols = GRAF.bars(p, C, b, s.h, s.h.map((_, i) => `niño ${i + 1}`), Y, { col: i => (dup.includes(s.h[i]) ? C.bad : good ? C.ok : C.sky) });
      G.cols.forEach((c, i) => { RK.knob(p, C, c.cx, c.top, C.brand); TK.label(p, C, String(s.h[i]), c.cx, c.top - 14, C.ink, 11, c.w); });
      const sum = s.h.reduce((a, c) => a + c, 0);
      RK.strip(p, C, G.fb, `$\\text{suma}\\ ${sum}\\ \\text{de}\\ ${r.total}\\ \\cdot\\ \\text{el mayor}\\ ${Math.max(...s.h)}$`, { kicker: dup.length ? 'hay dos iguales' : sum !== r.total ? (sum < r.total ? 'faltan dulces' : 'sobran dulces') : good ? (r.ask === 'max' ? 'lo máximo posible' : 'el menor máximo posible') : 'reparto válido, pero se puede mejorar', col: G.locked || good ? C.ok : C.brand, size: 14 });
    },
    press(G, x, y) { const i = GRAF.colAt(G.cols || [], x); if (i < 0 || y < G.b.y - 20 || y > G.b.y + G.b.h + 10) return false; G.grab = i; game.move(G, y); return true; },
    drag(G, x, y) { if (G.grab < 0) return false; game.move(G, y); return true; },
    release(G) { G.grab = -1; },
    demo: G => (G.cols ? { from: { x: G.cols[0].cx, y: G.cols[0].top }, to: { x: G.cols[0].cx, y: G.cols[0].top - 60 }, text: 'Sube la columna', ty: G.b.y + 10 } : null),
    peek: G => ({ b: G.b, cols: G.cols }),
  });
  game.move = (G, y) => { const r = G.r, b = G.b, v = Math.max(1, Math.min(r.total, Math.round((b.y + b.h - y) / b.h * r.total))); if (v !== G.s.h[G.grab] || !G.touched[G.cur]) { G.s.h[G.grab] = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
