// La tabla de los divisores (Preuniversitario, pu-nu-1; spec 2026-11-18-preuda-razonamiento-completo): con n = 2^a · 3^b, cada
// divisor escoge cuántos 2 lleva (de 0 a a) y cuántos 3 (de 0 a b). Se arrastran las dos agarraderas para dar las filas y las
// columnas de la tabla; el juego llena cada casilla con su divisor y tacha los que no dividen a n. La tabla buena tiene todos
// los divisores y ninguno de más: (a + 1)(b + 1).
// params = { rounds: [{ p: [primo 1, primo 2], e: [a, b] }] }   state = { rounds: [{ rows, cols }] }   (de 1 a 6)
GAMES['tabla-divisores'] = (() => {
  const ok = (s, r) => s.rows === r.e[0] + 1 && s.cols === r.e[1] + 1;
  const n = r => r.p[0] ** r.e[0] * r.p[1] ** r.e[1];
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ rows: 1, cols: 1 }),
    ok,
    solution: r => `${r.e[0] + 1} · ${r.e[1] + 1} = ${(r.e[0] + 1) * (r.e[1] + 1)} divisores`,
    prompt: r => `¿Cuántos divisores tiene $${n(r)} = ${r.p[0]}^{${r.e[0]}} \\cdot ${r.p[1]}^{${r.e[1]}}$?`,
    foot: () => 'Arrastra las agarraderas de filas y columnas',
    layout(G) { G.o = { x: 56, y: 116 }; G.cs = Math.min(42, (G.W - 80) / 6); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { rows: r.e[0] + 1, cols: r.e[1] + 1 } : G.s, good = ok(s, r), o = G.o, cs = G.cs, N = n(r);
      for (let j = 0; j < s.cols; j++) TK.label(p, C, `$${r.p[1]}^{${j}}$`, o.x + (j + 0.5) * cs, o.y - 12, C.coral, 10, cs);
      let cnt = 0;
      for (let i = 0; i < s.rows; i++) {
        TK.label(p, C, `$${r.p[0]}^{${i}}$`, o.x - 18, o.y + (i + 0.5) * cs, C.sky, 10, 30);
        for (let j = 0; j < s.cols; j++) {
          const v = r.p[0] ** i * r.p[1] ** j, divides = N % v === 0, x = o.x + j * cs, y = o.y + i * cs;
          if (divides) cnt++;
          p.stroke(C.line); p.strokeWeight(1); p.fill(divides ? RK.al(p, good ? C.ok : C.sky, 90) : RK.al(p, C.bad, 50)); p.rect(x + 1, y + 1, cs - 2, cs - 2, 4);
          TK.label(p, C, String(v), x + cs / 2, y + cs / 2, divides ? C.ink : C.bad, 10, cs - 4);
        }
      }
      G.hR = { x: o.x - 30, y: o.y + s.rows * cs + 8 }; G.hC = { x: o.x + s.cols * cs + 8, y: o.y - 30 };
      RK.knob(p, C, G.hR.x, G.hR.y, C.sky); RK.knob(p, C, G.hC.x, G.hC.y, C.coral);
      RK.strip(p, C, G.fb, `$${s.rows} \\cdot ${s.cols} = ${s.rows * s.cols}$`, { kicker: good ? 'todos los divisores, sin sobrantes' : `${cnt} dividen a ${N}`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.hypot(x - G.hR.x, y - G.hR.y) < 24) G.grab = 'rows'; else if (Math.hypot(x - G.hC.x, y - G.hC.y) < 24) G.grab = 'cols'; else return false; return true; },
    drag(G, x, y) {
      if (!G.grab) return false; const o = G.o, cs = G.cs;
      const v = G.grab === 'rows' ? Math.round((y - o.y - 8) / cs) : Math.round((x - o.x - 8) / cs), c = Math.max(1, Math.min(6, v));
      if (c !== G.s[G.grab]) { G.s[G.grab] = c; G.touch(); } return true;
    },
    release(G) { G.grab = null; },
    demo: G => ({ from: G.hR, to: { x: G.hR.x, y: G.hR.y + 2 * G.cs }, text: 'Arrastra la agarradera', ty: G.o.y + 3 * G.cs }),
    peek: G => ({ hR: G.hR, hC: G.hC }),
  });
  return Object.assign(game, { answer: r => ({ rows: r.e[0] + 1, cols: r.e[1] + 1 }) });
})();
