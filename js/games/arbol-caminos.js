// El árbol de probabilidades (Preuniversitario, pu-pb-2; spec 2026-11-18-preuda-razonamiento-completo): dos o tres pasos
// independientes (monedas, tiros) en un árbol; cada rama lleva su probabilidad. Se tocan las hojas (caminos completos) donde pasa
// lo pedido; el juego multiplica a lo largo de cada camino y suma los caminos marcados.
// params = { rounds: [{ steps: [[[rótulo, num, den], …]], say, f(camino de índices) → bool }] }   state = { rounds: [{ m: [marca por hoja] }] }
GAMES['arbol-caminos'] = (() => {
  const paths = r => r.steps.reduce((acc, st) => acc.flatMap(pa => st.map((_, i) => [...pa, i])), [[]]);
  const need = r => paths(r).map(pa => !!r.f(pa));
  const ok = (s, r) => need(r).every((v, k) => s.m[k] === v);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const prob = (r, pa) => pa.reduce(([n, d], i, k) => [n * r.steps[k][i][1], d * r.steps[k][i][2]], [1, 1]);
  const add = (a, b) => { const n = a[0] * b[1] + b[0] * a[1], d = a[1] * b[1], g = gcd(n, d) || 1; return [n / g, d / g]; };
  const game = roundsGame({
    aspect: 1.35,
    init: r => ({ m: paths(r).map(() => false) }),
    answered: s => s.m.some(Boolean),
    ok,
    solution: r => { const P = paths(r).filter((pa, k) => need(r)[k]).reduce((a, pa) => add(a, prob(r, pa)), [0, 1]); return `$P = \\tfrac{${P[0]}}{${P[1]}}$`; },
    prompt: r => `Marca los caminos en que ${r.say}`,
    foot: () => 'Toca las hojas del árbol',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { m: need(r) } : G.s, good = ok(s, r), P = paths(r), L = r.steps.length, hTot = G.H - 210, x0 = 30, dx = (G.W - 110) / L;
      const yOf = (lvl, idx, count) => 100 + (idx + 0.5) * hTot / count;
      let level = [[]];
      for (let l = 0; l < L; l++) {
        const next = level.flatMap(pa => r.steps[l].map((_, i) => [...pa, i])), cnt = next.length, pc = level.length;
        next.forEach((pa, k) => {
          const parent = Math.floor(k / r.steps[l].length), y1 = l ? yOf(l - 1, parent, pc) : 100 + hTot / 2, y2 = yOf(l, k, cnt), xa = x0 + l * dx, xb = x0 + (l + 1) * dx, [lab, n, d] = r.steps[l][pa[l]];
          p.stroke(C.line); p.strokeWeight(1.2); p.line(xa, y1, xb, y2);
          if (cnt <= 8) TK.label(p, C, `${lab} $\\tfrac{${n}}{${d}}$`, (xa + xb) / 2, (y1 + y2) / 2 - 8, C.mute, 8, dx);
        });
        level = next;
      }
      G.leaves = P.map((pa, k) => {
        const y = yOf(L - 1, k, P.length), x = x0 + L * dx, on = s.m[k], pr = prob(r, pa);
        p.stroke(on ? (good ? C.ok : C.brand) : C.line); p.strokeWeight(on ? 2 : 1); p.fill(on ? RK.al(p, good ? C.ok : C.brand, 90) : RK.al(p, C.card, 220)); p.rect(x + 4, y - 10, 64, 20, 6);
        TK.label(p, C, `${pa.map((i, l) => r.steps[l][i][0]).join('')} $\\tfrac{${pr[0]}}{${pr[1]}}$`, x + 36, y, C.ink, 9, 62);
        return { x: x + 4, y: y - 10, w: 64, h: 20, k };
      });
      const sum = P.filter((_, k) => s.m[k]).reduce((a, pa) => add(a, prob(r, pa)), [0, 1]);
      RK.strip(p, C, G.fb, `$P = ${sum[0] ? `\\tfrac{${sum[0]}}{${sum[1]}}` : '0'}$`, { kicker: good ? 'se multiplica por camino y se suman los caminos' : `${s.m.filter(Boolean).length} caminos marcados`, col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) { const c = (G.leaves || []).find(b => hitBox({ x: b.x - 4, y: b.y - 2, w: b.w + 8, h: b.h + 4 }, x, y)); if (!c) return false; G.s.m[c.k] = !G.s.m[c.k]; G.touch(); return true; },
    demo: G => { const c = G.leaves?.[0]; return c ? { from: { x: c.x + 30, y: c.y + 10 }, to: { x: c.x + 30, y: c.y + 10 }, text: 'Toca una hoja', ty: G.leaves.at(-1).y + 40 } : null; },
    peek: G => ({ leaves: G.leaves }),
  });
  return Object.assign(game, { answer: r => ({ m: need(r) }) });
})();
