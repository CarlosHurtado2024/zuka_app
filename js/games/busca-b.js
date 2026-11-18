// ¿Quién es B? (Álgebra 0, alg-0c; spec 2026-11-18-algebra-revision): las operaciones al revés. A está fijo; B empieza
// vacío. Se arrastran elementos del universo a B (si también están en A caen en la zona común) hasta que se cumplan las
// dos pistas de la ronda, por ejemplo A ∪ B = … y A ∩ B = …. Cada pista se pone verde cuando se cumple.
// params = { rounds: [{ U, A, conds: [['union' | 'inter' | 'BmA' | 'AmB', [..]], …] }] }   state = { rounds: [{ B: [..] }] }
GAMES['busca-b'] = (() => {
  const val = (k, A, B) => (k === 'union' ? [...A, ...B.filter(v => !A.includes(v))] : k === 'inter' ? A.filter(v => B.includes(v)) : k === 'BmA' ? B.filter(v => !A.includes(v)) : A.filter(v => !B.includes(v)));
  const eq = (X, Y) => X.length === Y.length && X.every(v => Y.includes(v));
  const holds = (B, r) => r.conds.map(([k, X]) => eq(val(k, r.A, B), X));
  const ok = (s, r) => holds(s.B, r).every(Boolean);
  // La B que pide la ronda (se prueban todos los subconjuntos de U: son pocos).
  const answer = r => { for (let m = 0; m < 2 ** r.U.length; m++) { const B = r.U.filter((_, i) => m & (1 << i)); if (holds(B, r).every(Boolean)) return B; } return null; };
  const NAME = { union: 'A \\cup B', inter: 'A \\cap B', BmA: 'B - A', AmB: 'A - B' };
  const tset = xs => (xs.length ? `\\{${xs.join(', ')}\\}` : '\\varnothing');
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ B: [] }),
    ok,
    answered: s => s.B.length > 0,
    solution: r => `B = {${answer(r).join(', ')}}`,
    prompt: r => `$A = ${tset(r.A)}$. ¿Quién es $B$?`,
    foot: () => 'Arrastra elementos del universo a B (o sácalos) hasta cumplir las dos pistas',
    layout(G) {
      const W = G.W, H = G.H; G.box = { x: 12, y: 92, w: W - 24, h: H * 0.34 }; G.cs = SK.venn2(G.box, 0.5, 2);
      G.trayY = G.box.y + G.box.h + 14; G.cy = G.trayY + 50;
    },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r, box, cs } = G, [SA, SB] = SK.sets(C), good = ok(G.s, r), B = G.locked && !good ? answer(r) : G.s.B;
      SK.panel(p, C, box, { u: true });
      SK.membrane(p, C, cs[0].x, cs[0].y, cs[0].r, cs[0].r, SA.line, { fill: 22 }); SK.membrane(p, C, cs[1].x, cs[1].y, cs[1].r, cs[1].r, SB.line, { fill: 22, dash: !B.length });
      SK.tag(p, C, 'A', cs[0].x - cs[0].r * 0.7, cs[0].y - cs[0].r * 0.75, SA); SK.tag(p, C, 'B', cs[1].x + cs[1].r * 0.7, cs[1].y - cs[1].r * 0.75, SB);
      // A solo (fijos), la zona común y B solo.
      G.spots = [];
      const col = (list, x, kind) => list.forEach((v, i) => { const y = cs[0].y + (i - (list.length - 1) / 2) * 24; if (kind !== 'A') G.spots.push({ v, x: x - 15, y: y - 11, w: 30, h: 22 }); if (G.drag?.v === v) return; SK.chip(p, C, { x: x - 15, y: y - 11, w: 30, h: 22 }, v, { state: kind === 'A' ? 'idle' : G.locked ? 'ok' : 'on', col: kind === 'A' ? SA.line : SB.line, size: 12, r: 7 }); });
      col(r.A.filter(v => !B.includes(v)), cs[0].x - cs[0].r * 0.5, 'A');
      col(r.A.filter(v => B.includes(v)), (cs[0].x + cs[1].x) / 2, 'AB');
      col(B.filter(v => !r.A.includes(v)), cs[1].x + cs[1].r * 0.5, 'B');
      // El universo: lo que no está en B.
      const rest = r.U.filter(v => !B.includes(v)), w = Math.min(34, (G.W - 24) / Math.max(rest.length, 1) - 4);
      TK.label(p, C, 'universo', 40, G.trayY - 4, C.mute, 10, 70);
      rest.forEach((v, i) => { const x = 14 + i * (w + 4); G.spots.push({ v, x, y: G.trayY + 4, w, h: 28, tray: true }); if (G.drag?.v !== v) SK.chip(p, C, { x, y: G.trayY + 4, w, h: 28 }, v, { state: 'idle', size: 13, r: 9 }); });
      if (G.drag) SK.chip(p, C, { x: G.drag.x - 16, y: G.drag.y - 13, w: 32, h: 26 }, G.drag.v, { state: 'on', col: C.brand, size: 13, r: 9 });
      // Las dos pistas, cada una con su valor actual.
      const h = holds(B, r);
      r.conds.forEach(([k, X], j) => {
        const b = { x: 12, y: G.cy + j * 50, w: G.W - 24, h: 44 };
        SK.formal(p, C, b, `$${NAME[k]} = ${tset(X)}$`, { raw: true, kicker: `ahora: ${tset(val(k, r.A, B)).replace(/\\\{|\\\}/g, m => (m === '\\{' ? '{' : '}')).replace('\\varnothing', '∅')}`, col: h[j] ? C.ok : SB.line, size: 15 });
      });
    },
    press(G, x, y) { const q = (G.spots || []).find(q => hitBox(q, x, y)); if (!q) return false; G.drag = { v: q.v, tray: !!q.tray, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const c = G.cs[1], inB = Math.hypot(x - c.x, y - c.y) < c.r + 10, B = G.s.B;
      if (d.tray && inB && !B.includes(d.v)) { B.push(d.v); G.touch(); } else if (!d.tray && !inB) { B.splice(B.indexOf(d.v), 1); G.touch(); }
    },
    demo(G) { const want = answer(G.r) || [], q = G.spots?.find(q => q.tray && want.includes(q.v)); return q ? { from: { x: q.x + q.w / 2, y: q.y + 14 }, to: { x: G.cs[1].x + G.cs[1].r * 0.4, y: G.cs[1].y }, text: 'Arrastra a B', ty: G.box.y + 18 } : null; },
    peek: G => ({ spots: G.spots, cs: G.cs, answer: answer(G.r) }),
  });
  return Object.assign(game, { answer, holds });
})();
