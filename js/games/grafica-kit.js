// Kit de las gráficas (Preuniversitario, mundo «Tablas y gráficas»; spec 2026-11-18-preuda-razonamiento-completo): ejes con
// rayas de escala y barras, para los juegos de leer, armar y comparar datos.
// GRAF.axes(p, C, b, lo, hi, step) → Y(v)   dibuja la escala de lo a hi con una raya cada step
// GRAF.bars(p, C, b, vals, labs, Y, o) → columnas [{ x, w, cx }]   o = { col(i), lo (piso), hl: [índices resaltados] }
// GRAF.colAt(cols, x) → índice de la columna bajo x (o −1)
const GRAF = (() => {
  function axes(p, C, b, lo, hi, step) {
    const Y = v => b.y + b.h - (v - lo) / (hi - lo) * b.h;
    for (let v = lo; v <= hi + 1e-9; v += step) {
      const y = Y(v);
      p.stroke(RK.al(p, C.line, v === lo ? 220 : 90)); p.strokeWeight(1); p.line(b.x, y, b.x + b.w, y);
      TK.label(p, C, String(Math.round(v * 100) / 100), b.x - 14, y, C.mute, 9, 26);
    }
    p.stroke(C.line); p.line(b.x, b.y, b.x, b.y + b.h);
    return Y;
  }
  function bars(p, C, b, vals, labs, Y, o = {}) {
    const n = vals.length, w = b.w / n, lo = o.lo ?? 0;
    return vals.map((v, i) => {
      const x = b.x + i * w + w * 0.18, bw = w * 0.64, top = Y(Math.max(v, lo)), hl = o.hl?.includes(i);
      p.noStroke(); p.fill(o.col ? o.col(i) : hl ? C.brand : C.sky); p.rect(x, top, bw, Y(lo) - top, 3, 3, 0, 0);
      if (labs) TK.label(p, C, labs[i], x + bw / 2, b.y + b.h + 13, hl ? C.brand : C.ink, 10, w);
      return { x, w: bw, cx: x + bw / 2, top };
    });
  }
  const colAt = (cols, x) => cols.findIndex(c => x >= c.x - 8 && x <= c.x + c.w + 8);
  return { axes, bars, colAt };
})();
