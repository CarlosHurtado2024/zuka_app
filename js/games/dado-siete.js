// El dado: las caras opuestas suman 7 (Preuniversitario, pu-es-3; spec 2026-11-18-preuda-razonamiento-completo): en un dado
// común 1 va frente a 6, 2 frente a 5 y 3 frente a 4. Se ven tres caras (arriba, frente y derecha); se arrastran los números
// de las tres caras escondidas (abajo, atrás e izquierda) a su lugar en el desarrollo.
// params = { rounds: [{ top, front, right }] }   state = { rounds: [{ bottom, back, left }] }
GAMES['dado-siete'] = (() => {
  const want = r => ({ bottom: 7 - r.top, back: 7 - r.front, left: 7 - r.right });
  const ok = (s, r) => ['bottom', 'back', 'left'].every(k => s[k] === want(r)[k]);
  const NAMES = { bottom: 'abajo', back: 'atrás', left: 'izquierda' };
  const lay = G => { const u = 46, cx = G.W / 2; G.u = u; G.cells = { top: [cx - u / 2, 120], back: [cx - u / 2, 120 - u + u], left: [cx - 3 * u / 2, 120 + u], front: [cx - u / 2, 120 + u], right: [cx + u / 2, 120 + u], bottom: [cx - u / 2, 120 + 2 * u] }; G.cells.back = [cx - u / 2, 120 - 0]; G.cells.top = [cx - u / 2, 120 + u]; G.cells.front = [cx - u / 2, 120 + 2 * u]; G.cells.bottom = [cx - u / 2, 120 + 3 * u]; G.cells.left = [cx - 3 * u / 2, 120 + u]; G.cells.right = [cx + u / 2, 120 + u]; };
  const game = roundsGame({
    aspect: 1.35,
    init: () => ({ bottom: null, back: null, left: null }),
    ok,
    answered: s => s.bottom != null || s.back != null || s.left != null,
    solution: r => `abajo ${7 - r.top}, atrás ${7 - r.front}, izquierda ${7 - r.right}`,
    prompt: r => `Se ven ${r.top} arriba, ${r.front} al frente y ${r.right} a la derecha. ¿Y las escondidas?`,
    foot: () => 'Arrastra los números a las caras escondidas del desarrollo',
    layout(G) { lay(G); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.drag = null; lay(G); },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? want(r) : G.s, u = G.u, good = ok(s, r);
      const known = { top: r.top, front: r.front, right: r.right };
      Object.entries(G.cells).forEach(([k, [x, y]]) => {
        const v = known[k] ?? s[k], hidden = !(k in known);
        p.stroke(C.ink); p.strokeWeight(1.4); p.fill(hidden ? RK.al(p, good ? C.ok : C.mint, 90) : RK.al(p, C.card, 220)); p.rect(x, y, u, u, 4);
        if (v != null) TK.label(p, C, String(v), x + u / 2, y + u / 2, C.ink, 18, u); else TK.label(p, C, NAMES[k], x + u / 2, y + u / 2, C.mute, 8, u - 4);
      });
      G.tray = [1, 2, 3, 4, 5, 6].map((n, i) => ({ n, x: G.W / 2 - (6 * 40 - 6) / 2 + i * 40, y: G.H - 110, w: 34, h: 34 }));
      G.tray.forEach(b => RK.chip(p, C, b, String(b.n), { size: 14, col: C.sky }));
      if (G.drag) RK.chip(p, C, { x: G.drag.x - 17, y: G.drag.y - 17, w: 34, h: 34 }, String(G.drag.n), { on: true, col: C.brand, size: 14 });
      RK.strip(p, C, G.fb, good ? '$\\text{cada pareja suma 7}$' : '$\\text{opuestas: 1-6, 2-5, 3-4}$', { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const t = (G.tray || []).find(b => hitBox(b, x, y)); if (t) { G.drag = { n: t.n, x, y }; return true; } for (const k of ['bottom', 'back', 'left']) { const [cx, cy] = G.cells[k]; if (G.s[k] != null && hitBox({ x: cx, y: cy, w: G.u, h: G.u }, x, y)) { G.drag = { n: G.s[k], x, y }; G.s[k] = null; return true; } } return false; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; for (const k of ['bottom', 'back', 'left']) { const [cx, cy] = G.cells[k]; if (hitBox({ x: cx - 4, y: cy - 4, w: G.u + 8, h: G.u + 8 }, x, y)) G.s[k] = d.n; } G.touch(); },
    demo(G) { const [cx, cy] = G.cells.left, t = G.tray?.find(b => b.n !== 7 - G.r.right); return t ? { from: { x: t.x + 17, y: t.y + 17 }, to: { x: cx + G.u / 2, y: cy + G.u / 2 }, text: 'Arrastra un número', ty: t.y - 12 } : null; },
    peek: G => ({ cells: G.cells, tray: G.tray }),
  });
  return Object.assign(game, { answer: r => want(r) });
})();
