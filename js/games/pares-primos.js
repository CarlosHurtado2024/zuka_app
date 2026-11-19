// Las parejas de primos (Preuniversitario, pu-nu-2; spec 2026-11-18-preuda-razonamiento-completo): arriba están los factores
// primos de a y abajo los de b, en fichas. Se toca una ficha de arriba y luego una igual de abajo: las dos se juntan en el
// centro (son un factor común). Cuando ya no quedan parejas, el centro es el MCD y todo junto (cada pareja contada una vez)
// es el MCM.
// params = { rounds: [{ a, b }] }   state = { rounds: [{ pairs: [[i de a, j de b]] }] }
GAMES['pares-primos'] = (() => {
  const fac = n => { const out = []; let v = n; for (let d = 2; v > 1; d++) while (v % d === 0) { out.push(d); v /= d; } return out; };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const valid = (r, pairs) => { const A = fac(r.a), B = fac(r.b), ui = new Set(), uj = new Set(); return pairs.every(([i, j]) => { const good = A[i] === B[j] && !ui.has(i) && !uj.has(j); ui.add(i); uj.add(j); return good; }); };
  const ok = (s, r) => valid(r, s.pairs) && s.pairs.reduce((m, [i]) => m * fac(r.a)[i], 1) === gcd(r.a, r.b);
  const answer = r => { const A = fac(r.a), B = fac(r.b), used = new Set(), pairs = []; A.forEach((v, i) => { const j = B.findIndex((w, k) => w === v && !used.has(k)); if (j >= 0) { used.add(j); pairs.push([i, j]); } }); return { pairs }; };
  const game = roundsGame({
    aspect: 1.25,
    init: () => ({ pairs: [] }),
    answered: s => s.pairs.length > 0,
    ok,
    solution: r => `MCD ${gcd(r.a, r.b)}, MCM ${r.a / gcd(r.a, r.b) * r.b}`,
    prompt: r => `Junta los primos comunes de ${r.a} y ${r.b}`,
    foot: () => 'Toca una ficha de arriba y luego una igual de abajo',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.sel = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), A = fac(r.a), B = fac(r.b), usedA = new Set(s.pairs.map(q => q[0])), usedB = new Set(s.pairs.map(q => q[1]));
      const row = (L, y, used, key, col) => { const w = Math.min(44, (G.W - 40) / L.length - 6), x0 = (G.W - L.length * (w + 6) + 6) / 2; return L.map((v, i) => { const b = { x: x0 + i * (w + 6), y, w, h: 36, i, key }; if (!used.has(i)) RK.chip(p, C, b, String(v), { on: G.sel?.key === key && G.sel.i === i, col, size: 14 }); else { p.noFill(); p.stroke(C.line); p.drawingContext.setLineDash([3, 3]); p.rect(b.x, b.y, w, 36, 8); p.drawingContext.setLineDash([]); } return b; }); };
      TK.label(p, C, `${r.a}`, 30, 118, C.sky, 12, 40); TK.label(p, C, `${r.b}`, 30, 278, C.coral, 12, 40);
      G.ba = row(A, 100, usedA, 'a', C.sky); G.bb = row(B, 260, usedB, 'b', C.coral);
      const mid = s.pairs.map(([i]) => A[i]), w = 40, x0 = (G.W - Math.max(1, mid.length) * (w + 6) + 6) / 2;
      p.stroke(good ? C.ok : C.brand); p.strokeWeight(1.5); p.noFill(); p.rect(16, 168, G.W - 32, 60, 10);
      TK.label(p, C, 'comunes', 50, 162, C.brand, 9, 70);
      mid.forEach((v, k) => RK.chip(p, C, { x: x0 + k * (w + 6), y: 180, w, h: 36 }, String(v), { on: true, col: good ? C.ok : C.mint, size: 14 }));
      const g = mid.reduce((a, b) => a * b, 1);
      RK.strip(p, C, G.fb, good ? `$\\text{MCD} = ${gcd(r.a, r.b)}\\quad \\text{MCM} = ${r.a / gcd(r.a, r.b) * r.b}$` : `$\\text{comunes: ${mid.length ? mid.join(' · ') + ' = ' + g : 'ninguno'}}$`, { kicker: good ? 'no quedan parejas' : '', col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) {
      const hitA = (G.ba || []).find(b => hitBox(b, x, y)), hitB = (G.bb || []).find(b => hitBox(b, x, y)), r = G.r;
      if (hitA && !G.s.pairs.some(q => q[0] === hitA.i)) { G.sel = { key: 'a', i: hitA.i }; return true; }
      if (hitB && !G.s.pairs.some(q => q[1] === hitB.i)) {
        if (G.sel?.key === 'a' && fac(r.a)[G.sel.i] === fac(r.b)[hitB.i]) { G.s.pairs.push([G.sel.i, hitB.i]); G.touch(); }
        G.sel = null; return true;
      }
      if (y > 168 && y < 228 && G.s.pairs.length) { G.s.pairs.pop(); G.touch(); return true; }
      return false;
    },
    demo: G => { const a = G.ba?.[0], b = G.bb?.find(q => fac(G.r.b)[q.i] === fac(G.r.a)[0]) || G.bb?.[0]; return a && b ? { from: { x: a.x + a.w / 2, y: a.y + 18 }, to: { x: b.x + b.w / 2, y: b.y + 18 }, text: 'Toca uno y luego su pareja', ty: 240 } : null; },
    peek: G => ({ ba: G.ba, bb: G.bb }),
  });
  return Object.assign(game, { answer });
})();
