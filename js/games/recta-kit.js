// Piezas de dibujo del mundo «La Recta Real» (spec 2026-11-18-algebra-revision). Va después de kit.js y formula.js.
// Flechas sobre la recta, manijas, fichas y la franja de escritura formal (TeX entre $…$).
const RK = (() => {
  const al = (p, col, a) => { const c = p.color(col); c.setAlpha(a); return c; };
  // Ficha con texto. o = { on, col, r, size }.
  function chip(p, C, b, txt, o = {}) {
    const col = o.col ?? C.brand;
    p.stroke(o.on ? col : C.line); p.strokeWeight(o.on ? 2 : 1.2); p.fill(o.on ? al(p, col, 60) : C.card); p.rect(b.x, b.y, b.w, b.h, o.r ?? 9);
    p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
    fitText(p, String(txt), b.x + b.w / 2, b.y + b.h / 2 + 1, b.w - 8, o.size ?? 14, b.h - 4);
  }
  // Flecha horizontal de x0 a x1 a la altura y.
  function arrow(p, x0, x1, y, col, w = 4) {
    p.stroke(col); p.strokeWeight(w); p.line(x0, y, x1, y);
    const d = Math.sign(x1 - x0) || 1;
    p.noStroke(); p.fill(col); if (Math.abs(x1 - x0) > 2) p.triangle(x1 + d * 2, y, x1 - d * 11, y - 7, x1 - d * 11, y + 7);
  }
  function knob(p, C, x, y, col) { p.stroke(col); p.strokeWeight(3); p.fill(C.cream ?? C.card); p.circle(x, y, 22); }
  // Franja de escritura formal, con rótulo pequeño opcional.
  function strip(p, C, b, tex, o = {}) {
    p.stroke(C.line); p.strokeWeight(1); p.fill(al(p, C.card, 230)); p.rect(b.x, b.y, b.w, b.h, 12);
    p.noStroke(); p.fill(o.col ?? C.brand); p.rect(b.x + 1, b.y + 9, 3, b.h - 18, 2);
    if (o.kicker) { p.fill(C.mute); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER); p.textSize(10); p.text(o.kicker, b.x + 14, b.y + 12); }
    p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
    fitText(p, tex, b.x + b.w / 2 + 4, b.y + b.h / 2 + (o.kicker ? 7 : 1), b.w - 28, o.size ?? 18, b.h - (o.kicker ? 22 : 10));
  }
  // Número en TeX: entero, decimal corto o fracción (−0.5 → −½).
  const num = v => { if (Number.isInteger(v)) return String(v); for (let d = 2; d <= 12; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}`; } return String(+v.toFixed(3)); };
  // Entre paréntesis si es negativo: 3 − (−4).
  const par = v => (v < 0 ? `(${num(v)})` : num(v));
  // Regla de valores con manija: n marcas de x0 a x1; lab(k) rotula la marca k (o null). Devuelve la x de cada marca.
  function track(p, C, x0, x1, y, n, i, lab, col) {
    const X = k => x0 + k * (x1 - x0) / (n - 1);
    p.stroke(C.line); p.strokeWeight(2); p.line(x0, y, x1, y);
    for (let k = 0; k < n; k++) { p.stroke(C.line); p.strokeWeight(1.5); p.line(X(k), y - 4, X(k), y + 4); const t = lab?.(k); if (t != null) TK.label(p, C, t, X(k), y + 18, k === i ? C.brand : C.mute, 10, Math.max(22, (x1 - x0) / n * 1.8)); }
    knob(p, C, X(i), y, col ?? C.brand);
    return X;
  }
  const pick = (x, x0, x1, n) => Math.max(0, Math.min(n - 1, Math.round((x - x0) / (x1 - x0) * (n - 1))));
  // Bloque algebraico: kind 2 = cuadrado x², 1 = barra x (vertical), 0 = cuadrito 1. u = lado x; s = lado 1. Negativo en coral.
  const tileSize = (kind, u, s) => (kind === 2 ? [u, u] : kind === 1 ? [s, u] : [s, s]);
  function tile(p, C, kind, x, y, u, s, neg, o = {}) {
    const [w, h] = tileSize(kind, u, s), col = neg ? C.coral : [C.mint, C.sky, C.sun][2 - kind];
    p.stroke(o.lift ? C.brand : RK_ink(C, col)); p.strokeWeight(o.lift ? 2 : 1.2); p.fill(al(p, col, o.ghost ? 40 : 170)); p.rect(x, y, w, h, 3);
    if (o.label !== false && Math.min(w, h) >= 14) { p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(Math.min(12, h * 0.6)); p.text((neg ? '−' : '') + ['1', 'x', 'x²'][kind], x + w / 2, y + h / 2 + 1); }
    return [w, h];
  }
  const RK_ink = (C, col) => C.line;
  // Plano cartesiano en la caja b con la ventana v = { x0, x1, y0, y1 }; o = { step, lx, ly } (rótulos de los ejes).
  // Devuelve { X, Y, iX, iY } para pasar de valores a pantalla y de vuelta.
  function plane(p, C, b, v, o = {}) {
    const X = x => b.x + (x - v.x0) / (v.x1 - v.x0) * b.w, Y = y => b.y + b.h - (y - v.y0) / (v.y1 - v.y0) * b.h;
    const iX = px => v.x0 + (px - b.x) / b.w * (v.x1 - v.x0), iY = py => v.y0 + (b.y + b.h - py) / b.h * (v.y1 - v.y0);
    p.noStroke(); p.fill(al(p, C.card, 150)); p.rect(b.x, b.y, b.w, b.h, 8);
    const st = o.step ?? 1;
    p.stroke(al(p, C.line, 120)); p.strokeWeight(1);
    for (let x = Math.ceil(v.x0 / st) * st; x <= v.x1; x += st) p.line(X(x), b.y, X(x), b.y + b.h);
    for (let y = Math.ceil(v.y0 / st) * st; y <= v.y1; y += st) p.line(b.x, Y(y), b.x + b.w, Y(y));
    p.stroke(C.ink); p.strokeWeight(1.6);
    if (v.y0 <= 0 && v.y1 >= 0) p.line(b.x, Y(0), b.x + b.w, Y(0));
    if (v.x0 <= 0 && v.x1 >= 0) p.line(X(0), b.y, X(0), b.y + b.h);
    if (o.lx) TK.label(p, C, o.lx, b.x + b.w - 10, Math.min(b.y + b.h - 8, Y(0) - 10), C.mute, 10, 30);
    if (o.ly) TK.label(p, C, o.ly, Math.max(b.x + 10, X(0) + 12), b.y + 10, C.mute, 10, 30);
    return { X, Y, iX, iY };
  }
  // Curva y = f(x) recortada a la caja.
  function curve(p, b, M, v, f, col, w = 2.5) {
    p.noFill(); p.stroke(col); p.strokeWeight(w); p.beginShape();
    for (let i = 0; i <= 120; i++) { const x = v.x0 + (v.x1 - v.x0) * i / 120, y = f(x); if (!Number.isFinite(y) || y < v.y0 - 1 || y > v.y1 + 1) { p.endShape(); p.beginShape(); continue; } p.vertex(M.X(x), M.Y(y)); }
    p.endShape();
  }
  return { al, chip, arrow, knob, strip, num, par, track, pick, tile, tileSize, plane, curve };
})();
