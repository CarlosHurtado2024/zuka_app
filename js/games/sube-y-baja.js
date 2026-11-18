// Sube y baja (Álgebra, alg-13d; spec 2026-11-18-algebra-revision): subir un x % y luego bajar el mismo x % no devuelve
// al precio de antes: queda 100 · (1 + x)(1 − x) = 100(1 − x²). Se arrastra el porcentaje y se ven las tres barras: antes,
// después de subir y después de bajar. Hay que encontrar el porcentaje que deja el precio final pedido.
// params = { rounds: [{ end }] }   (precio final partiendo de 100)   state = { rounds: [{ x }] }   (x de 5 en 5, de 5 a 60)
GAMES['sube-y-baja'] = (() => {
  const end = x => 100 * (1 + x / 100) * (1 - x / 100);
  const need = r => { for (let x = 5; x <= 60; x += 5) if (Math.abs(end(x) - r.end) < 1e-9) return x; return -1; };
  const ok = (s, r) => s.x === need(r);
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ x: 5 }),
    ok,
    solution: r => `${need(r)} %: 100 × ${1 + need(r) / 100} × ${1 - need(r) / 100} = ${r.end}`,
    prompt: r => `Sube un x % y baja el mismo x %: queda en ${r.end}. ¿Cuánto es x?`,
    foot: () => 'Arrastra el porcentaje',
    layout(G) { G.base = G.H - 160; G.tY = G.H - 112; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? need(r) : G.s.x, vals = [100, 100 * (1 + x / 100), end(x)], Y = v => G.base - (G.base - 104) * v / 165, w = (G.W - 60) / 3;
      vals.forEach((v, i) => { p.noStroke(); p.fill([C.line, C.mint, C.coral][i]); p.rect(30 + i * w + 8, Y(v), w - 16, G.base - Y(v), 4); TK.label(p, C, `${+v.toFixed(2)}`, 30 + i * w + w / 2, Y(v) - 12, C.ink, 12, w); TK.label(p, C, ['antes', `+${x} %`, `−${x} %`][i], 30 + i * w + w / 2, G.base + 12, C.mute, 10, w); });
      p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.line(24, Y(r.end), G.W - 24, Y(r.end)); p.drawingContext.setLineDash([]);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 12, x / 5 - 1, i => ((i + 1) % 2 === 0 ? `${(i + 1) * 5}` : null));
      RK.strip(p, C, G.fb, `$100 \\times ${1 + x / 100} \\times ${1 - x / 100} = ${+end(x).toFixed(2)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x / 5 - 1), y: G.tY }, to: { x: G.X(G.s.x / 5 + 3), y: G.tY }, text: 'Arrastra el porcentaje', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = (RK.pick(x, 30, G.W - 30, 12) + 1) * 5; if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { need, end });
})();
