// Las luces del código binario (Preuniversitario, pu-cd-1; spec 2026-11-18-preuda-razonamiento-completo): una fila de bombillos
// que valen 16, 8, 4, 2 y 1 (cada uno el doble del de su derecha). Se tocan los bombillos para prenderlos o apagarlos hasta
// que lo que suman los prendidos sea el número pedido; abajo se lee el código de unos y ceros.
// params = { rounds: [{ n, bits }] }   state = { rounds: [{ on: [0 | 1 por bombillo] }] }
GAMES['binario-luces'] = (() => {
  const val = (on) => on.reduce((a, b) => a * 2 + b, 0);
  const ok = (s, r) => val(s.on) === r.n;
  const bitsOf = r => Array.from({ length: r.bits }, (_, i) => (r.n >> (r.bits - 1 - i)) & 1);
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ on: Array(r.bits).fill(0) }),
    answered: s => s.on.some(Boolean),
    ok,
    solution: r => `${r.n} = ${bitsOf(r).join('')}`,
    prompt: r => `Prende los bombillos que suman ${r.n}`,
    foot: () => 'Toca un bombillo para prenderlo o apagarlo',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { on: bitsOf(r) } : G.s, good = ok(s, r), n = r.bits, w = (G.W - 30) / n, y = 170, d = Math.min(w * 0.7, 52);
      G.bulbs = s.on.map((b, i) => {
        const x = 15 + (i + 0.5) * w, v = 2 ** (n - 1 - i);
        if (b) { p.noStroke(); p.fill(RK.al(p, C.sun, 70)); p.circle(x, y, d * 1.5); }
        p.stroke(C.ink); p.strokeWeight(1.4); p.fill(b ? C.sun : RK.al(p, C.card, 200)); p.circle(x, y, d);
        p.noStroke(); p.fill(C.mute); p.rect(x - d * 0.18, y + d / 2 - 2, d * 0.36, 10, 2);
        TK.label(p, C, String(v), x, y - d / 2 - 14, C.mute, 11, w);
        TK.label(p, C, String(b), x, y + d / 2 + 26, b ? C.ink : C.mute, 16, w);
        return { x, y, d };
      });
      const parts = s.on.map((b, i) => (b ? 2 ** (n - 1 - i) : 0)).filter(Boolean);
      RK.strip(p, C, G.fb, `$${parts.length ? parts.join(' + ') : '0'} = ${val(s.on)}$`, { kicker: `código ${s.on.join('')}`, col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const i = (G.bulbs || []).findIndex(b => Math.hypot(x - b.x, y - b.y) < b.d / 2 + 8); if (i < 0) return false; G.s.on[i] = 1 - G.s.on[i]; G.touch(); return true; },
    demo: G => (G.bulbs ? { from: G.bulbs[0], to: G.bulbs[0], text: 'Toca un bombillo', ty: G.bulbs[0].y + 70 } : null),
    peek: G => ({ bulbs: G.bulbs }),
  });
  return Object.assign(game, { answer: r => ({ on: bitsOf(r) }) });
})();
