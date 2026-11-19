// Leer una gráfica de barras (Preuniversitario, pu-gr-1 y pu-gr-3; spec 2026-11-18-preuda-razonamiento-completo): la escala
// manda. Se ve una gráfica de barras (a veces con el eje que no empieza en cero) y una pregunta (el valor de una barra, la
// diferencia entre dos o el total). Se desliza el marcador de abajo hasta la respuesta; las barras de la pregunta se resaltan.
// params = { rounds: [{ bars: [[rótulo, valor]], lo, hi, step, q: 'val' | 'diff' | 'sum', a, b?, max, tstep }] }
// state = { rounds: [{ i }] }   (respuesta = i · tstep)
GAMES['lee-barras'] = (() => {
  const ans = r => { const v = r.bars.map(b => b[1]); return r.q === 'sum' ? v.reduce((a, c) => a + c, 0) : r.q === 'diff' ? Math.abs(v[r.a] - v[r.b]) : v[r.a]; };
  const n = r => Math.round(r.max / r.tstep) + 1;
  const ok = (s, r) => s.i * r.tstep === ans(r);
  const ask = r => (r.q === 'sum' ? '¿Cuánto suman todas las barras?' : r.q === 'diff' ? `¿Cuánto más tiene ${r.bars[r.a][0]} que ${r.bars[r.b][0]}?` : `¿Cuánto tiene ${r.bars[r.a][0]}?`);
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ i: ans(r) === 0 ? 1 : 0 }),
    ok,
    solution: r => `${ans(r)}`,
    prompt: ask,
    foot: () => 'Desliza el marcador hasta la respuesta',
    layout(G) { G.b = { x: 44, y: 96, w: G.W - 60, h: G.H - 266 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { i: ans(r) / r.tstep } : G.s, good = ok(s, r), lo = r.lo ?? 0;
      const Y = GRAF.axes(p, C, G.b, lo, r.hi, r.step);
      const hl = r.q === 'sum' ? r.bars.map((_, i) => i) : r.q === 'diff' ? [r.a, r.b] : [r.a];
      GRAF.bars(p, C, G.b, r.bars.map(b => b[1]), r.bars.map(b => b[0]), Y, { lo, hl });
      if (lo > 0) TK.label(p, C, `el eje empieza en ${lo}`, G.b.x + G.b.w / 2, G.b.y + G.b.h + 30, C.coral, 9, G.b.w);
      const N = n(r);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, N, s.i, k => (k % Math.ceil(N / 6) === 0 ? String(k * r.tstep) : null), good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$${s.i * r.tstep}$`, { kicker: good ? 'lectura correcta' : 'tu respuesta', col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 28) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.i), y: G.tY }, to: { x: G.X(G.s.i) + 60, y: G.tY }, text: 'Desliza el marcador', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const i = RK.pick(x, 30, G.W - 30, n(G.r)); if (i !== G.s.i || !G.touched[G.cur]) { G.s.i = i; G.touch(); } };
  return Object.assign(game, { answer: r => ({ i: ans(r) / r.tstep }) });
})();
