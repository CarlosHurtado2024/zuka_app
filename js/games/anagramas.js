// Anagramas con letras repetidas (Preuniversitario, pu-co-2; spec 2026-11-18-preuda-razonamiento-completo): ordenar n letras
// distintas da n! maneras; si una letra se repite k veces, intercambiar sus copias no cambia la palabra, así que se divide
// entre k!. Arriba está n!; se arrastran al denominador las fichas k! de cada letra repetida y el juego hace la cuenta.
// params = { rounds: [{ word }] }   state = { rounds: [{ den: [k, k, …] }] }   (fichas 2!, 3!, 4!)
GAMES['anagramas'] = (() => {
  const reps = r => { const m = {}; [...r.word].forEach(c => { m[c] = (m[c] || 0) + 1; }); return Object.values(m).filter(k => k > 1).sort((a, b) => a - b); };
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  const ok = (s, r) => [...s.den].sort((a, b) => a - b).join() === reps(r).join();
  const TRAY = [2, 2, 3, 3, 4];
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ den: [] }),
    ok,
    answered: s => s.den.length > 0,
    solution: r => `${r.word.length}! / ${reps(r).map(k => `${k}!`).join('·')} = ${fact(r.word.length) / reps(r).reduce((a, k) => a * fact(k), 1)}`,
    prompt: r => `¿De cuántas maneras se ordenan las letras de ${r.word}?`,
    foot: () => 'Arrastra al denominador un k! por cada letra que se repite k veces',
    layout(G) { G.den = { x: G.W / 2 - 110, y: 196, w: 220, h: 44 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { den: reps(r) } : G.s, good = ok(s, r), n = r.word.length, w = Math.min(30, (G.W - 40) / n);
      [...r.word].forEach((c, i) => { const same = [...r.word].filter(x => x === c).length > 1; RK.chip(p, C, { x: G.W / 2 - n * w / 2 + i * w, y: 104, w: w - 2, h: 32 }, c, { on: true, col: same ? C.coral : C.sky, size: 14 }); });
      TK.label(p, C, `$${n}! = ${fact(n)}$`, G.W / 2, 166, C.ink, 16, 160);
      p.stroke(C.ink); p.strokeWeight(2); p.line(G.W / 2 - 110, 186, G.W / 2 + 110, 186);
      p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 3]); p.rect(G.den.x, G.den.y, G.den.w, G.den.h, 10); p.drawingContext.setLineDash([]);
      G.inDen = s.den.map((k, i) => ({ k, i, x: G.den.x + 8 + i * 50, y: G.den.y + 6, w: 44, h: 32 }));
      G.inDen.forEach(b => RK.chip(p, C, b, `$${b.k}!$`, { on: true, col: good ? C.ok : C.mint, size: 14 }));
      G.tray = TRAY.map((k, i) => ({ k, x: G.W / 2 - (TRAY.length * 50 - 6) / 2 + i * 50, y: G.H - 112, w: 44, h: 32 }));
      G.tray.forEach(b => RK.chip(p, C, b, `$${b.k}!$`, { size: 13 }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 22, y: G.drag.y - 16, w: 44, h: 32 }, `$${G.drag.k}!$`, { on: true, col: C.brand, size: 13 });
      const d = s.den.reduce((a, k) => a * fact(k), 1), v = fact(n) / d;
      RK.strip(p, C, G.fb, `$\\dfrac{${n}!}{${s.den.length ? s.den.map(k => `${k}!`).join(' \\cdot ') : '1'}} = ${Number.isInteger(v) ? v : RK.num(Math.round(v * 100) / 100)}$`, { col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) {
      const t = (G.tray || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { k: t.k, from: -1, x, y }; return true; }
      const b = (G.inDen || []).find(b => hitBox(b, x, y)); if (b) { G.s.den.splice(b.i, 1); G.drag = { k: b.k, from: b.i, x, y }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; if (hitBox({ x: G.den.x - 10, y: G.den.y - 14, w: G.den.w + 20, h: G.den.h + 28 }, x, y) && G.s.den.length < 4) G.s.den.push(d.k); G.touch(); },
    demo: G => ({ from: { x: G.tray[4].x + 22, y: G.tray[4].y + 16 }, to: { x: G.den.x + 30, y: G.den.y + 22 }, text: 'Arrastra al denominador', ty: G.tray[0].y - 12 }),
    peek: G => ({ den: G.den, tray: G.tray }),
  });
  return Object.assign(game, { answer: r => ({ den: reps(r) }), reps });
})();
