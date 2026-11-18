// Las vueltas de i (Álgebra, alg-23c; spec 2026-11-18-algebra-revision): multiplicar por i es dar un cuarto de vuelta, así
// que iⁿ da n cuartos de vuelta y se repite cada 4. Se gira la flecha arrastrando su punta (salta a 1, i, −1, −i) y se
// cuentan las vueltas. Hay que dejar la flecha en el valor de iⁿ.
// params = { rounds: [{ n }] }   state = { rounds: [{ q }] }   (0: 1, 1: i, 2: −1, 3: −i)
GAMES['vueltas-i'] = (() => {
  const NAME = ['1', 'i', '-1', '-i'];
  const ok = (s, r) => s.q === r.n % 4;
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ q: 1 }),
    ok,
    solution: r => `i^${r.n} = ${NAME[r.n % 4]}: ${r.n} = 4·${Math.floor(r.n / 4)} + ${r.n % 4}`,
    prompt: r => `¿Cuánto vale $i^{${r.n}}$? Gira la flecha`,
    foot: () => 'Cada cuarto de vuelta es multiplicar por i; cuatro cuartos vuelven al 1',
    layout(G) { G.c = { x: G.W / 2, y: 96 + (G.H - 190) / 2 }; G.R = Math.min(G.W / 2 - 40, (G.H - 200) / 2); G.fb = { x: 12, y: G.H - 76, w: G.W - 24, h: 48 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r, c, R } = G, q = G.locked && !ok(G.s, r) ? r.n % 4 : G.s.q, ang = q * Math.PI / 2;
      p.noFill(); p.stroke(C.line); p.strokeWeight(1.5); p.circle(c.x, c.y, 2 * R); p.line(c.x - R - 10, c.y, c.x + R + 10, c.y); p.line(c.x, c.y - R - 10, c.x, c.y + R + 10);
      ['1', 'i', '−1', '−i'].forEach((t, k) => TK.label(p, C, t, c.x + Math.cos(k * Math.PI / 2) * (R + 18), c.y - Math.sin(k * Math.PI / 2) * (R + 18), k === q ? C.brand : C.mute, 13, 30));
      const tx = c.x + Math.cos(ang) * R, ty = c.y - Math.sin(ang) * R;
      p.stroke(C.brand); p.strokeWeight(4); p.line(c.x, c.y, tx, ty); RK.knob(p, C, tx, ty, C.brand); G.tip = { x: tx, y: ty };
      RK.strip(p, C, G.fb, `$i^{${r.n}} = i^{4\\cdot${Math.floor(r.n / 4)} + ${r.n % 4}} \\;?\\; ${NAME[q]}$`, { kicker: `${r.n} cuartos de vuelta`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.hypot(x - G.c.x, y - G.c.y) > G.R + 30) return false; G.grab = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.grab) return false; game.move(G, x, y); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: G.tip, to: { x: G.c.x, y: G.c.y - G.R }, text: 'Gira la flecha', ty: G.c.y + G.R + 26 }),
    peek: G => ({ c: G.c, R: G.R }),
  });
  game.move = (G, x, y) => { let a = Math.atan2(G.c.y - y, x - G.c.x); if (a < 0) a += 2 * Math.PI; const q = Math.round(a / (Math.PI / 2)) % 4; if (q !== G.s.q || !G.touched[G.cur]) { G.s.q = q; G.touch(); } };
  return game;
})();
