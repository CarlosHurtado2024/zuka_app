// Tapar y evaluar (Álgebra, alg-102; spec 2026-11-18-algebra-revision): para hallar A en A/(x − p) se tapa el factor
// (x − p) de la fracción original y lo que queda se evalúa en el número que anula lo tapado, x = p. Cada factor del
// denominador tiene debajo su fracción parcial; se arrastra a cada factor la ficha del valor de x en que hay que evaluar
// (entre ellas están los valores con el signo cambiado). El juego tapa ese factor, evalúa lo demás y escribe el número.
// params = { rounds: [{ num: [c, d], ps: [p, q, …] }] }   (numerador c·x + d, factores x − p)   state = { rounds: [{ put: [valor | null, …] }] }
GAMES['tapa-evalua'] = (() => {
  const coefAt = (r, k, x) => { let den = 1; r.ps.forEach((q, j) => { if (j !== k) den *= x - q; }); return den === 0 ? null : (r.num[0] * x + r.num[1]) / den; };
  const ok = (s, r) => s.put.every((v, k) => v === r.ps[k]);
  const answer = r => ({ put: [...r.ps] });
  const chips = r => [...new Set([...r.ps, ...r.ps.map(v => -v).filter(v => v !== 0)])].sort((a, b) => a - b);
  const fac = v => (v === 0 ? 'x' : `x ${v < 0 ? '+' : '-'} ${Math.abs(v)}`);
  const lay = G => { const n = G.r.ps.length, w = Math.min(96, (G.W - 30) / n - 8); G.fac = G.r.ps.map((_, k) => ({ k, x: G.W / 2 - (n * (w + 8) - 8) / 2 + k * (w + 8), y: 128, w, h: 36 })); G.cy = G.H * 0.68; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; };
  const game = roundsGame({
    aspect: 1.3,
    init: r => ({ put: r.ps.map(() => null) }),
    ok,
    answered: s => s.put.some(v => v != null),
    solution: r => r.ps.map((p, k) => { const c = coefAt(r, k, p); return `${k ? (c < 0 ? ' − ' : ' + ') : c < 0 ? '−' : ''}${Math.abs(c)}/(${fac(p)})`; }).join(''),
    prompt: r => `Parte $\\dfrac{${r.num[0] === 1 ? '' : r.num[0]}x ${r.num[1] < 0 ? '-' : '+'} ${Math.abs(r.num[1])}}{${r.ps.map(p => `(${fac(p)})`).join('')}}$`,
    foot: () => '¿En qué x se evalúa? Arrastra el valor a cada factor',
    layout: G => lay(G),
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s;
      TK.label(p, C, 'factores del denominador', G.W / 2, 108, C.mute, 10, G.W - 30);
      G.fac.forEach(b => {
        const v = s.put[b.k];
        RK.chip(p, C, b, v == null ? `$(${fac(r.ps[b.k])})$` : '$\\text{tapado}$', { on: true, col: v == null ? C.sky : C.mute, size: 12 });
        const c = v == null ? null : coefAt(r, b.k, v), good = v === r.ps[b.k];
        const lab = v == null ? `$\\dfrac{\\square}{${fac(r.ps[b.k])}}$` : `$x = ${v}:\\ \\dfrac{${c == null ? '\\infty' : RK.num(c)}}{${fac(r.ps[b.k])}}$`;
        RK.chip(p, C, { x: b.x, y: b.y + 46, w: b.w, h: 58 }, lab, { on: v != null, col: v == null ? C.line : G.locked ? (good ? C.ok : C.bad) : C.mint, size: 12 });
      });
      const L = chips(r), w = Math.min(54, (G.W - 20) / L.length - 6);
      G.cards = L.map((v, i) => ({ v, x: G.W / 2 - (L.length * (w + 6) - 6) / 2 + i * (w + 6), y: G.cy, w, h: 34 }));
      TK.label(p, C, 'evaluar en x =', G.W / 2, G.cy - 12, C.mute, 10, 120);
      G.cards.forEach(b => RK.chip(p, C, b, String(b.v), { size: 13 }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 17, w, h: 34 }, String(G.drag.v), { on: true, size: 13 });
      const all = s.put.every(v => v != null);
      RK.strip(p, C, G.fb, all ? `$${r.ps.map((pp, k) => { const c = coefAt(r, k, s.put[k]); return `\\dfrac{${c == null ? '?' : RK.num(c)}}{${fac(pp)}}`; }).join(' + ')}$` : '$\\text{tapa cada factor}$', { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      const b = (G.cards || []).find(b => hitBox(b, x, y)); if (b) { G.drag = { v: b.v, x, y }; return true; }
      const f = G.fac.find(f => hitBox({ x: f.x, y: f.y, w: f.w, h: 104 }, x, y)); if (f && G.s.put[f.k] != null) { G.s.put[f.k] = null; G.touch(); return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; const f = G.fac.find(f => hitBox({ x: f.x - 4, y: f.y - 10, w: f.w + 8, h: 120 }, x, y)); if (f) { G.s.put[f.k] = d.v; G.touch(); } },
    demo(G) { const f = G.fac[G.fac.length - 1], b = G.cards?.find(c => c.v !== G.r.ps[f.k]); return b ? { from: { x: b.x + b.w / 2, y: b.y + 17 }, to: { x: f.x + f.w / 2, y: f.y + 18 }, text: 'Arrastra a un factor', ty: G.cy + 52 } : null; },
    peek: G => ({ fac: G.fac, cards: G.cards }),
  });
  return Object.assign(game, { answer });
})();
