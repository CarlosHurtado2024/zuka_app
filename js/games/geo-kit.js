// Piezas de dibujo de los juegos de geometría del Preuniversitario UdeA (spec 2026-11-18-preuda-geometria). Va después
// de kit.js. Los ángulos van en grados, en sentido antihorario desde la derecha, como en el cuaderno.
const GEO = (() => {
  const rad = d => d * Math.PI / 180;
  // Punto a distancia r de (x, y) en la dirección d.
  const at = (x, y, r, d) => [x + r * Math.cos(rad(d)), y - r * Math.sin(rad(d))];
  // Dirección (0 a 360) en la que queda (x, y) visto desde (x0, y0).
  const angOf = (x0, y0, x, y) => (Math.atan2(y0 - y, x - x0) * 180 / Math.PI + 360) % 360;
  const snap = (v, s) => Math.round(v / s) * s;
  // Sector de a0 a a1 (a0 < a1) con su medida escrita afuera: así se «ve» un ángulo.
  function wedge(p, C, x, y, r, a0, a1, col, label, lr) {
    if (a1 - a0 < 0.5) return;
    const c = p.color(col); c.setAlpha(80);
    p.noStroke(); p.fill(c); p.arc(x, y, 2 * r, 2 * r, -rad(a1), -rad(a0), p.PIE);
    p.noFill(); p.stroke(col); p.strokeWeight(2); p.arc(x, y, 2 * r, 2 * r, -rad(a1), -rad(a0));
    if (label != null) { const [lx, ly] = at(x, y, lr ?? r + 15, (a0 + a1) / 2); TK.label(p, C, String(label), lx, ly, col, 13, 64); }
  }
  // Recta que pasa por (x, y) con dirección d, de largo 2·len.
  function line(p, x, y, len, d, col, w = 3) { const [a, b] = at(x, y, len, d), [c, e] = at(x, y, len, d + 180); p.stroke(col); p.strokeWeight(w); p.line(a, b, c, e); }
  // Manija para arrastrar: un punto con aro.
  function knob(p, C, x, y, col) { p.stroke(col); p.strokeWeight(3); p.fill(C.cream); p.circle(x, y, 22); }
  return { rad, at, angOf, snap, wedge, line, knob };
})();
