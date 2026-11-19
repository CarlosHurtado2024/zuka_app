// El cuadro de coordenadas (Preuniversitario, pu-cd-1 y pu-cd-2; spec 2026-11-18-preuda-razonamiento-completo): el alfabeto sin
// Ñ en un cuadro de 6 filas y 5 columnas; cada letra se escribe con dos cifras, fila y columna (B = 12, M = 33). Se tocan las
// casillas del cuadro, en orden, para cifrar una palabra (mode 'code') o para descifrar un mensaje de cifras (mode 'decode');
// tocar una casilla de abajo la borra.
// params = { rounds: [{ word, mode }] }   state = { rounds: [{ f: [índice de letra | −1] }] }
GAMES['cuadro-polibio'] = (() => {
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', COLS = 5;
  const code = i => `${Math.floor(i / COLS) + 1}${i % COLS + 1}`;
  const need = r => [...r.word].map(c => ABC.indexOf(c));
  const ok = (s, r) => need(r).every((k, i) => s.f[i] === k);
  const game = roundsGame({
    aspect: 1.5,
    init: r => ({ f: need(r).map(() => -1) }),
    answered: s => s.f.some(k => k >= 0),
    ok,
    solution: r => `${r.word} = ${need(r).map(code).join(' ')}`,
    prompt: r => (r.mode === 'decode' ? `Descifra ${need(r).map(code).join(' ')}` : `Cifra ${r.word} con el cuadro`),
    foot: () => 'Toca las letras del cuadro en orden',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { f: need(r) } : G.s, good = ok(s, r), cs = Math.min(36, (G.W - 60) / COLS), gx = (G.W - COLS * cs) / 2 + 10, gy = 108;
      for (let c = 0; c < COLS; c++) TK.label(p, C, String(c + 1), gx + (c + 0.5) * cs, gy - 10, C.coral, 10, cs);
      G.cells = [];
      for (let i = 0; i < 26; i++) {
        const row = Math.floor(i / COLS), col = i % COLS, x = gx + col * cs, y = gy + row * cs, used = s.f.includes(i);
        if (col === 0) TK.label(p, C, String(row + 1), gx - 14, y + cs / 2, C.coral, 10, 20);
        p.stroke(C.line); p.strokeWeight(1); p.fill(used ? RK.al(p, C.sky, 90) : RK.al(p, C.card, 200)); p.rect(x, y, cs, cs, 4);
        TK.label(p, C, ABC[i], x + cs / 2, y + cs / 2, C.ink, 13, cs);
        G.cells.push({ x, y, w: cs, h: cs, i });
      }
      const n = r.word.length, sw = Math.min(46, (G.W - 30) / n - 6), x0 = (G.W - n * (sw + 6) + 6) / 2, sy = gy + 6 * cs + 34;
      G.slots = Array.from({ length: n }, (_, i) => ({ x: x0 + i * (sw + 6), y: sy, w: sw, h: 34 }));
      G.slots.forEach((b, i) => {
        const k = s.f[i], top = r.mode === 'decode' ? code(need(r)[i]) : r.word[i];
        TK.label(p, C, top, b.x + b.w / 2, b.y - 11, C.mute, 11, b.w + 4);
        p.stroke(k >= 0 ? (good ? C.ok : C.brand) : C.line); p.strokeWeight(1.3); p.fill(k >= 0 ? RK.al(p, good ? C.ok : C.brand, 50) : RK.al(p, C.card, 120)); p.rect(b.x, b.y, b.w, b.h, 7);
        if (k >= 0) TK.label(p, C, r.mode === 'decode' ? ABC[k] : code(k), b.x + b.w / 2, b.y + b.h / 2, C.ink, 14, b.w);
      });
      RK.strip(p, C, G.fb, good ? `$\\text{${r.word} = ${need(r).map(code).join(' ')}}$` : '$\\text{fila y columna}$', { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const sl = (G.slots || []).findIndex(b => hitBox(b, x, y));
      if (sl >= 0) { if (G.s.f[sl] >= 0) { G.s.f[sl] = -1; G.touch(); } return true; }
      const c = (G.cells || []).find(b => hitBox(b, x, y));
      if (!c) return false;
      const k = G.s.f.indexOf(-1); if (k >= 0) { G.s.f[k] = c.i; G.touch(); }
      return true;
    },
    demo: G => { const c = G.cells?.[need(G.r)[0]]; return c ? { from: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, to: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, text: 'Toca la letra', ty: G.slots[0].y + 52 } : null; },
    peek: G => ({ cells: G.cells, slots: G.slots }),
  });
  return Object.assign(game, { answer: r => ({ f: need(r) }) });
})();
