// Reparte los factores (Álgebra, exponentes racionales; lección alg-22a): el número se muestra como sus factores
// primos (64 = 2·2·2·2·2·2). El denominador del exponente dice en cuántos grupos iguales se reparten (eso es la raíz) y
// el numerador cuántos de esos grupos se toman (la potencia): 64^(2/3) = tres grupos de 2·2, se toman dos: 4 · 4 = 16.
// Si los factores no se pueden repartir parejo, el juego lo dice.
// params = { rounds: [{ n, num, den }] }   state = { rounds: [{ split, keep }] }     Spec 2026-11-15-torres-de-potencias.

GAMES['reparte-factores'] = (() => {
  function primes(n) { const out = []; for (let f = 2; n > 1; f++) while (n % f === 0) { out.push(f); n /= f; } return out; }
  // Un grupo, si los factores de n se reparten parejo en k grupos; si no, null.
  function groupOf(n, k) {
    const count = {}; primes(n).forEach(f => { count[f] = (count[f] || 0) + 1; });
    if (Object.values(count).some(c => c % k)) return null;
    return Object.entries(count).flatMap(([f, c]) => Array(c / k).fill(+f));
  }
  const prod = xs => xs.reduce((a, b) => a * b, 1);
  const valueOf = r => prod(groupOf(r.n, r.den)) ** r.num;

  const game = roundsGame({
    aspect: 1.2,
    init: () => ({ split: 1, keep: 1 }),
    ok: (s, r) => s.split === r.den && s.keep === r.num,
    solution: r => `${r.n}^(${r.num}/${r.den}) = ${prod(groupOf(r.n, r.den))}${sup(r.num)} = ${valueOf(r)}`,
    prompt: r => `Arma ${r.n} elevado a ${r.num}/${r.den}: reparte en grupos iguales y toma algunos`,
    foot: () => 'El de abajo reparte (raíz); el de arriba dice cuántos grupos tomar (potencia)',
    layout(G) { const w = (G.W - 36) / 2; G.box = [{ x: 12, y: G.H - 64, w, h: 32 }, { x: 24 + w, y: G.H - 64, w, h: 32 }]; },
    draw(G) {
      const { p, C, W, H, s, r } = G, g = groupOf(r.n, s.split), top = 104;
      p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.textSize(13);
      p.text(`${r.n} = ${primes(r.n).join(' · ')}`, W / 2, top);
      if (!g) {
        const fs = primes(r.n), step = Math.min(34, (W - 30) / fs.length);
        fs.forEach((f, i) => drawTile(p, C, { x: W / 2 - (fs.length * step) / 2 + i * step + 2, y: top + 44, w: step - 4, h: 30 }, f, { fill: C.card, ink: C.mute, size: 15, r: 7, lift: 0 }));
        p.noStroke(); p.fill(C.bad); p.textSize(13); p.text(`No se pueden repartir parejo en ${s.split} grupos`, W / 2, top + 100);
      } else {
        const gw = Math.max(34, g.length * 30 + 8), per = Math.max(1, Math.floor((W - 16) / (gw + 6)));
        for (let k = 0; k < s.split; k++) {
          const row = Math.floor(k / per), inRow = Math.min(per, s.split - row * per), gx = W / 2 - (inRow * (gw + 6) - 6) / 2 + (k % per) * (gw + 6), gy = top + 22 + row * 48, on = k < s.keep;
          p.noFill(); p.stroke(on ? C.sun : C.line); p.strokeWeight(on ? 3 : 1.5); p.rect(gx, gy, gw, 40, 10);
          g.forEach((f, i) => drawTile(p, C, { x: gx + (gw - g.length * 30) / 2 + i * 30 + 2, y: gy + 6, w: 26, h: 25 }, f, { fill: on ? C.mint : C.card, ink: on ? undefined : C.mute, size: 14, r: 7, lift: on ? 2 : 0 }));
        }
        const rows = Math.ceil(s.split / per), one = prod(g), y = top + 22 + rows * 48 + 16;
        p.noStroke(); p.fill(C.mute); p.textSize(12); p.text(s.split === 1 ? 'sin repartir: un solo grupo' : `cada grupo vale ${one}: es la raíz ${{ 2: 'cuadrada', 3: 'cúbica', 4: 'cuarta', 5: 'quinta', 6: 'sexta' }[s.split]} de ${r.n}`, W / 2, y);
        const good = G.locked && s.split === r.den && s.keep === r.num;
        p.fill(good ? C.ok : C.ink); p.textSize(17); p.text(`${r.n}^(${s.keep}/${s.split}) = ${one}${s.keep > 1 ? sup(s.keep) : ''} = ${one ** s.keep}`, W / 2, y + 26);
      }
      drawStepper(p, C, G.box[0], s.split, 'grupos iguales (índice)');
      drawStepper(p, C, G.box[1], s.keep, 'grupos que tomo (potencia)');
    },
    press(G, x, y) {
      const a = stepHit(G.box[0], x, y), b = stepHit(G.box[1], x, y);
      if (!a && !b) return false;
      G.s.split = Math.max(1, Math.min(6, G.s.split + a)); G.s.keep = Math.max(1, Math.min(G.s.split, G.s.keep + b)); G.touch();
      return true;
    },
    peek: G => ({ box: G.box }),
  });
  return { ...game, primes, groupOf, valueOf };
})();
