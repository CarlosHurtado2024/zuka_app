// Las potencias de 11 (Álgebra, alg-24c; spec 2026-11-18-algebra-revision): 11 = 10 + 1, así que 11ⁿ = (10 + 1)ⁿ y sus
// cifras son la fila n de Pascal (mientras ningún número pase de 9; después se lleva, como en una suma). Se arrastra n
// y se ven la fila y la potencia. Hay que encontrar la potencia de 11 que da el número pedido.
// params = { rounds: [{ value }] }   state = { rounds: [{ n }] }   (de 0 a 6)
GAMES['once-potencias'] = (() => {
  const row = n => GAMES['triangulo-pascal'].row(n);
  const ok = (s, r) => 11 ** s.n === r.value;
  const need = r => Math.round(Math.log(r.value) / Math.log(11));
  const game = roundsGame({
    aspect: 1,
    init: () => ({ n: 0 }),
    ok,
    solution: r => `11^${need(r)} = ${r.value}`,
    prompt: r => `¿Qué potencia de 11 da ${r.value}?`,
    foot: () => 'Arrastra n: compara la fila de Pascal con las cifras',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, n = G.locked && !ok(G.s, r) ? need(r) : G.s.n, R = row(n);
      TK.label(p, C, 'fila de Pascal', G.W / 2, 110, C.mute, 11, 120);
      const w = Math.min(40, (G.W - 20) / R.length - 4);
      R.forEach((v, i) => RK.chip(p, C, { x: G.W / 2 - (R.length * (w + 4) - 4) / 2 + i * (w + 4), y: 122, w, h: 32 }, String(v), { on: true, col: v > 9 ? C.coral : C.sky, size: 13 }));
      TK.label(p, C, `11^${n} = ${11 ** n}`, G.W / 2, 186, 11 ** n === r.value ? C.ok : C.ink, 20, G.W - 30);
      if (R.some(v => v > 9)) TK.label(p, C, 'hay números de dos cifras: se llevan', G.W / 2, 212, C.coral, 11, G.W - 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 7, n, i => String(i));
      RK.strip(p, C, G.fb, `$11^{${n}} = (10 + 1)^{${n}} = ${11 ** n}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.n), y: G.tY }, to: { x: G.X(G.s.n + 2), y: G.tY }, text: 'Arrastra n', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const n = RK.pick(x, 30, G.W - 30, 7); if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { need });
})();
