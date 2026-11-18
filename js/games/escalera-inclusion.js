// Muñecas de conjuntos (Álgebra 0, alg-0b; spec 2026-11-18-algebra-revision): la inclusión como muñecas rusas. Abajo
// hay varios conjuntos sueltos; se arrastran al centro uno por uno y cada nuevo envuelve al anterior, pero solo entra si
// lo contiene (si no, rebota y dice qué le falta). Hay que armar la cadena más larga ⊆ ⊆ ⊆. El vacío cabe dentro de
// cualquiera: por eso una cadena larga empieza por él.
// params = { rounds: [{ sets: [[elementos]] }] }   state = { rounds: [{ tower: [índices, del más pequeño al más grande] }] }
GAMES['escalera-inclusion'] = (() => {
  const sub = (X, Y) => X.every(v => Y.includes(v)) && X.length < Y.length;
  const valid = (t, r) => t.every((k, j) => j === 0 || sub(r.sets[t[j - 1]], r.sets[k]));
  // Largo de la cadena más larga (los conjuntos son pocos: se prueba desde cada uno).
  function longest(r) {
    const memo = {}, from = i => (memo[i] ??= 1 + Math.max(0, ...r.sets.map((Y, j) => (sub(r.sets[i], Y) ? from(j) : 0))));
    return Math.max(...r.sets.map((_, i) => from(i)));
  }
  function chain(r) {   // una cadena más larga (para la solución)
    const L = longest(r), go = t => { if (t.length === L) return t; for (let j = 0; j < r.sets.length; j++) if (!t.includes(j) && (!t.length || sub(r.sets[t.at(-1)], r.sets[j]))) { const o = go([...t, j]); if (o) return o; } return null; };
    return go([]);
  }
  const txt = X => (X.length ? `{${X.join(', ')}}` : '∅');
  const tex = X => (X.length ? `\\{${X.join(', ')}\\}` : '\\varnothing');
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ tower: [] }),
    ok: (s, r) => valid(s.tower, r) && s.tower.length === longest(r),
    answered: s => s.tower.length > 0,
    solution: r => chain(r).map(i => txt(r.sets[i])).join(' ⊆ '),
    prompt: () => 'Arma la cadena más larga: cada uno debe contener al de adentro',
    foot: (r, s) => (s.tower.length ? 'Para sacar el último, arrástralo afuera' : 'Arrastra al centro el que va más adentro'),
    layout(G) { const W = G.W, H = G.H; G.c = { x: W / 2, y: H * 0.42 }; G.fb = { x: 12, y: H - 84, w: W - 24, h: 52 }; G.cardY = H * 0.6; },
    enter(G) { G.drag = null; G.msg = null; },
    draw(G) {
      const { p, C, r } = G, good = game.okOf(G.s, r), s = G.locked && !good ? { tower: chain(r) } : G.s, A = SK.sets(C)[0];
      // Las muñecas: cada conjunto de la torre envuelve al anterior.
      const n = s.tower.length;
      for (let j = n - 1; j >= 0; j--) {
        const k = j + 1, rx = 26 + k * (G.W * 0.38 - 26) / Math.max(n, 3), ry = rx * 0.6;
        SK.membrane(p, C, G.c.x, G.c.y, rx, ry, G.locked ? C.ok : A.line, { fill: 14, w: j === n - 1 ? 2 : 1.4 });
        TK.label(p, C, txt(r.sets[s.tower[j]]), G.c.x, G.c.y - ry + 8, A.ink, 11, rx * 1.6);
      }
      if (!n) { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([4, 4]); p.ellipse(G.c.x, G.c.y, 120, 66); p.drawingContext.setLineDash([]); TK.label(p, C, 'centro', G.c.x, G.c.y, C.mute, 11, 80); }
      // Las tarjetas sueltas.
      const rest = r.sets.map((_, i) => i).filter(i => !s.tower.includes(i)), w = Math.min(96, (G.W - 24) / Math.ceil(rest.length / 2) - 8);
      G.cards = {};
      rest.forEach((i, j) => {
        const row = j % 2, col = Math.floor(j / 2), cols = Math.ceil(rest.length / 2), x = G.W / 2 - (cols * (w + 8) - 8) / 2 + col * (w + 8), y = G.cardY + row * 40;
        G.cards[i] = { x, y, w, h: 32 };
        if (G.drag?.i !== i) SK.chip(p, C, G.cards[i], txt(r.sets[i]), { state: 'idle', size: 13, r: 10 });
      });
      if (G.drag) SK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 16, w, h: 32 }, txt(r.sets[G.drag.i]), { state: 'on', col: C.brand, size: 13, r: 10 });
      if (G.msg && G.t - G.msg.t < 2.4) TK.label(p, C, G.msg.text, G.W / 2, G.cardY - 22, C.bad, 12, G.W - 30);
      SK.formal(p, C, G.fb, `$${s.tower.length ? s.tower.map(i => tex(r.sets[i])).join(' \\subseteq ') : '\\text{(vacía)}'}$`, { kicker: `Cadena · ${s.tower.length} de ${r.sets.length}`, col: G.locked ? C.ok : A.line, size: 16 });
    },
    press(G, x, y) {
      const hit = Object.entries(G.cards || {}).find(([, b]) => hitBox(b, x, y));
      if (hit) { G.drag = { i: +hit[0], x, y, from: 'tray' }; return true; }
      const t = G.s.tower, top = t.at(-1);
      if (top != null && Math.hypot(x - G.c.x, y - G.c.y) < G.W * 0.42) { G.drag = { i: top, x, y, from: 'tower' }; return true; }
      return false;
    },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) {
      const d = G.drag; if (!d) return; G.drag = null;
      const t = G.s.tower, inCenter = Math.abs(x - G.c.x) < G.W * 0.42 && Math.abs(y - G.c.y) < G.H * 0.2;
      if (d.from === 'tower') { if (!inCenter) { t.pop(); G.touch(); } return; }
      if (!inCenter) return;
      const X = G.r.sets[d.i], top = t.at(-1);
      if (top != null && !sub(G.r.sets[top], X)) { const miss = G.r.sets[top].filter(v => !X.includes(v)); G.msg = { t: G.t, text: miss.length ? `${txt(X)} no contiene a ${miss.join(', ')}` : `${txt(X)} no es más grande que ${txt(G.r.sets[top])}` }; return; }
      t.push(d.i); G.msg = null; G.touch();
    },
    demo(G) { const b = Object.values(G.cards || {})[0]; return b ? { from: { x: b.x + b.w / 2, y: b.y + 16 }, to: G.c, text: 'Arrastra al centro', ty: G.c.y + 70 } : null; },
    peek: G => ({ cards: G.cards, c: G.c, chain: chain(G.r) }),
  });
  game.okOf = (s, r) => valid(s.tower, r) && s.tower.length === longest(r);
  return Object.assign(game, { longest, chain, sub });
})();
