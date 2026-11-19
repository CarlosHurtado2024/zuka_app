// De lo que queda (Preuniversitario, pu-ar-1; spec 2026-11-18-preuda-razonamiento-completo): «gasta 1/3 y luego 1/4 de lo que
// le queda». Cada compra es una fila: la barra de esa fila es el dinero que había ANTES de comprar (el total o lo que quedaba),
// partida en partes iguales. Se arrastra el corte hasta las partes que se gastan; la fila de abajo empieza con lo que quedó.
// params = { rounds: [{ total, steps: [[num, den, 'total' | 'resto']] }] }   state = { rounds: [{ j: [partes cortadas por fila] }] }
GAMES['corta-lo-que-queda'] = (() => {
  const run = (r, j) => { let rem = r.total; return r.steps.map(([, den, of], k) => { const base = of === 'total' ? r.total : rem, spent = base * j[k] / den; rem -= spent; return { base, spent, rem }; }); };
  const ok = (s, r) => r.steps.every(([num], k) => s.j[k] === num);
  const money = v => (Math.round(v) === v ? v.toLocaleString('es-CO') : v.toFixed(1));
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ j: r.steps.map(() => 0) }),
    ok,
    solution: r => { const R = run(r, r.steps.map(s => s[0])); return R.map((x, k) => `gasta ${money(x.spent)}, quedan ${money(x.rem)}`).join('; '); },
    prompt: r => `Hay ${money(r.total)}. Corta lo que gasta cada fila`,
    foot: () => 'Arrastra el corte de cada fila',
    layout(G) { G.x0 = 20; G.x1 = G.W - 20; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { j: r.steps.map(x => x[0]) } : G.s, good = ok(s, r), R = run(r, s.j), Wt = G.x1 - G.x0;
      G.rows = R.map((x, k) => {
        const [, den] = r.steps[k], y = 124 + k * 72, bw = Wt * x.base / r.total, cut = G.x0 + bw * s.j[k] / den;
        TK.label(p, C, `gasta $\\tfrac{${r.steps[k][0]}}{${den}}$ ${r.steps[k][2] === 'total' ? 'del total' : 'de lo que queda'} (había ${money(x.base)})`, G.x0 + Wt / 2, y - 14, C.ink, 10, Wt);
        p.noStroke(); p.fill(RK.al(p, C.mint, 120)); p.rect(G.x0, y, bw, 30, 6);
        p.fill(RK.al(p, C.coral, 200)); p.rect(G.x0, y, cut - G.x0, 30, 6, 0, 0, 6);
        for (let t = 1; t < den; t++) { p.stroke(C.ink); p.strokeWeight(1); p.line(G.x0 + bw * t / den, y, G.x0 + bw * t / den, y + 30); }
        RK.knob(p, C, cut, y + 15, C.brand);
        TK.label(p, C, `gasta ${money(x.spent)} · quedan ${money(x.rem)}`, G.x0 + Wt / 2, y + 44, C.ink, 10, Wt);
        return { y, bw, den };
      });
      const last = R.at(-1).rem;
      RK.strip(p, C, G.fb, `$\\text{quedan ${money(last)}}$`, { kicker: good ? 'eso es lo que queda' : 'lo que va quedando', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const k = (G.rows || []).findIndex(rw => y > rw.y - 12 && y < rw.y + 42); if (k < 0) return false; G.grab = k; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => { const rw = G.rows?.[0]; return rw ? { from: { x: G.x0 + 4, y: rw.y + 15 }, to: { x: G.x0 + rw.bw / rw.den, y: rw.y + 15 }, text: 'Arrastra el corte', ty: rw.y - 30 } : null; },
    peek: G => ({ rows: G.rows }),
  });
  game.move = (G, x) => { const rw = G.rows[G.grab], j = Math.max(0, Math.min(rw.den, Math.round((x - G.x0) / (rw.bw / rw.den)))); if (j !== G.s.j[G.grab] || !G.touched[G.cur]) { G.s.j[G.grab] = j; G.touch(); } };
  return Object.assign(game, { answer: r => ({ j: r.steps.map(x => x[0]) }) });
})();
