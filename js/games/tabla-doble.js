// Comparar grupos de distinto tamaño (Preuniversitario, pu-gr-3; spec 2026-11-18-preuda-razonamiento-completo): una tabla de
// dos grupos con cuántos dicen «sí» de cuántos. Más personas no es más proporción. Cada grupo tiene su barra de 100 %; se
// arrastra la parte pintada de cada una hasta su porcentaje (de 5 en 5) y así se comparan de verdad.
// params = { rounds: [{ rows: [[grupo, sí, total]], what }] }   state = { rounds: [{ p: [porcentaje por grupo] }] }
GAMES['tabla-doble'] = (() => {
  const need = r => r.rows.map(([, y, t]) => y / t * 100);
  const ok = (s, r) => need(r).every((v, i) => s.p[i] === v);
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ p: r.rows.map(() => 0) }),
    ok,
    solution: r => r.rows.map(([g, y, t], i) => `${g}: ${y} de ${t} = ${need(r)[i]} %`).join('; '),
    prompt: r => `¿Qué porcentaje ${r.what} en cada grupo?`,
    foot: () => 'Arrastra la parte pintada de cada barra',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; G.x0 = 24; G.x1 = G.W - 24; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { p: need(r) } : G.s, good = ok(s, r), X = v => G.x0 + v / 100 * (G.x1 - G.x0);
      G.rowsY = r.rows.map((_, i) => 140 + i * 92);
      r.rows.forEach(([g, y, t], i) => {
        const yy = G.rowsY[i];
        TK.label(p, C, `${g}: ${y} de ${t}`, G.W / 2, yy - 28, C.ink, 13, G.W - 30);
        p.stroke(C.line); p.strokeWeight(1); p.fill(RK.al(p, C.card, 200)); p.rect(G.x0, yy - 14, G.x1 - G.x0, 28, 6);
        p.noStroke(); p.fill(s.p[i] === need(r)[i] && good ? C.ok : i ? C.sky : C.coral); p.rect(G.x0, yy - 14, X(s.p[i]) - G.x0, 28, 6);
        for (let k = 1; k < 10; k++) { p.stroke(RK.al(p, C.line, 120)); p.line(X(k * 10), yy + 14, X(k * 10), yy + 20); }
        RK.knob(p, C, X(s.p[i]), yy, C.brand);
        TK.label(p, C, `${s.p[i]} %`, Math.min(Math.max(X(s.p[i]), 40), G.W - 40), yy + 30, C.brand, 11, 60);
      });
      const best = good ? r.rows[need(r).indexOf(Math.max(...need(r)))][0] : null;
      RK.strip(p, C, G.fb, good ? `$\\text{mayor proporción: ${best}}$` : `$${s.p.map(v => v + '\\%').join('\\quad ')}$`, { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const i = (G.rowsY || []).findIndex(yy => Math.abs(y - yy) < 24); if (i < 0) return false; G.grab = i; game.move(G, x); return true; },
    drag(G, x) { if (G.grab < 0) return false; game.move(G, x); return true; },
    release(G) { G.grab = -1; },
    demo: G => (G.rowsY ? { from: { x: G.x0 + 4, y: G.rowsY[0] }, to: { x: G.x0 + 120, y: G.rowsY[0] }, text: 'Arrastra la barra', ty: G.rowsY[0] + 50 } : null),
    peek: G => ({ rowsY: G.rowsY, x0: G.x0, x1: G.x1 }),
  });
  game.move = (G, x) => { const v = Math.max(0, Math.min(100, Math.round((x - G.x0) / (G.x1 - G.x0) * 20) * 5)); if (v !== G.s.p[G.grab] || !G.touched[G.cur]) { G.s.p[G.grab] = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ p: need(r) }) });
})();
