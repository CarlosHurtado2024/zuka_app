// Multiplica por la razón (Trigonometría, trig-42c; con sen, cos y tan en trig-1): en una situación se conoce un lado y un ángulo y
// se busca otro lado. Se elige la razón que convierte el lado conocido en el buscado; el juego hace la cuenta.
// item = { q, known: 'op'|'ady'|'hip', want, val, deg, unit, fns? }
GAMES['multiplica-razon'] = (() => {
  const RATIO = { 'op/hip': 'sen', 'ady/hip': 'cos', 'op/ady': 'tan', 'hip/op': 'csc', 'hip/ady': 'sec', 'ady/op': 'cot' };
  const ALL = ['sen', 'cos', 'tan', 'csc', 'sec', 'cot'], IDX = { op: 0, ady: 1, hip: 2 };
  const fn = it => RATIO[`${it.want}/${it.known}`], res = it => Math.round(it.val * TK.F[fn(it)](TK.rad(it.deg)) * 10) / 10;
  return questGame({
    aspect: 1.35,
    init: () => ({ pick: null }),
    ok: (s, it) => s.pick === fn(it),
    answer: it => ({ pick: fn(it) }),
    solution: it => `$${it.val} \\cdot ${TK.FN[fn(it)]}\\,${it.deg}^\\circ \\approx ${res(it)}$ ${it.unit}`,
    prompt: it => it.q,
    foot: () => 'lado buscado = lado conocido × razón',
    no: (it, s) => `$${TK.FN[s.pick]}$ une otros dos lados`,
    layout(G) {
      const fns = G.item.fns || ALL, rows = Math.ceil(fns.length / 3), w = (G.W - 24 - 16) / 3, y0 = G.bottom - rows * 44 - 2;
      G.tile = fns.map((f, i) => ({ f, x: 12 + (i % 3) * (w + 8), y: y0 + Math.floor(i / 3) * 44, w, h: 36 }));
      const h = Math.min(y0 - G.top - 78, 130), a = TK.rad(Math.max(28, Math.min(62, G.item.deg))), bw = Math.min(G.W - 130, h / Math.tan(a)), x0 = (G.W - bw) / 2, yb = y0 - 30;
      G.A = [x0, yb]; G.B = [x0 + bw, yb]; G.T = [x0 + bw, yb - bw * Math.tan(a)]; G.eqY = G.top + 20;
    },
    draw(G) {
      const { p, C, s, item: it, A, B, T } = G, seg = [[B, T], [A, B], [A, T]], cen = [(A[0] + B[0] + T[0]) / 3, (A[1] + B[1] + T[1]) / 3], k = IDX[it.known], w = IDX[it.want];
      TK.label(p, C, G.solved ? `$${it.val} \\times ${TK.FN[fn(it)]}\\,${it.deg}^\\circ \\approx ${res(it)}$ ${it.unit}` : `$? = ${it.val} \\times \\square$`, G.W / 2, G.eqY, G.solved ? C.ok : C.ink, 19, G.W - 30);
      p.noStroke(); p.fill(C.card); p.triangle(...A, ...B, ...T);
      seg.forEach(([a, b], i) => { p.stroke(i === k ? C.sky : i === w ? C.coral : C.mute); p.strokeWeight(i === k || i === w ? 5 : 2); p.line(...a, ...b); });
      p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.rect(B[0] - 11, B[1] - 11, 11, 11);
      TK.sideLabel(p, C, `${it.val} ${it.unit}`, ...seg[k], cen, C.sky, 13); TK.sideLabel(p, C, G.solved ? `${res(it)} ${it.unit}` : '?', ...seg[w], cen, C.coral, G.solved ? 13 : 18);
      TK.label(p, C, `${it.deg}°`, A[0] + 34, A[1] - 9, C.N, 12, 40);
      G.tile.forEach(t => drawTile(p, C, t, `$${TK.FN[t.f]}\\,${it.deg}^\\circ$`, { fill: G.solved && t.f === fn(it) ? C.ok : s.pick === t.f ? C.coral : C.cream, size: 15, r: 10 }));
    },
    press(G, x, y) {
      const t = G.tile.find(b => hitBox(b, x, y));
      if (!t) return false;
      G.s.pick = t.f; G.submit();
      return true;
    },
    peek: G => ({ solve: [G.tile.find(t => t.f === fn(G.item))], wrong: G.tile.find(t => t.f !== fn(G.item)) }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
