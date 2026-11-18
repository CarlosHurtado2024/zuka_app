// El vagón y la liga (Álgebra, alg-12b; juego en movimiento; spec 2026-11-18-algebra-revision): los inversos llevan al
// neutro. Suma: un vagón en a debe llegar a la estación 0; se estira el resorte (el número que se suma) y al soltar el
// vagón corre: llega si se sumó el opuesto, −a. Producto: una liga de largo a debe quedar de largo 1; se elige el
// factor en una regla de fracciones y al soltar la liga se estira o encoge: queda en 1 si el factor es el recíproco, 1/a.
// params = { rounds: [{ title, items: [{ kind: '+', a } | { kind: '×', a: [num, den] }] }] }   s = { v, shot }
GAMES['vagon-inverso'] = (() => {
  const K = [[1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [1, 1], [4, 3], [3, 2], [2, 1], [3, 1], [4, 1]];
  const val = it => (it.kind === '+' ? it.a : it.a[0] / it.a[1]);
  const need = it => (it.kind === '+' ? -it.a : K.findIndex(([n, d]) => Math.abs((n / d) * val(it) - 1) < 1e-9));
  const fr = ([n, d]) => (d === 1 ? `${n}` : `\\tfrac{${n}}{${d}}`);
  const game = questGame({
    aspect: 1.15,
    idle: 'Sin prisa: el vagón y la liga solo se mueven al soltar',
    init: it => ({ v: it.kind === '+' ? 0 : 5, shot: null }),
    ok: (s, it) => s.v === need(it),
    answer: it => ({ v: need(it), shot: null }),
    solution: it => (it.kind === '+' ? `sumar ${-it.a}: el opuesto` : `multiplicar por ${K[need(it)].join('/')}: el recíproco`),
    prompt: it => (it.kind === '+' ? 'Lleva el vagón a la estación 0' : 'Deja la liga de largo 1'),
    foot: (it, s) => (s.missed ? 'Mira cuánto se pasó o le faltó' : it.kind === '+' ? 'Estira el resorte y suelta' : 'Elige el factor y suelta'),
    layout(G) { G.L = { x0: 24, x1: G.W - 24, y: G.top + 150, min: -8, max: 8 }; G.R = { x0: 24, x1: G.W - 24, y: G.top + 120, min: 0, max: 4 }; G.trackY = G.bottom - 44; },
    draw(G) {
      const { p, C, s, item: it } = G, t = s.shot == null ? 0 : Math.min(1, (G.t - s.shot) / 1.1), e = t * t * (3 - 2 * t);
      if (it.kind === '+') {
        const X = drawNumLine(p, C, G.L, { step: 1, every: 2 }), a = it.a, end = a + s.v, pos = a + s.v * e;
        p.noStroke(); p.fill(C.ok); p.triangle(X(0), G.L.y - 34, X(0) - 8, G.L.y - 20, X(0) + 8, G.L.y - 20); TK.label(p, C, 'estación', X(0), G.L.y - 44, C.ok, 10, 70);
        if (s.v && s.shot == null) RK.arrow(p, X(a), X(end), G.L.y + 34, s.v > 0 ? C.mint : C.coral, 3);
        TK.label(p, C, `$${s.v >= 0 ? '+' : ''}${RK.num(s.v)}$`, (X(a) + X(end)) / 2, G.L.y + 52, C.ink, 14, 60);
        p.stroke(C.ink); p.strokeWeight(2); p.fill(C.sky); p.rect(X(pos) - 18, G.L.y - 22, 36, 18, 4); p.fill(C.ink); p.circle(X(pos) - 9, G.L.y - 3, 7); p.circle(X(pos) + 9, G.L.y - 3, 7);
        G.knob = { x: X(end), y: G.L.y + 34 }; RK.knob(p, C, G.knob.x, G.knob.y, C.brand);
        if (t >= 1 && !G.solved) { if (end === 0) G.good('¡Llegó! a + (−a) = 0'); else { s.shot = null; s.missed = true; G.bad(`Quedó en ${end}`); } }
      } else {
        const X = drawNumLine(p, C, G.R, { step: 1 }), a = val(it), f = K[s.v][0] / K[s.v][1], len = a * (1 + (f - 1) * e);
        p.stroke(C.ok); p.strokeWeight(2); p.line(X(1), G.R.y - 40, X(1), G.R.y + 6); TK.label(p, C, 'largo 1', X(1), G.R.y - 50, C.ok, 10, 60);
        p.stroke(C.coral); p.strokeWeight(7); p.line(X(0), G.R.y - 18, X(Math.min(4, len)), G.R.y - 18);
        TK.label(p, C, `$${fr(it.a)}$`, X(0) + 16, G.R.y - 38, C.coral, 14, 40);
        // La regla de factores.
        const kx = i => 24 + i * (G.W - 48) / (K.length - 1);
        p.stroke(C.line); p.strokeWeight(2); p.line(kx(0), G.trackY, kx(K.length - 1), G.trackY);
        K.forEach((k, i) => { p.stroke(C.line); p.line(kx(i), G.trackY - 5, kx(i), G.trackY + 5); TK.label(p, C, `$${fr(k)}$`, kx(i), G.trackY + 22, i === s.v ? C.brand : C.mute, 11, 26); });
        G.knob = { x: kx(s.v), y: G.trackY }; G.kx = kx; RK.knob(p, C, G.knob.x, G.knob.y, C.brand);
        TK.label(p, C, `$\\times\\,${fr(K[s.v])}$`, G.W / 2, G.trackY - 30, C.ink, 16, 80);
        if (t >= 1 && !G.solved) { if (Math.abs(f * a - 1) < 1e-9) G.good('¡Largo 1! a · (1/a) = 1'); else { s.shot = null; s.missed = true; G.bad(`Quedó de largo ${RK.num(f * a).replace(/\\tfrac\{(\d+)\}\{(\d+)\}/, '$1/$2')}`); } }
      }
    },
    press(G, x, y) { if (G.s.shot != null || Math.hypot(x - G.knob.x, y - G.knob.y) > 40) return false; G.grab = true; return true; },
    drag(G, x) {
      if (!G.grab || G.s.shot != null) return false;
      const it = G.item;
      if (it.kind === '+') { const L = G.L, v = Math.round(L.min + (x - L.x0) / (L.x1 - L.x0) * (L.max - L.min)) - it.a; G.s.v = Math.max(L.min - it.a, Math.min(L.max - it.a, v)); }
      else { let b = 0; for (let i = 1; i < K.length; i++) if (Math.abs(G.kx(i) - x) < Math.abs(G.kx(b) - x)) b = i; G.s.v = b; }
      return true;
    },
    release(G) { if (G.grab && G.s.shot == null && !G.solved) { G.s.shot = G.t; G.api.sfx?.tap?.(); } G.grab = false; },
    demo: G => (G.knob ? { from: G.knob, to: { x: G.knob.x + (G.item.kind === '+' ? -60 : 50), y: G.knob.y }, text: 'Arrastra y suelta', ty: G.knob.y - 70 } : null),
    peek: G => ({ knob: G.knob, L: G.L, kx: G.kx && K.map((_, i) => G.kx(i)), need: need(G.item), flying: G.s.shot != null }),
  });
  return Object.assign(game, { need, K });
})();
