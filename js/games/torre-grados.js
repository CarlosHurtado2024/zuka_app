// La torre de grados (Álgebra, polinomios; juego dinámico de alg-23a; spec 2026-11-21-dinamicos-mundos-altos): los
// términos de un polinomio están revueltos, como los bloques de la caja de Caro. Se tocan de mayor a menor exponente
// para apilarlos: el primero que se pone dice el grado. El coeficiente no manda (un 9 pequeño va después de un x³), el
// término sin x es el de grado 0 y va de último. Tocar uno que no es el siguiente quita una vida.
// params = { rounds: [{ title, items: [{ terms: [[coeficiente, exponente], …] }] }], lives? }   state = { done: [n] }

GAMES['torre-grados'] = (() => {
  const termTex = ([c, e]) => `${c < 0 ? '-' : ''}${Math.abs(c) === 1 && e > 0 ? '' : Math.abs(c)}${e === 0 ? '' : e === 1 ? 'x' : `x^{${e}}`}`;
  const sorted = it => it.terms.map((_, i) => i).sort((a, b) => it.terms[b][1] - it.terms[a][1]);
  const polyTex = (it, idx) => idx.map((i, k) => { const t = termTex(it.terms[i]); return k === 0 ? t : t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t}`; }).join('');
  const gradeOf = it => Math.max(...it.terms.map(t => t[1]));
  return questGame({
    aspect: 1.2,
    init: () => ({ order: [] }),
    ok: (s, it) => s.order.length === it.terms.length && s.order.join() === sorted(it).join(),
    answer: it => ({ order: sorted(it) }),
    solution: it => `$${polyTex(it, sorted(it))}$: grado ${gradeOf(it)}`,
    prompt: () => 'Apila los términos, del exponente mayor al menor',
    foot: (it, s) => (s.order.length ? 'El coeficiente no decide: mira el exponente de x' : 'El primero que pongas dice el grado'),
    layout(G) {
      const n = G.item.terms.length, cols = Math.min(3, n), w = (G.W - 24 - (cols - 1) * 10) / cols, rows = Math.ceil(n / cols), y0 = G.bottom - rows * 50 - 6;
      G.tile = i => ({ x: 12 + (i % cols) * (w + 10), y: y0 + Math.floor(i / cols) * 50, w, h: 40 });
      G.board = { x: 12, y: G.top + 6, w: G.W - 24, h: Math.max(60, y0 - G.top - 22) };
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, b = G.board;
      p.noStroke(); p.fill(shade(C.card, 0.82)); p.rect(b.x, b.y + 3, b.w, b.h, 14);
      p.stroke(G.solved ? C.ok : C.line); p.strokeWeight(2); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 14);
      p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
      if (!s.order.length) { p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, 'Aquí queda el polinomio ordenado', W / 2, b.y + b.h / 2, b.w - 20, 13); }
      else { p.fill(C.ink); fitText(p, `$${polyTex(it, s.order)}$`, W / 2, b.y + b.h / 2 - (G.solved ? 10 : 0), b.w - 20, 20, 30); if (G.solved) { p.fill(C.ok); fitText(p, `grado ${gradeOf(it)}`, W / 2, b.y + b.h - 16, b.w - 20, 14); } }
      it.terms.forEach((t, i) => { const used = s.order.includes(i); drawTile(p, C, G.tile(i), `$${termTex(t)}$`, { fill: used ? C.line : C.cream, ink: used ? C.mute : undefined, size: 18 }); });
    },
    press(G, x, y) {
      const it = G.item, s = G.s, i = it.terms.findIndex((_, k) => !s.order.includes(k) && hitBox(G.tile(k), x, y));
      if (i < 0) return false;
      const best = Math.max(...it.terms.filter((_, k) => !s.order.includes(k)).map(t => t[1]));
      if (it.terms[i][1] !== best) { G.bad(it.terms[i][1] === 0 ? 'El número solo es de grado 0: va de último' : 'Todavía queda un exponente más alto'); return true; }
      s.order.push(i); G.api.sfx?.tap?.();
      if (s.order.length === it.terms.length) G.good(`Grado ${gradeOf(it)}`);
      return true;
    },
    peek: G => { const left = sorted(G.item).filter(i => !G.s.order.includes(i)); return { solve: left.map(i => G.tile(i)), wrong: left.length > 1 ? G.tile(left[left.length - 1]) : null }; },
  });
})();
