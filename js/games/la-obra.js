// La obra (lección 1.2): se sabe cuántos obreros tardan cuántos días; se arrastran obreros de la
// banca a la obra (o se usan ±) y un calendario muestra los días que tardarían (producto constante,
// regla de tres inversa). Hay que dejar los obreros justos para terminar en los días pedidos.
// params = { workers, days, askDays, max }   state = { workers }

GAMES['la-obra'] = (() => {
  const answerOf = p => Math.round((p.workers * p.days) / p.askDays);
  const daysFor = (p, w) => (p.workers * p.days) / w;

  function grade(state, params) {
    const ans = answerOf(params);
    return { ok: state.workers === ans, solution: `$${params.workers} \\cdot ${params.days} = ${params.workers * params.days} = x \\cdot ${params.askDays} \\Rightarrow x = ${ans}$ obreros` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { workers: params.workers };
    let locked = false, W = 0, H = 0, bench = null, site = null, buttons = [], drag = null;

    function layout(w, h) {
      W = w; H = h;
      bench = { x: 12, y: h * 0.3, w: w * 0.34, h: h * 0.5 };
      site = { x: w * 0.34 + 28, y: h * 0.3, w: w - (w * 0.34 + 28) - 12, h: h * 0.5 };
      buttons = [
        { d: -1, x: site.x, y: site.y + site.h + 10, w: 44, h: 32, t: '−' },
        { d: 1, x: site.x + site.w - 44, y: site.y + site.h + 10, w: 44, h: 32, t: '+' },
      ];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    function setWorkers(n) {
      st.workers = Math.max(1, Math.min(params.max, n));
      api.ready(st.workers !== params.workers);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function worker(x, y, s, col) {
        p.noStroke(); p.fill(col); p.circle(x, y - s * 0.45, s * 0.45);
        p.rect(x - s * 0.3, y - s * 0.2, s * 0.6, s * 0.75, s * 0.12);
        p.fill(C.sun); p.arc(x, y - s * 0.5, s * 0.55, s * 0.4, p.PI, p.TWO_PI); // casco
      }
      // Obreros en cuadrícula dentro de una caja.
      function crowd(box, n, col, cols) {
        const s = Math.min(26, (box.w - 12) / cols / 1.1, (box.h - 30) / Math.ceil(Math.max(n, 1) / cols) / 1.3);
        for (let i = 0; i < n; i++) worker(box.x + 10 + (i % cols) * (box.w - 16) / cols + s * 0.5, box.y + 30 + Math.floor(i / cols) * s * 1.3 + s * 0.5, s, col);
      }

      p.draw = () => {
        p.background(C.bg);
        const ans = answerOf(params), good = st.workers === ans;
        const days = daysFor(params, st.workers);
        // Calendario.
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(12);
        p.text(`${params.workers} obreros × ${params.days} días = ${params.workers * params.days} obreros·día`, W / 2, 6);
        p.fill(C.N); p.textSize(14); p.text(`¿Cuántos obreros para terminar en ${params.askDays} días?`, W / 2, 24);
        const col = locked ? (good ? C.ok : C.bad) : Math.round(days) === params.askDays ? C.ok : C.brand;
        p.stroke(col); p.strokeWeight(2.5); p.fill(C.card); p.rect(W / 2 - 70, 48, 140, 50, 12);
        p.noStroke(); p.fill(col); p.rect(W / 2 - 70, 48, 140, 14, 12, 12, 0, 0);
        p.fill(C.ink); p.textSize(22); p.textAlign(p.CENTER, p.CENTER); p.text(`${Math.round(days)} días`, W / 2, 80);
        p.fill(C.mute); p.textSize(10); p.textAlign(p.CENTER, p.TOP); p.text('calendario', W / 2, 100);
        // Banca y obra.
        [['Banca', bench], ['Obra', site]].forEach(([name, box]) => {
          p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 12);
          p.noStroke(); p.fill(C.mute); p.textSize(12); p.textAlign(p.CENTER, p.TOP); p.text(name, box.x + box.w / 2, box.y + 8);
        });
        crowd(bench, Math.max(0, params.max - st.workers), C.mute, 4);
        crowd(site, st.workers, col, 5);
        p.noStroke(); p.fill(C.ink); p.textSize(16); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        // Entre los botones − y +: si el hueco es angosto queda solo el número.
        const gap = site.w - 104;
        fitText(p, gap < 64 ? String(st.workers) : `${st.workers} obrero${st.workers === 1 ? '' : 's'}`, site.x + site.w / 2, buttons[0].y + 16, Math.max(24, gap), 16);
        buttons.forEach(b => {
          drawTile(p, C, b, b.t, { fill: C.sky, r: 8, lift: 2, size: 18 });
        });
        p.fill(C.mute); p.textSize(11); p.text(locked && !good ? `Debían ser ${ans} obreros para ${params.askDays} días` : 'Arrastra obreros a la obra o toca ±', W / 2, H - 12);
        if (drag) worker(p.mouseX, p.mouseY, 30, C.brand);
      };

      p.mousePressed = () => {
        if (locked) return;
        const b = buttons.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) { setWorkers(st.workers + b.d); api.sfx?.tap?.(); return false; }
        if (inside(bench, p.mouseX, p.mouseY) && st.workers < params.max) { drag = 'bench'; return false; }
        if (inside(site, p.mouseX, p.mouseY) && st.workers > 1) { drag = 'site'; return false; }
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        if (drag === 'bench' && inside(site, p.mouseX, p.mouseY)) { setWorkers(st.workers + 1); api.sfx?.tap?.(); }
        if (drag === 'site' && inside(bench, p.mouseX, p.mouseY)) { setWorkers(st.workers - 1); api.sfx?.tap?.(); }
        drag = null;
        return false;
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ ...st }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
