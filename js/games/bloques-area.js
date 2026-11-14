// Bloques de área (Álgebra, productos notables y factorización; mundo Taller de los Bloques; spec 2026-11-19-mundos-altos):
// un producto (x + a)(x + b) es el área de un rectángulo de lados x + a y x + b, armado con un cuadrado x², barras de
// x por 1 y cuadritos de 1 por 1. El juego dibuja el rectángulo; el estudiante mueve los números con − y +.
//   mode 'factor': se da x² + s·x + p y se eligen a y b; el rectángulo cambia en vivo y cuenta sus barras y cuadritos.
//                  Gana cuando tiene justo s barras y p cuadritos (dos números que sumen s y multipliquen p).
//   mode 'expand': se da (x + a)(x + b) ya dibujado, sin contar; se dice cuántas barras x y cuántos cuadritos tiene.
// params = { rounds: [{ mode, a, b }] }   state = { rounds: [{ u, v }] }   (u, v: los dos números que se eligen)

GAMES['bloques-area'] = (() => {
  const M = t => (typeof mathStep === 'function' ? `$${plainToTex(t)}$` : t);
  const poly = (s, p) => `x² ${s < 0 ? '−' : '+'} ${Math.abs(s)}x ${p < 0 ? '−' : '+'} ${Math.abs(p)}`;
  const game = roundsGame({
    aspect: 1.3,
    init: () => ({ u: 0, v: 0 }),
    ok: (s, r) => (r.mode === 'factor' ? s.u + s.v === r.a + r.b && s.u * s.v === r.a * r.b : s.u === r.a + r.b && s.v === r.a * r.b),
    answered: s => s.u > 0 || s.v > 0,
    solution: r => `$(x + ${r.a})(x + ${r.b}) = x^2 + ${r.a + r.b}x + ${r.a * r.b}$`,
    prompt: r => (r.mode === 'factor' ? `Arma el rectángulo de área ${M(poly(r.a + r.b, r.a * r.b))}` : `Cuenta las piezas de ${M(`(x + ${r.a})(x + ${r.b})`)}`),
    foot: r => (r.mode === 'factor' ? 'Dos números que sumados den las barras y multiplicados den los cuadritos' : 'Las barras son a + b; los cuadritos llenan la esquina: a por b'),
    layout(G) { const w = (G.W - 36) / 2; G.box = [{ x: 12, y: G.H - 64, w, h: 32 }, { x: 24 + w, y: G.H - 64, w, h: 32 }]; },
    draw(G) {
      const { p, C, W, H, s, r } = G, fac = r.mode === 'factor', a = fac ? s.u : r.a, b = fac ? s.v : r.b;
      const top = 96, room = H - 64 - 44 - top, k = Math.min(15, (Math.min(W - 60, room) - 0) / (6 + Math.max(a, b, 4))), X = 6 * k, x0 = W / 2 - (X + a * k) / 2, y0 = top + (room - (X + b * k)) / 2;
      const cell = (x, y, w, h, col) => { p.noStroke(); p.fill(col); p.rect(x + 1, y + 1, w - 2, h - 2, 3); };
      cell(x0, y0, X, X, C.sky);
      for (let i = 0; i < a; i++) cell(x0 + X + i * k, y0, k, X, C.mint);
      for (let j = 0; j < b; j++) cell(x0, y0 + X + j * k, X, k, C.mint);
      for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) cell(x0 + X + i * k, y0 + X + j * k, k, k, C.sun);   // sol, no coral: en el kit y en los videos el coral es «negativo»
      p.noStroke(); p.fill(inkOn(C.sky, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, '$x^2$', x0 + X / 2, y0 + X / 2, X - 8, 18);
      p.fill(C.mute); p.textSize(12);
      fitText(p, fac || G.locked ? M(`x + ${a}`) : M('x + a'), x0 + (X + a * k) / 2, y0 - 12, W - 40, 13);
      // Lo que el juego cuenta (en «expand» solo al comprobar: contar es el ejercicio).
      const bars = a + b, units = a * b;
      p.fill(C.ink); p.textStyle(p.BOLD);
      fitText(p, fac ? `${bars} ${bars === 1 ? 'barra' : 'barras'} x · ${units} ${units === 1 ? 'cuadrito' : 'cuadritos'}` : G.locked ? `${bars} barras x · ${units} cuadritos` : `tu respuesta: ${M(poly(s.u, s.v))}`, W / 2, H - 64 - 30, W - 24, 14);
      drawStepper(p, C, G.box[0], s.u, fac ? 'a' : 'barras x', C.Q);
      drawStepper(p, C, G.box[1], s.v, fac ? 'b' : 'cuadritos', fac ? C.Q : C.N);
    },
    press(G, x, y) {
      const d0 = stepHit(G.box[0], x, y), d1 = stepHit(G.box[1], x, y), fac = G.r.mode === 'factor';
      if (!d0 && !d1) return false;
      G.s.u = Math.max(0, Math.min(fac ? 9 : 18, G.s.u + d0)); G.s.v = Math.max(0, Math.min(fac ? 9 : 81, G.s.v + d1)); G.touch();
      return true;
    },
    peek: G => ({ box: G.box, want: G.r.mode === 'factor' ? [G.r.a, G.r.b] : [G.r.a + G.r.b, G.r.a * G.r.b] }),
  });
  return { ...game, poly };
})();
