// La ventana de la inversa (Trigonometría, trig-45): para invertir una función hay que quedarse con un tramo que tenga todas las
// alturas y no repita ninguna. Se mueve una ventana sobre la gráfica (en medios de π). item = { fn, std? }
GAMES['ventana-inversa'] = (() => {
  const stdA = fn => (fn === 'cos' ? 0 : -1);
  const valid = (fn, a, w) => w === 2 && TK.mod(a, 2) === (fn === 'cos' ? 0 : 1);
  return questGame({
    aspect: 1.4,
    init: () => ({ a: -4, w: 4 }),
    ok: (s, it) => valid(it.fn, s.a, s.w) && (!it.std || s.a === stdA(it.fn)),
    answer: it => ({ a: stdA(it.fn), w: 2 }),
    solution: it => `$${TK.FN[it.fn]}^{-1}$: $[${TK.piTex(stdA(it.fn), 2)},\\ ${TK.piTex(stdA(it.fn) + 2, 2)}]$`,
    prompt: it => (it.std ? `Deja la ventana oficial de $${TK.FN[it.fn]}^{-1}$: tiene los ángulos agudos` : `Deja un tramo de $y = ${TK.FN[it.fn]} x$ con todas las alturas, sin repetir`),
    foot: (it, s) => `Ventana: de $${TK.piTex(s.a, 2)}$ a $${TK.piTex(s.a + s.w, 2)}$`,
    yes: (it, s) => (s.a === stdA(it.fn) ? '¡Es justo la ventana oficial!' : 'Sirve: tiene todas las alturas una sola vez'),
    layout(G) {
      const w = (G.W - 36) / 2, y = G.bottom - 98; G.ba = { x: 12, y, w, h: 36 }; G.bw = { x: 24 + w, y, w, h: 36 }; G.go = { x: G.W / 2 - 80, y: G.bottom - 46, w: 160, h: 38 };
      G.box = { x: 16, y: G.top + 6, w: G.W - 32, h: y - G.top - 30 };
    },
    draw(G) {
      const { p, C, s, item: it, box } = G, yr = it.fn === 'tan' ? 3.2 : 1.5, f = TK.F[it.fn];
      const X = q => box.x + (q + 4) / 8 * box.w, Y = v => box.y + (box.h - 16) / 2 - v * (box.h - 16) / (2 * yr);
      p.noStroke(); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 10);
      const band = p.color(G.solved ? C.ok : C.sky); band.setAlpha(60); p.fill(band); const ga = TK.glide(G, 'a', s.a), gw = TK.glide(G, 'w', s.w); p.rect(X(ga), box.y, X(ga + gw) - X(ga), box.h - 16);
      p.stroke(C.line); p.strokeWeight(1.5); p.line(box.x, Y(0), box.x + box.w, Y(0)); p.line(X(0), box.y, X(0), box.y + box.h - 16);
      for (let q = -4; q <= 4; q += 2) TK.label(p, C, `$${TK.piTex(q, 2)}$`, Math.max(box.x + 14, Math.min(box.x + box.w - 14, X(q))), box.y + box.h - 8, C.mute, 11, 40);
      // La curva: gruesa dentro de la ventana, delgada afuera.
      let prev = null;
      for (let i = 0; i <= 320; i++) {
        const q = -4 + i / 40, v = f(q * Math.PI / 2), pt = Math.abs(v) <= yr ? [X(q), Y(v), q] : null;
        if (prev && pt && Math.abs(pt[1] - prev[1]) < box.h / 2) { const inn = q > s.a && q <= s.a + s.w; p.stroke(inn ? (G.solved ? C.ok : C.mint) : C.mute); p.strokeWeight(inn ? 4 : 1.5); p.line(prev[0], prev[1], pt[0], pt[1]); }
        prev = pt;
      }
      drawStepper(p, C, G.ba, `$${TK.piTex(s.a, 2)}$`, 'empieza en'); drawStepper(p, C, G.bw, `$${TK.piTex(s.w, 2)}$`, 'ancho');
      drawBtn(p, C, G.go, 'Probar', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, da = stepHit(G.ba, x, y), dw = stepHit(G.bw, x, y);
      if (da || dw) { if (dw) s.w = Math.max(1, Math.min(4, s.w + dw)); else s.a += da; s.a = Math.max(-4, Math.min(4 - s.w, s.a)); G.api.sfx?.tap?.(); return true; }
      if (!hitBox(G.go, x, y)) return false;
      G.submit(s.w < 2 ? 'Faltan alturas: ese tramo no las recorre todas' : !valid(it.fn, s.a, s.w) ? 'Una altura se repite: no habría un solo ángulo que devolver' : 'Sirve, pero la oficial es la que contiene los ángulos agudos');
      return true;
    },
    // Primero el ancho (al achicarlo, el inicio no se mueve) y después el inicio.
    peek: G => ({ solve: [...TK.steps(G.bw, G.s.w, 2), ...TK.steps(G.ba, G.s.a, stdA(G.item.fn)), G.go], wrong: G.go }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
