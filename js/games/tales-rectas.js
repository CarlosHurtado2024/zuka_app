// El teorema de Tales (Preuniversitario, pu-ge-3; spec 2026-11-18-preuda-razonamiento-completo): rectas paralelas que cortan
// dos rectas que salen de un punto O dejan segmentos proporcionales: OA/AB = OA'/A'B'. Están OA, AB y OA'; se arrastra el
// punto B' sobre la segunda recta (de medio en medio) hasta que la recta BB' quede paralela a AA'.
// params = { rounds: [{ a, b, c }] }   (OA = a, AB = b, OA' = c)   state = { rounds: [{ d }] }   (A'B' de 0.5 a 12)
GAMES['tales-rectas'] = (() => {
  const need = r => r.b * r.c / r.a;
  const ok = (s, r) => Math.abs(s.d - need(r)) < 1e-9;
  const game = roundsGame({
    aspect: 1.1,
    init: r => ({ d: need(r) === 2 ? 3 : 2 }),
    ok,
    solution: r => `A'B' = ${RK.num(need(r))}`,
    prompt: r => `OA = ${r.a}, AB = ${r.b}, OA' = ${r.c}. ¿Cuánto mide A'B' si BB' es paralela a AA'?`,
    foot: () => "Arrastra B' por la recta de arriba",
    layout(G) { G.O = { x: 24, y: G.H - 110 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { d: need(r) } : G.s, O = G.O, maxL = Math.max(r.a + r.b, r.c + 12), u = (G.W - 60) / maxL, ang = -0.55;
      const P1 = t => ({ x: O.x + t * u, y: O.y }), P2 = t => ({ x: O.x + t * u * Math.cos(ang), y: O.y + t * u * Math.sin(ang) });
      p.stroke(C.ink); p.strokeWeight(1.6); p.line(O.x, O.y, G.W - 16, O.y); const e = P2(maxL); p.line(O.x, O.y, e.x, e.y);
      const A = P1(r.a), B = P1(r.a + r.b), A2 = P2(r.c), B2 = P2(r.c + s.d), good = ok(s, r);
      p.stroke(C.sky); p.strokeWeight(2.2); p.line(A.x, A.y, A2.x, A2.y);
      p.stroke(good ? C.ok : C.coral); p.line(B.x, B.y, B2.x, B2.y);
      [[A, 'A'], [B, 'B'], [A2, "A'"], [O, 'O']].forEach(([q, t]) => { drawDot(p, C, q.x, q.y, 9, C.ink); TK.label(p, C, t, q.x, q.y + 14, C.mute, 10, 24); });
      RK.knob(p, C, B2.x, B2.y, C.brand); TK.label(p, C, "B'", B2.x, B2.y - 18, C.ink, 11, 24); G.B2 = B2;
      TK.label(p, C, String(r.a), (O.x + A.x) / 2, O.y + 14, C.ink, 10, 30); TK.label(p, C, String(r.b), (A.x + B.x) / 2, O.y + 14, C.ink, 10, 30);
      RK.strip(p, C, G.fb, `$\\dfrac{${r.a}}{${r.b}} ${good ? '=' : '\\ne'} \\dfrac{${r.c}}{${RK.num(s.d)}}$`, { kicker: `A'B' = ${String(s.d)}`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.hypot(x - G.B2.x, y - G.B2.y) > 44) return false; G.grab = true; return true; },
    drag(G, x, y) {
      if (!G.grab) return false;
      const r = G.r, O = G.O, maxL = Math.max(r.a + r.b, r.c + 12), u = (G.W - 60) / maxL, ang = -0.55, t = ((x - O.x) * Math.cos(ang) + (y - O.y) * Math.sin(ang)) / u;
      const d = Math.max(0.5, Math.min(12, Math.round((t - r.c) * 2) / 2)); if (d !== G.s.d || !G.touched[G.cur]) { G.s.d = d; G.touch(); } return true;
    },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.B2.x, y: G.B2.y }, to: { x: G.B2.x + 30, y: G.B2.y - 18 }, text: "Arrastra B'", ty: G.O.y + 34 }),
    peek: G => ({ O: G.O, B2: G.B2 }),
  });
  return Object.assign(game, { answer: r => ({ d: need(r) }) });
})();
