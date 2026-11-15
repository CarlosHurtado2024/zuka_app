// El bote y la corriente (Álgebra, sistemas de ecuaciones; juego dinámico de alg-101; spec
// 2026-11-21-dinamicos-mundos-altos): el bote de Caro. Río abajo la corriente suma (v + c) y río arriba resta (v − c).
// Se conocen las dos velocidades. Se elige la corriente c con − y + (o arrastrando); el juego despeja el bote de la
// primera pista, v = (río abajo) − c, y lo muestra: eso es sustituir. Al «Zarpar» el bote sube contra la corriente y se
// ve si llega a la bandera de la segunda pista. La velocidad río arriba no se muestra antes: hay que pensarla.
// params = { rounds: [{ title, items: [{ down, up }] }], lives? }   state = { done: [n] }

GAMES['bote-corriente'] = (() => {
  const cOf = it => (it.down - it.up) / 2;
  return questGame({
    aspect: 1.25,
    init: () => ({ c: 0 }),
    ok: (s, it) => it.down - 2 * s.c === it.up,
    answer: it => ({ c: cOf(it) }),
    solution: it => `$v + c = ${it.down}$, $v - c = ${it.up}$: bote ${it.down - cOf(it)}, corriente ${cOf(it)}`,
    prompt: it => `Río abajo va a ${it.down} y río arriba a ${it.up}`,
    foot: () => 'Elige la corriente: el bote sale de la primera pista',
    no: (it, s) => `Río arriba irías a ${it.down - 2 * s.c}, no a ${it.up}: ${it.down - 2 * s.c > it.up ? 'falta corriente' : 'sobra corriente'}`,
    layout(G) {
      const y = G.bottom - 42; G.box = { x: 12, y, w: 160, h: 34 }; G.btn = { x: G.W - 12 - 120, y: y - 2, w: 120, h: 38 };
      G.track = { x0: 30, x1: G.W - 30, y: y - 40 }; G.river = { y: G.top + 10, h: G.track.y - G.top - 46 };
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, r = G.river, v = it.down - s.c, L = W - 60, sc = L / it.down, y1 = r.y + r.h * 0.3, y2 = r.y + r.h * 0.72;
      p.noStroke(); p.fill(shade(C.sky, 0.55)); p.rect(12, r.y, W - 24, r.h, 12);
      const arrow = (y, len, col, txt) => { p.stroke(col); p.strokeWeight(5); p.line(30, y, 30 + len, y); p.noStroke(); p.fill(col); p.triangle(30 + len, y - 7, 30 + len + 11, y, 30 + len, y + 7); p.fill(C.cream); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER); fitText(p, txt, 34, y - 14, W - 70, 12); };
      arrow(y1, it.down * sc - 11, C.mint, `río abajo: v + c = ${v} + ${s.c} = ${it.down}`);
      // Río arriba: solo se ve la bandera; la flecha del bote aparece al acertar.
      const fx = 30 + it.up * sc; p.stroke(C.cream); p.strokeWeight(2); p.line(fx, y2 - 20, fx, y2 + 12); p.noStroke(); p.fill(C.sun); p.triangle(fx, y2 - 20, fx + 13, y2 - 14, fx, y2 - 8);
      if (G.solved) arrow(y2, it.up * sc - 11, C.coral, `río arriba: v − c = ${v} − ${s.c} = ${it.up}`);
      else { p.noStroke(); p.fill(C.cream); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER); fitText(p, `río arriba: v − c = ${it.up}`, 34, y2 - 14, W - 70, 12); }
      p.noStroke(); p.fill(G.solved ? C.ok : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, `corriente c = ${s.c}  ·  bote v = ${it.down} − ${s.c} = ${v}`, W / 2, G.track.y, W - 20, 14);
      drawStepper(p, C, G.box, s.c, 'corriente', C.Z);
      drawBtn(p, C, G.btn, 'Zarpar', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const d = stepHit(G.box, x, y);
      if (d) { G.s.c = Math.max(0, Math.min(Math.floor(G.item.down / 2), G.s.c + d)); G.api.sfx?.tap?.(); return true; }
      if (hitBox(G.btn, x, y)) { G.submit(); return true; }
      return false;
    },
    peek: G => { const b = G.box, n = cOf(G.item) - G.s.c; return { solve: [...Array(Math.abs(n)).fill(n > 0 ? { x: b.x + b.w - 40, y: b.y, w: 40, h: b.h } : { x: b.x, y: b.y, w: 40, h: b.h }), G.btn], wrong: n ? G.btn : null }; },
  });
})();
