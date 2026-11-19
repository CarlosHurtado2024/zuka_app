// Multiplicar lo que queda (Preuniversitario, pu-ar-1; spec 2026-11-18-preuda-razonamiento-completo): un rectángulo es todo el
// dinero. La primera compra se parte en columnas y la segunda en filas. Se arrastran las dos agarraderas para dejar pintado
// solo lo que QUEDA después de cada compra: el pedazo pintado es el producto de las dos fracciones que quedan.
// params = { rounds: [{ a: [num, den] (primera compra), b: [num, den] (segunda, de lo que queda) }] }   state = { rounds: [{ c, f }] }
GAMES['area-queda'] = (() => {
  const need = r => ({ c: r.a[1] - r.a[0], f: r.b[1] - r.b[0] });
  const ok = (s, r) => s.c === need(r).c && s.f === need(r).f;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ c: r.a[1], f: r.b[1] }),
    ok,
    solution: r => { const n = need(r), N = n.c * n.f, D = r.a[1] * r.b[1], g = gcd(N, D); return `queda $\\tfrac{${n.c}}{${r.a[1]}} \\cdot \\tfrac{${n.f}}{${r.b[1]}} = \\tfrac{${N / g}}{${D / g}}$`; },
    prompt: r => `Gasta $\\tfrac{${r.a[0]}}{${r.a[1]}}$ y luego $\\tfrac{${r.b[0]}}{${r.b[1]}}$ de lo que queda. ¿Qué parte queda?`,
    foot: () => 'Deja pintado solo lo que queda: arrastra las dos agarraderas',
    layout(G) { G.R = { x: 40, y: 110, w: G.W - 80, h: G.H - 240 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? need(r) : G.s, good = ok(s, r), R = G.R, cw = R.w / r.a[1], rh = R.h / r.b[1];
      p.noStroke(); p.fill(RK.al(p, C.line, 70)); p.rect(R.x, R.y, R.w, R.h, 6);
      p.fill(RK.al(p, good ? C.ok : C.sky, 200)); p.rect(R.x, R.y + R.h - s.f * rh, s.c * cw, s.f * rh, 4);
      p.stroke(C.ink); p.strokeWeight(1); p.noFill(); p.rect(R.x, R.y, R.w, R.h, 6);
      for (let i = 1; i < r.a[1]; i++) p.line(R.x + i * cw, R.y, R.x + i * cw, R.y + R.h);
      p.stroke(RK.al(p, C.ink, 120)); for (let j = 1; j < r.b[1]; j++) p.line(R.x, R.y + j * rh, R.x + s.c * cw, R.y + j * rh);
      G.hC = { x: R.x + s.c * cw, y: R.y + R.h + 16 }; G.hF = { x: R.x - 16, y: R.y + R.h - s.f * rh };
      RK.knob(p, C, G.hC.x, G.hC.y, C.coral); RK.knob(p, C, G.hF.x, G.hF.y, C.mint);
      TK.label(p, C, `$\\tfrac{${s.c}}{${r.a[1]}}$`, G.hC.x, G.hC.y + 18, C.coral, 12, 40);
      TK.label(p, C, `$\\tfrac{${s.f}}{${r.b[1]}}$`, G.hF.x - 4, G.hF.y - 16, C.mint, 12, 40);
      RK.strip(p, C, G.fb, `$\\tfrac{${s.c}}{${r.a[1]}} \\cdot \\tfrac{${s.f}}{${r.b[1]}} = \\tfrac{${s.c * s.f}}{${r.a[1] * r.b[1]}}$`, { kicker: good ? 'eso es lo que queda' : 'lo pintado', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.hypot(x - G.hC.x, y - G.hC.y) < 24) G.grab = 'c'; else if (Math.hypot(x - G.hF.x, y - G.hF.y) < 24) G.grab = 'f'; else return false; return true; },
    drag(G, x, y) {
      if (!G.grab) return false; const r = G.r, R = G.R;
      if (G.grab === 'c') { const c = Math.max(0, Math.min(r.a[1], Math.round((x - R.x) / (R.w / r.a[1])))); if (c !== G.s.c) { G.s.c = c; G.touch(); } }
      else { const f = Math.max(0, Math.min(r.b[1], Math.round((R.y + R.h - y) / (R.h / r.b[1])))); if (f !== G.s.f) { G.s.f = f; G.touch(); } }
      return true;
    },
    release(G) { G.grab = null; },
    demo: G => ({ from: G.hC, to: { x: G.hC.x - G.R.w / G.r.a[1], y: G.hC.y }, text: 'Arrastra la agarradera', ty: G.R.y - 14 }),
    peek: G => ({ hC: G.hC, hF: G.hF }),
  });
  return Object.assign(game, { answer: need });
})();
