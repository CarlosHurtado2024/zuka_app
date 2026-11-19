// El tramo que más sube (Preuniversitario, pu-gr-1; spec 2026-11-18-preuda-razonamiento-completo): una gráfica de línea en el
// tiempo. Se arrastra la franja de lupa sobre un tramo (de un punto al siguiente) y el juego dice cuánto cambió ahí, en
// unidades y en porcentaje. Hay que dejarla en el tramo que pide la pregunta: el de mayor subida, mayor bajada o mayor
// aumento porcentual (que no siempre es el mismo que el de mayor subida).
// params = { rounds: [{ pts: [[rótulo, valor]], hi, step, q: 'up' | 'down' | 'pct' }] }   state = { rounds: [{ k }] }   (tramo k: de k a k+1)
GAMES['mayor-subida'] = (() => {
  const d = (r, k) => r.pts[k + 1][1] - r.pts[k][1];
  const pct = (r, k) => d(r, k) / r.pts[k][1] * 100;
  const score = (r, k) => (r.q === 'down' ? -d(r, k) : r.q === 'pct' ? pct(r, k) : d(r, k));
  const best = r => { let b = 0; for (let k = 1; k < r.pts.length - 1; k++) if (score(r, k) > score(r, b)) b = k; return b; };
  const ok = (s, r) => s.k === best(r);
  const fmt = v => (Math.round(v * 10) / 10).toString();
  const ask = { up: '¿En qué tramo subió más?', down: '¿En qué tramo bajó más?', pct: '¿En qué tramo creció más en porcentaje?' };
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ k: best(r) === 0 ? 1 : 0 }),
    ok,
    solution: r => { const k = best(r); return `de ${r.pts[k][0]} a ${r.pts[k + 1][0]}`; },
    prompt: r => ask[r.q],
    foot: () => 'Arrastra la lupa de un tramo a otro',
    layout(G) { G.b = { x: 44, y: 96, w: G.W - 64, h: G.H - 230 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { k: best(r) } : G.s, good = ok(s, r), n = r.pts.length, b = G.b;
      const Y = GRAF.axes(p, C, b, 0, r.hi, r.step), X = i => b.x + (i + 0.5) * b.w / n; G.Xp = X;
      p.noStroke(); p.fill(RK.al(p, good ? C.ok : C.brand, 45)); p.quad(X(s.k), b.y, X(s.k + 1), b.y, X(s.k + 1), b.y + b.h, X(s.k), b.y + b.h);
      p.noFill(); p.stroke(C.sky); p.strokeWeight(2.4); p.beginShape(); r.pts.forEach((pt, i) => p.vertex(X(i), Y(pt[1]))); p.endShape();
      r.pts.forEach((pt, i) => { p.noStroke(); p.fill(i === s.k || i === s.k + 1 ? (good ? C.ok : C.brand) : C.sky); p.circle(X(i), Y(pt[1]), 9); TK.label(p, C, String(pt[1]), X(i), Y(pt[1]) - 12, C.ink, 10, 40); TK.label(p, C, pt[0], X(i), b.y + b.h + 13, C.mute, 9, b.w / n); });
      const dv = d(r, s.k);
      RK.strip(p, C, G.fb, `$${dv >= 0 ? '+' : ''}${dv}\\ \\ (${dv >= 0 ? '+' : ''}${fmt(pct(r, s.k))}\\%)$`, { kicker: `de ${r.pts[s.k][0]} a ${r.pts[s.k + 1][0]}`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (y < G.b.y - 10 || y > G.b.y + G.b.h + 20) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.Xp(G.s.k + 0.5), y: G.b.y + G.b.h / 2 }, to: { x: G.Xp(G.s.k + 2.5), y: G.b.y + G.b.h / 2 }, text: 'Arrastra la lupa', ty: G.b.y + 12 }),
    peek: G => ({ b: G.b }),
  });
  game.move = (G, x) => { const n = G.r.pts.length, k = Math.max(0, Math.min(n - 2, Math.floor((x - G.b.x) / (G.b.w / n) - 0.5))); if (k !== G.s.k || !G.touched[G.cur]) { G.s.k = k; G.touch(); } };
  return Object.assign(game, { answer: r => ({ k: best(r) }) });
})();
