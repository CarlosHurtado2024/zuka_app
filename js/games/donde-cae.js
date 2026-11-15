// ¿Dónde cae el agua? (Álgebra, ecuaciones cuadráticas; juego dinámico de alg-4; spec 2026-11-21-dinamicos-mundos-altos):
// la boquilla de la fuente está en x = 0 y el agua solo cae hacia adelante. El agua toca el suelo donde la altura vale
// cero: en las raíces de la ecuación. Se ponen baldes en las marcas del suelo donde va a caer y luego «Abrir el agua».
// Como en el video, a veces una raíz no sirve (queda detrás de la boquilla), a veces hay una sola (raíz doble) y a
// veces el agua no toca el suelo nunca (no hay raíces reales): entonces no se pone ningún balde.
// params = { rounds: [{ title, items: [{ eq (TeX), roots: [raíces reales] }] }], lives? }   state = { done: [n] }
// Las marcas van de 1 a 8.

GAMES['donde-cae'] = (() => {
  const valid = it => [...new Set(it.roots.filter(r => r > 0))].sort((a, b) => a - b);
  const picked = s => s.on.map((v, i) => (v ? i + 1 : 0)).filter(Boolean);
  return questGame({
    aspect: 1.15,
    init: () => ({ on: Array(8).fill(false) }),
    ok: (s, it) => picked(s).join() === valid(it).join(),
    answer: it => ({ on: Array.from({ length: 8 }, (_, i) => valid(it).includes(i + 1)) }),
    solution: it => `$${it.eq}$: ${valid(it).length ? `cae en ${valid(it).join(' y ')}` : 'no cae adelante'}`,
    prompt: it => `$${it.eq}$`,
    foot: () => 'Pon un balde donde cae el agua (adelante de la boquilla) y abre',
    no: (it, s) => { const v = valid(it), g = picked(s); return g.some(x => !v.includes(x)) ? (it.roots.length ? 'Ahí la altura no vale cero' : 'Esta ecuación no tiene raíces reales: el agua no toca el suelo') : it.roots.some(r => r <= 0) && !v.length ? 'La raíz queda detrás de la boquilla' : 'Falta un balde'; },
    layout(G) {
      G.btn = { x: G.W / 2 - 74, y: G.bottom - 40, w: 148, h: 34 };
      const y = G.btn.y - 54, step = (G.W - 60) / 8;
      G.gy = y; G.mark = i => ({ x: 30 + i * step - step / 2 + 4, y: y - 30, w: step - 8, h: 50 }); G.X = i => 30 + i * step;
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, y = G.gy;
      p.stroke(C.ink); p.strokeWeight(3); p.line(14, y, W - 14, y);
      // La boquilla en 0.
      p.noStroke(); p.fill(C.mute); p.rect(G.X(0) - 7, y - 22, 14, 22, 3); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text('0', G.X(0), y + 12);
      for (let i = 1; i <= 8; i++) {
        const x = G.X(i), on = s.on[i - 1];
        p.stroke(C.ink); p.strokeWeight(2); p.line(x, y - 5, x, y + 5);
        p.noStroke(); p.fill(on ? C.N : C.mute); p.textStyle(p.BOLD); p.textSize(11); p.text(i, x, y + 14);
        if (on) { const good = G.solved; p.fill(good ? C.ok : C.sky); p.quad(x - 12, y - 22, x + 12, y - 22, x + 8, y - 3, x - 8, y - 3); }
      }
      if (G.solved) for (const r of valid(it)) {   // el chorro hasta cada balde
        p.noFill(); p.stroke(C.sky); p.strokeWeight(3); p.beginShape();
        for (let t = 0; t <= 1.001; t += 0.05) p.vertex(G.X(0) + (G.X(r) - G.X(0)) * t, y - 22 - Math.sin(Math.PI * t) * Math.min(120, G.gy - G.top - 30));
        p.endShape();
      }
      if (G.solved && !valid(it).length) { p.noStroke(); p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, it.roots.length ? 'La raíz queda detrás: ningún balde' : 'Sin raíces reales: ningún balde', W / 2, G.top + 30, W - 20, 14); }
      drawBtn(p, C, G.btn, 'Abrir el agua', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      if (hitBox(G.btn, x, y)) { G.submit(); return true; }
      for (let i = 1; i <= 8; i++) if (hitBox(G.mark(i), x, y)) { G.s.on[i - 1] = !G.s.on[i - 1]; G.api.sfx?.tap?.(); return true; }
      return false;
    },
    peek: G => { const v = valid(G.item), off = G.s.on.map((on, i) => (on !== v.includes(i + 1) ? i + 1 : 0)).filter(Boolean); return { solve: [...off.map(i => G.mark(i)), G.btn], wrongs: [G.mark(v.includes(8) ? 7 : 8), G.btn] }; },
  });
})();
