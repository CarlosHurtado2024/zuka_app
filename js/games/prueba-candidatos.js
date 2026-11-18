// Los candidatos racionales (Álgebra, alg-93; spec 2026-11-18-algebra-revision): con coeficientes enteros y el primero 1,
// un cero entero tiene que dividir al término independiente. Las fichas son los divisores con su signo; se arrastra cada
// una al probador, que calcula P(c). Hay que llevar a la caja de los ceros todos los que dan 0, y solo esos.
// params = { rounds: [{ P: [coef.], cands: [..] }] }   state = { rounds: [{ zeros: [índices], tried: [índices] }] }
GAMES['prueba-candidatos'] = (() => {
  const val = (P, x) => P.reduce((a, q) => a * x + q, 0);
  const goods = r => r.cands.map((c, i) => (val(r.P, c) === 0 ? i : -1)).filter(i => i >= 0);
  const ok = (s, r) => [...s.zeros].sort().join() === goods(r).join();
  const poly = P => GAMES['iguala-coeficientes'].poly3([...Array(4 - P.length).fill(0), ...P]);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ zeros: [], tried: [] }),
    ok,
    answered: s => s.zeros.length > 0,
    solution: r => `ceros: ${goods(r).map(i => r.cands[i]).join(', ')}`,
    prompt: r => `Encuentra los ceros enteros de $${poly(r.P)}$`,
    foot: () => 'Arrastra un candidato al probador; si da 0, llévalo a los ceros',
    layout(G) { G.tester = { x: 16, y: 104, w: G.W / 2 - 24, h: 70 }; G.box = { x: G.W / 2 + 8, y: 104, w: G.W / 2 - 24, h: 70 }; G.cy = 210; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.drag = null; G.last = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { zeros: goods(r), tried: goods(r) } : G.s;
      p.stroke(C.brand); p.strokeWeight(1.4); p.fill(RK.al(p, C.brand, 18)); p.rect(G.tester.x, G.tester.y, G.tester.w, G.tester.h, 12);
      TK.label(p, C, 'probador', G.tester.x + G.tester.w / 2, G.tester.y - 10, C.mute, 10, 80);
      if (G.last != null) TK.label(p, C, `P(${r.cands[G.last]}) = ${val(r.P, r.cands[G.last])}`, G.tester.x + G.tester.w / 2, G.tester.y + G.tester.h / 2, val(r.P, r.cands[G.last]) === 0 ? C.ok : C.ink, 14, G.tester.w - 8);
      p.stroke(C.ok); p.fill(RK.al(p, C.ok, 18)); p.rect(G.box.x, G.box.y, G.box.w, G.box.h, 12); TK.label(p, C, 'ceros', G.box.x + G.box.w / 2, G.box.y - 10, C.mute, 10, 60);
      G.spots = [];
      s.zeros.forEach((i, j) => G.spots.push({ i, x: G.box.x + 8 + j * 40, y: G.box.y + 18, w: 36, h: 32, z: true }));
      const free = r.cands.map((_, i) => i).filter(i => !s.zeros.includes(i)), w = Math.min(42, (G.W - 20) / Math.ceil(free.length / 2) - 4);
      free.forEach((i, j) => G.spots.push({ i, x: 16 + (j % Math.ceil(free.length / 2)) * (w + 4), y: G.cy + Math.floor(j / Math.ceil(free.length / 2)) * 40, w, h: 32 }));
      G.spots.forEach(q => { if (G.drag?.i !== q.i) RK.chip(p, C, q, String(r.cands[q.i]), { on: q.z || s.tried.includes(q.i), col: q.z ? C.ok : val(r.P, r.cands[q.i]) === 0 ? C.ok : C.coral, size: 12 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 20, y: G.drag.y - 16, w: 40, h: 32 }, String(r.cands[G.drag.i]), { on: true, size: 12 });
      RK.strip(p, C, G.fb, `$\\text{ceros: } ${s.zeros.map(i => r.cands[i]).join(',\\ ') || '\\varnothing'}$`, { kicker: 'Candidatos: divisores del último coeficiente', col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const q = (G.spots || []).find(q => hitBox(q, x, y)); if (!q) return false; G.drag = { i: q.i, z: !!q.z, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; G.drag = null; if (!d) return;
      const s = G.s;
      if (hitBox(G.tester, x, y)) { G.last = d.i; if (!s.tried.includes(d.i)) s.tried.push(d.i); if (d.z) s.zeros.splice(s.zeros.indexOf(d.i), 1); G.touch(); return; }
      if (hitBox(G.box, x, y) && !d.z) { s.zeros.push(d.i); G.touch(); return; }
      if (d.z && !hitBox(G.box, x, y)) { s.zeros.splice(s.zeros.indexOf(d.i), 1); G.touch(); }
    },
    demo(G) { const q = G.spots?.find(q => !q.z); return q ? { from: { x: q.x + q.w / 2, y: q.y + 16 }, to: { x: G.tester.x + G.tester.w / 2, y: G.tester.y + 35 }, text: 'Arrastra al probador', ty: G.cy + 90 } : null; },
    peek: G => ({ spots: G.spots, tester: G.tester, box: G.box }),
  });
  return Object.assign(game, { goods });
})();
