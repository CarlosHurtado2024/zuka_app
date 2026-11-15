// Reparte las barras (Álgebra, factorización; juego dinámico de alg-24b; spec 2026-11-21-dinamicos-mundos-altos): el
// montón de Caro es un cuadrado x², unas barras y unos cuadritos. Para armar el rectángulo, las barras se reparten:
// unas a la derecha y otras abajo. El hueco de la esquina mide lo de un lado por lo del otro, y ahí tienen que caber
// justo los cuadritos. Se pasan barras de un lado a otro con las flechas; cuando el hueco se llena exacto, «Listo».
// No todo montón se arma: si ningún reparto sirve, «No se arma».
// params = { rounds: [{ title, items: [{ s (barras), p (cuadritos) }] }], lives? }   state = { done: [n] }

GAMES['reparte-barras'] = (() => {
  // El reparto que arma el rectángulo (a barras a la derecha), o −1 si ninguno sirve.
  const splitOf = it => { for (let a = 0; a <= it.s / 2; a++) if (a * (it.s - a) === it.p) return a; return -1; };
  return questGame({
    aspect: 1.35,
    init: it => ({ a: 0, none: false }),
    ok: (s, it) => (splitOf(it) < 0 ? !!s.none : !s.none && s.a * (it.s - s.a) === it.p),
    answer: it => (splitOf(it) < 0 ? { a: 0, none: true } : { a: splitOf(it), none: false }),
    solution: it => { const a = splitOf(it); return a < 0 ? `$x^2 + ${it.s}x + ${it.p}$ no se arma con enteros` : `$x^2 + ${it.s}x + ${it.p} = (x + ${a})(x + ${it.s - a})$`; },
    prompt: it => `$x^2 + ${it.s}x + ${it.p}$: arma el rectángulo`,
    foot: () => 'Pasa barras de un lado al otro hasta que el hueco se llene justo',
    no: (it, s) => (s.none ? 'Sí se arma: prueba otro reparto' : splitOf(it) < 0 ? 'Ningún reparto llena justo el hueco' : 'El hueco no queda lleno justo'),
    retry: G => { G.s.none = false; },
    layout(G) {
      const w = (G.W - 24 - 3 * 8) / 4, y = G.bottom - 40;
      G.btn = [0, 1, 2, 3].map(i => ({ x: 12 + i * (w + 8), y, w, h: 34 }));
      G.area = { y: G.top + 2, h: y - G.top - 34 };
    },
    draw(G) {
      const { p, C, W, s, item: it } = G, a = s.a, b = it.s - a, k = Math.min(13, (Math.min(G.area.h, W - 40)) / (6 + Math.max(a, b, 3))), X = 6 * k, x0 = W / 2 - (X + a * k) / 2, y0 = G.area.y + (G.area.h - (X + b * k)) / 2;
      const cell = (x, y, w, h, col) => { p.noStroke(); p.fill(col); p.rect(x + 1, y + 1, w - 2, h - 2, 3); };
      cell(x0, y0, X, X, C.sky);
      for (let i = 0; i < a; i++) cell(x0 + X + i * k, y0, k, X, C.mint);
      for (let j = 0; j < b; j++) cell(x0, y0 + X + j * k, X, k, C.mint);
      // El hueco: se llena con los cuadritos que hay; si faltan queda punteado y si sobran se apilan afuera.
      for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) { const n = i * b + j; if (n < it.p) cell(x0 + X + i * k, y0 + X + j * k, k, k, C.sun); else { p.noFill(); p.stroke(C.mute); p.strokeWeight(1); p.rect(x0 + X + i * k + 1, y0 + X + j * k + 1, k - 2, k - 2, 3); } }
      const hole = a * b, diff = it.p - hole;
      p.noStroke(); p.fill(diff === 0 && hole > 0 ? C.ok : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      fitText(p, `${a} y ${b}: el hueco pide ${hole} · ${diff === 0 ? 'justo' : diff > 0 ? `sobran ${diff}` : `faltan ${-diff}`}`, W / 2, G.btn[0].y - 16, W - 20, 13);
      drawBtn(p, C, G.btn[0], '← barra', false, C.cream); drawBtn(p, C, G.btn[1], 'barra →', false, C.cream);
      drawBtn(p, C, G.btn[2], 'Listo', G.solved && !s.none, G.solved && !s.none ? C.ok : C.coral); drawBtn(p, C, G.btn[3], 'No se arma', G.solved && s.none, G.solved && s.none ? C.ok : C.sky);
    },
    press(G, x, y) {
      const s = G.s, i = G.btn.findIndex(b => hitBox(b, x, y));
      if (i < 0) return false;
      if (i === 0) s.a = Math.max(0, s.a - 1); else if (i === 1) s.a = Math.min(G.item.s, s.a + 1);
      else { s.none = i === 3; G.submit(); return true; }
      G.api.sfx?.tap?.();
      return true;
    },
    peek: G => { const a = splitOf(G.item), n = a < 0 ? 0 : a - G.s.a; return { solve: [...Array(Math.abs(n)).fill(G.btn[n > 0 ? 1 : 0]), G.btn[a < 0 ? 3 : 2]], wrong: G.btn[a < 0 ? 2 : 3] }; },
  });
})();
