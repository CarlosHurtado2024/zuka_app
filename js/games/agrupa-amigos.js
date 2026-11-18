// Números amigos (Álgebra, alg-12b; spec 2026-11-18-algebra-revision): la conmutativa y la asociativa dejan sumar en el
// orden y con los paréntesis que se quiera. Cuatro números sueltos y dos platos: se arrastran de a dos a cada plato y
// cada plato muestra su suma. Hay que formar parejas que den cifras redondas (centenas), para que la cuenta salga fácil.
// params = { rounds: [{ nums: [4 números], unit }] }   state = { rounds: [{ plates: [[i, j], [k, l]] }] }
GAMES['agrupa-amigos'] = (() => {
  const sum = (r, P) => P.reduce((a, i) => a + r.nums[i], 0);
  const ok = (s, r) => s.plates.every(P => P.length === 2 && sum(r, P) % r.unit === 0);
  // Las parejas buenas (para la solución y las pruebas).
  function answer(r) { const n = r.nums; for (let j = 1; j < 4; j++) { const a = [0, j], b = [1, 2, 3].filter(k => k !== j); if ((n[0] + n[j]) % r.unit === 0 && (n[b[0]] + n[b[1]]) % r.unit === 0) return { plates: [a, b] }; } return null; }
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ plates: [[], []] }),
    ok,
    answered: s => s.plates.some(P => P.length),
    solution: r => { const a = answer(r); return a.plates.map(P => `(${P.map(i => r.nums[i]).join(' + ')})`).join(' + ') + ` = ${r.nums.reduce((x, y) => x + y, 0)}`; },
    prompt: r => `Suma $${r.nums.join(' + ')}$ en parejas redondas`,
    foot: () => 'El orden y los paréntesis no cambian una suma: arrastra de a dos a cada plato',
    layout(G) { const W = G.W, H = G.H; G.trayY = 104; G.pl = [0, 1].map(k => ({ x: 14 + k * (W - 28) / 2 + 4, y: H * 0.42, w: (W - 28) / 2 - 8, h: 92 })); G.fb = { x: 12, y: H - 84, w: W - 24, h: 52 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, good = ok(G.s, r), s = G.locked && !good ? answer(r) : G.s, w = 58, h = 36;
      G.spots = [];
      const free = r.nums.map((_, i) => i).filter(i => !s.plates.some(P => P.includes(i)));
      free.forEach((i, j) => { const x = G.W / 2 - (free.length * (w + 8) - 8) / 2 + j * (w + 8); G.spots.push({ i, x, y: G.trayY, w, h }); });
      s.plates.forEach((P, k) => {
        const b = G.pl[k], full = P.length === 2, round = full && sum(r, P) % r.unit === 0;
        p.stroke(G.locked ? C.ok : round ? C.ok : C.line); p.strokeWeight(round ? 2 : 1.2); p.fill(RK.al(p, C.card, 220)); p.rect(b.x, b.y, b.w, b.h, 14);
        P.forEach((i, j) => G.spots.push({ i, x: b.x + 8 + j * (b.w - 16 - w) , y: b.y + 10, w, h }));
        TK.label(p, C, P.length ? `= ${sum(r, P)}` : 'plato', b.x + b.w / 2, b.y + b.h - 18, round ? C.ok : C.mute, 15, b.w - 10);
      });
      G.spots.forEach(q => { if (G.drag?.i !== q.i) RK.chip(p, C, q, r.nums[q.i], { on: s.plates.some(P => P.includes(q.i)), col: C.mint, size: 16 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - h / 2, w, h }, r.nums[G.drag.i], { on: true, size: 16 });
      const tex = s.plates.map(P => (P.length ? `(${P.map(i => r.nums[i]).join(' + ')})` : '\\square')).join(' + ');
      RK.strip(p, C, G.fb, `$${tex}${ok(s, r) ? ` = ${r.nums.reduce((x, y) => x + y, 0)}` : ''}$`, { kicker: 'Reagrupada', col: G.locked ? C.ok : C.mint, size: 17 });
    },
    press(G, x, y) { const q = (G.spots || []).find(q => hitBox(q, x, y)); if (!q) return false; G.drag = { i: q.i, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const s = G.s, k = G.pl.findIndex(b => hitBox({ x: b.x - 6, y: b.y - 10, w: b.w + 12, h: b.h + 20 }, x, y));
      s.plates.forEach(P => { const j = P.indexOf(d.i); if (j >= 0) P.splice(j, 1); });
      if (k >= 0 && s.plates[k].length < 2) s.plates[k].push(d.i);
      G.touch();
    },
    demo(G) { const q = G.spots?.[0]; return q ? { from: { x: q.x + q.w / 2, y: q.y + q.h / 2 }, to: { x: G.pl[0].x + G.pl[0].w / 2, y: G.pl[0].y + 30 }, text: 'Arrastra a un plato', ty: G.pl[0].y + G.pl[0].h + 18 } : null; },
    peek: G => ({ spots: G.spots, pl: G.pl }),
  });
  return Object.assign(game, { answer });
})();
