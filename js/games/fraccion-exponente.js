// El exponente fraccionario (Álgebra, alg-22a; spec 2026-11-18-algebra-revision): a^(m/n) es sacar la raíz n-ésima y
// elevar a la m. Se arrastran dos reglas: el índice de la raíz (abajo de la fracción) y la potencia (arriba). El número
// pasa primero por la raíz y luego por la potencia, y se ve cada paso. Hay que llevar la base al valor pedido.
// params = { rounds: [{ a, target }] }   state = { rounds: [{ n, m }] }   (n de 1 a 4; m de 1 a 4)
GAMES['fraccion-exponente'] = (() => {
  const val = (a, n, m) => Math.round((a ** (1 / n)) ** m * 1e6) / 1e6;
  const ok = (s, r) => Math.abs(val(r.a, s.n, s.m) - r.target) < 1e-6;
  const answer = r => { for (let n = 1; n <= 4; n++) for (let m = 1; m <= 4; m++) if (ok({ n, m }, r)) return { n, m }; return null; };
  const game = roundsGame({
    aspect: 1.1,
    init: () => ({ n: 1, m: 1 }),
    ok,
    solution: r => { const a = answer(r); return `${r.a}^(${a.m}/${a.n}) = ${r.target}`; },
    prompt: r => `¿Qué exponente fraccionario lleva ${r.a} a ${r.target}?`,
    foot: () => 'Conviene sacar la raíz primero: el número se achica',
    layout(G) { G.t1 = G.H - 150; G.t2 = G.H - 104; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, root = Math.round(r.a ** (1 / s.n) * 1e6) / 1e6, v = val(r.a, s.n, s.m);
      const box = (x, txt, col) => RK.chip(p, C, { x: x - 40, y: 124, w: 80, h: 44 }, txt, { on: true, col, size: 17 });
      box(G.W * 0.17, `$${r.a}$`, C.sky); RK.arrow(p, G.W * 0.17 + 42, G.W * 0.5 - 44, 146, C.line, 2);
      TK.label(p, C, `$\\sqrt[${s.n}]{\\;}$`, G.W * 0.34, 128, C.ink, 14, 50);
      box(G.W * 0.5, `$${+root.toFixed(3)}$`, C.mint); RK.arrow(p, G.W * 0.5 + 42, G.W * 0.83 - 44, 146, C.line, 2);
      TK.label(p, C, `$(\\;)^{${s.m}}$`, G.W * 0.67, 128, C.ink, 14, 50);
      box(G.W * 0.83, `$${+v.toFixed(3)}$`, Math.abs(v - r.target) < 1e-6 ? C.ok : C.coral);
      RK.track(p, C, 70, G.W - 30, G.t1, 4, s.n - 1, i => String(i + 1)); TK.label(p, C, 'raíz', 34, G.t1, C.mute, 11, 40);
      RK.track(p, C, 70, G.W - 30, G.t2, 4, s.m - 1, i => String(i + 1)); TK.label(p, C, 'potencia', 34, G.t2, C.mute, 11, 56);
      RK.strip(p, C, G.fb, `$${r.a}^{${s.m}/${s.n}} = (\\sqrt[${s.n}]{${r.a}})^{${s.m}} = ${+v.toFixed(3)}$`, { col: G.locked || ok(G.s, r) ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const k = Math.abs(y - G.t1) < 20 ? 'n' : Math.abs(y - G.t2) < 20 ? 'm' : null; if (!k) return false; G.grab = k; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => ({ from: { x: 70, y: G.t1 }, to: { x: 70 + (G.W - 100) / 3 * 2, y: G.t1 }, text: 'Arrastra la raíz y la potencia', ty: G.t1 - 30 }),
    peek: G => ({ t1: G.t1, t2: G.t2 }),
  });
  game.move = (G, x) => { const v = RK.pick(x, 70, G.W - 30, 4) + 1; if (v !== G.s[G.grab] || !G.touched[G.cur]) { G.s[G.grab] = v; G.touch(); } };
  return Object.assign(game, { answer });
})();
