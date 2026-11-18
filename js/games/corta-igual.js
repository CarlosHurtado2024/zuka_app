// Corta igual (Preuniversitario UdeA, pu-cm-2; spec 2026-11-18-preuda-mundo-1): por qué hace falta un denominador
// común. Dos barras del mismo largo muestran a/b y c/d con pedazos de distinto tamaño: así no se pueden juntar. Un
// deslizador recorta las dos barras en n pedacitos iguales; si n no es múltiplo de los dos denominadores, los cortes
// nuevos no caen sobre los viejos (se ven en rojo). Cuando encajan en las dos, la tercera barra junta (o quita) los
// pedacitos y el juego escribe la cuenta: «1/2 + 1/3 = 3/6 + 2/6 = 5/6». Vale cualquier denominador común.
// params = { rounds: [{ a: [num, den], b: [num, den], op?: '+' | '-' }] }   state = { rounds: [{ n }] }
GAMES['corta-igual'] = (() => {
  const MAXN = 24, U = 1.5;   // la barra de la suma puede pasar de 1: caben hasta 1.5 unidades
  const fits = (r, n) => n % r.a[1] === 0 && n % r.b[1] === 0;
  const lcm = (a, b) => { let n = Math.max(a, b); while (n % a || n % b) n++; return n; };
  const sign = r => (r.op === '-' ? -1 : 1);
  const pieces = (r, n) => [r.a[0] * n / r.a[1], r.b[0] * n / r.b[1]];
  const text = (r, n) => { const [x, y] = pieces(r, n); return `${r.a[0]}/${r.a[1]} ${r.op === '-' ? '−' : '+'} ${r.b[0]}/${r.b[1]} = ${x}/${n} ${r.op === '-' ? '−' : '+'} ${y}/${n} = ${x + sign(r) * y}/${n}`; };
  const game = roundsGame({
    aspect: 1.36,
    init: () => ({ n: 1 }),
    ok: (s, r) => s.n > 1 && fits(r, s.n),
    solution: r => text(r, lcm(r.a[1], r.b[1])),
    prompt: r => `Recorta las dos barras en pedacitos iguales para ${r.op === '-' ? 'restar' : 'sumar'}`,
    foot: (r, s) => (s.n === 1 ? 'Los pedazos son de distinto tamaño: así no se pueden juntar' : fits(r, s.n) ? (s.n === lcm(r.a[1], r.b[1]) ? 'Encajan en las dos: es el denominador común más pequeño' : `Encajan; también sirve ${lcm(r.a[1], r.b[1])}, que es más pequeño`) : 'Los cortes nuevos no caen sobre los viejos'),
    layout(G) { G.x0 = 20; G.uw = (G.W - 40) / U; G.slY = G.H - 62; G.px = n => 26 + (n - 1) / (MAXN - 1) * (G.W - 52); },
    enter(G) { G.dragging = false; },
    draw(G) {
      const { p, C, r, s, x0, uw } = G, ok = fits(r, s.n), n = s.n;
      TK.label(p, C, ok && n > 1 ? text(r, n) : `${r.a[0]}/${r.a[1]} ${r.op === '-' ? '−' : '+'} ${r.b[0]}/${r.b[1]}`, G.W / 2, 108, G.locked ? (ok ? C.ok : C.bad) : ok && n > 1 ? C.ok : C.ink, 17, G.W - 20);
      const bar = (y, fr, col, lab) => {
        p.noStroke(); p.fill(col); p.rect(x0, y, uw * fr[0] / fr[1], 34, 5);
        p.noFill(); p.stroke(C.ink); p.strokeWeight(2); p.rect(x0, y, uw, 34, 5);
        for (let k = 1; k < fr[1]; k++) p.line(x0 + uw * k / fr[1], y, x0 + uw * k / fr[1], y + 34);
        // Los cortes nuevos: finos; en rojo los que no caen sobre un corte viejo cuando no encaja.
        if (n > 1) for (let k = 1; k < n; k++) { const old = (k * fr[1]) % n === 0; if (old) continue; p.stroke(n % fr[1] ? C.bad : C.bg); p.strokeWeight(1.5); p.line(x0 + uw * k / n, y + 2, x0 + uw * k / n, y + 32); }
        TK.label(p, C, lab, x0 + uw + 26, y + 17, n > 1 && n % fr[1] ? C.bad : C.mute, 13, 60);
      };
      bar(138, r.a, C.sky, n > 1 && n % r.a[1] === 0 ? `${r.a[0] * n / r.a[1]}/${n}` : `${r.a[0]}/${r.a[1]}`);
      bar(186, r.b, C.coral, n > 1 && n % r.b[1] === 0 ? `${r.b[0] * n / r.b[1]}/${n}` : `${r.b[0]}/${r.b[1]}`);
      // La barra del resultado: aparece cuando los pedacitos son del mismo tamaño.
      const y = 248;
      p.noFill(); p.stroke(C.line); p.strokeWeight(2); p.rect(x0, y, uw, 34, 5);
      if (ok && n > 1) {
        const [a, b] = pieces(r, n), w = uw / n, tot = a + sign(r) * b;
        for (let k = 0; k < (r.op === '-' ? a : a + b); k++) { const gone = r.op === '-' && k >= tot; p.stroke(C.bg); p.strokeWeight(1.5); p.fill(gone ? C.line : k < a ? C.sky : C.coral); p.rect(x0 + k * w, y, w, 34, 3); if (gone) { p.stroke(C.bad); p.strokeWeight(2); p.line(x0 + k * w + 3, y + 4, x0 + (k + 1) * w - 3, y + 30); } }
        TK.label(p, C, `${tot}/${n}`, x0 + uw + 26, y + 17, C.ok, 14, 60);
      } else TK.label(p, C, 'todavía no se pueden juntar', x0 + uw / 2, y + 17, C.mute, 12, uw - 10);
      // Deslizador: en cuántos pedacitos se recorta cada barra.
      const sy = G.slY;
      p.stroke(C.line); p.strokeWeight(6); p.line(G.px(1), sy, G.px(MAXN), sy);
      for (let k = 1; k <= MAXN; k++) { p.stroke(C.bg); p.strokeWeight(1.5); p.line(G.px(k), sy - 3, G.px(k), sy + 3); if (k === 1 || k % 2 === 0) { p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(9); p.textAlign(p.CENTER, p.CENTER); p.text(k, G.px(k), sy + 24); } }
      TK.label(p, C, 'pedacitos por barra', G.W / 2, sy - 26, C.mute, 11, 200);
      p.stroke(n === 1 ? C.mute : ok ? C.ok : C.bad); p.strokeWeight(3); p.fill(C.cream); p.circle(G.px(n), sy, 30);
      p.noStroke(); p.fill(inkOn(C.cream, C.ink)); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text(n, G.px(n), sy + 1);
    },
    press(G, x, y) { if (Math.abs(y - G.slY) > 30) return false; G.dragging = true; game.setN(G, x); return true; },
    drag(G, x) { if (!G.dragging) return false; game.setN(G, x); return true; },
    release(G) { G.dragging = false; },
    demo: G => ({ from: { x: G.px(G.s.n), y: G.slY }, to: { x: G.px(G.s.n < 8 ? 10 : 4), y: G.slY }, text: 'Arrastra: recorta las barras en pedacitos', ty: G.slY - 50 }),
    peek: G => ({ slY: G.slY, px: [...Array(MAXN).keys()].map(i => G.px(i + 1)) }),
  });
  game.setN = (G, x) => { const n = Math.max(1, Math.min(MAXN, Math.round(1 + (x - 26) / (G.W - 52) * (MAXN - 1)))); if (n !== G.s.n || !G.touched[G.cur]) { G.s.n = n; G.touch(); } };
  return Object.assign(game, { fits, lcm, text });
})();
