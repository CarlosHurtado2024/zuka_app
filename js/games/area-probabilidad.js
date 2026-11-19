// El área de la probabilidad (Preuniversitario, pu-pb-2; spec 2026-11-18-preuda-razonamiento-completo): un cuadrado de lado 1 es
// todo lo que puede pasar. El ancho pintado es P(A) y el alto P(B); si A y B son independientes, que pasen los dos es el
// rectángulo de la esquina: P(A) · P(B). Uno de los dos lados viene dado; se arrastra el otro hasta que el área sea la pedida.
// params = { rounds: [{ a: [num, den] | null, b: [num, den] | null, both: [num, den], grid }] }   state = { rounds: [{ v }] }   (el lado libre, en partes de grid)
GAMES['area-probabilidad'] = (() => {
  const free = r => (r.a ? 'b' : 'a');
  const known = r => r.a || r.b;
  const need = r => { const k = known(r); for (let v = 0; v <= r.grid; v++) if (k[0] * v * r.both[1] === r.both[0] * k[1] * r.grid) return v; return null; };
  const ok = (s, r) => s.v === need(r);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const fr = (n, d) => { const g = gcd(n, d) || 1; return n ? `\\tfrac{${n / g}}{${d / g}}` : '0'; };
  const game = roundsGame({
    aspect: 1.25,
    init: r => ({ v: need(r) === r.grid ? 1 : r.grid }),
    ok,
    solution: r => `$P(${free(r).toUpperCase()}) = ${fr(need(r), r.grid)}$`,
    prompt: r => `$P(${free(r) === 'a' ? 'B' : 'A'}) = ${fr(known(r)[0], known(r)[1])}$ y $P(A \\text{ y } B) = ${fr(r.both[0], r.both[1])}$. ¿$P(${free(r).toUpperCase()})$?`,
    foot: () => 'Arrastra el borde del lado que falta',
    layout(G) { G.S = Math.min(G.W - 80, G.H - 230); G.o = { x: (G.W - G.S) / 2, y: 104 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { v: need(r) } : G.s, good = ok(s, r), S = G.S, o = G.o, k = known(r), kv = k[0] / k[1], fv = s.v / r.grid;
      const wA = free(r) === 'a' ? fv : kv, hB = free(r) === 'b' ? fv : kv;
      p.stroke(C.ink); p.strokeWeight(1.5); p.fill(RK.al(p, C.card, 200)); p.rect(o.x, o.y, S, S);
      p.noStroke(); p.fill(RK.al(p, C.sky, 70)); p.rect(o.x, o.y, wA * S, S);
      p.fill(RK.al(p, C.coral, 70)); p.rect(o.x, o.y + S - hB * S, S, hB * S);
      p.fill(RK.al(p, good ? C.ok : C.brand, 170)); p.rect(o.x, o.y + S - hB * S, wA * S, hB * S);
      p.stroke(RK.al(p, C.line, 120)); p.strokeWeight(1); for (let i = 1; i < r.grid; i++) { p.line(o.x + i * S / r.grid, o.y, o.x + i * S / r.grid, o.y + S); p.line(o.x, o.y + i * S / r.grid, o.x + S, o.y + i * S / r.grid); }
      G.h = free(r) === 'a' ? { x: o.x + wA * S, y: o.y + S + 14 } : { x: o.x - 14, y: o.y + S - hB * S };
      RK.knob(p, C, G.h.x, G.h.y, C.brand);
      TK.label(p, C, 'A', o.x + wA * S / 2, o.y - 10, C.sky, 11, 30); TK.label(p, C, 'B', o.x + S + 12, o.y + S - hB * S / 2, C.coral, 11, 20);
      const both = [free(r) === 'a' ? s.v * k[0] : k[0] * s.v, r.grid * k[1]];
      RK.strip(p, C, G.fb, `$${free(r) === 'a' ? fr(s.v, r.grid) : fr(k[0], k[1])} \\cdot ${free(r) === 'b' ? fr(s.v, r.grid) : fr(k[0], k[1])} = ${fr(both[0], both[1])}$`, { kicker: good ? 'el área pedida' : 'área de los dos', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.hypot(x - G.h.x, y - G.h.y) > 26) return false; G.grab = true; return true; },
    drag(G, x, y) {
      if (!G.grab) return false; const r = G.r, o = G.o, S = G.S;
      const t = free(r) === 'a' ? (x - o.x) / S : (o.y + S - y) / S, v = Math.max(0, Math.min(r.grid, Math.round(t * r.grid)));
      if (v !== G.s.v) { G.s.v = v; G.touch(); } return true;
    },
    release(G) { G.grab = false; },
    demo: G => (G.h ? { from: G.h, to: free(G.r) === 'a' ? { x: G.h.x - 50, y: G.h.y } : { x: G.h.x, y: G.h.y + 50 }, text: 'Arrastra el borde', ty: G.o.y + G.S + 36 } : null),
    peek: G => ({ h: G.h }),
  });
  return Object.assign(game, { answer: r => ({ v: need(r) }) });
})();
