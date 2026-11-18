// Polígono en la cuadrícula (Preuniversitario, pu-ge-5; spec 2026-11-18-preuda-razonamiento-completo): el área de una figura
// en cuadrícula se halla partiéndola en rectángulos y triángulos, o encerrándola en un rectángulo y restando las esquinas.
// Tres vértices están fijos; se arrastra el cuarto por los puntos de la cuadrícula y el área se cuenta en vivo.
// params = { rounds: [{ pts: [[x, y], [x, y], [x, y]], target }] }   (el cuarto vértice va después del tercero)
// state = { rounds: [{ x, y }] }   (enteros de 0 a 8)
GAMES['poligono-cuadricula'] = (() => {
  const area = (r, s) => { const P = [...r.pts, [s.x, s.y]]; let a = 0; P.forEach((q, i) => { const n = P[(i + 1) % 4]; a += q[0] * n[1] - n[0] * q[1]; }); return Math.abs(a) / 2; };
  const simple = (r, s) => { const P = [...r.pts, [s.x, s.y]]; const cr = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); const sg = P.map((q, i) => Math.sign(cr(q, P[(i + 1) % 4], P[(i + 2) % 4]))); return sg.every(v => v === sg[0] && v !== 0); };
  const ok = (s, r) => simple(r, s) && area(r, s) === r.target;
  const answer = r => { for (let x = 0; x <= 8; x++) for (let y = 0; y <= 8; y++) if (ok({ x, y }, r)) return { x, y }; return null; };
  const game = roundsGame({
    aspect: 1.25,
    init: r => [[r.pts[0][0], r.pts[2][1]], [r.pts[0][0], 8], [0, 8], [8, 8]].map(([x, y]) => ({ x, y })).find(s => !ok(s, r)),
    ok,
    solution: r => { const a = answer(r); return `(${a.x}, ${a.y})`; },
    prompt: r => `Pon el cuarto vértice para que el cuadrilátero (sin cruzarse) tenga área ${r.target}`,
    foot: () => 'Arrastra el vértice suelto por la cuadrícula',
    layout(G) { const s = Math.min(G.W - 40, G.H - 200); G.u = s / 8; G.o = { x: (G.W - s) / 2, y: 100 + s }; G.fb = { x: 12, y: G.H - 70, w: G.W - 24, h: 46 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, u = G.u, o = G.o, X = x => o.x + x * u, Y = y => o.y - y * u, good = ok(s, r), P = [...r.pts, [s.x, s.y]];
      p.stroke(RK.al(p, C.line, 110)); p.strokeWeight(1); for (let i = 0; i <= 8; i++) { p.line(X(i), Y(0), X(i), Y(8)); p.line(X(0), Y(i), X(8), Y(i)); }
      p.stroke(C.ink); p.strokeWeight(2); p.fill(RK.al(p, good ? C.ok : simple(r, s) ? C.sky : C.coral, 120)); p.beginShape(); P.forEach(q => p.vertex(X(q[0]), Y(q[1]))); p.endShape(p.CLOSE);
      r.pts.forEach(q => drawDot(p, C, X(q[0]), Y(q[1]), 9, C.ink));
      RK.knob(p, C, X(s.x), Y(s.y), C.brand);
      RK.strip(p, C, G.fb, simple(r, s) ? `$\\text{área} = ${RK.num(area(r, s))}$` : '$\\text{los lados se cruzan}$', { col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const X = G.o.x + G.s.x * G.u, Y = G.o.y - G.s.y * G.u; if (Math.hypot(x - X, y - Y) > 40) return false; G.grab = true; return true; },
    drag(G, x, y) { if (!G.grab) return false; const nx = Math.max(0, Math.min(8, Math.round((x - G.o.x) / G.u))), ny = Math.max(0, Math.min(8, Math.round((G.o.y - y) / G.u))); if (nx !== G.s.x || ny !== G.s.y || !G.touched[G.cur]) { G.s.x = nx; G.s.y = ny; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.o.x + G.s.x * G.u, y: G.o.y - G.s.y * G.u }, to: { x: G.o.x + G.s.x * G.u, y: G.o.y - (G.s.y + 2) * G.u }, text: 'Arrastra el vértice', ty: G.o.y + 18 }),
    peek: G => ({ o: G.o, u: G.u }),
  });
  return Object.assign(game, { answer, area });
})();
