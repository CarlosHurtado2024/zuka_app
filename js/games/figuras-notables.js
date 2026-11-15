// Figuras notables (Trigonometría, trig-2): las razones de 30°, 45° y 60° salen de medio triángulo equilátero (1, √3, 2) y de medio
// cuadrado (1, 1, √2). Se tocan dos lados: el de arriba y el de abajo de la fracción. item = { fn, deg }
GAMES['figuras-notables'] = (() => {
  const S3 = Math.sqrt(3), LEN = [1, S3, 2, 1, 1, Math.SQRT2], TEX = ['1', '\\sqrt3', '2', '1', '1', '\\sqrt2'];
  const RES = { tan60: '\\sqrt3', tan30: '\\tfrac{\\sqrt3}{3}', sen45: '\\tfrac{\\sqrt2}{2}', cos45: '\\tfrac{\\sqrt2}{2}', tan45: '1' };
  const fits = (a, b, it) => a !== b && a != null && b != null && (a < 3) === (b < 3) && (a < 3) === (it.deg !== 45) && Math.abs(LEN[a] / LEN[b] - TK.F[it.fn](TK.rad(it.deg))) < 1e-9;
  const pair = it => { for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) if (fits(a, b, it)) return [a, b]; return null; };
  const name = it => `${TK.FN[it.fn]} ${it.deg}^\\circ`;
  return questGame({
    aspect: 1.3,
    init: () => ({ pick: [] }),
    ok: (s, it) => fits(s.pick[0], s.pick[1], it),
    answer: it => ({ pick: pair(it) }),
    solution: it => { const [a, b] = pair(it), r = RES[it.fn + it.deg]; return `$${name(it)} = \\tfrac{${TEX[a]}}{${TEX[b]}}${r ? ` = ${r}` : ''}$`; },
    prompt: it => `Arma $${name(it)}$: toca el lado de arriba y luego el de abajo`,
    foot: () => 'Busca el ángulo en una figura y mira sus lados desde ahí',
    no: () => 'Esos lados no dan esa razón: busca primero el ángulo',
    retry: G => { G.s.pick = []; },
    layout(G) {
      const u = Math.min(74, (G.W - 96) / 2.3, (G.bottom - G.top - 110) / S3), yb = G.top + 76 + S3 * u, xe = G.W * 0.27 - u / 2, v = u * 1.25, xs = G.W * 0.74 - v / 2;
      const A = [xe, yb], B = [xe + u, yb], T = [xe + u, yb - S3 * u], A2 = [xs, yb], B2 = [xs + v, yb], T2 = [xs + v, yb - v];
      G.tri = [[A, B, T], [A2, B2, T2]]; G.seg = [[A, B], [B, T], [A, T], [A2, B2], [B2, T2], [A2, T2]]; G.yb = yb;
    },
    draw(G) {
      const { p, C, s, item: it, tri, seg } = G, col = i => (s.pick[0] === i ? C.sky : s.pick[1] === i ? C.coral : C.ink);
      const show = i => (s.pick[i] == null ? '\\square' : TEX[s.pick[i]]), r = RES[it.fn + it.deg];
      TK.label(p, C, `$${name(it)} = \\tfrac{${show(0)}}{${show(1)}}${G.solved && r ? ` = ${r}` : ''}$`, G.W / 2, G.top + 26, G.solved ? C.ok : C.ink, 21, G.W - 30);
      tri.forEach(([a, b, t], k) => {
        const cen = [(a[0] + b[0] + t[0]) / 3, (a[1] + b[1] + t[1]) / 3];
        p.noStroke(); p.fill(C.card); p.triangle(...a, ...b, ...t);
        p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.rect(b[0] - 11, b[1] - 11, 11, 11);
        for (let i = 0; i < 3; i++) { const [q, w] = seg[3 * k + i]; p.stroke(col(3 * k + i)); p.strokeWeight(s.pick.includes(3 * k + i) ? 6 : 3); p.line(...q, ...w); TK.sideLabel(p, C, `$${TEX[3 * k + i]}$`, q, w, cen, col(3 * k + i)); }
        TK.label(p, C, k ? '45°' : '60°', a[0] + (k ? 26 : 19), a[1] - 9, C.N, 12, 40); TK.label(p, C, k ? '45°' : '30°', t[0] - (k ? 10 : 8), t[1] + (k ? 26 : 34), C.N, 12, 40);
        TK.label(p, C, k ? 'Medio cuadrado' : 'Medio equilátero', (a[0] + b[0]) / 2, G.yb + 34, C.mute, 11, 130);
      });
    },
    press(G, x, y) {
      const s = G.s, i = TK.hitSeg(G.seg, x, y);
      if (i < 0 || s.pick.includes(i)) return i >= 0;
      s.pick.push(i); G.api.sfx?.tap?.();
      if (s.pick.length === 2) G.submit();
      return true;
    },
    peek: G => ({ solve: G.s.pick.length ? [] : pair(G.item).map(i => TK.mid(...G.seg[i])) }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
