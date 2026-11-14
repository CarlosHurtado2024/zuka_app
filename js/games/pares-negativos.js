// Parejas de negativos (Álgebra, potencias; lección alg-21a): una potencia se escribe como sus factores. Con
// paréntesis, (−2)⁴ son cuatro factores −2; sin paréntesis, −2⁴ es un solo −1 por cuatro doses. Se tocan dos factores
// negativos para emparejarlos (cada pareja da positivo) y al final se elige el signo: si queda un negativo suelto, el
// resultado es negativo. El juego escribe el valor.
// params = { rounds: [{ base, n, paren, outer }] }     paren: el signo va dentro del paréntesis; outer: hay un − afuera
// state = { rounds: [{ pairs: [[i, j]], sign: 0 | 1 | −1, pick: −1 }] }      Spec 2026-11-15-torres-de-potencias.

GAMES['pares-negativos'] = (() => {
  const negsOf = r => (r.paren ? r.n : 0) + (r.outer ? 1 : 0);
  const signOf = r => (negsOf(r) % 2 ? -1 : 1);
  const exprOf = r => `${r.outer ? '−' : ''}${r.paren ? `(−${r.base})` : r.base}${sup(r.n)}`;
  const valueOf = r => signOf(r) * r.base ** r.n;
  // Las fichas: el −1 de afuera (si lo hay) y luego los n factores.
  const tilesOf = r => [...(r.outer ? [{ txt: '−1', neg: true }] : []), ...Array.from({ length: r.n }, () => ({ txt: r.paren ? `−${r.base}` : `${r.base}`, neg: !!r.paren }))];

  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ pairs: [], sign: 0, pick: -1 }),
    ok: (s, r) => s.sign === signOf(r) && s.pairs.length === Math.floor(negsOf(r) / 2),
    answered: s => s.sign !== 0,
    solution: r => { const n = negsOf(r), k = Math.floor(n / 2); return `${exprOf(r)} = ${negTxt(valueOf(r))} (${k ? `${k} ${k === 1 ? 'pareja' : 'parejas'} de negativos${n % 2 ? ' y uno suelto' : ''}` : 'un solo negativo, sin pareja'})`; },
    prompt: r => `${exprOf(r)}: empareja los factores negativos y elige el signo`,
    foot: (r, s) => (s.sign ? 'Revisa que no queden dos negativos sin emparejar' : 'Toca dos fichas negativas: juntas dan positivo'),
    layout(G) { G.btn = [{ x: G.W / 2 - 96, y: G.H - 74, w: 88, h: 36, sign: 1 }, { x: G.W / 2 + 8, y: G.H - 74, w: 88, h: 36, sign: -1 }]; },
    draw(G) {
      const { p, C, W, H, s, r } = G, tiles = tilesOf(r), tw = Math.min(50, (W - 24) / tiles.length - 6), x0 = W / 2 - (tiles.length * (tw + 6) - 6) / 2, y = 166;
      G.boxes = tiles.map((_, i) => ({ x: x0 + i * (tw + 6), y, w: tw, h: 42 }));
      const paired = i => s.pairs.some(q => q.includes(i));
      p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
      p.text(tiles.map(t => (t.neg && t.txt !== '−1' ? `(${t.txt})` : t.txt)).join(' · '), W / 2, 100);
      s.pairs.forEach(([i, j]) => {   // el arco que une cada pareja
        const a = G.boxes[i], b = G.boxes[j], xa = a.x + a.w / 2, xb = b.x + b.w / 2;
        p.noFill(); p.stroke(C.ok); p.strokeWeight(3); p.arc((xa + xb) / 2, y, Math.abs(xb - xa), 34 + Math.abs(j - i) * 6, Math.PI, 0);
        p.noStroke(); p.fill(C.ok); p.textSize(15); p.text('+', (xa + xb) / 2, y - 26 - Math.abs(j - i) * 3);
      });
      tiles.forEach((t, i) => drawTile(p, C, G.boxes[i], t.txt, { fill: !t.neg ? C.cream : paired(i) ? C.mint : C.coral, size: 16, ring: s.pick === i ? C.sun : null }));
      const loose = tiles.filter((t, i) => t.neg && !paired(i)).length;
      p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER);
      p.text(`negativos sueltos: ${loose}`, W / 2, y + 66);
      p.fill(C.mute); p.textSize(12); p.text('El signo del resultado es', W / 2, H - 90);
      G.btn.forEach(b => drawTile(p, C, b, b.sign > 0 ? '+ positivo' : '− negativo', { fill: s.sign === b.sign ? C.sun : C.cream, size: 14, r: 10, lift: 2 }));
      if (s.sign) { p.noStroke(); p.fill(C.ink); p.textSize(18); p.text(`${exprOf(r)} = ${s.sign < 0 ? '−' : ''}${r.base ** r.n}`, W / 2, y + 96); }
    },
    press(G, x, y) {
      const { s, r } = G, tiles = tilesOf(r), b = G.btn.find(q => hitBox(q, x, y));
      if (b) { s.sign = b.sign; G.touch(); return true; }
      const i = (G.boxes || []).findIndex(q => hitBox(q, x, y));
      if (i < 0 || !tiles[i].neg) return i >= 0;
      const k = s.pairs.findIndex(q => q.includes(i));
      if (k >= 0) { s.pairs.splice(k, 1); s.pick = -1; }           // tocar una emparejada la suelta
      else if (s.pick < 0 || s.pick === i) s.pick = s.pick === i ? -1 : i;
      else { s.pairs.push([Math.min(s.pick, i), Math.max(s.pick, i)]); s.pick = -1; }
      G.api.sfx?.tap?.();
      return true;
    },
    peek: G => ({ boxes: G.boxes, btn: G.btn, negs: tilesOf(G.r).map(t => t.neg), sign: signOf(G.r) }),
  });
  return { ...game, negsOf, signOf, exprOf, valueOf };
})();
