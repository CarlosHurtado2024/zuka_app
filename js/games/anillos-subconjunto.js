// Aros de subconjuntos (Álgebra 0, alg-0b; juego en movimiento; spec 2026-11-18-algebra-revision): abajo hay un aro
// con un conjunto X y arriba tres estacas con conjuntos. El aro solo se queda en una estaca Y si X ⊆ Y: todos los
// elementos de X están en Y. Se arrastra el lanzador de lado a lado para apuntar y al soltar el aro vuela; si no
// encaja, rebota y quita una vida. Sin prisa: nada se mueve hasta que el estudiante suelta.
// params = { rounds: [{ title, items: [{ ring: [..], pegs: [[..], [..], [..]] }] }] }   s = { x, shot, peg }
GAMES['anillos-subconjunto'] = (() => {
  const sub = (X, Y) => X.every(v => Y.includes(v));
  const txt = X => (X.length ? `{${X.join(', ')}}` : '∅');
  const goods = it => it.pegs.map((Y, i) => (sub(it.ring, Y) ? i : -1)).filter(i => i >= 0);
  const game = questGame({
    aspect: 1.25,
    idle: 'Apunta con calma; el aro sale al soltar',
    init: () => ({ x: null, shot: null, peg: null }),
    ok: (s, it) => s.peg != null && sub(it.ring, it.pegs[s.peg]),
    answer: it => ({ x: null, shot: null, peg: goods(it)[0] }),
    solution: it => `${txt(it.ring)} ⊆ ${goods(it).map(i => txt(it.pegs[i])).join(' y ')}`,
    prompt: () => 'Lanza el aro a una estaca que lo contenga',
    foot: (it, s) => (s.missed ? 'Revisa elemento por elemento: ¿están todos en la estaca?' : 'X ⊆ Y: cada elemento de X está en Y'),
    layout(G) { G.pegY = G.top + 70; G.baseY = G.bottom - 40; G.px = i => G.W * (0.2 + 0.3 * i); },
    draw(G) {
      const { p, C, s, item: it } = G, [SA, SB] = SK.sets(C);
      // Las estacas con su conjunto.
      it.pegs.forEach((Y, i) => {
        const x = G.px(i);
        p.stroke(C.line); p.strokeWeight(5); p.line(x, G.pegY - 8, x, G.pegY + 60);
        p.noStroke(); p.fill(C.line); p.rect(x - 22, G.pegY + 58, 44, 6, 3);
        SK.chip(p, C, { x: x - 44, y: G.pegY - 40, w: 88, h: 28 }, txt(Y), { state: 'on', col: SB.line, size: 13, r: 10 });
      });
      // El lanzador y el aro.
      const x0 = s.x ?? G.W / 2;
      p.stroke(C.line); p.strokeWeight(2); p.line(24, G.baseY + 24, G.W - 24, G.baseY + 24);
      let rx = x0, ry = G.baseY, k = 0;
      if (s.shot != null) {
        k = Math.min(1, (G.t - s.shot) / 0.9);
        const tx = G.px(s.peg), ty = G.pegY + 26;
        rx = x0 + (tx - x0) * k; ry = G.baseY + (ty - G.baseY) * k - Math.sin(k * Math.PI) * 60;
        if (k >= 1 && !G.solved) {
          if (game.okShot(s, it)) G.good('¡Encaja! Todos sus elementos están en la estaca');
          else { const miss = it.ring.filter(v => !it.pegs[s.peg].includes(v)); s.shot = null; s.missed = true; G.bad(`No encaja: falta ${miss.join(', ')}`); }
        }
      } else { p.noStroke(); p.fill(SK.al(p, SA.line, 60)); p.triangle(x0, G.baseY + 16, x0 - 10, G.baseY + 26, x0 + 10, G.baseY + 26); if (s.x != null) { p.stroke(SK.al(p, C.brand, 140)); p.strokeWeight(1.4); p.drawingContext.setLineDash([4, 5]); p.line(x0, G.baseY - 20, G.px(game.near(G, x0)), G.pegY + 64); p.drawingContext.setLineDash([]); } }
      if (G.solved && s.peg != null) { rx = G.px(s.peg); ry = G.pegY + 26; }
      SK.membrane(p, C, rx, ry, 40, 15, SA.line, { fill: 30, w: 3 });
      p.noStroke(); p.fill(SA.ink); p.textAlign(p.CENTER, p.CENTER); fitText(p, txt(it.ring), rx, ry, 70, 13);
      G.ring = { x: x0, y: G.baseY };
    },
    press(G, x, y) { if (G.s.shot != null || y < G.baseY - 50) return false; G.s.x = Math.max(30, Math.min(G.W - 30, x)); return true; },
    drag(G, x) { if (G.s.shot != null || G.s.x == null) return false; G.s.x = Math.max(30, Math.min(G.W - 30, x)); return true; },
    release(G) { const s = G.s; if (s.x != null && s.shot == null && !G.solved) { s.peg = game.near(G, s.x); s.shot = G.t; G.api.sfx?.tap?.(); } },
    demo(G) { return G.ring ? { from: { x: G.W / 2, y: G.baseY }, to: { x: G.px(0), y: G.baseY }, text: 'Arrastra el lanzador y suelta', ty: G.baseY - 60 } : null; },
    peek: G => ({ baseY: G.baseY, pegs: [0, 1, 2].map(i => G.px(i)), goods: goods(G.item), flying: G.s.shot != null }),
  });
  game.near = (G, x) => [0, 1, 2].reduce((b, i) => (Math.abs(G.px(i) - x) < Math.abs(G.px(b) - x) ? i : b), 0);
  game.okShot = (s, it) => s.peg != null && sub(it.ring, it.pegs[s.peg]);
  return Object.assign(game, { goods, sub });
})();
