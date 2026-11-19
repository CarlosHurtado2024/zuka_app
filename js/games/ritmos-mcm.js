// Los ritmos que coinciden (Preuniversitario, pu-nu-2; spec 2026-11-18-preuda-razonamiento-completo): dos cosas que se repiten
// (un bus cada a minutos, otro cada b) son dos filas de marcas en una línea de tiempo. Se arrastra el marcador por la línea;
// el juego dice si en ese momento hay marca en cada fila. La primera vez que coinciden después de 0 es el MCM.
// params = { rounds: [{ a, b, max, labels? }] }   state = { rounds: [{ t }] }
GAMES['ritmos-mcm'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a), lcm = (a, b) => a / gcd(a, b) * b;
  const ok = (s, r) => s.t === lcm(r.a, r.b);
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ t: r.a }),
    ok,
    solution: r => `a los ${lcm(r.a, r.b)}`,
    prompt: r => `Uno cada ${r.a} y otro cada ${r.b}. ¿Cuándo coinciden otra vez?`,
    foot: () => 'Arrastra el marcador por la línea de tiempo',
    layout(G) { G.x0 = 24; G.x1 = G.W - 24; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { t: lcm(r.a, r.b) } : G.s, good = ok(s, r), X = t => G.x0 + t / r.max * (G.x1 - G.x0), labs = r.labels || ['A', 'B'];
      [[r.a, 130, C.sky, labs[0]], [r.b, 190, C.coral, labs[1]]].forEach(([k, y, col, lab]) => {
        p.stroke(C.line); p.strokeWeight(1); p.line(G.x0, y, G.x1, y);
        for (let t = 0; t <= r.max; t += k) { p.noStroke(); p.fill(col); p.circle(X(t), y, 10); }
        TK.label(p, C, `${lab}: cada ${k}`, G.x0 + 50, y - 16, col, 10, 110);
      });
      for (let t = 0; t <= r.max; t += Math.max(1, Math.round(r.max / 10))) TK.label(p, C, String(t), X(t), 226, C.mute, 8, 24);
      const onA = s.t % r.a === 0, onB = s.t % r.b === 0, x = X(s.t);
      p.stroke(good ? C.ok : C.brand); p.strokeWeight(2); p.line(x, 112, x, 208); RK.knob(p, C, x, 244, C.brand);
      TK.label(p, C, `t = ${s.t}`, x, 262, C.brand, 11, 60);
      RK.strip(p, C, G.fb, `$\\text{${labs[0]}: ${onA ? 'sí' : 'no'} · ${labs[1]}: ${onB ? 'sí' : 'no'}}$`, { kicker: good ? 'la primera vez que coinciden' : onA && onB ? 'coinciden, pero ¿es la primera vez?' : '', col: G.locked || good ? C.ok : C.brand, size: 15 });
      G.X = X;
    },
    press(G, x, y) { if (y < 100 || y > 270) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.t), y: 244 }, to: { x: G.X(G.s.t) + 70, y: 244 }, text: 'Arrastra el marcador', ty: 286 }),
    peek: G => ({ x0: G.x0, x1: G.x1 }),
  });
  game.move = (G, x) => { const r = G.r, t = Math.max(1, Math.min(r.max, Math.round((x - G.x0) / (G.x1 - G.x0) * r.max))); if (t !== G.s.t || !G.touched[G.cur]) { G.s.t = t; G.touch(); } };
  return Object.assign(game, { answer: r => ({ t: lcm(r.a, r.b) }) });
})();
