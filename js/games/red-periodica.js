// La red periódica (Trigonometría, trig-49): las soluciones de una ecuación trigonométrica se repiten. Cada red atrapa una
// familia: una primera solución y un salto fijo. Los peces (las soluciones) no se ven hasta lanzar: hay que resolver la
// ecuación primero. Posiciones en doceavos de π, de 0 a 4π. item = { eq (TeX), fams: [[x0, salto], …] }
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
GAMES['red-periodica'] = (() => {
  const JUMPS = [4, 6, 8, 12, 24], END = 48;
  const run = (a, j) => { const out = []; for (let q = TK.mod(a, j); q < END; q += j) out.push(q); return out; };
  const fish = it => [...new Set(it.fams.flatMap(([a, j]) => run(a, j)))].sort((a, b) => a - b);
  const hooks = s => [...new Set(s.nets.flatMap(n => run(n.a, JUMPS[n.j])))].sort((a, b) => a - b);
  return questGame({
    aspect: 1.45,
    init: it => ({ nets: it.fams.map(() => ({ a: 0, j: 4 })), cur: 0, seen: false }),
    ok: (s, it) => hooks(s).join() === fish(it).join(),
    answer: it => ({ nets: it.fams.map(([a, j]) => ({ a, j: JUMPS.indexOf(j) })), cur: 0, seen: true }),
    solution: it => `$${it.eq}$: ${it.fams.map(([a, j]) => `$x = ${TK.piTex(a, 12)} + ${TK.piTex(j, 12).replace('\\pi', 'k\\pi')}$`).join(' y ')}`,
    prompt: it => `Atrapa todas las soluciones de $${it.eq}$ con ${it.fams.length > 1 ? 'dos redes' : 'una red'}`,
    foot: (it, s) => (s.seen ? 'Ya se ven los peces: corrige la primera solución y el salto' : it.fams.length > 1 ? 'Hay dos familias de soluciones: usa las dos redes' : 'Resuelve primero: los peces se ven al lanzar'),
    layout(G) {
      const n = G.item.fams.length, w = (G.W - 36) / 2, y = G.bottom - 98;
      G.ba = { x: 12, y, w, h: 36 }; G.bj = { x: 24 + w, y, w, h: 36 }; G.go = { x: G.W / 2 - 80, y: G.bottom - 46, w: 160, h: 38 };
      G.tab = n > 1 ? [0, 1].map(i => ({ x: G.W / 2 - 104 + i * 108, y: y - 54, w: 100, h: 28 })) : [];
      G.box = { x: 12, y: G.top + 6, w: G.W - 24, h: y - G.top - (n > 1 ? 70 : 30) };
      G.X = q => G.box.x + 10 + q / END * (G.box.w - 20); G.fy = G.box.y + G.box.h * 0.6;
    },
    draw(G) {
      const { p, C, s, item: it, box, X, fy } = G, fs = fish(it), cols = [C.sky, C.mint], show = s.seen || G.solved;
      p.noStroke(); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
      p.stroke(C.line); p.strokeWeight(1.5); p.line(box.x, box.y + box.h - 22, box.x + box.w, box.y + box.h - 22);
      for (let k = 0; k <= 4; k++) { p.stroke(C.mute); p.strokeWeight(1.5); p.line(X(12 * k), box.y + box.h - 26, X(12 * k), box.y + box.h - 18); TK.label(p, C, `$${TK.piTex(k)}$`, X(12 * k), box.y + box.h - 9, C.mute, 11, 36); }
      // Redes: un anzuelo por salto. Si los peces ya se ven, el anzuelo sin pez sale en rojo.
      s.nets.forEach((n, i) => run(n.a, JUMPS[n.j]).forEach(q => {
        const c = show && !fs.includes(q) ? C.bad : cols[i];
        p.stroke(c); p.strokeWeight(i === s.cur ? 3 : 2); p.line(X(q), box.y + 6 + i * 5, X(q), fy - 10); p.noFill(); p.circle(X(q), fy, 18);
      }));
      if (show) for (const q of fs) { const x = X(q); p.noStroke(); p.fill(G.solved ? C.ok : C.coral); p.ellipse(x, fy, 15, 9); p.triangle(x - 6, fy, x - 12, fy - 5, x - 12, fy + 5); }
      G.tab.forEach((b, i) => drawTile(p, C, b, `Red ${i + 1}`, { fill: cols[i], size: 13, r: 9, lift: 2, ring: s.cur === i ? C.N : null }));
      const net = s.nets[s.cur], tag = G.tab.length ? ` (red ${s.cur + 1})` : '';
      drawStepper(p, C, G.ba, `$${TK.piTex(net.a, 12)}$`, `primera solución${tag}`); drawStepper(p, C, G.bj, `$${TK.piTex(JUMPS[net.j], 12)}$`, `salto${tag}`);
      drawBtn(p, C, G.go, 'Lanzar', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, net = s.nets[s.cur], da = stepHit(G.ba, x, y), dj = stepHit(G.bj, x, y);
      if (da || dj) { s.seen = false; if (da) net.a = Math.max(0, Math.min(23, net.a + da)); else net.j = Math.max(0, Math.min(4, net.j + dj)); G.api.sfx?.tap?.(); return true; }
      const t = G.tab.findIndex(b => hitBox(b, x, y));
      if (t >= 0) { s.cur = t; return true; }
      if (!hitBox(G.go, x, y)) return false;
      const h = hooks(s), f = fish(it);
      s.seen = true; G.submit(h.some(q => !f.includes(q)) ? 'Un anzuelo cayó donde no hay pez' : 'Quedaron peces sin atrapar');
      return true;
    },
    peek: G => ({ solve: [...G.item.fams.flatMap(([a, j], i) => [...(G.tab.length ? [G.tab[i]] : []), ...TK.steps(G.ba, G.s.nets[i].a, a), ...TK.steps(G.bj, G.s.nets[i].j, JUMPS.indexOf(j))]), G.go], wrong: G.go }),
  });
})();
