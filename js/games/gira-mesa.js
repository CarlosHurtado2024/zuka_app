// Girar no cambia la mesa (Preuniversitario, pu-or-2; spec 2026-11-18-preuda-razonamiento-completo): en una mesa redonda
// lo que importa es quién está junto a quién, no en qué silla. A la izquierda está una mesa; a la derecha, la misma gente
// en otro orden aparente. Se arrastra la mesa de la derecha para girarla hasta que coincida silla por silla con la de la
// izquierda: así se ve que eran el mismo acomodo.
// params = { rounds: [{ left: [nombres], shift }] }   (la mesa de la derecha es la izquierda girada `shift` sillas)
// state = { rounds: [{ k }] }   (giro aplicado a la de la derecha)
GAMES['gira-mesa'] = (() => {
  const right = r => r.left.map((_, i) => r.left[(i + r.shift) % r.left.length]);
  const view = (r, k) => { const R = right(r), n = R.length; return R.map((_, i) => R[(i - k + n * 10) % n]); };
  const ok = (s, r) => view(r, s.k).join() === r.left.join();
  const answer = r => ({ k: r.shift % r.left.length });
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ k: 0 }),
    ok,
    solution: r => `girar ${answer(r).k} sillas`,
    prompt: () => 'Gira la mesa de la derecha hasta que sea igual a la otra',
    foot: () => 'Arrastra alrededor de la mesa de la derecha para girarla',
    layout(G) { G.cL = { x: G.W * 0.27, y: 180 }; G.cR = { x: G.W * 0.73, y: 180 }; G.R = Math.min(G.W * 0.18, 66); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), n = r.left.length;
      const table = (c, list, col) => { p.noStroke(); p.fill(RK.al(p, C.card, 200)); p.circle(c.x, c.y, G.R * 1.2); list.forEach((nm, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; RK.chip(p, C, { x: c.x + G.R * Math.cos(a) - 24, y: c.y + G.R * Math.sin(a) - 12, w: 48, h: 24 }, nm, { on: true, col, size: 10 }); }); };
      table(G.cL, r.left, C.sky); table(G.cR, view(r, s.k), good ? C.ok : C.coral);
      TK.label(p, C, 'esta', G.cL.x, G.cL.y, C.mute, 10, 40); TK.label(p, C, '↻ gírala', G.cR.x, G.cR.y, C.mute, 10, 60);
      RK.strip(p, C, G.fb, good ? '$\\text{es el mismo acomodo}$' : `$\\text{girada ${s.k} silla${s.k === 1 ? '' : 's'}}$`, { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.hypot(x - G.cR.x, y - G.cR.y) > G.R + 40) return false; G.grab = true; G.a0 = Math.atan2(y - G.cR.y, x - G.cR.x); G.k0 = G.s.k; return true; },
    drag(G, x, y) { if (!G.grab) return false; const n = G.r.left.length, a = Math.atan2(y - G.cR.y, x - G.cR.x), d = Math.round((a - G.a0) / (2 * Math.PI / n)), k = ((G.k0 + d) % n + n) % n; if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.cR.x + G.R, y: G.cR.y }, to: { x: G.cR.x, y: G.cR.y + G.R }, text: 'Gira la mesa', ty: G.cR.y + G.R + 40 }),
    peek: G => ({ cR: G.cR, R: G.R }),
  });
  return Object.assign(game, { answer });
})();
