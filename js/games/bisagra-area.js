// La bisagra del área (Trigonometría, trig-46b): Área = ½·a·b·sen C. Con la base fija, el área solo depende de la altura a·sen C. Se
// gira el lado a hasta la altura que da el área pedida: casi siempre sirven dos ángulos, C y 180° − C.
// item = { a, b, area, atex? }   (ángulos de 15° en 15°)
GAMES['bisagra-area'] = (() => {
  const sols = it => Array.from({ length: 11 }, (_, i) => 15 * (i + 1)).filter(c => Math.abs(0.5 * it.a * it.b * Math.sin(TK.rad(c)) - it.area) < 0.02);
  const at = it => it.atex ?? `${it.area}`;
  return questGame({
    aspect: 1.35,
    init: () => ({ c: 1, marks: [] }),
    ok: (s, it) => [...s.marks].sort((a, b) => a - b).join() === sols(it).join(),
    answer: it => ({ c: 1, marks: sols(it) }),
    solution: it => `$C = ${sols(it).map(c => `${c}^\\circ`).join('$ y $')}$`,
    prompt: it => `Área $${at(it)}$: gira el lado azul y marca cada ángulo que sirve`,
    foot: () => 'Área = ½ · base · altura, y la altura es $a\\,\\operatorname{sen} C$',
    layout(G) {
      const it = G.item, y = G.bottom - 46, w = (G.W - 24 - 16), sw = w * 0.5, bw = (w - sw) / 2;
      G.st = { x: 12, y, w: sw, h: 38 }; G.mk = { x: 20 + sw, y, w: bw, h: 38 }; G.go = { x: 28 + sw + bw, y, w: bw, h: 38 };
      G.u = Math.min((G.W - 44) / (it.a + it.b), (y - G.top - 56) / it.a); G.P = [22 + it.a * G.u + (G.W - 44 - (it.a + it.b) * G.u) / 2, y - 38];
    },
    draw(G) {
      const { p, C, s, item: it, P, u } = G, Q = [P[0] + it.b * u, P[1]], tip = c => [P[0] + it.a * u * Math.cos(TK.rad(c)), P[1] - it.a * u * Math.sin(TK.rad(c))], T = tip(TK.glide(G, 'c', 15 * s.c)), hy = P[1] - 2 * it.area / it.b * u;
      p.stroke(C.line); p.strokeWeight(1.5); p.line(10, P[1], G.W - 10, P[1]);
      p.stroke(C.coral); p.strokeWeight(2.5); p.drawingContext.setLineDash([7, 5]); p.line(10, hy, G.W - 10, hy); p.drawingContext.setLineDash([]);
      drawPill(p, C, `línea punteada: altura para área ${at(it).replace(/\\sqrt(\d)/, '√$1')}`, G.W / 2, G.top + 12, C.coral, 11);
      for (const m of s.marks) { const t = tip(m); p.stroke(C.ok); p.strokeWeight(3); p.line(...P, ...t); drawDot(p, C, t[0], t[1], 9, C.ok); TK.label(p, C, `${m}°`, t[0], t[1] - 14, C.ok, 12, 40); }
      p.noStroke(); p.fill(C.card); p.triangle(...P, ...Q, ...T);
      p.stroke(C.ink); p.strokeWeight(3); p.line(...P, ...Q); p.line(...Q, ...T); p.stroke(C.sky); p.strokeWeight(5); p.line(...P, ...T);
      p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([3, 4]); p.line(T[0], T[1], T[0], P[1]); p.drawingContext.setLineDash([]);
      drawDot(p, C, T[0], T[1], 11, C.sky);
      TK.label(p, C, `${it.b}`, (P[0] + Q[0]) / 2, P[1] + 13, C.ink, 13, 40); TK.label(p, C, `${it.a}`, (P[0] + T[0]) / 2 - 12, (P[1] + T[1]) / 2 - 8, C.sky, 13, 40);
      drawStepper(p, C, G.st, `${15 * s.c}°`, 'ángulo C'); drawBtn(p, C, G.mk, 'Marcar', false, C.mint); drawBtn(p, C, G.go, 'Listo', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, d = stepHit(G.st, x, y), c = 15 * s.c;
      if (d) { s.c = Math.max(1, Math.min(11, s.c + d)); G.api.sfx?.tap?.(); return true; }
      if (hitBox(G.mk, x, y)) {
        if (s.marks.includes(c)) return true;
        if (sols(it).includes(c)) { s.marks.push(c); G.a.say(`Con ${c}° el área sí es la pedida`, G.C.ok); G.api.sfx?.tap?.(); }
        else G.bad(0.5 * it.a * it.b * Math.sin(TK.rad(c)) < it.area ? 'Con ese ángulo la altura no llega a la línea' : 'Con ese ángulo la altura se pasa de la línea');
        return true;
      }
      if (!hitBox(G.go, x, y)) return false;
      G.submit(s.marks.length ? 'Falta otro ángulo que deja el lado a la misma altura' : 'Primero marca un ángulo que sirva');
      return true;
    },
    peek: G => {
      const solve = []; let c = G.s.c;
      for (const m of sols(G.item).filter(q => !G.s.marks.includes(q))) { solve.push(...TK.steps(G.st, c, m / 15), G.mk); c = m / 15; }
      return { solve: [...solve, G.go], wrong: sols(G.item).includes(15 * G.s.c) ? null : G.mk };
    },
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
