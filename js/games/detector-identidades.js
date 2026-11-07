// El detector de identidades (trigonometría, simplificar y demostrar): en la pantalla están las gráficas
// de los dos lados de una igualdad (izquierdo rosa grueso, derecho azul punteado encima). Si es una
// identidad, coinciden en todo x; si no, en algún lugar se separan. Se arrastra la lupa por el eje x y
// se lee el valor de cada lado; luego se elige «Contraejemplo aquí» (guarda ese x) o «Es identidad».
// Rondas con pestañas. Las funciones vienen en los parámetros.
// params = { rounds: [{ lhs, rhs, f, g, identity }] }   state = { answers: [{ x } | 'id' | null] }

GAMES['detector-identidades'] = (() => {
  const val = (h, x) => { const v = h(x); return Number.isFinite(v) && Math.abs(v) < 1e3 ? v : NaN; };
  function differs(r, x) {
    const a = val(r.f, x), b = val(r.g, x);
    return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) > 0.05;
  }
  const okOne = (a, r) => (r.identity ? a === 'id' : !!a && a !== 'id' && differs(r, a.x));
  const piTxt = x => {
    const k = Math.round(x / (Math.PI / 12));
    if (Math.abs(k * Math.PI / 12 - x) > 1e-6) return x.toFixed(2);
    if (k === 0) return '0';
    const g = (a, b) => (b ? g(b, a % b) : a), d = g(Math.abs(k), 12), n = Math.abs(k) / d, den = 12 / d;
    return (k < 0 ? '−' : '') + (n === 1 ? '' : n) + 'π' + (den === 1 ? '' : '/' + den);
  };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okOne(state.answers[i], r));
    const solution = params.rounds.map(r => {
      if (r.identity) return `«${r.lhs} = ${r.rhs}» es identidad`;
      const xs = Array.from({ length: 25 }, (_, k) => -Math.PI + k * Math.PI / 12).filter(x => differs(r, x));
      const x = xs.find(x => Math.abs(x - Math.PI / 2) < 1e-9) ?? xs[0];
      return `«${r.lhs} = ${r.rhs}» falla, por ejemplo en x = ${piTxt(x)}`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { answers: params.rounds.map(() => null) };
    const probe = params.rounds.map(() => Math.PI / 4);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], scr = null, bId = null, bCx = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      scr = { x: 12, y: 104, w: w - 24, h: h * 0.4 };
      const by = h - 52, bw = (w - 36) / 2;
      bCx = { x: 12, y: by, w: bw, h: 42 }; bId = { x: 24 + bw, y: by, w: bw, h: 42 };
    }
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const X = x => scr.x + ((x + Math.PI) / (2 * Math.PI)) * scr.w;
    const Xinv = px => -Math.PI + ((px - scr.x) / scr.w) * 2 * Math.PI;
    const Y = y => scr.y + scr.h / 2 - y * scr.h / 6;      // de −3 a 3
    const ready = () => api.ready(st.answers.every(a => a !== null));
    const f2 = v => (Number.isFinite(v) ? (Math.abs(v) < 0.005 ? '0.00' : v.toFixed(2).replace('-', '−')) : 'no existe');

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function plot(h, col, weight, dash) {
        p.noFill(); p.stroke(col); p.strokeWeight(weight); if (dash) p.drawingContext.setLineDash(dash);
        let open = false, prev = null;
        for (let px = 0; px <= scr.w; px += 2) {
          const x = Xinv(scr.x + px), v = val(h, x);
          const inRange = Number.isFinite(v) && Math.abs(v) <= 3.2;
          if (!inRange || (prev !== null && Math.abs(v - prev) > 2.5)) { if (open) p.endShape(); open = false; prev = inRange ? v : null; if (!inRange) continue; }
          if (!open) { p.beginShape(); open = true; }
          p.vertex(scr.x + px, Y(v)); prev = v;
        }
        if (open) p.endShape();
        p.drawingContext.setLineDash([]);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], a = st.answers[cur], x = probe[cur];
        tabs.forEach((t, i) => {
          const col = locked ? (okOne(st.answers[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.answers[i] !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        let ts = 18; p.textSize(ts); const claim = `¿${r.lhs} = ${r.rhs}?`;
        while (p.textWidth(claim) > W - 20 && ts > 11) p.textSize(--ts);
        p.fill(C.ink); p.text(claim, W / 2, 56);
        p.textSize(12); p.textStyle(p.NORMAL);
        p.fill(C.I); p.text(`━ ${r.lhs}`, W / 4, 84); p.fill(C.Z); p.text(`┅ ${r.rhs}`, 3 * W / 4, 84);

        // Pantalla: cuadrícula, ejes y las dos gráficas.
        p.noStroke(); p.fill(C.card); p.rect(scr.x, scr.y, scr.w, scr.h, 10);
        p.stroke(C.line); p.strokeWeight(1);
        for (let k = -2; k <= 2; k++) { const px = X(k * Math.PI / 2); p.line(px, scr.y + 4, px, scr.y + scr.h - 4); }
        p.strokeWeight(1.5); p.line(scr.x, Y(0), scr.x + scr.w, Y(0));
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.TOP);
        ['−π', '−π/2', '0', 'π/2', 'π'].forEach((s, k) => p.text(s, X((k - 2) * Math.PI / 2), Y(0) + 4));
        plot(r.f, C.I, 6);
        plot(r.g, C.Z, 2.5, [7, 6]);

        // Lupa.
        const lx = X(x), fx = val(r.f, x), gx = val(r.g, x), diff = differs(r, x);
        p.stroke(C.N); p.strokeWeight(1.5); p.line(lx, scr.y, lx, scr.y + scr.h);
        [[fx, C.I], [gx, C.Z]].forEach(([v, col]) => { if (Number.isFinite(v) && Math.abs(v) <= 3) { p.noStroke(); p.fill(col); p.circle(lx, Y(v), 10); } });
        p.noFill(); p.stroke(C.N); p.strokeWeight(3); p.circle(lx, scr.y + scr.h + 22, 26); p.line(lx + 9, scr.y + scr.h + 31, lx + 16, scr.y + scr.h + 38);
        const y0 = scr.y + scr.h + 62;
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(15); p.fill(C.ink);
        p.text(`x = ${piTxt(x)}`, W / 2, y0);
        p.textSize(14); p.fill(C.I); p.text(`izq. = ${f2(fx)}`, W / 2 - 74, y0 + 24); p.fill(C.Z); p.text(`der. = ${f2(gx)}`, W / 2 + 74, y0 + 24);
        p.textSize(13);
        if (locked && !okOne(a, r)) { p.fill(C.ok); p.text(r.identity ? 'era una identidad' : 'tenía contraejemplo', W / 2, y0 + 48); }
        else { p.fill(diff ? C.N : C.mute); p.text(diff ? '¡aquí se separan!' : 'aquí coinciden', W / 2, y0 + 48); }

        // Veredicto.
        [[bCx, a && a !== 'id' ? `marcado x = ${piTxt(a.x)}` : 'Contraejemplo aquí', a && a !== 'id'], [bId, 'Es identidad', a === 'id']].forEach(([b, s, on]) => {
          p.stroke(on ? C.brand : C.line); p.strokeWeight(on ? 3 : 1.5); p.fill(on ? C.brand + '33' : C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); let fs = 14; p.textSize(fs); while (p.textWidth(s) > b.w - 10 && fs > 9) p.textSize(--fs); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
      };

      const setProbe = () => { const k = Math.round(Xinv(Math.min(scr.x + scr.w, Math.max(scr.x, p.mouseX))) / (Math.PI / 12)); probe[cur] = k * Math.PI / 12; };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (inside(bCx, p.mouseX, p.mouseY)) { st.answers[cur] = { x: probe[cur] }; ready(); api.sfx?.tap?.(); return false; }
        if (inside(bId, p.mouseX, p.mouseY)) { st.answers[cur] = 'id'; ready(); api.sfx?.tap?.(); return false; }
        if (p.mouseY > scr.y && p.mouseY < scr.y + scr.h + 44 && p.mouseX > scr.x - 10 && p.mouseX < scr.x + scr.w + 10) { drag = true; setProbe(); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; setProbe(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; return false; };
    }, 1.55);

    return {
      loaded: m.ready,
      getState: () => ({ answers: st.answers.map(a => (a && a !== 'id' ? { x: a.x } : a)) }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, differs };
})();
