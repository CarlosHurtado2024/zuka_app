// La red periódica (Trigonometría, trig-49): las soluciones de una ecuación trigonométrica se repiten. Cada red atrapa una familia:
// un primer pez y un salto fijo. Posiciones en doceavos de π, de 0 a 4π. item = { eq (TeX), fams: [[x0, salto], …] }
GAMES['red-periodica'] = (() => {
  const JUMPS = [4, 6, 8, 12, 24], END = 48;
  const run = (a, j) => { const out = []; if (a == null) return out; for (let q = TK.mod(a, j); q < END; q += j) out.push(q); return out; };
  const fish = it => [...new Set(it.fams.flatMap(([a, j]) => run(a, j)))].sort((a, b) => a - b);
  const hooks = s => [...new Set(s.nets.flatMap(n => run(n.a, JUMPS[n.j])))].sort((a, b) => a - b);
  return questGame({
    aspect: 1.4,
    init: it => ({ nets: it.fams.map(() => ({ a: null, j: 4 })), cur: 0 }),
    ok: (s, it) => hooks(s).join() === fish(it).join(),
    answer: it => ({ nets: it.fams.map(([a, j]) => ({ a, j: JUMPS.indexOf(j) })), cur: 0 }),
    solution: it => `$${it.eq}$: ${it.fams.map(([a, j]) => `$x = ${TK.piTex(a, 12)} + ${TK.piTex(j, 12).replace('\\pi', 'k\\pi')}$`).join(' y ')}`,
    prompt: it => `Atrapa todas las soluciones de $${it.eq}$ con ${it.fams.length > 1 ? 'dos redes' : 'una red'}`,
    foot: it => (it.fams.length > 1 ? 'Hay dos familias de soluciones: usa las dos redes' : 'Una sola red basta si el salto es el correcto'),
    layout(G) {
      const y = G.bottom - 46, n = G.item.fams.length; G.st = { x: 12, y, w: G.W * 0.56, h: 38 }; G.go = { x: G.st.x + G.st.w + 10, y, w: G.W - 34 - G.st.w, h: 38 };
      G.tab = n > 1 ? [0, 1].map(i => ({ x: G.W / 2 - 104 + i * 108, y: y - 56, w: 100, h: 28 })) : [];
      G.box = { x: 12, y: G.top + 6, w: G.W - 24, h: y - G.top - (n > 1 ? 72 : 32) };
      G.X = q => G.box.x + 10 + q / END * (G.box.w - 20); G.fy = G.box.y + G.box.h * 0.6;
      G.fishBox = q => ({ x: G.X(q) - 8, y: G.fy - 8, w: 16, h: 16 });
    },
    draw(G) {
      const { p, C, s, item: it, box, X, fy } = G, fs = fish(it), cols = [C.sky, C.mint];
      p.noStroke(); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
      p.stroke(C.line); p.strokeWeight(1.5); p.line(box.x, box.y + box.h - 22, box.x + box.w, box.y + box.h - 22);
      for (let k = 0; k <= 4; k++) { p.stroke(C.mute); p.strokeWeight(1.5); p.line(X(12 * k), box.y + box.h - 26, X(12 * k), box.y + box.h - 18); TK.label(p, C, `$${TK.piTex(k)}$`, X(12 * k), box.y + box.h - 9, C.mute, 11, 36); }
      // Redes: un anzuelo por salto. El que cae sin pez se ve en rojo.
      s.nets.forEach((n, i) => run(n.a, JUMPS[n.j]).forEach(q => {
        const hit = fs.includes(q), c = hit ? cols[i] : C.bad;
        p.stroke(c); p.strokeWeight(i === s.cur ? 3 : 2); p.line(X(q), box.y + 6 + i * 5, X(q), fy - (hit ? 12 : 0)); p.noFill(); p.circle(X(q), fy, hit ? 22 : 10);
      }));
      for (const q of fs) {
        const x = X(q), col = G.solved ? C.ok : C.coral;
        p.noStroke(); p.fill(col); p.ellipse(x, fy, 15, 9); p.triangle(x - 6, fy, x - 12, fy - 5, x - 12, fy + 5);
      }
      G.tab.forEach((b, i) => drawTile(p, C, b, `Red ${i + 1}`, { fill: cols[i], size: 13, r: 9, lift: 2, ring: s.cur === i ? C.N : null }));
      drawStepper(p, C, G.st, `$${TK.piTex(JUMPS[s.nets[s.cur].j], 12)}$`, `salto de la red${G.tab.length ? ` ${s.cur + 1}` : ''}`);
      drawBtn(p, C, G.go, 'Lanzar', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, net = s.nets[s.cur], d = stepHit(G.st, x, y);
      if (d) { net.j = Math.max(0, Math.min(4, net.j + d)); G.api.sfx?.tap?.(); return true; }
      const t = G.tab.findIndex(b => hitBox(b, x, y));
      if (t >= 0) { s.cur = t; return true; }
      if (hitBox(G.go, x, y)) { const h = hooks(s), f = fish(it); G.submit(h.some(q => !f.includes(q)) ? 'Un anzuelo cayó donde no hay pez' : 'Quedaron peces sin atrapar'); return true; }
      if (!hitBox(G.box, x, y)) return false;
      const q = fish(it).reduce((b, v) => (Math.abs(G.X(v) - x) < Math.abs(G.X(b) - x) ? v : b));
      if (Math.abs(G.X(q) - x) < 18) { net.a = q; G.api.sfx?.tap?.(); }
      return true;
    },
    peek: G => ({ solve: [...G.item.fams.flatMap(([a, j], i) => [...(G.tab.length ? [G.tab[i]] : []), G.fishBox(a), ...TK.steps(G.st, G.s.nets[i].j, JUMPS.indexOf(j))]), G.go], wrong: G.go }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
