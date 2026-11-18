// El uno disfrazado (Álgebra, alg-22b; spec 2026-11-18-algebra-revision): racionalizar es multiplicar por 1 escrito como
// √n/√n. La fracción tiene una raíz abajo; abajo hay tarjetas que valen 1 (√2/√2, √3/√3, 2/2…). Se arrastra una sobre la
// fracción y se multiplica: solo la que tiene la misma raíz deja el denominador sin raíz. La fracción vale lo mismo.
// params = { rounds: [{ k, n, cards: [m, …] }] }   (k/√n; cada tarjeta es √m/√m, o m/m si m es negativo)   state = { rounds: [{ c }] }
GAMES['racionaliza-uno'] = (() => {
  const ok = (s, r) => s.c != null && r.cards[s.c] === r.n;
  const cardTex = m => (m > 0 ? `\\dfrac{\\sqrt{${m}}}{\\sqrt{${m}}}` : `\\dfrac{${-m}}{${-m}}`);
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ c: null }),
    ok,
    answered: s => s.c != null,
    solution: r => `× √${r.n}/√${r.n}: ${r.k}√${r.n}/${r.n}`,
    prompt: r => `Quita la raíz de abajo en $\\dfrac{${r.k}}{\\sqrt{${r.n}}}$`,
    foot: () => 'Arrastra una tarjeta que valga 1 sobre la fracción',
    layout(G) { G.f = { x: G.W / 2 - 70, y: 104, w: 140, h: 76 }; G.cy = G.H * 0.56; G.fb = { x: 12, y: G.H - 84, w: G.W - 24, h: 52 }; },
    enter(G) { G.drag = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { c: r.cards.indexOf(r.n) } : G.s, m = s.c == null ? null : r.cards[s.c];
      p.stroke(C.brand); p.strokeWeight(1.5); p.fill(RK.al(p, C.brand, 22)); p.rect(G.f.x, G.f.y, G.f.w, G.f.h, 12);
      TK.label(p, C, m == null ? `$\\dfrac{${r.k}}{\\sqrt{${r.n}}}$` : `$\\dfrac{${r.k}}{\\sqrt{${r.n}}}\\cdot${cardTex(m)}$`, G.f.x + G.f.w / 2, G.f.y + G.f.h / 2, C.ink, 18, G.f.w - 10);
      const w = Math.min(70, (G.W - 30) / r.cards.length - 8);
      G.cards = r.cards.map((mm, i) => ({ i, x: G.W / 2 - (r.cards.length * (w + 8) - 8) / 2 + i * (w + 8), y: G.cy, w, h: 58 }));
      G.cards.forEach(b => { if (G.drag?.i !== b.i) RK.chip(p, C, b, `$${cardTex(r.cards[b.i])}$`, { on: s.c === b.i, size: 15 }); });
      if (G.drag) RK.chip(p, C, { x: G.drag.x - w / 2, y: G.drag.y - 29, w, h: 58 }, `$${cardTex(r.cards[G.drag.i])}$`, { on: true, size: 15 });
      let tex = `\\dfrac{${r.k}}{\\sqrt{${r.n}}}`;
      if (m != null) tex = m > 0 ? (m === r.n ? `\\dfrac{${r.k}\\sqrt{${r.n}}}{${r.n}}` : `\\dfrac{${r.k}\\sqrt{${m}}}{\\sqrt{${r.n * m}}}`) : `\\dfrac{${r.k * -m}}{${-m}\\sqrt{${r.n}}}`;
      RK.strip(p, C, G.fb, `$${tex}$`, { kicker: m == null ? 'Elige un uno disfrazado' : m === r.n ? 'Abajo ya no hay raíz' : 'Abajo sigue habiendo raíz', col: G.locked || ok(G.s, r) ? C.ok : C.coral, size: 18 });
    },
    press(G, x, y) { const b = (G.cards || []).find(b => hitBox(b, x, y)); if (!b) return false; G.drag = { i: b.i, x, y }; return true; },
    drag(G, x, y) { if (!G.drag) return false; G.drag.x = x; G.drag.y = y; return true; },
    release(G, x, y) { const d = G.drag; G.drag = null; if (!d) return; if (hitBox({ x: G.f.x - 20, y: G.f.y - 20, w: G.f.w + 40, h: G.f.h + 40 }, x, y)) { G.s.c = d.i; G.touch(); } },
    demo(G) { const b = G.cards?.[0]; return b ? { from: { x: b.x + b.w / 2, y: b.y + 29 }, to: { x: G.f.x + G.f.w / 2, y: G.f.y + G.f.h / 2 }, text: 'Arrastra una tarjeta a la fracción', ty: G.cy + 80 } : null; },
    peek: G => ({ cards: G.cards, f: G.f }),
  });
  return game;
})();
