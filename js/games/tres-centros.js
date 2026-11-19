// Media, mediana y moda en una gráfica de puntos (Preuniversitario, pu-gr-2; spec 2026-11-18-preuda-razonamiento-completo):
// cada dato es un punto apilado sobre su valor. Debajo de la recta hay tres alfileres (media, mediana, moda) que se arrastran a
// su lugar (de medio en medio). Con datos cargados a un lado, los tres no coinciden.
// params = { rounds: [{ data: [enteros], lo, hi }] }   state = { rounds: [{ m: [media, mediana, moda] }] }
GAMES['tres-centros'] = (() => {
  const NAMES = ['media', 'mediana', 'moda'];
  const vals = r => {
    const s = r.data.slice().sort((a, b) => a - b), n = s.length, mean = s.reduce((a, b) => a + b, 0) / n;
    const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    const cnt = {}; s.forEach(v => (cnt[v] = (cnt[v] || 0) + 1)); const mode = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
    return [mean, med, mode];
  };
  const ok = (s, r) => vals(r).every((v, i) => s.m[i] === v);
  const game = roundsGame({
    aspect: 1.4,
    init: r => ({ m: [r.lo, r.lo, r.lo] }),
    ok,
    solution: r => vals(r).map((v, i) => `${NAMES[i]} ${v}`).join(', '),
    prompt: () => 'Pon la media, la mediana y la moda en su lugar',
    foot: () => 'Arrastra cada alfiler sobre la recta',
    layout(G) { G.ax = { x0: 30, x1: G.W - 30, y: 200 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = -1; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { m: vals(r) } : G.s, good = ok(s, r), ax = G.ax, X = v => ax.x0 + (v - r.lo) / (r.hi - r.lo) * (ax.x1 - ax.x0), want = vals(r);
      G.X = X;
      p.stroke(C.ink); p.strokeWeight(1.4); p.line(ax.x0, ax.y, ax.x1, ax.y);
      const cnt = {};
      for (let v = r.lo; v <= r.hi; v++) { p.stroke(C.line); p.line(X(v), ax.y - 3, X(v), ax.y + 3); TK.label(p, C, String(v), X(v), ax.y + 13, C.mute, 9, 20); }
      r.data.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; p.noStroke(); p.fill(C.sky); p.circle(X(v), ax.y - 10 - (cnt[v] - 1) * 14, 11); });
      const cols = [C.brand, C.coral, C.mint];
      G.pins = s.m.map((v, i) => {
        const x = X(v), y = ax.y + 40 + i * 28, right = v === want[i];
        p.stroke(cols[i]); p.strokeWeight(1.5); p.line(x, ax.y + 4, x, y - 9);
        p.noStroke(); p.fill(right && good ? C.ok : cols[i]); p.circle(x, y, 16);
        TK.label(p, C, `${NAMES[i]} ${v}`, Math.min(Math.max(x, 60), G.W - 60), y + 15, C.ink, 9, 100);
        return { x, y };
      });
      RK.strip(p, C, G.fb, good ? '$\\text{los tres centros, en su lugar}$' : `$\\text{${s.m.join(' · ')}}$`, { col: G.locked || good ? C.ok : C.brand, size: 15 });
    },
    press(G, x, y) { const i = (G.pins || []).findIndex(q => Math.hypot(x - q.x, y - q.y) < 18); if (i < 0) return false; G.grab = i; return true; },
    drag(G, x) { if (G.grab < 0) return false; const r = G.r, ax = G.ax, v = Math.max(r.lo, Math.min(r.hi, Math.round((r.lo + (x - ax.x0) / (ax.x1 - ax.x0) * (r.hi - r.lo)) * 2) / 2)); if (v !== G.s.m[G.grab]) { G.s.m[G.grab] = v; G.touch(); } return true; },
    release(G) { G.grab = -1; },
    demo: G => (G.pins ? { from: G.pins[0], to: { x: G.pins[0].x + 80, y: G.pins[0].y }, text: 'Arrastra el alfiler', ty: 100 } : null),
    peek: G => ({ pins: G.pins, ax: G.ax }),
  });
  return Object.assign(game, { answer: r => ({ m: vals(r) }) });
})();
