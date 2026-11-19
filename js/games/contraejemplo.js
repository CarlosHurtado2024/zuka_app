// El contraejemplo (Preuniversitario, pu-lo-2 y pu-lo-4; spec 2026-11-18-preuda-razonamiento-completo): para tumbar «todos
// cumplen» basta UNO que no cumpla; para tumbar «ninguno cumple», uno que sí. En una caja hay fichas; se toca la que tumba la
// frase y el juego la pone a prueba.
// params = { rounds: [{ claim, items: [fichas], bad(x) → bool (true si la ficha tumba la frase) }] }   state = { rounds: [{ pick }] }
GAMES['contraejemplo'] = (() => {
  const ok = (s, r) => s.pick >= 0 && !!r.bad(r.items[s.pick]);
  const first = r => r.items.findIndex(x => r.bad(x));
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ pick: -1 }),
    answered: s => s.pick >= 0,
    ok,
    solution: r => `${r.items[first(r)]} tumba la frase`,
    prompt: r => `«${r.claim}». Toca la ficha que la tumba`,
    foot: () => 'Toca una ficha para ponerla a prueba',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { pick: first(r) } : G.s, good = ok(s, r), n = r.items.length, per = Math.min(n, 4), cw = Math.min(70, (G.W - 40) / per), rows = Math.ceil(n / per);
      p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 160)); p.rect(16, 96, G.W - 32, rows * 56 + 24, 12);
      G.cells = r.items.map((it, i) => {
        const row = Math.floor(i / per), inRow = Math.min(per, n - row * per), x = (G.W - inRow * cw) / 2 + (i % per) * cw, y = 108 + row * 56, b = { x: x + 4, y, w: cw - 8, h: 46, i };
        const on = s.pick === i;
        RK.chip(p, C, b, String(it), { on, col: on ? (good ? C.ok : C.bad) : C.sky, size: 15 });
        return b;
      });
      const it = s.pick >= 0 ? r.items[s.pick] : null;
      RK.strip(p, C, G.fb, it === null ? '$\\text{elige una ficha}$' : good ? `$\\text{${it}: la frase cae}$` : `$\\text{${it}: la frase sigue en pie}$`, { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const c = (G.cells || []).find(b => hitBox(b, x, y)); if (!c) return false; G.s.pick = c.i; G.touch(); return true; },
    demo: G => (G.cells ? { from: { x: G.cells[0].x + 20, y: G.cells[0].y + 20 }, to: { x: G.cells[0].x + 20, y: G.cells[0].y + 20 }, text: 'Toca una ficha', ty: G.cells.at(-1).y + 76 } : null),
    peek: G => ({ cells: G.cells }),
  });
  return Object.assign(game, { answer: r => ({ pick: first(r) }) });
})();
