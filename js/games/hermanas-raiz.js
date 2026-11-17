// Las raíces hermanas (Trigonometría, trig-153): las n raíces n-ésimas de un complejo tienen el mismo módulo y reparten la vuelta en n
// partes iguales. Con una raíz dada, se tocan las demás. item = { n, deg0, step }   (puntos cada `step` grados)
GAMES['hermanas-raiz'] = (() => {
  const ORD = { 2: 'cuadradas', 3: 'cúbicas', 4: 'cuartas', 5: 'quintas', 6: 'sextas', 8: 'octavas' };
  const others = it => Array.from({ length: it.n - 1 }, (_, k) => TK.mod(it.deg0 + (k + 1) * 360 / it.n, 360)).sort((a, b) => a - b);
  return questGame({
    aspect: 1.3,
    init: () => ({ pick: [] }),
    ok: (s, it) => [...s.pick].sort((a, b) => a - b).join() === others(it).join(),
    answer: it => ({ pick: others(it) }),
    solution: it => `${[it.deg0, ...others(it)].join('°, ')}°: una cada ${360 / it.n}°`,
    prompt: it => `Una de las ${it.n} raíces ${ORD[it.n]} está en ${it.deg0}°. Toca ${it.n === 2 ? 'la otra' : `las otras ${it.n - 1}`}`,
    foot: (it, s) => `Raíces encontradas: ${s.pick.length + 1} de ${it.n}. Todas quedan igual de separadas`,
    layout(G) { G.R = Math.min(G.W * 0.36, (G.bottom - G.top - 40) / 2); G.cx = G.W / 2; G.cy = (G.top + G.bottom) / 2; G.dot = d => { const [x, y] = TK.at(G.cx, G.cy, G.R, d); return { x: x - 6, y: y - 6, w: 12, h: 12 }; }; },
    draw(G) {
      const { p, C, s, item: it, cx, cy, R } = G, all = [it.deg0, ...s.pick].sort((a, b) => a - b);
      TK.ring(p, C, cx, cy, R);
      if (G.solved) { p.noFill(); p.stroke(C.ok); p.strokeWeight(2.5); p.beginShape(); all.forEach(d => p.vertex(...TK.at(cx, cy, R, d))); p.endShape(p.CLOSE); }
      for (let d = 0; d < 360; d += it.step) { const [x, y] = TK.at(cx, cy, R, d); p.noStroke(); p.fill(C.mute); p.circle(x, y, 7); }
      all.forEach(d => {
        const [x, y] = TK.at(cx, cy, R, d), [lx, ly] = TK.at(cx, cy, R + 19, d), first = d === it.deg0, col = first ? C.N : G.solved ? C.ok : C.mint;
        p.stroke(col); p.strokeWeight(2.5); p.line(cx, cy, x, y); drawDot(p, C, x, y, first ? 13 : 11, col); TK.label(p, C, `${d}°`, lx, ly, col, 12, 44);
      });
    },
    press(G, x, y) {
      const s = G.s, it = G.item, a = TK.mod(Math.atan2(G.cy - y, x - G.cx) * 180 / Math.PI, 360), d = TK.mod(Math.round(a / it.step) * it.step, 360), [dx, dy] = TK.at(G.cx, G.cy, G.R, d);
      if (Math.hypot(dx - x, dy - y) > 13) return false;
      if (d === it.deg0 || s.pick.includes(d)) return true;
      if (!others(it).includes(d)) { G.bad('Ahí no hay raíz: todas quedan igual de separadas'); return true; }
      s.pick.push(d); G.api.sfx?.tap?.();
      if (s.pick.length === it.n - 1) G.good(`Una raíz cada ${360 / it.n}°: son los vértices de un polígono regular`);
      return true;
    },
    peek: G => ({ solve: others(G.item).filter(d => !G.s.pick.includes(d)).map(G.dot), wrong: G.dot([1, 2, 3].map(k => TK.mod(G.item.deg0 + k * G.item.step, 360)).find(d => !others(G.item).includes(d))) }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
