// Voltea la flecha (Preuniversitario UdeA, pu-cm-1; spec 2026-11-18-preuda-enteros): la regla de los signos se ve.
// Una flecha de tamaño a sale del 0. Con un deslizador se elige el multiplicador b: la flecha se repite |b| veces
// (se estira) y, si b es negativo, toda la cadena se refleja en el 0 (se voltea). Hay que llevar la punta al aro. Si a
// ya es negativa y b también, la cadena se voltea hacia la derecha: negativo por negativo, positivo. Estilo de la
// «balanza»: todo cambia en vivo mientras se arrastra, sin vidas ni reloj.
// params = { rounds: [{ a, target }] }   state = { rounds: [{ b }] }   (b entero de −6 a 6)
GAMES['voltea-flecha'] = (() => {
  const m = TK.minusTxt, B = 6;
  const par = v => (v < 0 ? `(${m(v)})` : String(v));
  const range = r => Math.max(15, Math.ceil((Math.max(Math.abs(r.target), Math.abs(r.a) * 3) + 2) / 5) * 5);
  const game = roundsGame({
    aspect: 1.32,
    init: () => ({ b: 1 }),
    ok: (s, r) => r.a * s.b === r.target,
    solution: r => `${par(r.a)} · ${par(r.target / r.a)} = ${m(r.target)}`,
    prompt: r => `Estira y voltea la flecha de ${m(r.a)} hasta llegar a ${m(r.target)}`,
    foot: (r, s) => (s.b < 0 ? 'Multiplicador negativo: la cadena se refleja en el 0' : s.b === 0 ? 'Por 0 no queda flecha' : 'Multiplicador positivo: solo se estira'),
    layout(G) {
      const R = range(G.r);
      G.L = { x0: 18, x1: G.W - 18, min: -R, max: R, y: 262 };
      G.X = v => G.L.x0 + (v + R) / (2 * R) * (G.L.x1 - G.L.x0);
      G.slY = G.H - 66; G.bx = b => 30 + (b + B) / (2 * B) * (G.W - 60);
    },
    enter(G) { G.dragging = false; game.layoutOf(G); },
    draw(G) {
      const { p, C, r, s, L, X } = G, R = L.max, v = r.a * s.b, ok = v === r.target, clampV = x => Math.max(-R, Math.min(R, x));
      const col = G.locked ? (ok ? C.ok : C.bad) : ok ? C.ok : v < 0 ? C.coral : C.sky;
      TK.label(p, C, `${par(r.a)} · ${par(s.b)} = ${m(v)}`, G.W / 2, 104, G.locked ? (ok ? C.ok : C.bad) : ok ? C.ok : C.ink, 20, G.W - 24);
      drawNumLine(p, C, L, { step: 1, every: 5, size: 11 });
      // El espejo en el 0.
      p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([5, 5]); p.line(X(0), L.y - 104, X(0), L.y + 8); p.drawingContext.setLineDash([]);
      TK.label(p, C, 'espejo', X(0), L.y - 114, C.mute, 10, 60);
      // El aro donde debe quedar la punta.
      const tx = X(r.target);
      p.noFill(); p.stroke(C.ok); p.strokeWeight(2.5); p.circle(tx, L.y - 34, 26);
      TK.label(p, C, m(r.target), tx, L.y - 58, C.ok, 12, 40);
      // La flecha original (arriba, delgada): es la pieza que se repite.
      const arrowTo = (x0, x1, y, c, w, head = 8) => { if (Math.abs(x1 - x0) < 1) return; p.stroke(c); p.strokeWeight(w); p.line(x0, y, x1, y); const d = Math.sign(x1 - x0); p.noStroke(); p.fill(c); p.triangle(x1 + d * head * 0.6, y, x1 - d * head, y - head, x1 - d * head, y + head); };
      arrowTo(X(0), X(r.a), L.y - 86, r.a < 0 ? C.coral : C.sky, 3, 6);
      TK.label(p, C, `flecha: ${m(r.a)}`, X(r.a / 2) + (r.a < 0 ? -30 : 30), L.y - 98, C.mute, 11, 80);
      // Con multiplicador negativo: la cadena sin voltear queda punteada al otro lado.
      if (s.b < 0) {
        const gx = X(clampV(r.a * -s.b));
        p.stroke(C.mute); p.strokeWeight(3); p.drawingContext.setLineDash([3, 6]); p.line(X(0), L.y - 34, gx, L.y - 34); p.drawingContext.setLineDash([]);
        p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); const d = Math.sign(gx - X(0)); p.arc(X(0), L.y - 44, 44, 34, Math.PI, 2 * Math.PI);
        p.noStroke(); p.fill(C.mute); p.triangle(X(0) - d * 22, L.y - 40, X(0) - d * 27, L.y - 50, X(0) - d * 17, L.y - 50);
      }
      // La cadena: |b| copias de la flecha, de punta a cola. La punta se desliza y pasa por el 0 al voltearse.
      const shown = TK.glide(G, 'v' + G.cur, clampV(v), 7), hx = X(shown);
      arrowTo(X(0), hx, L.y - 34, col, 7, 10);
      for (let i = 1; i < Math.abs(s.b); i++) { const sx = X(r.a * i * Math.sign(s.b)); if (Math.abs(sx - X(0)) < Math.abs(hx - X(0)) - 4) { p.stroke(C.bg); p.strokeWeight(2.5); p.line(sx, L.y - 40, sx, L.y - 28); } }
      drawDot(p, C, X(0), L.y - 34, 10, C.cream);
      if (Math.abs(v) > R) TK.label(p, C, `${m(v)}: se sale de la recta`, G.W / 2, L.y + 40, C.bad, 12, 220);
      else TK.label(p, C, `${Math.abs(s.b)} ${Math.abs(s.b) === 1 ? 'copia' : 'copias'}${s.b < 0 ? ', volteadas' : ''}`, G.W / 2, L.y + 40, C.mute, 12, 220);
      // El deslizador del multiplicador: a la izquierda voltea, a la derecha no.
      const y = G.slY, bx = G.bx;
      p.strokeWeight(6); p.stroke(C.coral); p.line(bx(-B), y, bx(0), y); p.stroke(C.sky); p.line(bx(0), y, bx(B), y);
      for (let b = -B; b <= B; b++) { p.stroke(C.bg); p.strokeWeight(2); p.line(bx(b), y - 3, bx(b), y + 3); p.noStroke(); p.fill(b < 0 ? C.I : b ? C.Z : C.N); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.CENTER, p.CENTER); p.text(m(b), bx(b), y + 24); }
      TK.label(p, C, 'voltea', bx(-B / 2), y - 26, C.I, 11, 80); TK.label(p, C, 'no voltea', bx(B / 2), y - 26, C.Z, 11, 80);
      p.stroke(col); p.strokeWeight(3); p.fill(C.cream); p.circle(bx(s.b), y, 32);
      p.noStroke(); p.fill(inkOn(C.cream, C.ink)); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text(`×${par(s.b)}`, bx(s.b), y + 1);
    },
    press(G, x, y) { if (Math.abs(y - G.slY) > 30) return false; G.dragging = true; game.setB(G, x); return true; },
    drag(G, x) { if (!G.dragging) return false; game.setB(G, x); return true; },
    release(G) { G.dragging = false; },
    // La mano arrastra el multiplicador hacia el lado que voltea.
    demo: G => ({ from: { x: G.bx(G.s.b), y: G.slY }, to: { x: G.bx(G.s.b > -2 ? -3 : 3), y: G.slY }, text: 'Arrastra el multiplicador: mira la flecha', ty: G.L.y + 64 }),
    peek: G => ({ slY: G.slY, xOf: [...Array(2 * B + 1).keys()].map(i => G.bx(i - B)), need: G.r.target / G.r.a }),
  });
  // El multiplicador que corresponde al dedo; cambia de ronda → la recta toma el rango de esa ronda.
  game.setB = (G, x) => { const b = Math.max(-B, Math.min(B, Math.round((x - 30) / (G.W - 60) * 2 * B - B))); if (b !== G.s.b || !G.touched[G.cur]) { G.s.b = b; G.touch(); } };
  game.layoutOf = G => { const R = range(G.r); G.L.min = -R; G.L.max = R; G.X = v => G.L.x0 + (v + R) / (2 * R) * (G.L.x1 - G.L.x0); };
  return Object.assign(game, { range });
})();
