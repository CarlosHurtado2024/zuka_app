// Rellena los medios (lección 1.4): una recta con el primer y el último término fijos y k huecos
// entre ellos; se arrastran fichas (con distractores) a los huecos. Sirve para medios aritméticos
// (sumar d) y geométricos (multiplicar por r).
// params = { first, last, k, kind: 'aritmetica' | 'geometrica', chips: [números] }   state = { slots: [índice | null] }

GAMES['rellena-medios'] = (() => {
  const ratioOf = p => Math.round(Math.pow(p.last / p.first, 1 / (p.k + 1)) * 1e6) / 1e6;
  const diffOf = p => (p.last - p.first) / (p.k + 1);
  const means = p => Array.from({ length: p.k }, (_, i) => (p.kind === 'geometrica'
    ? Math.round(p.first * ratioOf(p) ** (i + 1) * 1e6) / 1e6
    : p.first + (i + 1) * diffOf(p)));
  const fmt = n => String(+n.toFixed(4));

  function grade(state, params) {
    const want = means(params);
    const ok = want.every((v, i) => state.slots[i] != null && params.chips[state.slots[i]] === v);
    const key = params.kind === 'geometrica' ? `r = ${fmt(ratioOf(params))}` : `d = ${fmt(diffOf(params))}`;
    return { ok, solution: `${params.k} medios entre ${params.first} y ${params.last}: ${key}; ${[params.first, ...want, params.last].map(fmt).join(', ')}` };
  }

  function create(host, params, api) {
    const C = api.palette;
    const geo = params.kind === 'geometrica';
    const st = { slots: params.chips.map(() => null).slice(0, params.k) };
    let locked = false, W = 0, H = 0, slots = [], ends = [], tray = [], drag = null;

    function layout(w, h) {
      W = w; H = h;
      const cols = Math.min(params.chips.length, 3), cw = Math.min(84, (w - 24 - (cols - 1) * 8) / cols), cgap = (w - 24 - cols * cw) / Math.max(1, cols - 1);
      const trayTop = h - 36 - Math.ceil(params.chips.length / cols) * 44;
      tray = params.chips.map((_, j) => ({ x: 12 + (j % cols) * (cw + cgap), y: trayTop + Math.floor(j / cols) * 44, w: cw, h: 36 }));
      // Las casillas quedan por encima de la bandeja con sitio para la corrección «→ valor» (locked).
      const n = params.k + 2, bw = Math.min(64, (w - 24 - (n - 1) * 6) / n), gap = (w - 24 - n * bw) / (n - 1), y = Math.min(h * 0.36, trayTop - 82);
      const all = Array.from({ length: n }, (_, i) => ({ x: 12 + i * (bw + gap), y, w: bw, h: 44 }));
      ends = [all[0], all[n - 1]]; slots = all.slice(1, n - 1);
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const placedAt = j => st.slots.indexOf(j);
    const ready = () => api.ready(st.slots.every(j => j !== null));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function chip(b, label, col, fill = C.card, dashed = false) {
        if (dashed) p.drawingContext.setLineDash([5, 4]);
        p.stroke(col); p.strokeWeight(2); p.fill(fill); p.rect(b.x, b.y, b.w, b.h, 9);
        p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(b.w < 60 ? 12 : 14);
        p.text(label, b.x + b.w / 2, b.y + b.h / 2);
      }

      p.draw = () => {
        p.background(C.bg);
        const want = means(params);
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`${params.k} medios ${geo ? 'geométricos' : 'aritméticos'} entre ${params.first} y ${params.last}`, 12, 8, W - 24, 36);
        p.stroke(C.line); p.strokeWeight(2); p.line(ends[0].x + ends[0].w / 2, ends[0].y + ends[0].h + 10, ends[1].x + ends[1].w / 2, ends[0].y + ends[0].h + 10);
        chip(ends[0], params.first, C.mute); chip(ends[1], params.last, C.mute);
        slots.forEach((s, i) => {
          const j = st.slots[i], good = j !== null && params.chips[j] === want[i];
          const col = locked ? (good ? C.ok : C.bad) : j !== null ? C.brand : C.line;
          if (j === null) chip(s, '?', col, C.bg, true); else chip(s, params.chips[j], col);
          if (locked && !good) { p.noStroke(); p.fill(C.ok); p.textSize(11); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP); p.text(`→ ${fmt(want[i])}`, s.x + s.w / 2, s.y + s.h + 16); }
        });
        // Saltos entre casillas: «+ d» o «× r», pista visual sin el valor.
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.BOTTOM);
        const all = [ends[0], ...slots, ends[1]];
        for (let i = 0; i < all.length - 1; i++) p.text(geo ? '× r' : '+ d', (all[i].x + all[i].w + all[i + 1].x) / 2, all[i].y - 4);
        if (!locked) params.chips.forEach((v, j) => { if (placedAt(j) < 0 && !(drag && drag.j === j)) chip(tray[j], v, C.Z); });   // bloqueado, la bandeja sobra
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡Huecos bien rellenos!' : 'Mira los valores en verde') : `Arrastra las fichas a los huecos · sobran ${params.chips.length - params.k}`, 12, H - 26, W - 24, 24);
        if (drag) chip({ x: p.mouseX - tray[0].w / 2, y: p.mouseY - 18, w: tray[0].w, h: 36 }, params.chips[drag.j], C.brand);
      };

      p.mousePressed = () => {
        if (locked) return;
        const i = slots.findIndex((s, i) => st.slots[i] !== null && inside(s, p.mouseX, p.mouseY));
        if (i >= 0) { drag = { j: st.slots[i] }; st.slots[i] = null; ready(); return false; }
        const j = tray.findIndex((b, j) => placedAt(j) < 0 && inside(b, p.mouseX, p.mouseY));
        if (j >= 0) { drag = { j }; return false; }
      };
      p.mouseDragged = () => (drag ? false : undefined);
      p.mouseReleased = () => {
        if (!drag) return;
        const i = slots.findIndex(s => inside({ x: s.x - 6, y: s.y - 10, w: s.w + 12, h: s.h + 20 }, p.mouseX, p.mouseY));
        if (i >= 0) { st.slots[i] = drag.j; api.sfx?.tap?.(); }
        drag = null;
        ready();
        return false;
      };
    }, 1.0);

    return {
      loaded: m.ready,
      getState: () => ({ slots: [...st.slots] }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, means };
})();
