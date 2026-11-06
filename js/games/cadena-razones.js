// Cadena de razones (lección 1.2): la regla de tres compuesta como producto de razones. Cada
// tarjeta muestra una fracción que se voltea al tocarla (9/7 ⇄ 7/9); el resultado se calcula en
// vivo con un medidor «sube/baja» respecto al valor conocido.
// params = { base, unit, factors: [{ label, a, b, inverse }], answer }   state = { flipped: boolean[] }
// Una tarjeta sin voltear muestra a/b; la orientación correcta es a/b si la magnitud es inversa
// (la razón va «al revés» del cambio) y b/a si es directa.

GAMES['cadena-razones'] = (() => {
  const shownFrac = (f, flipped) => (flipped ? [f.b, f.a] : [f.a, f.b]);
  const result = (params, flipped) => params.factors.reduce((v, f, i) => { const [n, d] = shownFrac(f, flipped[i]); return (v * n) / d; }, params.base);
  const correct = f => !f.inverse;   // flipped debe ser true solo en las magnitudes directas

  function grade(state, params) {
    const ok = params.factors.every((f, i) => state.flipped[i] === correct(f));
    const chain = params.factors.map(f => { const [n, d] = shownFrac(f, correct(f)); return `\\tfrac{${n}}{${d}}`; }).join(' \\cdot ');
    return { ok, solution: `$x = ${params.base} \\cdot ${chain} = ${params.answer}$ ${params.unit}` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { flipped: params.factors.map(() => false) };
    let locked = false, W = 0, H = 0, cards = [], anim = params.factors.map(() => 0);

    function layout(w, h) {
      W = w; H = h;
      const n = params.factors.length, cw = 62, gap = 34, total = 92 + n * cw + (n - 1) * gap;
      const x0 = (w - total) / 2 + 92;
      cards = params.factors.map((_, i) => ({ x: x0 + i * (cw + gap), y: h * 0.42, w: cw, h: 70 }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); api.ready(true); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const x = result(params, st.flipped), good = params.factors.every((f, i) => st.flipped[i] === correct(f));
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(12);
        p.text('Regla de tres compuesta', W / 2, 8);
        p.fill(C.ink); p.textSize(13);
        [`9 hombres hacen una obra en ${params.base} ${params.unit} a 6 h/día.`, '¿Cuántos días tardan 7 hombres a 8 h/día?'].forEach((ln, i) => p.text(ln, W / 2, 26 + i * 17));
        p.fill(C.N); p.textSize(12); p.text('Toca una tarjeta para voltear su razón', W / 2, 66);
        // Cadena: x = base × [a/b] × [a/b] = resultado
        const cy = cards[0].y + cards[0].h / 2;
        p.fill(C.ink); p.textSize(20); p.textAlign(p.RIGHT, p.CENTER); p.text(`x = ${params.base} ×`, cards[0].x - 8, cy);
        cards.forEach((c, i) => {
          const f = params.factors[i];
          anim[i] = Math.max(0, anim[i] - 0.1);
          const sx = Math.abs(1 - 2 * anim[i]);           // volteo: se estrecha y se vuelve a abrir
          const [n, d] = shownFrac(f, anim[i] > 0.5 ? !st.flipped[i] : st.flipped[i]);
          const col = locked ? (st.flipped[i] === correct(f) ? C.ok : C.bad) : C.brand;
          p.push(); p.translate(c.x + c.w / 2, cy); p.scale(sx, 1);
          p.stroke(col); p.strokeWeight(2.5); p.fill(C.card); p.rect(-c.w / 2, -c.h / 2, c.w, c.h, 12);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(20);
          p.text(n, 0, -16); p.text(d, 0, 18);
          p.stroke(C.ink); p.strokeWeight(2); p.line(-16, 0, 16, 0);
          p.pop();
          if (i < cards.length - 1) { p.noStroke(); p.fill(C.ink); p.textSize(20); p.textAlign(p.CENTER, p.CENTER); p.text('×', c.x + c.w + 17, cy); }
          p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.TOP); p.text(f.label, c.x + c.w / 2, c.y + c.h + 6);
          if (locked) { p.fill(st.flipped[i] === correct(f) ? C.ok : C.bad); p.textSize(10); p.text(f.inverse ? 'inversa: al revés' : 'directa: igual', c.x + c.w / 2, c.y + c.h + 20); }
        });
        // Resultado y medidor sube/baja.
        const rcol = locked ? (good ? C.ok : C.bad) : C.ink;
        p.noStroke(); p.fill(rcol); p.textAlign(p.CENTER, p.CENTER); p.textSize(26);
        p.text(`= ${Number.isInteger(x) ? x : x.toFixed(1)} ${params.unit}`, W / 2, H * 0.72);
        const up = x > params.base, same = Math.abs(x - params.base) < 1e-9;
        p.fill(same ? C.mute : up ? C.ok : C.I); p.textSize(14);
        p.text(same ? `= igual que ${params.base}` : `${up ? '▲ sube' : '▼ baja'} respecto a ${params.base} ${params.unit}`, W / 2, H * 0.82);
        if (locked && !good) { p.fill(C.bad); p.textSize(13); p.text(`Debía dar ${params.answer} ${params.unit}`, W / 2, H * 0.92); }
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = cards.findIndex(c => inside(c, p.mouseX, p.mouseY));
        if (i < 0) return;
        st.flipped[i] = !st.flipped[i]; anim[i] = 1; api.sfx?.tap?.();
        return false;
      };
    }, 1.15);

    return {
      loaded: m.ready,
      getState: () => ({ flipped: [...st.flipped] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
