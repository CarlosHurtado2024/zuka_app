// Las piedras de la selva (Álgebra, ecuaciones exponenciales y logarítmicas; juego dinámico de alg-73; spec
// 2026-11-21-dinamicos-mundos-altos): la trampa del video. Al resolver una ecuación salen candidatos, y no todos
// sirven: un logaritmo no acepta números negativos ni el cero. En el río hay piedras con los candidatos; para cruzar
// se pisan TODAS las que sí son solución y ninguna de las que no. Pisar una falsa quita una vida y el juego dice por
// qué no sirve.
// params = { rounds: [{ title, items: [{ eq (TeX), stones: [{ x (texto), ok, why? }] }] }], lives? }   state = { done: [n] }

GAMES['piedras-selva'] = (() => {
  const good = it => it.stones.map((q, i) => (q.ok ? i : -1)).filter(i => i >= 0);
  return questGame({
    aspect: 1.15,
    init: () => ({ on: [] }),
    ok: (s, it) => [...s.on].sort((a, b) => a - b).join() === good(it).join(),
    answer: it => ({ on: good(it) }),
    solution: it => `$${it.eq}$: ${good(it).map(i => `x = ${it.stones[i].x}`).join(' y ')}`,
    prompt: it => `$${it.eq}$`,
    foot: (it, s) => `Pisa todas las soluciones que sí sirven · llevas ${s.on.length}`,
    layout(G) {
      const n = G.item.stones.length, w = Math.min(74, (G.W - 24 - (n - 1) * 10) / n), x0 = G.W / 2 - (n * w + (n - 1) * 10) / 2, mid = G.top + (G.bottom - G.top) / 2;
      G.stone = i => ({ x: x0 + i * (w + 10), y: mid - 26 + (i % 2 ? 22 : -22), w, h: 52 }); G.mid = mid;
    },
    draw(G) {
      const { p, C, W, s, item: it } = G;
      p.noStroke(); p.fill(shade(C.sky, 0.55)); p.rect(12, G.mid - 70, W - 24, 140, 16);
      it.stones.forEach((q, i) => {
        const b = G.stone(i), on = s.on.includes(i);
        p.noStroke(); p.fill(shade(on ? (G.solved ? C.ok : C.mint) : C.cream, 0.74)); p.ellipse(b.x + b.w / 2, b.y + b.h / 2 + 4, b.w, b.h);
        p.fill(on ? (G.solved ? C.ok : C.mint) : C.cream); p.ellipse(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h);
        p.fill(inkOn(on ? C.mint : C.cream, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, `$x = ${q.x}$`, b.x + b.w / 2, b.y + b.h / 2, b.w - 10, 15, 30);
      });
    },
    press(G, x, y) {
      const it = G.item, s = G.s, i = it.stones.findIndex((_, k) => hitBox(G.stone(k), x, y));
      if (i < 0 || s.on.includes(i)) return i >= 0;
      if (!it.stones[i].ok) { G.bad(it.stones[i].why || 'Reemplázala en la ecuación: no la cumple'); return true; }
      s.on.push(i); G.api.sfx?.tap?.();
      if (s.on.length === good(it).length) G.good('¡Cruzaste el río!');
      return true;
    },
    peek: G => { const it = G.item, bad = it.stones.findIndex(q => !q.ok); return { solve: good(it).filter(i => !G.s.on.includes(i)).map(i => G.stone(i)), wrong: bad >= 0 ? G.stone(bad) : null }; },
  });
})();
