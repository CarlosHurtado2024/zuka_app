// La tabla de dos dados (Preuniversitario, pu-pb-1 y pu-pb-2; spec 2026-11-18-preuda-razonamiento-completo): los 36 resultados
// de lanzar dos dados en una tabla de 6 × 6 (fila: primer dado, columna: segundo). Se tocan las casillas donde pasa el suceso
// pedido; el juego cuenta las marcadas y escribe la probabilidad como fracción simplificada.
// params = { rounds: [{ say, f(a, b) → bool }] }   state = { rounds: [{ m: [36 marcas] }] }
GAMES['tabla-dados'] = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const need = r => Array.from({ length: 36 }, (_, k) => !!r.f(Math.floor(k / 6) + 1, k % 6 + 1));
  const ok = (s, r) => need(r).every((v, k) => s.m[k] === v);
  const frac = k => { const g = gcd(k, 36) || 1; return k ? `\\tfrac{${k / g}}{${36 / g}}` : '0'; };
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ m: Array(36).fill(false) }),
    answered: s => s.m.some(Boolean),
    ok,
    solution: r => { const k = need(r).filter(Boolean).length; return `${k} de 36: $${frac(k)}$`; },
    prompt: r => `Dos dados: marca los resultados en que ${r.say}`,
    foot: () => 'Toca las casillas para marcarlas',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { m: need(r) } : G.s, good = ok(s, r), cs = Math.min(40, (G.W - 60) / 6), x0 = (G.W - 6 * cs) / 2 + 10, y0 = 112;
      for (let j = 0; j < 6; j++) TK.label(p, C, String(j + 1), x0 + (j + 0.5) * cs, y0 - 12, C.coral, 11, cs);
      G.cells = [];
      for (let i = 0; i < 6; i++) {
        TK.label(p, C, String(i + 1), x0 - 14, y0 + (i + 0.5) * cs, C.sky, 11, 20);
        for (let j = 0; j < 6; j++) {
          const k = i * 6 + j, x = x0 + j * cs, y = y0 + i * cs, on = s.m[k];
          p.stroke(RK.al(p, C.line, 150)); p.strokeWeight(1); p.fill(on ? RK.al(p, good ? C.ok : C.brand, 150) : RK.al(p, C.card, 210)); p.rect(x + 1, y + 1, cs - 2, cs - 2, 4);
          TK.label(p, C, `${i + 1},${j + 1}`, x + cs / 2, y + cs / 2, on ? C.ink : C.mute, 8, cs - 4);
          G.cells.push({ x, y, w: cs, h: cs, k });
        }
      }
      const k = s.m.filter(Boolean).length;
      RK.strip(p, C, G.fb, `$P = ${frac(k)}$`, { kicker: `${k} de 36 resultados`, col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const c = (G.cells || []).find(b => hitBox(b, x, y)); if (!c) return false; G.s.m[c.k] = !G.s.m[c.k]; G.touch(); return true; },
    demo: G => { const c = G.cells?.[7]; return c ? { from: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, to: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, text: 'Toca una casilla', ty: G.cells.at(-1).y + 52 } : null; },
    peek: G => ({ cells: G.cells }),
  });
  return Object.assign(game, { answer: r => ({ m: need(r) }) });
})();
