// La escalera de potencias (Álgebra, alg-21a; spec 2026-11-18-algebra-revision): subir un escalón es multiplicar por la
// base y bajar uno es dividir. Se arrastra la marca por la escalera; cada escalón por el que pasa muestra su valor, así
// se ve que b⁰ = 1 y que los exponentes negativos son fracciones. Hay que llegar al exponente que da el valor pedido.
// params = { rounds: [{ base, num, den }] }   (valor pedido num/den)   state = { rounds: [{ e }] }   (de −4 a 4)
GAMES['escalera-potencias'] = (() => {
  const val = (b, e) => b ** e;
  const need = r => { for (let e = -4; e <= 4; e++) if (Math.abs(val(r.base, e) - r.num / r.den) < 1e-12) return e; return null; };
  const ok = (s, r) => s.e === need(r);
  const frac = (b, e) => (e >= 0 ? `${b ** e}` : `\\tfrac{1}{${b ** -e}}`);
  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ e: 1 }),
    ok,
    solution: r => `${r.base}^${need(r)} = ${r.den === 1 ? r.num : `${r.num}/${r.den}`}`,
    prompt: r => `¿Qué exponente de ${r.base} da $${r.den === 1 ? r.num : `\\tfrac{${r.num}}{${r.den}}`}$?`,
    foot: (r) => `Subir es × ${r.base}; bajar es ÷ ${r.base}`,
    layout(G) { G.y0 = 104; G.y1 = G.H - 96; G.x = G.W * 0.42; G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = false; G.seen = new Set([0, 1]); },
    draw(G) {
      const { p, C, r } = G, e = G.locked && !ok(G.s, r) ? need(r) : G.s.e, Y = k => G.y1 - (k + 4) * (G.y1 - G.y0) / 8;
      if (!G.seen) G.seen = new Set([0, 1]);
      for (let k = Math.min(1, e); k <= Math.max(1, e); k++) G.seen.add(k);
      p.stroke(C.line); p.strokeWeight(3); p.line(G.x - 40, Y(-4) + 10, G.x - 40, Y(4) - 10); p.line(G.x + 40, Y(-4) + 10, G.x + 40, Y(4) - 10);
      for (let k = -4; k <= 4; k++) {
        p.stroke(k === 0 ? C.sun : C.line); p.strokeWeight(k === 0 ? 3 : 2); p.line(G.x - 40, Y(k), G.x + 40, Y(k));
        TK.label(p, C, `$${r.base}^{${k}}$`, G.x - 70, Y(k), C.mute, 12, 50);
        if (G.seen.has(k) || G.locked) TK.label(p, C, `$${frac(r.base, k)}$`, G.x + 82, Y(k), k === e ? C.brand : C.ink, 13, 70);
      }
      RK.knob(p, C, G.x, Y(e), C.brand); G.ky = Y(e); G.Y = Y;
      RK.strip(p, C, G.fb, `$${r.base}^{${e}} = ${frac(r.base, e)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 19 });
    },
    press(G, x, y) { if (Math.abs(x - G.x) > 70) return false; G.grab = true; game.move(G, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.x, y: G.ky }, to: { x: G.x, y: G.Y(-1) }, text: 'Arrastra la marca por la escalera', ty: G.y0 - 8 }),
    peek: G => ({ x: G.x, y0: G.y0, y1: G.y1 }),
  });
  game.move = (G, y) => { const e = Math.max(-4, Math.min(4, Math.round(-4 + ((G.y1 - y) / (G.y1 - G.y0)) * 8))); if (e !== G.s.e || !G.touched[G.cur]) { G.s.e = e; G.touch(); } };
  return Object.assign(game, { need });
})();
