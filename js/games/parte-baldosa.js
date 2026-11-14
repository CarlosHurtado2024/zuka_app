// Parte la baldosa (Álgebra, simplificar radicales; lección alg-22b): una baldosa cuadrada de área n tiene lado √n.
// Se parte en una cuadrícula de k × k baldosas iguales: cada una tiene área n/k² y el lado grande es k veces el lado
// de una pequeña, √n = k·√(n/k²). Solo sirve si el área de la pequeña es entera. Meta: la cuadrícula más fina que
// sirve; ahí lo de adentro de la raíz ya no tiene cuadrados escondidos.
// params = { rounds: [{ n }], max? }   state = { rounds: [{ k }] }      Spec 2026-11-15-torres-de-potencias.

GAMES['parte-baldosa'] = (() => {
  // La cuadrícula más fina con baldosas de área entera: el mayor k con k² divisor de n.
  function bestK(n) { let best = 1; for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) best = k; return best; }
  const rootTxt = (k, m) => (m === 1 ? `${k}` : k === 1 ? `√${m}` : `${k}√${m}`);

  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ k: 1 }),
    ok: (s, r) => s.k === bestK(r.n),
    solution: r => `√${r.n} = ${rootTxt(bestK(r.n), r.n / bestK(r.n) ** 2)}`,
    prompt: r => `Baldosa de área ${r.n}: pártela en la cuadrícula más fina con baldosas de área entera`,
    foot: (r, s) => (r.n % (s.k * s.k) ? 'El área de cada baldosa pequeña debe ser un número entero' : 'El lado grande mide k veces el lado de una pequeña'),
    layout(G) { G.box = { x: G.W / 2 - 80, y: G.H - 64, w: 160, h: 32 }; G.sq = Math.min(G.W - 80, G.H - 250); },
    draw(G) {
      const { p, C, W, H, s, r } = G, S = G.sq, x0 = W / 2 - S / 2, y0 = 100, m = r.n / (s.k * s.k), whole = Number.isInteger(m), good = G.locked && s.k === bestK(r.n);
      const f = p.color(whole ? (good ? C.ok : C.mint) : C.coral); f.setAlpha(whole ? 110 : 60);
      p.stroke(whole ? (good ? C.ok : C.mint) : C.coral); p.strokeWeight(2.5); p.fill(f); p.rect(x0, y0, S, S, 4);
      p.strokeWeight(1.2);
      for (let i = 1; i < s.k; i++) { p.line(x0 + (i * S) / s.k, y0, x0 + (i * S) / s.k, y0 + S); p.line(x0, y0 + (i * S) / s.k, x0 + S, y0 + (i * S) / s.k); }
      // Una baldosa pequeña resaltada, con su área.
      const c = S / s.k;
      p.noFill(); p.stroke(C.sun); p.strokeWeight(3); p.rect(x0, y0 + S - c, c, c, 3);
      p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
      if (c > 30) { p.textSize(Math.min(15, c / 3)); p.text(whole ? m : numTxt(m), x0 + c / 2, y0 + S - c / 2); }
      p.textSize(12); p.fill(C.mute); p.text(`lado √${r.n}`, x0 + S / 2, y0 + S + 12);
      p.fill(whole ? (good ? C.ok : C.ink) : C.bad); p.textSize(16);
      p.text(whole ? `√${r.n} = ${rootTxt(s.k, m)}` : `área de cada una: ${numTxt(m)} (no es entera)`, W / 2, y0 + S + 36);
      drawStepper(p, C, G.box, `${s.k} × ${s.k}`, 'baldosas por lado');
    },
    press(G, x, y) { const d = stepHit(G.box, x, y); if (!d) return false; G.s.k = Math.max(1, Math.min(G.params.max ?? 10, G.s.k + d)); G.touch(); return true; },
    peek: G => ({ box: G.box, want: bestK(G.r.n) }),
  });
  return { ...game, bestK, rootTxt };
})();
