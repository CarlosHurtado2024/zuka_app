// Apunta el chorro (Álgebra, parábola y vértice; juego dinámico de alg-4a; spec 2026-11-21-dinamicos-mundos-altos):
// la fuente de Caro. Cada reto da la fórmula del chorro; hay que tocar en la cuadrícula el punto donde da la vuelta
// (el vértice) y luego «Lanzar»: el agua sale y, si el vértice está bien, pasa justo por la linterna. La fórmula puede
// venir armada, y = a(x − h)² + k, o sin armar (hay que completar el cuadrado o usar h = −b ÷ 2a).
// params = { rounds: [{ title, items: [{ a, h, k, std?: true }] }], lives? }   state = { done: [n] }
// La cuadrícula va de x = −5 a 5 y de y = −1 a 9.

GAMES['apunta-chorro'] = (() => {
  const sg = (v, first) => (v < 0 ? (first ? '-' : ' - ') : first ? '' : ' + ');
  const co = (c, first) => `${sg(c, first)}${Math.abs(c) === 1 ? '' : Math.abs(c)}`;
  const tex = it => {
    if (!it.std) return `y = ${it.a === 1 ? '' : it.a === -1 ? '-' : it.a}${it.h ? `(x ${it.h < 0 ? '+' : '-'} ${Math.abs(it.h)})^2` : 'x^2'}${it.k ? `${sg(it.k)}${Math.abs(it.k)}` : ''}`;
    const b = -2 * it.a * it.h, c = it.a * it.h * it.h + it.k;
    return `y = ${co(it.a, true)}x^2${b ? `${co(b)}x` : ''}${c ? `${sg(c)}${Math.abs(c)}` : ''}`;
  };
  return questGame({
    aspect: 1.4,
    init: () => ({ pt: null }),
    ok: (s, it) => !!s.pt && s.pt[0] === it.h && s.pt[1] === it.k,
    answer: it => ({ pt: [it.h, it.k] }),
    solution: it => `$${tex(it)}$: vértice $(${it.h}, ${it.k})$`,
    prompt: it => `$${tex(it)}$`,
    foot: (it, s) => (s.pt ? 'Toca «Lanzar» para soltar el agua' : 'Toca el punto donde el chorro da la vuelta'),
    no: (it, s) => (s.pt[0] !== it.h ? 'El chorro da la vuelta en otro x' : 'La altura del vértice es otra'),
    layout(G) {
      G.btn = { x: G.W / 2 - 60, y: G.bottom - 38, w: 120, h: 34 };
      const u = Math.min((G.W - 30) / 10, (G.btn.y - G.top - 16) / 10);
      G.grid = { u, x0: G.W / 2, y0: G.top + 8 + 9 * u };
      G.at = (x, y) => [G.grid.x0 + x * u, G.grid.y0 - y * u];
    },
    draw(G) {
      const { p, C, s, item: it } = G, { u } = G.grid;
      p.stroke(C.line); p.strokeWeight(1);
      for (let x = -5; x <= 5; x++) p.line(...G.at(x, -1), ...G.at(x, 9));
      for (let y = -1; y <= 9; y++) p.line(...G.at(-5, y), ...G.at(5, y));
      p.stroke(C.ink); p.strokeWeight(2); p.line(...G.at(-5, 0), ...G.at(5, 0)); p.line(...G.at(0, -1), ...G.at(0, 9));
      p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(9); p.textAlign(p.CENTER, p.CENTER);
      for (let x = -4; x <= 4; x += 2) if (x) p.text(negTxt(x), G.at(x, 0)[0], G.at(x, 0)[1] + 9);
      for (let y = 2; y <= 8; y += 2) p.text(y, G.at(0, y)[0] - 9, G.at(0, y)[1]);
      if (G.solved) {   // el chorro: la parábola, recortada a la cuadrícula
        p.noFill(); p.stroke(C.sky); p.strokeWeight(3.5); p.beginShape();
        for (let x = -5; x <= 5.001; x += 0.1) { const y = it.a * (x - it.h) ** 2 + it.k; if (y >= -1 && y <= 9) p.vertex(...G.at(x, y)); }
        p.endShape();
      }
      if (s.pt) { const [x, y] = G.at(...s.pt); drawDot(p, C, x, y, 12, G.solved ? C.ok : C.sun); drawPill(p, C, `(${negTxt(s.pt[0])}, ${negTxt(s.pt[1])})`, x, y - 18, G.solved ? C.ok : C.sun, 11); }
      drawBtn(p, C, G.btn, 'Lanzar', G.solved, G.solved ? C.ok : s.pt ? C.coral : C.line);
    },
    press(G, x, y) {
      if (hitBox(G.btn, x, y)) { if (G.s.pt) G.submit(); return true; }
      const { u, x0, y0 } = G.grid, gx = Math.round((x - x0) / u), gy = Math.round((y0 - y) / u);
      if (gx < -5 || gx > 5 || gy < -1 || gy > 9) return false;
      G.s.pt = [gx, gy]; G.api.sfx?.tap?.();
      return true;
    },
    peek: G => { const q = (x, y) => { const [a, b] = G.at(x, y); return { x: a - 2, y: b - 2, w: 4, h: 4 }; }; return { solve: [q(G.item.h, G.item.k), G.btn], wrongs: [q(G.item.h + 1, G.item.k), G.btn] }; },
  });
})();
