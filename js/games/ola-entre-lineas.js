// La ola entre líneas (Trigonometría, trig-44a): y = a·sen x + d va de d − a a d + a. Se eligen la amplitud y la línea media para que
// la ola toque justo el techo y el piso; la ola solo se dibuja al lanzarla. item = { hi, lo }
GAMES['ola-entre-lineas'] = (() => {
  const half = v => TK.minusTxt(v / 2);
  return questGame({
    aspect: 1.4,
    init: () => ({ a: 2, d: 0, sa: 2, sd: 0 }),
    ok: (s, it) => s.d + s.a === 2 * it.hi && s.d - s.a === 2 * it.lo,
    answer: it => ({ a: it.hi - it.lo, d: it.hi + it.lo, sa: it.hi - it.lo, sd: it.hi + it.lo }),
    solution: it => { const a = (it.hi - it.lo) / 2, d = (it.hi + it.lo) / 2; return `$y = ${a === 1 ? '' : a}\\operatorname{sen} x${d ? ` ${d < 0 ? '-' : '+'} ${Math.abs(d)}` : ''}$`; },
    prompt: it => `Lanza una ola que toque justo el techo (${TK.minusTxt(it.hi)}) y el piso (${TK.minusTxt(it.lo)})`,
    foot: () => 'La ola va de d − a hasta d + a',
    layout(G) {
      const w = (G.W - 36) / 2, y = G.bottom - 98; G.ba = { x: 12, y, w, h: 36 }; G.bd = { x: 24 + w, y, w, h: 36 }; G.go = { x: G.W / 2 - 80, y: G.bottom - 46, w: 160, h: 38 };
      G.box = { x: 16, y: G.top + 6, w: G.W - 32, h: y - G.top - 30 };
    },
    draw(G) {
      const { p, C, s, item: it, box } = G, Y = v => box.y + box.h / 2 - v * box.h / 11, X = t => box.x + t / (4 * Math.PI) * box.w;
      p.noStroke(); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
      p.stroke(C.line); p.strokeWeight(1.5); p.line(box.x, Y(0), box.x + box.w, Y(0));
      const dash = (v, col, txt) => { p.stroke(col); p.strokeWeight(2.5); p.drawingContext.setLineDash([7, 5]); p.line(box.x, Y(v), box.x + box.w, Y(v)); p.drawingContext.setLineDash([]); drawPill(p, C, txt, box.x + box.w - 44, Y(v), col, 11); };
      dash(it.hi, C.coral, `techo ${TK.minusTxt(it.hi)}`); dash(it.lo, C.sky, `piso ${TK.minusTxt(it.lo)}`);
      p.stroke(C.mute); p.strokeWeight(1); p.drawingContext.setLineDash([2, 4]); p.line(box.x, Y(s.sd / 2), box.x + box.w, Y(s.sd / 2)); p.drawingContext.setLineDash([]);
      p.noFill(); p.stroke(G.solved ? C.ok : C.mint); p.strokeWeight(3.5); p.beginShape();
      for (let i = 0, kk = Math.round(120 * TK.prog(G, 0.45)); i <= kk; i++) { const t = i / 120 * 4 * Math.PI; p.vertex(X(t), Y(Math.max(-5.4, Math.min(5.4, s.sa / 2 * Math.sin(t) + s.sd / 2)))); }
      p.endShape();
      drawStepper(p, C, G.ba, half(s.a), 'amplitud (a)'); drawStepper(p, C, G.bd, half(s.d), 'línea media (d)');
      drawBtn(p, C, G.go, 'Lanzar ola', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, da = stepHit(G.ba, x, y), dd = stepHit(G.bd, x, y);
      if (da || dd) { if (da) s.a = Math.max(1, Math.min(8, s.a + da)); else s.d = Math.max(-6, Math.min(6, s.d + dd)); G.api.sfx?.tap?.(); return true; }
      if (!hitBox(G.go, x, y)) return false;
      s.sa = s.a; s.sd = s.d; TK.fire(G);
      const top = (s.d + s.a) / 2;
      G.submit(top < it.hi ? 'La cresta no llega al techo' : top > it.hi ? 'La cresta se pasa del techo' : 'El valle no toca el piso');
      return true;
    },
    peek: G => ({ solve: [...TK.steps(G.ba, G.s.a, G.item.hi - G.item.lo), ...TK.steps(G.bd, G.s.d, G.item.hi + G.item.lo), G.go], wrong: G.go }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
