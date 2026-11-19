// Figuras que crecen (Preuniversitario, pu-se-2; spec 2026-11-18-preuda-razonamiento-completo): cada figura es un montón de
// puntos ordenados en filas; se ven las primeras y se arrastra la que sigue hasta que tenga los puntos justos. Abajo se ve
// cuántos puntos gana cada figura.
// params = { rounds: [{ seq: [puntos de las primeras figuras], need, cols, hi }] }   state = { rounds: [{ v }] }
GAMES['figura-patron'] = SUC.nextGame({
  prompt: () => '¿Cuántos puntos tiene la figura que sigue?',
  foot: 'Arrastra la figura que falta para darle puntos',
  terms: r => [...r.seq, null],
  need: r => r.need,
  range: r => [1, r.hi],
  noBars: true,
  extra: G => {
    const { p, C, T, r } = G, b = G.b, w = b.w / T.length, y0 = G.Y(0), cols = r.cols || 3, good = G.s.v === r.need;
    T.forEach((v, i) => {
      const rows = Math.ceil(v / cols), top = G.Y(v), x0 = b.x + i * w + w * 0.15, cw = w * 0.7 / cols, rh = (y0 - top) / Math.max(rows, 1), d = Math.max(3, Math.min(cw, rh) * 0.7), miss = i === G.miss;
      p.noStroke(); p.fill(miss ? (good ? C.ok : C.brand) : C.sky);
      for (let k = 0; k < v; k++) p.circle(x0 + (k % cols + 0.5) * cw, y0 - (Math.floor(k / cols) + 0.5) * rh, d);
      TK.label(p, C, `fig ${i + 1}`, b.x + (i + 0.5) * w, y0 + 14, C.mute, 9, w);
    });
    T.slice(1).forEach((t, i) => { const d = t - T[i]; TK.label(p, C, `+${d}`, b.x + (i + 1) * w, y0 + 30, C.coral, 9, w); });
  },
});
