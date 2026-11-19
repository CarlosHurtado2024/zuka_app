// La encuesta de tres círculos (Preuniversitario, pu-cj-1 y pu-cj-2; spec 2026-11-18-preuda-razonamiento-completo): un Venn de
// tres conjuntos con sus 8 zonas. Cada zona tiene su número: se arrastra arriba o abajo sobre la zona para cambiarlo. Al lado
// están los datos de la encuesta (cuántos en A, en A y B, en los tres…) y el juego suma las zonas en vivo para cada dato. Se
// llena del centro hacia afuera.
// params = { rounds: [{ labels: [A, B, C], z: { a, b, c, ab, ac, bc, abc, none } }] }   (z: cuántos hay SOLO en cada zona)
// state = { rounds: [{ v: { a, b, c, ab, ac, bc, abc, none } }] }
GAMES['encuesta-tres'] = (() => {
  const KEYS = ['abc', 'ab', 'ac', 'bc', 'a', 'b', 'c', 'none'];
  const MASK = { a: 1, b: 2, c: 4, ab: 3, ac: 5, bc: 6, abc: 7, none: 0 };
  const data = (r, v) => {
    const inA = k => MASK[k] & 1, inB = k => MASK[k] & 2, inC = k => MASK[k] & 4, S = f => KEYS.filter(f).reduce((t, k) => t + v[k], 0);
    const [A, B, Cn] = r.labels, sh = t => (t.length > 5 ? t.slice(0, 4) + '.' : t);   // rótulos cortos: caben dos columnas a 300 px
    return [
      ['en los 3', v.abc], [`${sh(A)} y ${sh(B)}`, S(k => inA(k) && inB(k))], [`${sh(A)} y ${sh(Cn)}`, S(k => inA(k) && inC(k))], [`${sh(B)} y ${sh(Cn)}`, S(k => inB(k) && inC(k))],
      [A, S(inA)], [B, S(inB)], [Cn, S(inC)], ['total', S(() => true)],
    ];
  };
  const ok = (s, r) => KEYS.every(k => s.v[k] === r.z[k]);
  const game = roundsGame({
    aspect: 1.45,
    init: () => ({ v: Object.fromEntries(KEYS.map(k => [k, 0])) }),
    answered: s => KEYS.some(k => s.v[k] > 0),
    ok,
    solution: r => KEYS.map(k => `${k === 'none' ? 'ninguno' : k.toUpperCase()}: ${r.z[k]}`).join(', '),
    prompt: () => 'Llena el diagrama con la encuesta, del centro hacia afuera',
    foot: () => 'Arrastra arriba o abajo sobre una zona para cambiar su número',
    layout(G) {
      const W = G.W, cx = W / 2, cy = 200, d = Math.min(W * 0.13, 46), R = d * 1.75;
      G.c = [[cx - d, cy - d * 0.55], [cx + d, cy - d * 0.55], [cx, cy + d * 0.95]]; G.R = R; G.box = { x: 12, y: cy - R - d * 0.6 - 10, w: W - 24, h: 2 * R + d * 1.6 + 30 };
      const acc = {}; for (let x = G.box.x; x < G.box.x + G.box.w; x += 4) for (let y = G.box.y; y < G.box.y + G.box.h; y += 4) { let m = 0; G.c.forEach(([a, b], i) => { if ((x - a) ** 2 + (y - b) ** 2 < R * R) m |= 1 << i; }); (acc[m] = acc[m] || []).push([x, y]); }
      G.cent = {}; KEYS.forEach(k => { const pts = acc[MASK[k]] || [[G.box.x + 20, G.box.y + 16]]; G.cent[k] = k === 'none' ? [G.box.x + 30, G.box.y + G.box.h - 18] : [pts.reduce((a, q) => a + q[0], 0) / pts.length, pts.reduce((a, q) => a + q[1], 0) / pts.length]; });
      G.fb = { x: 12, y: G.H - 66, w: W - 24, h: 44 };
    },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { v: r.z } : G.s, good = ok(s, r), cols = [C.sky, C.coral, C.mint];
      p.stroke(C.line); p.strokeWeight(1); p.noFill(); p.rect(G.box.x, G.box.y, G.box.w, G.box.h, 10);
      G.c.forEach(([x, y], i) => { p.stroke(cols[i]); p.strokeWeight(2); p.fill(RK.al(p, cols[i], 30)); p.circle(x, y, 2 * G.R); });
      TK.label(p, C, r.labels[0], G.c[0][0] - G.R * 0.7, G.c[0][1] - G.R * 0.85, cols[0], 10, 80);
      TK.label(p, C, r.labels[1], G.c[1][0] + G.R * 0.7, G.c[1][1] - G.R * 0.85, cols[1], 10, 80);
      TK.label(p, C, r.labels[2], G.c[2][0] + G.R * 0.95, G.c[2][1] + G.R * 0.8, cols[2], 10, 80);
      KEYS.forEach(k => { const [x, y] = G.cent[k], hit = s.v[k] === r.z[k]; p.noStroke(); p.fill(RK.al(p, C.card, 230)); p.rect(x - 14, y - 11, 28, 22, 6); TK.label(p, C, String(s.v[k]), x, y, G.grab?.k === k ? C.brand : good && hit ? C.ok : C.ink, 13, 26); });
      TK.label(p, C, 'ninguno', G.cent.none[0], G.cent.none[1] - 20, C.mute, 9, 60);
      const want = data(r, r.z), now = data(r, s.v), y0 = G.box.y + G.box.h + 12, colW = (G.W - 24) / 2;
      want.forEach(([lab, n], i) => { const hit = now[i][1] === n, x = 12 + (i % 2) * colW + colW / 2, y = y0 + Math.floor(i / 2) * 15; TK.label(p, C, `${hit ? '✓' : '·'} ${lab}: ${n} (van ${now[i][1]})`, x, y, hit ? C.ok : C.ink, 9, colW - 4); });
      RK.strip(p, C, G.fb, good ? '$\\text{el diagrama cuadra con la encuesta}$' : `$\\text{${want.filter((w, i) => now[i][1] === w[1]).length} de ${want.length} datos}$`, { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const k = KEYS.find(q => Math.abs(x - G.cent[q][0]) < 22 && Math.abs(y - G.cent[q][1]) < 18); if (!k) return false; G.grab = { k, y0: y, v0: G.s.v[k] }; return true; },
    drag(G, x, y) { if (!G.grab) return false; const v = Math.max(0, Math.min(60, G.grab.v0 + Math.round((G.grab.y0 - y) / 12))); if (v !== G.s.v[G.grab.k]) { G.s.v[G.grab.k] = v; G.touch(); } return true; },
    release(G, x, y) { if (G.grab && Math.abs(y - G.grab.y0) < 5) { G.s.v[G.grab.k] += 1; G.touch(); } G.grab = null; },
    demo: G => { const [x, y] = G.cent.abc; return { from: { x, y: y + 20 }, to: { x, y: y - 40 }, text: 'Arrastra hacia arriba', ty: G.box.y + 14 }; },
    peek: G => ({ cent: G.cent }),
  });
  return Object.assign(game, { answer: r => ({ v: { ...r.z } }) });
})();
