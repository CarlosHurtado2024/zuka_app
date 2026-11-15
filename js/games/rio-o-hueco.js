// ¿Río o hueco? (Álgebra, dominio de una expresión racional; juego dinámico de alg-25a; spec
// 2026-11-21-dinamicos-mundos-altos): Beto camina por el sendero de una fracción, un paso entero a la vez. Antes de
// cada paso se decide qué hay en el siguiente punto: si el denominador no es cero, se camina; si arriba y abajo se
// anulan a la vez (un factor común), es un hueco y se salta; si solo se anula el denominador, es un río (una
// asíntota) y no se puede pasar: ahí termina la caminata. Equivocarse quita una vida.
// params = { rounds: [{ title, items: [{ top: [ceros del numerador], bottom: [ceros del denominador], from, to }] }], lives? }
// state = { done: [n] }      (la fracción es ∏(x − t) ÷ ∏(x − b), ya factorizada)

GAMES['rio-o-hueco'] = (() => {
  const fac = r => (r === 0 ? 'x' : `(x ${r < 0 ? '+' : '-'} ${Math.abs(r)})`);
  const tex = it => `\\frac{${it.top.map(fac).join('') || '1'}}{${it.bottom.map(fac).join('')}}`;
  // Qué hay en x: 0 camino, 1 hueco, 2 río.
  const at = (it, x) => (!it.bottom.includes(x) ? 0 : it.top.includes(x) ? 1 : 2);
  // Hasta dónde llega la caminata: el primer río, o el final del sendero.
  const endOf = it => { for (let x = it.from + 1; x <= it.to; x++) if (at(it, x) === 2) return x; return it.to; };
  const NAMES = ['Caminar', 'Saltar el hueco', 'Es un río'];
  return questGame({
    aspect: 1.2,
    init: it => ({ x: it.from, end: false }),
    ok: (s, it) => !!s.end && s.x === endOf(it),
    answer: it => ({ x: endOf(it), end: true }),
    solution: it => `$${tex(it)}$: ${it.bottom.map(b => `en ${negTxt(b)} ${at(it, b) === 1 ? 'hay un hueco' : 'hay un río'}`).join(' y ')}`,
    prompt: it => `$${tex(it)}$`,
    foot: (it, s) => `Beto está en x = ${negTxt(s.x)}: ¿qué hay en x = ${negTxt(Math.min(it.to, s.x + 1))}?`,
    layout(G) {
      const w = (G.W - 24 - 2 * 8) / 3, y = G.bottom - 44; G.btn = [0, 1, 2].map(i => ({ x: 12 + i * (w + 8), y, w, h: 38 }));
      G.py = G.top + (y - G.top) / 2; G.X = x => 24 + (x - G.item.from) * (G.W - 48) / (G.item.to - G.item.from);
    },
    draw(G) {
      const { p, C, s, item: it } = G, y = G.py;
      for (let x = it.from; x <= it.to; x++) {
        const px = G.X(x), known = x <= s.x || (s.end && x === s.x), k = at(it, x);
        if (x < it.to) { p.stroke(known && x < s.x ? C.sky : C.line); p.strokeWeight(5); p.line(px, y, G.X(x + 1), y); }
        p.noStroke();
        if (known && k === 1) { p.fill(C.bg); p.circle(px, y, 18); p.noFill(); p.stroke(C.N); p.strokeWeight(2); p.circle(px, y, 14); }
        else if (known && k === 2) { p.fill(C.Z); p.rect(px - 9, y - 40, 18, 80, 8); }
        else { p.fill(known ? C.sky : C.card); p.stroke(C.line); p.strokeWeight(1.5); p.circle(px, y, 12); }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.text(negTxt(x), px, y + 22);
        if (known && k) { p.fill(k === 1 ? C.N : C.Z); p.textSize(10); p.text(k === 1 ? 'hueco' : 'río', px, y + 52); }
      }
      const bx = G.X(s.x) - (s.end && at(it, s.x) === 2 ? 20 : 0);   // Beto se queda en la orilla del río
      p.noStroke(); p.fill(C.coral); p.circle(bx, y - 24, 16); p.rect(bx - 6, y - 16, 12, 16, 4);
      NAMES.forEach((t, i) => drawBtn(p, C, G.btn[i], t, false, i === 0 ? C.cream : i === 1 ? C.sun : C.sky));
    },
    press(G, x, y) {
      const s = G.s, it = G.item, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      const nx = s.x + 1, k = at(it, nx);
      if (i !== k) { G.bad(k === 0 ? `En x = ${negTxt(nx)} el denominador no es cero: se camina` : k === 1 ? `En x = ${negTxt(nx)} arriba también da cero: es un hueco` : `En x = ${negTxt(nx)} solo se anula abajo: es un río`); return true; }
      s.x = nx; G.api.sfx?.tap?.();
      if (k === 2) { s.end = true; G.good('Un río: hasta aquí llega el sendero'); } else if (nx === it.to) { s.end = true; G.good('¡Llegó al final del sendero!'); }
      return true;
    },
    peek: G => { const it = G.item, seq = []; for (let x = G.s.x + 1; x <= endOf(it); x++) seq.push(G.btn[at(it, x)]); return { solve: seq, wrong: G.btn[(at(it, G.s.x + 1) + 1) % 3] }; },
  });
})();
