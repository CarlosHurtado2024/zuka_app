// Mueve el vértice (Preuniversitario UdeA, pu-ge-1 y pu-ge-2; spec 2026-11-18-preuda-geometria): un triángulo con la
// base quieta y el vértice de arriba suelto. Al arrastrarlo cambian los tres ángulos, pero su suma no: siempre 180°.
//   mode 'falta': se piden el ángulo A y el de arriba, C. El de arriba muestra «?»: hay que deducir B = 180 − A − C.
//   mode 'tipo' : hay que dejar el triángulo del tipo pedido (isósceles, rectángulo, equilátero u obtusángulo) con el
//                 ángulo A dado; los lados iguales se marcan con rayitas y el ángulo recto con su cuadrito.
// Los ángulos de la base saltan de 5° en 5°.
// params = { rounds: [{ mode: 'falta', A, C } | { mode: 'tipo', tipo, A }] }   state = { rounds: [{ A, B }] }
GAMES['apice-triangulo'] = (() => {
  const C3 = s => 180 - s.A - s.B;
  const TIPO = {
    isosceles: s => s.A === s.B || s.A === C3(s) || s.B === C3(s),
    rectangulo: s => s.A === 90 || s.B === 90 || C3(s) === 90,
    equilatero: s => s.A === 60 && s.B === 60,
    obtusangulo: s => Math.max(s.A, s.B, C3(s)) > 90,
  };
  const NOMBRE = { isosceles: 'isósceles', rectangulo: 'rectángulo', equilatero: 'equilátero', obtusangulo: 'obtusángulo' };
  const okOf = (s, r) => (r.mode === 'falta' ? s.A === r.A && C3(s) === r.C : s.A === r.A && TIPO[r.tipo](s) && (!r.y || TIPO[r.y](s)));
  // Una respuesta que sirve (para la solución y las pruebas).
  function answer(r) {
    if (r.mode === 'falta') return { A: r.A, B: 180 - r.A - r.C };
    for (let B = 10; B <= 160 - r.A; B += 5) if (okOf({ A: r.A, B }, r)) return { A: r.A, B };
    return null;
  }
  const game = roundsGame({
    aspect: 1.28,
    init: () => ({ A: 50, B: 25 }),
    ok: okOf,
    solution: r => { const a = answer(r); return `${a.A}°, ${a.B}° y ${180 - a.A - a.B}°`; },
    prompt: r => (r.mode === 'falta' ? `Arma un triángulo con A = ${r.A}° y C = ${r.C}°` : `Arma un triángulo ${NOMBRE[r.tipo]}${r.y ? ` y ${NOMBRE[r.y]}` : ''} con A = ${r.A}°`),
    foot: (r, s) => (r.mode === 'falta' ? 'Los tres ángulos siempre suman 180°' : `${s.A}° + ${s.B}° + ${C3(s)}° = 180°`),
    layout(G) { G.ax = 36; G.bx = G.W - 36; G.by = G.H - 78; },
    enter(G) { G.dragging = false; },
    draw(G) {
      const { p, C, r, s, ax, bx, by } = G, c = C3(s), base = bx - ax;
      // El vértice de arriba sale de los dos ángulos de la base.
      const ta = Math.tan(GEO.rad(s.A)), tb = Math.tan(GEO.rad(s.B));
      let x = s.A === 90 ? 0 : s.B === 90 ? base : base * tb / (ta + tb), h = s.A === 90 ? base * tb : x * ta;
      // Si el triángulo es muy alto, se dibuja a escala para que quepa.
      const k = Math.min(1, (by - 118) / h), sx = ax + (base * (1 - k)) / 2, A = [sx, by], B = [sx + base * k, by], V = [sx + x * k, by - h * k];
      G.A = A; G.B = B; G.V = V;
      const col = G.locked ? (okOf(s, r) ? C.ok : C.bad) : C.ink, c3 = p.color(C.sun); c3.setAlpha(40);
      p.fill(c3); p.stroke(col); p.strokeWeight(3); p.triangle(A[0], A[1], B[0], B[1], V[0], V[1]);
      const dirAV = GEO.angOf(A[0], A[1], V[0], V[1]), dirBV = GEO.angOf(B[0], B[1], V[0], V[1]), dirVA = (dirAV + 180) % 360, dirVB = (dirBV + 180) % 360;
      GEO.wedge(p, C, A[0], A[1], 26, 0, dirAV, C.sky, `${s.A}°`, 42);
      GEO.wedge(p, C, B[0], B[1], 26, dirBV, 180, C.coral, `${s.B}°`, 42);
      GEO.wedge(p, C, V[0], V[1], 22, dirVA, dirVB, C.mint, r.mode === 'falta' && !G.locked ? '?' : `${c}°`, 38);
      // El cuadrito del ángulo recto.
      p.noFill(); p.stroke(C.ink); p.strokeWeight(1.5);
      if (s.A === 90) p.rect(A[0], A[1] - 10, 10, 10); if (s.B === 90) p.rect(B[0] - 10, B[1] - 10, 10, 10);
      if (c === 90) { p.push(); p.translate(V[0], V[1]); p.rotate(-GEO.rad(dirVA)); p.rect(0, -10, 10, 10); p.pop(); }
      TK.label(p, C, 'A', A[0] - 12, A[1] + 14, C.mute, 13, 20); TK.label(p, C, 'B', B[0] + 12, B[1] + 14, C.mute, 13, 20); TK.label(p, C, 'C', V[0], V[1] - 26, C.mute, 13, 20);
      // Rayitas en los lados iguales (frente a ángulos iguales).
      const tick = (P, Q) => { const mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2, d = GEO.angOf(P[0], P[1], Q[0], Q[1]) + 90, [a, b] = GEO.at(mx, my, 7, d), [e, f] = GEO.at(mx, my, 7, d + 180); p.stroke(C.ink); p.strokeWeight(2.5); p.line(a, b, e, f); };
      if (r.mode === 'tipo') { if (s.A === s.B) { tick(A, V); tick(B, V); } if (s.A === c) { tick(B, V); tick(A, B); } if (s.B === c) { tick(A, V); tick(A, B); } }
      GEO.knob(p, C, V[0], V[1], C.mint);
    },
    press(G, x, y) { if (y < 96 || y > G.by + 6) return false; G.dragging = true; game.move(G, x, y); return true; },
    drag(G, x, y) { if (!G.dragging) return false; game.move(G, x, y); return true; },
    release(G) { G.dragging = false; },
    demo: G => ({ from: { x: G.V[0], y: G.V[1] }, to: { x: G.W / 2 + (G.V[0] > G.W / 2 ? -50 : 50), y: Math.max(140, G.V[1] - 30) }, text: 'Arrastra el vértice de arriba', ty: G.H - 44 }),
    peek: G => ({ A: G.A, B: G.B, V: G.V }),
  });
  // El dedo fija los dos ángulos de la base (de 5° en 5°); el de arriba es lo que falta para 180°.
  game.move = (G, x, y) => {
    const a = GEO.angOf(G.ax, G.by, x, y), b = 180 - GEO.angOf(G.bx, G.by, x, y);
    let A = Math.max(10, Math.min(150, GEO.snap(a > 180 ? 10 : a, 5))), B = Math.max(10, Math.min(150, GEO.snap(b < 0 || b > 180 ? 10 : b, 5)));
    if (A + B > 170) B = 170 - A;
    if (A !== G.s.A || B !== G.s.B || !G.touched[G.cur]) { G.s.A = A; G.s.B = B; G.touch(); }
  };
  return Object.assign(game, { okOf, answer });
})();
