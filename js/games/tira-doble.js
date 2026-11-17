// La tira doble (Trigonometría, trig-48b): una tira de largo 1 se parte en cos²θ y sen²θ. Su diferencia es cos 2θ. Se elige el corte
// (en octavos) para que la resta dé lo pedido. item = { t }   (cos 2θ = t/4, con t de −4 a 3)
GAMES['tira-doble'] = (() => {
  const fr = (n, d) => { const g = TK.gcd(n, d) || 1; n /= g; d /= g; return d === 1 || !n ? `${n}` : `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}`; };
  const TH = { 8: 0, 6: 30, 4: 45, 2: 60, 0: 90 };
  return questGame({
    aspect: 1.3,
    init: () => ({ k: 8, shot: null }),
    ok: (s, it) => s.k === it.t + 4,
    answer: it => ({ k: it.t + 4, shot: it.t + 4 }),
    solution: it => `$\\cos^2\\theta = ${fr(it.t + 4, 8)}$ y $\\operatorname{sen}^2\\theta = ${fr(4 - it.t, 8)}$`,
    prompt: it => `Corta la tira para que $\\cos 2\\theta = ${fr(it.t, 4)}$ y luego resta`,
    foot: () => '$\\cos 2\\theta = \\cos^2\\theta - \\operatorname{sen}^2\\theta$, y las dos partes suman 1',
    layout(G) { const y = G.bottom - 46; G.st = { x: 12, y, w: G.W * 0.56, h: 38 }; G.go = { x: G.st.x + G.st.w + 10, y, w: G.W - 34 - G.st.w, h: 38 }; G.x0 = 24; G.w = G.W - 48; G.y1 = G.top + 34; },
    draw(G) {
      const { p, C, s, x0, w, y1 } = G, cut = x0 + w * TK.glide(G, 'k', s.k) / 8;
      // La tira: cos² a la izquierda, sen² a la derecha.
      p.noStroke(); p.fill(C.sky); p.rect(x0, y1, cut - x0, 40, 8, 0, 0, 8); p.fill(C.coral); p.rect(cut, y1, x0 + w - cut, 40, 0, 8, 8, 0);
      for (let i = 1; i < 8; i++) { p.stroke(C.bg); p.strokeWeight(1.5); p.line(x0 + w * i / 8, y1, x0 + w * i / 8, y1 + 40); }
      TK.label(p, C, `$\\cos^2\\theta = ${fr(s.k, 8)}$`, x0 + w * 0.25, y1 - 16, C.sky, 14, w / 2 - 6); TK.label(p, C, `$\\operatorname{sen}^2\\theta = ${fr(8 - s.k, 8)}$`, x0 + w * 0.75, y1 - 16, C.coral, 14, w / 2 - 6);
      if (s.shot != null) {
        const y2 = y1 + 62, a = w * s.shot / 8, b = w * (8 - s.shot) / 8, d = s.shot - 4;
        p.noStroke(); p.fill(C.sky); p.rect(x0, y2, Math.max(a, 1), 22, 5); p.fill(C.coral); p.rect(x0, y2 + 26, Math.max(b, 1), 22, 5);
        p.stroke(G.solved ? C.ok : C.N); p.strokeWeight(5); if (a !== b) p.line(x0 + Math.min(a, b), y2 + 58, x0 + Math.max(a, b), y2 + 58);
        TK.label(p, C, `$\\cos 2\\theta = ${fr(s.shot, 8)} - ${fr(8 - s.shot, 8)} = ${fr(d, 4)}$${G.solved && TH[s.shot] != null ? `  →  θ = ${TH[s.shot]}°` : ''}`, G.W / 2, y2 + 82, G.solved ? C.ok : C.ink, 16, G.W - 24);
      }
      drawStepper(p, C, G.st, `$${fr(s.k, 8)}$`, 'corte (lo que mide cos²θ)');
      drawBtn(p, C, G.go, 'Restar', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, d = stepHit(G.st, x, y);
      if (d) { s.k = Math.max(0, Math.min(8, s.k + d)); G.api.sfx?.tap?.(); return true; }
      if (!hitBox(G.go, x, y)) return false;
      const k = s.k;
      s.shot = k; G.submit('Con ese corte la resta da otro número: mírala');
      return true;
    },
    peek: G => ({ solve: [...TK.steps(G.st, G.s.k, G.item.t + 4), G.go], wrong: G.go }),
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
