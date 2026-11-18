// El orden en el espejo (Álgebra, alg-12d; spec 2026-11-18-algebra-revision): sumar conserva el orden, multiplicar por
// un positivo también y por un negativo lo voltea. Arriba, a < b en la recta. Se arrastra el número que se suma o el
// factor; abajo aparecen las imágenes y el signo entre ellas se escribe solo (< o >). Hay que llevar la imagen de a al
// punto marcado, y mirar qué le pasa al orden.
// params = { rounds: [{ op: '+' | '×', a, b, target }] }   state = { rounds: [{ k }] }
GAMES['espejo-desigualdad'] = (() => {
  const KS = { '+': [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6], '×': [-3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3] };
  const app = (r, v, k) => (r.op === '+' ? v + k : v * k);
  const need = r => KS[r.op].find(k => app(r, r.a, k) === r.target);
  const ok = (s, r) => app(r, r.a, s.k) === r.target;
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ k: r.op === '+' ? 0 : 1 }),
    ok,
    solution: r => { const k = need(r), A = app(r, r.a, k), B = app(r, r.b, k); return `${r.op === '+' ? 'sumar' : 'multiplicar por'} ${k}: ${A} ${A < B ? '<' : '>'} ${B}`; },
    prompt: r => `Lleva a a la bandera ${r.op === '+' ? 'sumando' : 'multiplicando'}`,
    foot: (r, s) => (r.op === '×' && s.k < 0 ? 'Por un negativo, el orden se voltea' : 'Arrastra el control de abajo'),
    layout(G) { const W = G.W, H = G.H; G.L1 = { x0: 22, x1: W - 22, y: 132, min: -9, max: 9 }; G.L2 = { x0: 22, x1: W - 22, y: H * 0.5, min: -9, max: 9 }; G.trackY = H * 0.68; G.fb = { x: 12, y: H - 84, w: W - 24, h: 52 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { k: need(r) } : G.s, K = KS[r.op];
      const X1 = drawNumLine(p, C, G.L1, { step: 1, every: 3 }), X2 = drawNumLine(p, C, G.L2, { step: 1, every: 3 }), A = app(r, r.a, s.k), B = app(r, r.b, s.k);
      drawDot(p, C, X1(r.a), G.L1.y, 13, C.sky); drawDot(p, C, X1(r.b), G.L1.y, 13, C.coral);
      TK.label(p, C, 'a', X1(r.a), G.L1.y - 18, C.sky, 13, 20); TK.label(p, C, 'b', X1(r.b), G.L1.y - 18, C.coral, 13, 20);
      p.stroke(C.ok); p.strokeWeight(2); p.line(X2(r.target), G.L2.y - 6, X2(r.target), G.L2.y - 40); p.noStroke(); p.fill(C.ok); p.triangle(X2(r.target), G.L2.y - 40, X2(r.target) + 13, G.L2.y - 34, X2(r.target), G.L2.y - 28);
      p.stroke(RK.al(p, C.line, 200)); p.strokeWeight(1); p.drawingContext.setLineDash([3, 4]); p.line(X1(r.a), G.L1.y, X2(Math.max(-9, Math.min(9, A))), G.L2.y); p.line(X1(r.b), G.L1.y, X2(Math.max(-9, Math.min(9, B))), G.L2.y); p.drawingContext.setLineDash([]);
      drawDot(p, C, X2(A), G.L2.y, 13, C.sky); drawDot(p, C, X2(B), G.L2.y, 13, C.coral);
      const kx = i => 26 + i * (G.W - 52) / (K.length - 1), ki = K.indexOf(s.k);
      p.stroke(C.line); p.strokeWeight(2); p.line(kx(0), G.trackY, kx(K.length - 1), G.trackY);
      K.forEach((k, i) => { if (i % (r.op === '+' ? 2 : 2) === 0 || k === s.k) TK.label(p, C, `${k}`.replace('-', '−'), kx(i), G.trackY + 22, k === s.k ? C.brand : C.mute, 10, 28); });
      RK.knob(p, C, kx(ki), G.trackY, C.brand); G.kx = kx; G.knob = { x: kx(ki), y: G.trackY };
      TK.label(p, C, r.op === '+' ? `sumar ${s.k}`.replace('-', '−') : `multiplicar por ${s.k}`.replace('-', '−'), G.W / 2, G.trackY - 22, C.ink, 13, 200);
      const sg = A < B ? '<' : A > B ? '>' : '=';
      RK.strip(p, C, G.fb, `$${RK.num(r.a)} < ${RK.num(r.b)} \\;\\Rightarrow\\; ${RK.num(A)} ${sg} ${RK.num(B)}$`, { kicker: sg === '>' ? 'El orden se volteó' : 'El orden se conserva', col: G.locked ? C.ok : sg === '>' ? C.coral : C.mint, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.trackY) > 34) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: G.knob, to: { x: G.knob.x - 60, y: G.knob.y }, text: 'Arrastra el control', ty: G.trackY + 50 }),
    peek: G => ({ trackY: G.trackY, kx: KS[G.r.op].map((_, i) => G.kx(i)), need: need(G.r) }),
  });
  game.move = (G, x) => { const K = KS[G.r.op]; let b = 0; for (let i = 1; i < K.length; i++) if (Math.abs(G.kx(i) - x) < Math.abs(G.kx(b) - x)) b = i; if (K[b] !== G.s.k || !G.touched[G.cur]) { G.s.k = K[b]; G.touch(); } };
  return Object.assign(game, { need, KS });
})();
