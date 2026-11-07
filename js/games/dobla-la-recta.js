// Dobla la recta (lección 1.2, valor absoluto): el número de adentro de las barras ya está en la
// recta; hay que poner dónde cae su valor absoluto. Las barras doblan la recta por el cero como un
// espejo: lo que está a la derecha se queda y lo de la izquierda pasa al otro lado, a la misma
// distancia. Al poner la respuesta se dibujan las dos distancias al cero y el arco del doblez.
// params = { min, max, tol, points: [{ label, insideLabel, inside, tex, sol }] }   state = { answers: [número | null] }

GAMES['dobla-la-recta'] = (() => {
  const fmt = v => (Math.abs(v) < 0.005 ? '0' : v.toFixed(2)).replace('-', '−');

  function grade(state, params) {
    const ok = params.points.every((pt, i) => state.answers[i] != null && Math.abs(state.answers[i] - Math.abs(pt.inside)) <= params.tol);
    return { ok, solution: params.points.map(pt => `$${pt.tex} = ${pt.sol}$`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, pts = params.points;
    const st = { answers: pts.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], map = null, lineY = 0, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = pts.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      lineY = h * 0.48;
      map = lineMap(params.min, params.max, 24, w - 24);
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.answers.every(a => a !== null));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const pt = pts[cur], v = pt.inside, a = st.answers[cur], want = Math.abs(v), good = a !== null && Math.abs(a - want) <= params.tol;
        tabs.forEach((t, i) => {
          const ai = st.answers[i], ok = ai !== null && Math.abs(ai - Math.abs(pts[i].inside)) <= params.tol;
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : ai !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(28); p.textAlign(p.CENTER, p.CENTER); p.text(pt.label, W / 2, 66);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.text('Toca la recta donde queda el valor absoluto', 12, 92, W - 24, 20);

        // La recta, con el espejo en el cero.
        const x0 = map.toPx(0);
        p.stroke(C.mute); p.strokeWeight(2); p.line(map.toPx(params.min), lineY, map.toPx(params.max), lineY);
        for (let k = params.min * 2; k <= params.max * 2; k++) {
          const x = map.toPx(k / 2), whole = k % 2 === 0;
          p.stroke(C.mute); p.strokeWeight(whole ? 2 : 1); p.line(x, lineY - (whole ? 7 : 4), x, lineY + (whole ? 7 : 4));
          if (whole) { p.noStroke(); p.fill(C.mute); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP); p.text(String(k / 2).replace('-', '−'), x, lineY + 12); }
        }
        p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 5]); p.line(x0, lineY - 58, x0, lineY + 8); p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.CENTER, p.BOTTOM); p.text('espejo', x0, lineY - 60);
        const cx = x => Math.max(64, Math.min(W - 64, x));   // rótulos sin salirse del lienzo

        // El número de adentro de las barras: punto en la recta y su rótulo debajo.
        const xv = map.toPx(v), vcol = v < 0 ? C.I : C.Z;
        p.noStroke(); p.fill(vcol); p.circle(xv, lineY, 14);
        p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.TOP); p.text(`${pt.insideLabel} ≈ ${fmt(v)}`, cx(xv), lineY + 30);
        p.stroke(vcol); p.strokeWeight(5); p.line(x0, lineY + 58, xv, lineY + 58);
        p.noStroke(); p.textStyle(p.NORMAL); p.textSize(10); p.text(`distancia al 0: ${fmt(Math.abs(v))}`, cx((x0 + xv) / 2), lineY + 64);

        // La respuesta: la marca y su rótulo arriba, el doblez (arco) y su distancia al cero.
        if (a !== null) {
          const xa = map.toPx(a), col = locked ? (good ? C.ok : C.bad) : C.brand;
          if (Math.abs(xa - xv) > 2) {
            p.noFill(); p.stroke(col + 'AA'); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]);
            p.arc((xa + xv) / 2, lineY, Math.abs(xa - xv), Math.min(80, Math.abs(xa - xv) * 0.8), Math.PI, 2 * Math.PI);
            p.drawingContext.setLineDash([]);
          }
          p.noStroke(); p.fill(col); p.triangle(xa - 9, lineY - 22, xa + 9, lineY - 22, xa, lineY - 4);
          const lab = `${pt.label} = ${fmt(a)}`;
          p.textStyle(p.BOLD); p.textSize(13); const lw = p.textWidth(lab) + 10;
          p.fill(C.bg); p.rect(cx(xa) - lw / 2, lineY - 44, lw, 18, 4);   // fondo: tapa la línea del espejo
          p.fill(col); p.textAlign(p.CENTER, p.BOTTOM); p.text(lab, cx(xa), lineY - 26);
          p.stroke(col); p.strokeWeight(5); p.line(x0, lineY + 86, xa, lineY + 86);
          p.noStroke(); p.textStyle(p.NORMAL); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text(`distancia al 0: ${fmt(Math.abs(a))}`, cx((x0 + xa) / 2), lineY + 92);
        }
        if (locked && !good) {
          p.noStroke(); p.fill(C.ok); p.circle(map.toPx(want), lineY, 12);
          p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.TOP); p.text(`era ${fmt(want)}`, cx(map.toPx(want)), lineY + 110);
        }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        const pend = st.answers.findIndex((x, i) => x === null && i !== cur);
        p.text(locked ? (grade(st, params).ok ? '¡Bien doblado! El valor absoluto nunca es negativo' : 'El lugar correcto está en verde') : a !== null && pend >= 0 ? `Toca la pestaña ${pend + 1} para el siguiente` : 'Puedes arrastrar la marca para ajustarla', 12, H - 12, W - 24, 16);
      };

      const place = () => { st.answers[cur] = Math.round(Math.max(params.min, Math.min(params.max, map.toVal(p.mouseX))) * 100) / 100; ready(); };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked || Math.abs(p.mouseY - lineY) > 60) return;
        drag = true; place(); api.sfx?.tap?.(); return false;
      };
      p.mouseDragged = () => { if (!drag) return; place(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; return false; };
    }, 1.15);

    return {
      loaded: m.ready,
      getState: () => ({ answers: [...st.answers] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
