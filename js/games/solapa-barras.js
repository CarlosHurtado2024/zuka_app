// Las barras que se solapan (Preuniversitario, pu-cj-2; spec 2026-11-18-preuda-razonamiento-completo): en una encuesta de un
// total de personas, los de A son una barra y los de B otra. Se arrastra la barra de B: lo que se monta sobre A son los que
// están en los dos. El juego cuenta la unión (lo que cubren las dos) y los de ninguno (lo que queda sin cubrir), y los compara
// con el dato que da la encuesta.
// params = { rounds: [{ labels: [A, B], total, a, b, none }] }   state = { rounds: [{ s }] }   (inicio de la barra de B)
GAMES['solapa-barras'] = (() => {
  const both = (r, s) => Math.max(0, Math.min(r.a, s + r.b) - s);
  const none = (r, s) => r.total - (r.a + r.b - both(r, s));
  const need = r => { for (let s = 0; s <= r.total - r.b; s++) if (none(r, s) === r.none) return s; return null; };
  const ok = (s, r) => none(r, s.s) === r.none;
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ s: need(r) === r.total - r.b ? 0 : r.total - r.b }),
    ok,
    solution: r => `los dos: ${both(r, need(r))}`,
    prompt: r => `De ${r.total}: ${r.a} ${r.labels[0]}, ${r.b} ${r.labels[1]}, ${r.none} ninguno. ¿Cuántos los dos?`,
    foot: () => 'Arrastra la barra de abajo',
    layout(G) { G.x0 = 20; G.x1 = G.W - 20; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { s: need(r) } : G.s, good = ok(s, r), u = (G.x1 - G.x0) / r.total, X = v => G.x0 + v * u;
      p.stroke(C.line); p.strokeWeight(1); p.noFill(); p.rect(G.x0, 110, G.x1 - G.x0, 110, 8);
      TK.label(p, C, `total ${r.total}`, G.W / 2, 100, C.mute, 10, 120);
      const bo = both(r, s.s), un = r.a + r.b - bo;
      if (bo > 0) { p.noStroke(); p.fill(RK.al(p, C.brand, 70)); p.quad(X(s.s), 120, X(s.s + bo), 120, X(s.s + bo), 208, X(s.s), 208); }
      p.noStroke(); p.fill(RK.al(p, C.sky, 200)); p.rect(X(0), 126, r.a * u, 30, 5);
      p.fill(RK.al(p, C.coral, 200)); p.rect(X(s.s), 172, r.b * u, 30, 5);
      TK.label(p, C, `${r.labels[0]} ${r.a}`, X(r.a / 2), 141, inkOn(C.sky), 10, r.a * u);
      TK.label(p, C, `${r.labels[1]} ${r.b}`, X(s.s + r.b / 2), 187, inkOn(C.coral), 10, r.b * u);
      p.stroke(C.ink); p.strokeWeight(1.2); p.line(X(un), 112, X(un), 218);
      TK.label(p, C, `los dos: ${bo}`, X(s.s + bo / 2), 236, C.brand, 10, 90);
      TK.label(p, C, `ninguno: ${r.total - un}`, X((un + r.total) / 2), 254, good ? C.ok : C.ink, 10, Math.max(80, (r.total - un) * u));
      G.bx = X(s.s + r.b / 2); G.u = u;
      RK.strip(p, C, G.fb, `$${r.a} + ${r.b} - ${bo} = ${un}$`, { kicker: good ? `y ${r.total - un} en ninguno: cuadra` : `unión ${un}; ninguno ${r.total - un}`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (y < 166 || y > 208) return false; G.grab = { dx: x - G.bx }; return true; },
    drag(G, x) { if (!G.grab) return false; const r = G.r, s = Math.max(0, Math.min(r.total - r.b, Math.round((x - G.grab.dx - G.x0) / G.u - r.b / 2))); if (s !== G.s.s) { G.s.s = s; G.touch(); } return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: G.bx, y: 187 }, to: { x: G.bx - 60, y: 187 }, text: 'Arrastra la barra', ty: 272 }),
    peek: G => ({ bx: G.bx }),
  });
  return Object.assign(game, { answer: r => ({ s: need(r) }) });
})();
