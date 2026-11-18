// Gemelos (Álgebra 0, alg-0a; spec 2026-11-18-algebra-revision): igualdad e inclusión de conjuntos. A y B son dos
// membranas con sus elementos, escritos en otro orden y a veces repetidos. Un hilo une cada elemento con su gemelo del
// otro lado. Cada ronda pide una relación (A = B, A ⊆ B o A ∩ B = ∅) y se logra sacando a la papelera lo que estorba,
// sin sacar nada de más. Los repetidos no estorban: un conjunto no cambia por escribir dos veces el mismo elemento.
// params = { rounds: [{ A: [..], B: [..], goal: '=' | 'sub' | 'disj' }] }   state = { rounds: [{ outA: [índices], outB: [índices] }] }
GAMES['gemelos'] = (() => {
  // Lo que hay que sacar de cada lado, lo mínimo.
  function need(r) {
    const inA = v => r.A.includes(v), inB = v => r.B.includes(v), idx = (L, f) => L.map((v, i) => (f(v) ? i : -1)).filter(i => i >= 0);
    if (r.goal === '=') return { A: idx(r.A, v => !inB(v)), B: idx(r.B, v => !inA(v)) };
    if (r.goal === 'sub') return { A: idx(r.A, v => !inB(v)), B: [] };
    return { A: [], B: idx(r.B, inA) };
  }
  const sorted = a => [...a].sort((x, y) => x - y).join();
  const ok = (s, r) => { const n = need(r); return sorted(s.outA) === n.A.join() && sorted(s.outB) === n.B.join(); };
  const GOAL = { '=': ['Haz que A = B', 'A = B'], sub: ['Haz que A ⊆ B', 'A ⊆ B'], disj: ['Haz que A y B sean disjuntos: saca solo de B', 'A ∩ B = ∅'] };
  const tset = xs => (xs.length ? `\\{${[...new Set(xs)].join(', ')}\\}` : '\\varnothing');
  const game = roundsGame({
    aspect: 1.45,
    init: () => ({ outA: [], outB: [] }),
    ok,
    answered: s => s.outA.length + s.outB.length > 0,
    solution: r => { const n = need(r); return `sacar ${[...n.A.map(i => r.A[i]), ...n.B.map(i => r.B[i])].join(', ')}`; },
    prompt: r => GOAL[r.goal][0],
    foot: () => 'Arrastra a la papelera lo que estorba; los hilos unen elementos iguales',
    layout(G) { const W = G.W, H = G.H; const cy = (112 + H - 162) / 2; G.cA = { x: W * 0.27, y: cy }; G.cB = { x: W * 0.73, y: cy }; G.rx = W * 0.2; G.ry = (H - 274) / 2; G.bin = { x: W / 2 - 50, y: H - 150, w: 100, h: 44 }; G.fb = { x: 12, y: H - 92, w: W - 24, h: 54 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, [SA, SB] = SK.sets(C), good = ok(G.s, r), n = need(r);
      const s = G.locked && !good ? { outA: n.A, outB: n.B } : G.s;
      const pos = (side, i) => { const L = r[side], c = side === 'A' ? G.cA : G.cB, gap = Math.min(36, (2 * G.ry - 30) / L.length); return { x: c.x, y: c.y - (L.length - 1) * gap / 2 + i * gap }; };
      G.pos = pos;
      SK.membrane(p, C, G.cA.x, G.cA.y, G.rx, G.ry, SA.line, { fill: 20 }); SK.membrane(p, C, G.cB.x, G.cB.y, G.rx, G.ry, SB.line, { fill: 20 });
      SK.tag(p, C, 'A', G.cA.x, G.cA.y - G.ry - 2, SA); SK.tag(p, C, 'B', G.cB.x, G.cB.y - G.ry - 2, SB);
      // Hilos entre gemelos que siguen adentro.
      r.A.forEach((v, i) => { if (s.outA.includes(i)) return; r.B.forEach((w, j) => { if (w !== v || s.outB.includes(j)) return; const a = pos('A', i), b = pos('B', j); p.noFill(); p.stroke(SK.al(p, C.brand, 170)); p.strokeWeight(1.6); p.bezier(a.x + 22, a.y, a.x + 70, a.y, b.x - 70, b.y, b.x - 22, b.y); }); });
      // La papelera.
      p.stroke(C.line); p.strokeWeight(1.2); p.fill(SK.al(p, C.card, 200)); p.rect(G.bin.x, G.bin.y, G.bin.w, G.bin.h, 10);
      TK.label(p, C, 'papelera', G.bin.x + G.bin.w / 2, G.bin.y - 9, C.mute, 10, 90);
      const gone = [...s.outA.map(i => ['A', i]), ...s.outB.map(i => ['B', i])];
      G.spots = [];
      ['A', 'B'].forEach(side => r[side].forEach((v, i) => {
        const out = (side === 'A' ? s.outA : s.outB).includes(i);
        if (out) return;
        const q = pos(side, i); G.spots.push({ side, i, x: q.x, y: q.y });
        if (G.drag?.side === side && G.drag.i === i) return;
        SK.chip(p, C, { x: q.x - 20, y: q.y - 14, w: 40, h: 28 }, v, { state: 'on', col: side === 'A' ? SA.line : SB.line, size: 14, r: 9 });
      }));
      gone.forEach(([side, i], k) => { const x = G.bin.x + 18 + (k % 4) * 22, y = G.bin.y + 14 + Math.floor(k / 4) * 18; G.spots.push({ side, i, x, y, out: true }); if (!(G.drag?.side === side && G.drag.i === i)) SK.chip(p, C, { x: x - 10, y: y - 9, w: 20, h: 18 }, r[side][i], { state: G.locked ? 'ok' : 'idle', size: 10, r: 6 }); });
      if (G.drag) SK.chip(p, C, { x: G.drag.x - 20, y: G.drag.y - 14, w: 40, h: 28 }, r[G.drag.side][G.drag.i], { state: 'on', col: C.brand, size: 14, r: 9 });
      const keep = side => r[side].filter((_, i) => !(side === 'A' ? s.outA : s.outB).includes(i));
      SK.formal(p, C, G.fb, `$A = ${tset(keep('A'))}\\quad B = ${tset(keep('B'))}$`, { raw: true, kicker: `Meta: ${GOAL[r.goal][1]}`, col: G.locked ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const q = (G.spots || []).find(q => Math.abs(x - q.x) < (q.out ? 12 : 22) && Math.abs(y - q.y) < (q.out ? 10 : 15));
      if (!q) return false;
      G.drag = { side: q.side, i: q.i, out: !!q.out, x, y }; return true;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const L = d.side === 'A' ? G.s.outA : G.s.outB, b = G.bin, inBin = x > b.x - 10 && x < b.x + b.w + 10 && y > b.y - 16 && y < b.y + b.h + 10;
      if (!d.out && inBin) { L.push(d.i); G.touch(); } else if (d.out && !inBin) { L.splice(L.indexOf(d.i), 1); G.touch(); }
    },
    demo(G) { const n = need(G.r), q = n.A.length ? G.pos?.('A', n.A[0]) : n.B.length ? G.pos?.('B', n.B[0]) : null; return q ? { from: q, to: { x: G.bin.x + G.bin.w / 2, y: G.bin.y + 20 }, text: 'Arrastra a la papelera lo que estorba', ty: 108 } : null; },
    peek: G => ({ spots: G.spots, bin: G.bin, need: need(G.r) }),
  });
  return Object.assign(game, { need });
})();
