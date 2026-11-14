// Salta el punto (Álgebra, notación científica; lección alg-21b): los dígitos de un número con su punto decimal y,
// al lado, una potencia de 10. Con ◀ y ▶ se corre el punto un lugar: el número de adelante se hace diez veces más
// chico o más grande y el exponente de 10 lo compensa, así que el valor no cambia. Meta 'sci': dejar un solo dígito
// (no cero) antes del punto. Meta 'std': dejar 10⁰, o sea, escribir el número completo.
// params = { rounds: [{ digits, point, exp?, goal: 'sci' | 'std' }] }   digits: cadena; point: cuántos dígitos van antes del punto
// state = { rounds: [{ pt }] }      Spec 2026-11-15-torres-de-potencias.

GAMES['salta-la-coma'] = (() => {
  const expAt = (r, pt) => (r.exp ?? 0) + r.point - pt;
  const first = r => r.digits.search(/[1-9]/);
  // Dónde debe quedar el punto.
  const goalPt = r => (r.goal === 'sci' ? first(r) + 1 : r.point + (r.exp ?? 0));
  // El número de adelante, sin ceros de sobra: «003.840» → «3.84».
  function coefTxt(r, pt) {
    const a = r.digits.slice(0, pt).replace(/^0+(?=\d)/, '') || '0', b = r.digits.slice(pt).replace(/0+$/, '');
    return b ? `${a}.${b}` : a;
  }
  const numTxtOf = (r, pt) => `${coefTxt(r, pt)} × 10${sup(expAt(r, pt))}`;

  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ pt: r.point }),
    ok: (s, r) => s.pt === goalPt(r),
    solution: r => `${numTxtOf(r, r.point)} = ${r.goal === 'sci' ? numTxtOf(r, goalPt(r)) : coefTxt(r, goalPt(r))}`,
    prompt: r => (r.goal === 'sci' ? 'Corre el punto hasta dejar un solo dígito, que no sea cero, antes de él' : 'Corre el punto hasta que la potencia de 10 sea 10⁰: el número completo'),
    foot: (r, s) => `Cada salto cambia el exponente en 1 · saltos: ${Math.abs(s.pt - r.point)}`,
    layout(G) { G.btn = [{ x: G.W / 2 - 96, y: G.H - 76, w: 88, h: 38, d: -1 }, { x: G.W / 2 + 8, y: G.H - 76, w: 88, h: 38, d: 1 }]; },
    draw(G) {
      const { p, C, W, H, s, r } = G, n = r.digits.length, cw = Math.min(34, (W - 30) / n), x0 = W / 2 - (n * cw) / 2, y = 128;
      const a0 = Math.max(0, Math.min(s.pt - 1, first(r))), b1 = Math.max(s.pt, r.digits.replace(/0+$/, '').length);   // lo que de verdad se lee
      for (let i = 0; i < n; i++) {
        const live = i >= a0 && i < b1;
        drawTile(p, C, { x: x0 + i * cw + 2, y, w: cw - 4, h: 44 }, r.digits[i], { fill: live ? C.cream : C.card, ink: live ? undefined : C.mute, size: 22, r: 8, lift: live ? 3 : 0 });
      }
      const px = x0 + s.pt * cw;
      p.noStroke(); p.fill(C.coral); p.circle(px, y + 50, 13);
      if (s.pt !== r.point) {   // el camino del punto, salto a salto
        const dir = Math.sign(s.pt - r.point);
        p.noFill(); p.stroke(C.coral); p.strokeWeight(2);
        for (let k = r.point; k !== s.pt; k += dir) p.arc(x0 + (k + dir / 2) * cw, y + 58, cw, 20, 0, Math.PI);
      }
      const good = s.pt === goalPt(r);
      p.noStroke(); p.fill(good ? C.ok : C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.textSize(24);
      fitText(p, numTxtOf(r, s.pt), W / 2, y + 108, W - 30, 24);
      p.fill(C.mute); p.textSize(12);
      p.text(r.goal === 'sci' ? 'entre 1 y 10, por una potencia de 10' : 'el mismo número, escrito de otra forma', W / 2, y + 128);
      G.btn.forEach(b => drawTile(p, C, b, b.d < 0 ? '◀ punto' : 'punto ▶', { fill: C.cream, size: 14, r: 10, lift: 2 }));
    },
    press(G, x, y) {
      const b = G.btn.find(q => hitBox(q, x, y));
      if (!b) return false;
      G.s.pt = Math.max(1, Math.min(G.r.digits.length, G.s.pt + b.d)); G.touch();
      return true;
    },
    peek: G => ({ btn: G.btn, goal: goalPt(G.r) }),
  });
  return { ...game, expAt, goalPt, coefTxt, numTxtOf };
})();
