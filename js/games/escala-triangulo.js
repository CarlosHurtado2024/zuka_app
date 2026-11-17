// Escala el triángulo (Trigonometría, trig-4): el triángulo de lados cos θ, sen θ y 1 se divide entero entre cos θ o entre sen θ. Sale
// otro triángulo semejante con lados 1, tan θ, sec θ o cot θ, 1, csc θ: de ahí las otras identidades pitagóricas.
// item = { want: 'tan'|'sec'|'cot'|'csc' }
GAMES['escala-triangulo'] = (() => {
  const LAB = { cos: ['1', 'tan', 'sec'], sen: ['cot', '1', 'csc'] }, ID = { cos: '1 + \\tan^2\\theta = \\sec^2\\theta', sen: '\\cot^2\\theta + 1 = \\csc^2\\theta' };
  const divOf = w => (LAB.cos.includes(w) ? 'cos' : 'sen'), tex = n => (n === '1' ? '1' : `${TK.FN[n]}\\theta`), TH = 35;
  return questGame({
    aspect: 1.3,
    init: () => ({ div: null, pick: null }),
    ok: (s, it) => !!s.div && LAB[s.div][s.pick] === it.want,
    answer: it => ({ div: divOf(it.want), pick: LAB[divOf(it.want)].indexOf(it.want) }),
    solution: it => `$${tex(it.want)}$: dividir entre $${tex(divOf(it.want))}$; $${ID[divOf(it.want)]}$`,
    prompt: it => `Divide el triángulo y toca el lado que queda valiendo $${tex(it.want)}$`,
    foot: (it, s) => (s.div ? `Todo se dividió entre $${tex(s.div)}$: misma forma, más grande` : 'Los lados miden $\\cos\\theta$, $\\operatorname{sen}\\theta$ y 1 (la hipotenusa)'),
    no: () => 'Ese es otro lado: piensa qué da dividir cada uno',
    retry: G => { G.s.pick = null; },
    layout(G) {
      G.btn = TK.row(G, 3);
      const h = Math.min(G.btn[0].y - G.top - 86, 150), w = Math.min(G.W - 150, h / Math.tan(TK.rad(TH))), hh = w * Math.tan(TK.rad(TH)), x0 = (G.W - w) / 2, yb = G.btn[0].y - 34;
      G.A = [x0, yb]; G.B = [x0 + w, yb]; G.T = [x0 + w, yb - hh]; G.seg = [[G.A, G.B], [G.B, G.T], [G.A, G.T]];
    },
    draw(G) {
      const { p, C, s, item: it, A, B, T, seg } = G, cen = [(A[0] + B[0] + T[0]) / 3, (A[1] + B[1] + T[1]) / 3];
      TK.label(p, C, G.solved ? `$${ID[s.div]}$` : `¿Cuál lado vale $${tex(it.want)}$?`, G.W / 2, G.top + 22, G.solved ? C.ok : C.ink, 18, G.W - 30);
      p.noStroke(); p.fill(C.card); p.triangle(...A, ...B, ...T);
      if (s.div) {   // el triángulo de antes, más pequeño
        const k = s.div === 'cos' ? Math.cos(TK.rad(TH)) : Math.sin(TK.rad(TH)), q = pt => [A[0] + (pt[0] - A[0]) * k, A[1] + (pt[1] - A[1]) * k];
        p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 4]); p.triangle(...A, ...q(B), ...q(T)); p.drawingContext.setLineDash([]);
      }
      const lab = i => (!s.div ? ['\\cos\\theta', '\\operatorname{sen}\\theta', '1'][i] : LAB[s.div][i] === '1' ? '1' : G.solved ? tex(LAB[s.div][i]) : '?');
      seg.forEach(([a, b], i) => { const on = s.pick === i, col = on ? (G.solved ? C.ok : C.coral) : C.ink; p.stroke(col); p.strokeWeight(on ? 6 : 3); p.line(...a, ...b); TK.sideLabel(p, C, `$${lab(i)}$`, a, b, cen, col, 15); });
      p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.rect(B[0] - 11, B[1] - 11, 11, 11); TK.label(p, C, 'θ', A[0] + 30, A[1] - 9, C.N, 15, 30);
      drawBtn(p, C, G.btn[0], '÷ $\\cos\\theta$', s.div === 'cos', s.div === 'cos' ? C.mint : C.cream); drawBtn(p, C, G.btn[1], '÷ $\\operatorname{sen}\\theta$', s.div === 'sen', s.div === 'sen' ? C.mint : C.cream); drawBtn(p, C, G.btn[2], '↶ volver', false, C.sky);
    },
    press(G, x, y) {
      const s = G.s, it = G.item, b = G.btn.findIndex(q => hitBox(q, x, y));
      if (b >= 0) { s.div = [`cos`, `sen`, null][b]; s.pick = null; G.api.sfx?.tap?.(); return true; }
      const i = TK.hitSeg(G.seg, x, y);
      if (i < 0) return false;
      if (!s.div) { G.a.say('Primero divide todos los lados entre cos θ o entre sen θ', G.C.N); return true; }
      if (LAB[s.div][i] === '1') { G.a.say('Ese lado quedó valiendo 1', G.C.N); return true; }
      s.pick = i;
      if (LAB[s.div].includes(it.want)) G.submit(); else G.bad('En este triángulo no aparece ese lado: divide entre la otra');
      return true;
    },
    peek: G => { const d = divOf(G.item.want); return { solve: [...(G.s.div === d ? [] : [G.btn[d === 'cos' ? 0 : 1]]), TK.mid(...G.seg[LAB[d].indexOf(G.item.want)])] }; },
  });
})();
// Juego con `questGame` y las ayudas `TK` del kit (spec 2026-11-22-trigonometria-juegos).   params = { rounds: [{ title, items }], lives? }   state = { done: [n] }
