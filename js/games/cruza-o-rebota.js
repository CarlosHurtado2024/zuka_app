// ¿Cruza o rebota? (Álgebra, ceros y multiplicidad; juego dinámico de alg-93; spec 2026-11-21-dinamicos-mundos-altos):
// la montaña del video cruza la vía en unos ceros y en otros la toca y se devuelve. Eso lo decide cuántas veces se
// repite el factor: repetido un número impar de veces, cruza; un número par, rebota. Cada reto da el polinomio
// factorizado; en cada cero se toca la ficha para elegir «cruza» o «rebota» y luego «Dibujar»: el juego traza la
// montaña y se ve si quedó como se dijo.
// params = { rounds: [{ title, items: [{ a: 1 | −1, factors: [[cero, veces], …] }] }], lives? }   state = { done: [n] }

GAMES['cruza-o-rebota'] = (() => {
  const want = it => it.factors.map(([, m]) => (m % 2 ? 'c' : 'r'));
  const tex = it => `y = ${it.a < 0 ? '-' : ''}${it.factors.map(([r, m]) => `${r === 0 ? 'x' : `(x ${r < 0 ? '+' : '-'} ${Math.abs(r)})`}${m > 1 ? `^{${m}}` : ''}`).join('')}`;
  const f = (it, x) => it.a * it.factors.reduce((t, [r, m]) => t * (x - r) ** m, 1);
  return questGame({
    aspect: 1.25,
    init: it => ({ pick: it.factors.map(() => '') }),
    ok: (s, it) => s.pick.join() === want(it).join(),
    answer: it => ({ pick: want(it) }),
    solution: it => `$${tex(it)}$: ${it.factors.map(([r, m]) => `en ${negTxt(r)} ${m % 2 ? 'cruza' : 'rebota'}`).join(', ')}`,
    prompt: it => `$${tex(it)}$`,
    foot: () => 'Mira cuántas veces se repite cada factor',
    no: (it, s) => (s.pick.includes('') ? 'Falta decidir un cero' : 'Mira el exponente del factor: impar cruza, par rebota'),
    layout(G) {
      G.btn = { x: G.W / 2 - 60, y: G.bottom - 38, w: 120, h: 34 };
      const top = G.top + 6, h = G.btn.y - top - 60;
      G.X = x => 20 + (x + 5) * (G.W - 40) / 10; G.mid = top + h / 2; G.amp = h / 2 - 6;
      G.chip = i => { const x = G.X(G.item.factors[i][0]), w = Math.min(78, 2 * (G.W - 40) / 10 - 6); return { x: Math.max(8, Math.min(G.W - 8 - w, x - w / 2)), y: G.btn.y - 50, w, h: 34 }; };   // ceros a 2 unidades no se enciman
    },
    draw(G) {
      const { p, C, W, s, item: it } = G;
      p.stroke(C.ink); p.strokeWeight(3); p.line(12, G.mid, W - 12, G.mid);
      if (G.solved) {   // la montaña, con la altura comprimida para que quepa
        let max = 1; for (let x = -5; x <= 5; x += 0.1) max = Math.max(max, Math.abs(f(it, x)));
        const sq = v => Math.sign(v) * Math.sqrt(Math.abs(v) / max);
        p.noFill(); p.stroke(C.sky); p.strokeWeight(3.5); p.beginShape(); for (let x = -5; x <= 5.001; x += 0.05) p.vertex(G.X(x), G.mid - sq(f(it, x)) * G.amp); p.endShape();
      }
      it.factors.forEach(([r], i) => {
        const x = G.X(r), b = G.chip(i), v = s.pick[i];
        p.noStroke(); p.fill(C.N); p.circle(x, G.mid, 12);
        p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.text(negTxt(r), x, G.mid + 16);
        p.stroke(C.line); p.strokeWeight(1.5); p.line(x, G.mid + 24, b.x + b.w / 2, b.y);
        drawTile(p, C, b, v === 'c' ? 'cruza' : v === 'r' ? 'rebota' : '¿?', { fill: v ? (G.solved ? C.ok : C.sky) : C.cream, size: 14 });
      });
      drawBtn(p, C, G.btn, 'Dibujar', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      if (hitBox(G.btn, x, y)) { G.submit(); return true; }
      const i = G.item.factors.findIndex((_, k) => hitBox(G.chip(k), x, y));
      if (i < 0) return false;
      G.s.pick[i] = G.s.pick[i] === 'c' ? 'r' : 'c'; G.api.sfx?.tap?.();
      return true;
    },
    peek: G => { const w = want(G.item), taps = []; G.s.pick.forEach((v, i) => { const n = v === w[i] ? 0 : v === '' ? (w[i] === 'c' ? 1 : 2) : 1; for (let k = 0; k < n; k++) taps.push(G.chip(i)); }); return { solve: [...taps, G.btn], wrong: G.btn }; },
  });
})();
