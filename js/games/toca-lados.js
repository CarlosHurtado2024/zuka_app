// Toca los lados (Trigonometría, trig-1; con csc, sec y cot en trig-42c): el triángulo sale girado o volteado y hay que mirar desde θ.
// Se toca primero el lado de arriba de la fracción y luego el de abajo. item = { fn, t (0–7: volteos), len: [op, ady, hip] }
GAMES['toca-lados'] = (() => {
  const PAIR = { sen: [0, 2], cos: [1, 2], tan: [0, 1], csc: [2, 0], sec: [2, 1], cot: [1, 0] };
  return questGame({
    aspect: 1.3,
    init: () => ({ pick: [] }),
    ok: (s, it) => s.pick.join() === PAIR[it.fn].join(),
    answer: it => ({ pick: [...PAIR[it.fn]] }),
    solution: it => `$${TK.FN[it.fn]}\\theta = \\tfrac{${it.len[PAIR[it.fn][0]]}}{${it.len[PAIR[it.fn][1]]}}$`,
    prompt: it => `Arma $${TK.FN[it.fn]}\\theta$: toca el lado de arriba y luego el de abajo`,
    foot: () => 'Mira desde θ: el opuesto queda al frente; la hipotenusa, frente al ángulo recto',
    no: () => 'Esos dos lados forman otra razón',
    retry: G => { G.s.pick = []; },
    layout(G) {
      const it = G.item, t = it.t || 0, k = Math.max(0.4, Math.min(1, it.len[0] / it.len[1])), kx = Math.max(0.4, Math.min(1, it.len[1] / it.len[0]));
      const w = Math.min(G.W - 110, G.bottom - G.top - 96, 180), h = w, x0 = (G.W - w) / 2, y0 = G.top + 58;
      const P = ([u, v]) => { if (t & 4) [u, v] = [v, u]; if (t & 1) u = 1 - u; if (t & 2) v = 1 - v; return [x0 + u * w, y0 + v * h]; };
      const A = P([(1 - kx) / 2, 1]), B = P([(1 + kx) / 2, 1]), T = P([(1 + kx) / 2, 1 - k]);
      G.A = A; G.B = B; G.T = T; G.seg = [[B, T], [A, B], [A, T]]; G.cen = [(A[0] + B[0] + T[0]) / 3, (A[1] + B[1] + T[1]) / 3];
    },
    draw(G) {
      const { p, C, s, item: it, A, B, T, seg, cen } = G, col = i => (s.pick[0] === i ? C.sky : s.pick[1] === i ? C.coral : C.ink);
      const show = i => (s.pick[i] == null ? '\\square' : it.len[s.pick[i]]);
      TK.label(p, C, `$${TK.FN[it.fn]}\\theta = \\tfrac{${show(0)}}{${show(1)}}$`, G.W / 2, G.top + 26, G.solved ? C.ok : C.ink, 22, G.W - 40);
      p.noStroke(); p.fill(C.card); p.triangle(...A, ...B, ...T);
      seg.forEach(([a, b], i) => { p.stroke(col(i)); p.strokeWeight(s.pick.includes(i) ? 6 : 3); p.line(...a, ...b); });
      // Ángulo recto y θ.
      const u = (a, b, d) => { const n = Math.hypot(b[0] - a[0], b[1] - a[1]); return [a[0] + (b[0] - a[0]) / n * d, a[1] + (b[1] - a[1]) / n * d]; };
      const q1 = u(B, A, 12), q2 = u(B, T, 12); p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.quad(...B, ...q1, q1[0] + q2[0] - B[0], q1[1] + q2[1] - B[1], ...q2);
      const th = u(A, cen, 30); drawDot(p, C, A[0], A[1], 9, C.N); TK.label(p, C, 'θ', th[0], th[1], C.N, 17, 30);
      seg.forEach(([a, b], i) => TK.sideLabel(p, C, it.len[i], a, b, cen, col(i)));
    },
    press(G, x, y) {
      const s = G.s, i = TK.hitSeg(G.seg, x, y);
      if (i < 0 || s.pick.includes(i)) return i >= 0;
      s.pick.push(i); G.api.sfx?.tap?.();
      if (s.pick.length === 2) G.submit();
      return true;
    },
    peek: G => ({ solve: PAIR[G.item.fn].filter(i => !G.s.pick.includes(i) || G.s.pick.length === 0).map(i => TK.mid(...G.seg[i])) }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
