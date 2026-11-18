// El marco del cuadro (Álgebra, alg-3; spec 2026-11-18-algebra-revision): un marco de ancho w alrededor de un cuadro de
// lado x tiene área (x + 2w)² − x² = 4wx + 4w². Se arrastra el lado del cuadro y el marco se dibuja con su área. Hay que
// encontrar el cuadro cuyo marco tiene el área pedida.
// params = { rounds: [{ w, area }] }   state = { rounds: [{ x }] }   (de 1 a 15)
GAMES['marco-cuadro'] = (() => {
  const A = (r, x) => (x + 2 * r.w) ** 2 - x * x;
  const need = r => { for (let x = 1; x <= 15; x++) if (A(r, x) === r.area) return x; return -1; };
  const ok = (s, r) => A(r, s.x) === r.area;
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ x: 1 }),
    ok,
    solution: r => `x = ${need(r)}: (${need(r)} + ${2 * r.w})² − ${need(r)}² = ${r.area}`,
    prompt: r => `El marco mide ${r.w} de ancho y tiene área ${r.area}. ¿Lado del cuadro?`,
    foot: () => 'Arrastra el lado del cuadro',
    layout(G) { G.tY = G.H - 108; G.fb = { x: 12, y: G.H - 72, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, x = G.locked && !ok(G.s, r) ? need(r) : G.s.x, T = x + 2 * r.w, k = Math.min(G.W - 80, G.H * 0.42) / 19, ox = G.W / 2 - T * k / 2, oy = 106;
      p.noStroke(); p.fill(C.sun); p.rect(ox, oy, T * k, T * k, 3); p.fill(C.card); p.rect(ox + r.w * k, oy + r.w * k, x * k, x * k);
      p.noFill(); p.stroke(C.ink); p.strokeWeight(1.4); p.rect(ox, oy, T * k, T * k, 3); p.rect(ox + r.w * k, oy + r.w * k, x * k, x * k);
      TK.label(p, C, `x = ${x}`, G.W / 2, oy + T * k / 2, C.ink, 12, 60);
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, 15, x - 1, i => ((i + 1) % 2 ? String(i + 1) : null));
      RK.strip(p, C, G.fb, `$(${x} + ${2 * r.w})^2 - ${x}^2 = ${4 * r.w}\\cdot${x} + ${4 * r.w * r.w} = ${A(r, x)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 30) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x - 1), y: G.tY }, to: { x: G.X(G.s.x + 4), y: G.tY }, text: 'Arrastra el lado', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 30, G.W - 30, 15) + 1; if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { need });
})();
