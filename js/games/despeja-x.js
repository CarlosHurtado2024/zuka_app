// Despeja x (Álgebra, alg-1; spec 2026-11-18-algebra-revision): resolver es aplicar la misma operación a los dos lados.
// La ecuación ax + b = c (o x/a + b = c) está escrita; abajo hay tarjetas de operaciones. Se arrastra una tarjeta sobre
// la ecuación y se aplica a los dos lados: la ecuación cambia. Hay que dejar x sola. Se puede deshacer arrastrando la
// ecuación hacia abajo.
// params = { rounds: [{ a, b, c, div?, cards: [[op, v], …] }] }   (op '+' o '×')   state = { rounds: [{ steps: [índices de tarjeta] }] }
GAMES['despeja-x'] = (() => {
  // La ecuación es k·x + m = n (k puede ser fracción).
  const start = r => ({ k: r.div ? 1 / r.a : r.a, m: r.b, n: r.c });
  const apply = (e, [op, v]) => (op === '+' ? { k: e.k, m: e.m + v, n: e.n + v } : { k: e.k * v, m: e.m * v, n: e.n * v });
  const state = (s, r) => s.steps.reduce((e, i) => apply(e, r.cards[i]), start(r));
  const ok = (s, r) => { const e = state(s, r); return Math.abs(e.k - 1) < 1e-9 && Math.abs(e.m) < 1e-9; };
  const fmt = v => RK.num(Math.round(v * 1e6) / 1e6);
  const lhs = e => { const k = Math.abs(e.k - 1) < 1e-9 ? 'x' : Math.abs(e.k + 1) < 1e-9 ? '-x' : `${fmt(e.k)}x`; return Math.abs(e.m) < 1e-9 ? k : `${k} ${e.m < 0 ? '-' : '+'} ${fmt(Math.abs(e.m))}`; };
  const answer = r => { const steps = [], e0 = start(r); const iPlus = r.cards.findIndex(([op, v]) => op === '+' && Math.abs(v + e0.m) < 1e-9); if (e0.m && iPlus >= 0) steps.push(iPlus); const iMul = r.cards.findIndex(([op, v]) => op === '×' && Math.abs(v * e0.k - 1) < 1e-9); if (Math.abs(e0.k - 1) > 1e-9 && iMul >= 0) steps.push(iMul); return { steps }; };
  const lab = ([op, v]) => (op === '+' ? `${v < 0 ? '-' : '+'}\\,${fmt(Math.abs(v))}` : `\\times\\,${fmt(v)}`);
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ steps: [] }),
    ok,
    answered: s => s.steps.length > 0,
    solution: r => { const e = state(answer(r), r); return `x = ${fmt(e.n).replace(/\\tfrac\{(\d+)\}\{(\d+)\}/, '$1/$2')}`; },
    prompt: r => `Despeja x en $${lhs(start(r))} = ${fmt(r.c)}$`,
    foot: () => 'Arrastra una tarjeta a la ecuación: se aplica a los dos lados',
    layout(G) { G.eq = { x: 16, y: 106, w: G.W - 32, h: 64 }; G.cardY = G.H * 0.55; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, e = state(s, r);
      p.stroke(C.brand); p.strokeWeight(1.5); p.fill(RK.al(p, C.brand, 20)); p.rect(G.eq.x, G.eq.y, G.eq.w, G.eq.h, 12);
      TK.label(p, C, `$${lhs(e)} = ${fmt(e.n)}$`, G.W / 2, G.eq.y + G.eq.h / 2, C.ink, 22, G.eq.w - 20);
      TK.label(p, C, s.steps.length ? `pasos: ${s.steps.map(i => r.cards[i][0] === '+' ? `${r.cards[i][1] < 0 ? '−' : '+'}${Math.abs(r.cards[i][1])}` : `×${fmt(r.cards[i][1]).replace(/\\tfrac\{(\d+)\}\{(\d+)\}/, '$1/$2')}`).join('  ')}` : 'aún sin pasos', G.W / 2, G.eq.y + G.eq.h + 16, C.mute, 11, G.W - 30);
      const w = Math.min(70, (G.W - 24) / r.cards.length - 6);
      G.cards = r.cards.map((c, i) => ({ i, x: G.W / 2 - (r.cards.length * (w + 6) - 6) / 2 + i * (w + 6), y: G.cardY, w, h: 40 }));
      G.cards.forEach(b => { if (G.drag?.i !== b.i) RK.chip(p, C, b, `$${lab(r.cards[b.i])}$`, { size: 14 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 20, w, h: 40 }, `$${lab(r.cards[G.drag.i])}$`, { on: true, size: 14 });
      RK.strip(p, C, G.fb, ok(s, r) ? `$x = ${fmt(e.n)}$` : '$\\text{deja la x sola}$', { kicker: 'Lo mismo a los dos lados', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) {
      const b = (G.cards || []).find(b => hitBox(b, x, y)); if (b) { G.drag = { i: b.i, x, y }; return true; }
      if (hitBox(G.eq, x, y) && G.s.steps.length) { G.drag = { i: -1, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      if (d.i === -1) { if (y > G.eq.y + G.eq.h + 30) { G.s.steps.pop(); G.touch(); } return; }
      if (hitBox({ x: G.eq.x, y: G.eq.y - 20, w: G.eq.w, h: G.eq.h + 40 }, x, y) && G.s.steps.length < 4) { G.s.steps.push(d.i); G.touch(); }
    },
    demo(G) { const b = G.cards?.[0]; return b ? { from: { x: b.x + b.w / 2, y: b.y + 20 }, to: { x: G.W / 2, y: G.eq.y + 30 }, text: 'Arrastra una tarjeta a la ecuación', ty: G.cardY + 60 } : null; },
    peek: G => ({ cards: G.cards, eq: G.eq }),
  });
  return Object.assign(game, { answer, state });
})();
