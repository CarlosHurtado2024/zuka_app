// La balanza de cajas (Álgebra, ecuaciones lineales; juego dinámico de alg-1; spec 2026-11-21-dinamicos-mundos-altos):
// la balanza de Ana. En cada platillo hay cajas cerradas iguales (cada una trae x baldosas) y baldosas sueltas. La
// regla es una sola: lo que se hace en un lado, se hace también en el otro. Se quita una suelta de cada lado, se
// quita una caja de cada lado y, cuando solo quedan cajas contra sueltas, se reparte. Pedir algo que un platillo no
// tiene (quitar una suelta donde no hay) quita una vida.
// params = { rounds: [{ title, items: [{ a, b, c, d }] }], lives? }   (a·x + b = c·x + d, con a > c y d > b)   state = { done: [n] }

GAMES['balanza-cajas'] = (() => {
  const xOf = it => (it.d - it.b) / (it.a - it.c);
  const side = (n, k) => `${n ? `${n === 1 ? '' : n}x` : ''}${n && k ? ' + ' : ''}${k || !n ? k : ''}`;
  return questGame({
    aspect: 1.3,
    init: it => ({ a: it.a, b: it.b, c: it.c, d: it.d, div: false }),
    ok: (s, it) => !!s.div && s.b === 0 && s.c === 0 && s.d / s.a === xOf(it),
    answer: it => ({ a: it.a - it.c, b: 0, c: 0, d: it.d - it.b, div: true }),
    solution: it => `$${side(it.a, it.b)} = ${side(it.c, it.d)}$: $x = ${xOf(it)}$`,
    prompt: () => 'Deja una caja sola: ¿cuántas baldosas trae?',
    foot: () => 'Lo que haces en un lado, hazlo también en el otro',
    layout(G) { const w = (G.W - 24 - 2 * 8) / 3, y = G.bottom - 44; G.btn = [0, 1, 2].map(i => ({ x: 12 + i * (w + 8), y, w, h: 38 })); G.area = { y: G.top + 4, h: y - G.top - 12 }; },
    draw(G) {
      const { p, C, W, s } = G, ay = G.area.y, base = ay + G.area.h - 34, half = W / 2;
      // Brazo y platillos.
      p.stroke(C.ink); p.strokeWeight(4); p.line(40, base, W - 40, base); p.line(half, base, half, base + 26);
      p.noStroke(); p.fill(C.ink); p.triangle(half - 14, base + 30, half + 14, base + 30, half, base + 8);
      const pan = (x0, w, boxes, loose) => {
        const bw = Math.min(40, (w - 8) / Math.max(1, boxes) - 3);
        for (let i = 0; i < boxes; i++) drawTile(p, C, { x: x0 + 4 + i * (bw + 3), y: base - 44, w: bw, h: 38 }, 'x', { fill: C.sky, size: 16, r: 6, lift: 2 });
        const cols = Math.max(1, Math.floor((w - 8) / 13));
        for (let i = 0; i < loose; i++) { p.noStroke(); p.fill(C.sun); p.rect(x0 + 4 + (i % cols) * 13, base - 58 - Math.floor(i / cols) * 13, 11, 11, 2); }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, `${boxes} ${boxes === 1 ? 'caja' : 'cajas'} · ${loose} ${loose === 1 ? 'suelta' : 'sueltas'}`, x0 + w / 2, base + 14, w, 11);
      };
      pan(44, half - 60, s.a, s.b); pan(half + 16, half - 60, s.c, s.d);
      p.noStroke(); p.fill(G.solved ? C.ok : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, G.solved ? `$x = ${s.d / s.a}$: cada caja trae ${s.d / s.a}` : `$${side(s.a, s.b)} = ${side(s.c, s.d)}$`, W / 2, ay + 14, W - 20, 17);
      drawBtn(p, C, G.btn[0], '− 1 suelta', false, C.cream); drawBtn(p, C, G.btn[1], '− 1 caja', false, C.cream); drawBtn(p, C, G.btn[2], 'Repartir', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      if (i === 0) { if (s.b < 1 || s.d < 1) { G.bad('Un platillo no tiene sueltas que quitar'); return true; } s.b--; s.d--; }
      else if (i === 1) { if (s.a < 1 || s.c < 1) { G.bad('Un platillo no tiene cajas que quitar'); return true; } s.a--; s.c--; }
      else { if (s.b || s.c) { G.bad('Primero deja cajas solas en un lado y sueltas solas en el otro'); return true; } s.div = true; G.good(`Cada caja trae ${s.d / s.a}`); return true; }
      G.api.sfx?.tap?.();
      return true;
    },
    peek: G => ({ solve: [...Array(G.s.b).fill(G.btn[0]), ...Array(G.s.c).fill(G.btn[1]), G.btn[2]], wrong: G.s.b || G.s.c ? G.btn[2] : null }),
  });
})();
