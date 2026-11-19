// Pinta la ruleta (Preuniversitario, pu-pb-1 y pu-pb-2; spec 2026-11-18-preuda-razonamiento-completo): una ruleta partida en
// sectores iguales. Se tocan sectores para pintarlos; el juego dice la probabilidad de caer en lo pintado (y en lo no pintado).
// Hay que pintar justo lo que pide la probabilidad.
// params = { rounds: [{ n, target: [num, den], not?: bool }] }   (not: la meta es la de NO caer en lo pintado)   state = { rounds: [{ m: [n marcas] }] }
GAMES['ruleta-sectores'] = (() => {
  const want = r => { const p = r.target[0] / r.target[1], k = Math.round((r.not ? 1 - p : p) * r.n); return k; };
  const ok = (s, r) => s.m.filter(Boolean).length === want(r);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const fr = (k, n) => { const g = gcd(k, n) || 1; return k ? `\\tfrac{${k / g}}{${n / g}}` : '0'; };
  const game = roundsGame({
    aspect: 1.15,
    init: r => ({ m: Array(r.n).fill(false) }),
    answered: s => s.m.some(Boolean),
    ok,
    solution: r => `pintar ${want(r)} de ${r.n} sectores`,
    prompt: r => `Pinta la ruleta para que ${r.not ? 'NO caer en lo pintado' : 'caer en lo pintado'} tenga $P = \\tfrac{${r.target[0]}}{${r.target[1]}}$`,
    foot: () => 'Toca un sector para pintarlo o despintarlo',
    layout(G) { G.c = { x: G.W / 2, y: 210 }; G.R = Math.min(G.W * 0.36, 110, G.H - 66 - 210 - 8); G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { m: Array.from({ length: r.n }, (_, i) => i < want(r)) } : G.s, good = ok(s, r), c = G.c, R = G.R, step = 2 * Math.PI / r.n;
      for (let i = 0; i < r.n; i++) { p.stroke(C.ink); p.strokeWeight(1.2); p.fill(s.m[i] ? (good ? C.ok : C.coral) : RK.al(p, C.card, 220)); p.arc(c.x, c.y, 2 * R, 2 * R, -Math.PI / 2 + i * step, -Math.PI / 2 + (i + 1) * step, p.PIE); }
      p.noStroke(); p.fill(C.ink); p.triangle(c.x - 8, c.y - R - 14, c.x + 8, c.y - R - 14, c.x, c.y - R + 4);
      const k = s.m.filter(Boolean).length;
      RK.strip(p, C, G.fb, `$P(\\text{pintado}) = ${fr(k, r.n)}\\quad P(\\text{no}) = ${fr(r.n - k, r.n)}$`, { kicker: good ? 'justo lo pedido' : '', col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      const c = G.c, d = Math.hypot(x - c.x, y - c.y); if (d > G.R) return false;
      let a = Math.atan2(y - c.y, x - c.x) + Math.PI / 2; if (a < 0) a += 2 * Math.PI;
      const i = Math.floor(a / (2 * Math.PI / G.r.n)) % G.r.n; G.s.m[i] = !G.s.m[i]; G.touch(); return true;
    },
    demo: G => ({ from: { x: G.c.x + G.R * 0.3, y: G.c.y - G.R * 0.5 }, to: { x: G.c.x + G.R * 0.3, y: G.c.y - G.R * 0.5 }, text: 'Toca un sector', ty: G.c.y + G.R + 22 }),
    peek: G => ({ c: G.c, R: G.R }),
  });
  return Object.assign(game, { answer: r => ({ m: Array.from({ length: r.n }, (_, i) => i < want(r)) }) });
})();
