// El rectángulo de perímetro dado (Álgebra, alg-1; spec 2026-11-18-algebra-revision): un rectángulo de ancho x y largo
// x + m (o k·x) tiene perímetro 2(x + largo). Se arrastra x y el rectángulo crece con su perímetro escrito. Hay que llegar
// al perímetro pedido: es una ecuación lineal.
// params = { rounds: [{ m?, k?, P }] }   (largo = x + m, o k·x)   state = { rounds: [{ x }] }   (de 1 a 20)
GAMES['perimetro-x'] = (() => {
  const L = (r, x) => (r.k ? r.k * x : x + r.m);
  const per = (r, x) => 2 * (x + L(r, x));
  const need = r => { for (let x = 1; x <= 20; x++) if (per(r, x) === r.P) return x; return -1; };
  const ok = (s, r) => per(r, s.x) === r.P;
  const game = roundsGame({
    aspect: 1,
    init: () => ({ x: 1 }),
    ok,
    solution: r => `x = ${need(r)}: 2(${need(r)} + ${L(r, need(r))}) = ${r.P}`,
    prompt: r => `El largo es ${r.k ? `${r.k} veces el ancho` : `${r.m} más que el ancho`} y el perímetro, ${r.P}. ¿Ancho?`,
    foot: () => 'Arrastra el ancho',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 68, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? need(r) : G.s.x, l = L(r, x), u = Math.min((G.W - 60) / Math.max(l, 1), (G.tY - 160) / Math.max(x, 1), 14);
      p.stroke(per(r, x) === r.P || G.locked ? C.ok : C.brand); p.strokeWeight(3); p.fill(RK.al(p, C.sky, 50)); p.rect(G.W / 2 - l * u / 2, 110, l * u, x * u, 2);
      TK.label(p, C, `${l}`, G.W / 2, 100, C.mute, 11, 40); TK.label(p, C, `${x}`, G.W / 2 - l * u / 2 - 14, 110 + x * u / 2, C.mute, 11, 30);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 20, x - 1, i => ((i + 1) % 5 === 0 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$2(${x} + ${l}) = ${per(r, x)}$`, { kicker: `Meta: ${r.P}`, col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x - 1), y: G.tY }, to: { x: G.X(G.s.x + 5), y: G.tY }, text: 'Arrastra el ancho', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 20) + 1; if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { need });
})();
