// La fábrica de subconjuntos (Álgebra 0, conjunto de partes): un conjunto de n elementos tiene 2ⁿ subconjuntos.
// Hay 2ⁿ cajas y en cada una se encienden o apagan los elementos tocándolos; la caja muestra el subconjunto que
// arma. Meta: todas las cajas distintas (así salen todos, del vacío ∅ al conjunto completo). Las cajas
// repetidas se marcan para que se vea cuál sobra.
// params = { rounds: [{ elements: [etiquetas] }] }   state = { slots: [[[bool por elemento] por caja]] }

GAMES['fabrica-subconjuntos'] = (() => {
  const key = s => s.map(b => (b ? 1 : 0)).join('');
  const subsetText = (els, s) => { const xs = els.filter((_, k) => s[k]); return xs.length ? `{${xs.join(', ')}}` : '∅'; };
  function complete(slots, r) {
    const n = 2 ** r.elements.length;
    return !!slots && slots.length === n && new Set(slots.map(key)).size === n;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => complete(state.slots?.[i], r));
    const solution = params.rounds.map(r => {
      const all = Array.from({ length: 2 ** r.elements.length }, (_, m) => subsetText(r.elements, r.elements.map((_, k) => !!(m & (1 << k)))));
      return `P({${r.elements.join(', ')}}) = {${all.join(', ')}}`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { slots: R.map(r => Array.from({ length: 2 ** r.elements.length }, () => r.elements.map(() => false))) };
    const touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], boxes = [];

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      const n = st.slots[cur].length, cols = 2, gap = 10, top = 84;
      const bw = (w - 28 - gap) / cols, rows = Math.ceil(n / cols), bh = Math.min(64, (h - top - 30 - (rows - 1) * gap) / rows);
      boxes = st.slots[cur].map((_, j) => {
        const x = 14 + (j % cols) * (bw + gap), y = top + Math.floor(j / cols) * (bh + gap);
        const els = R[cur].elements, cw = Math.min(40, (bw - 16 - (els.length - 1) * 6) / els.length);
        const chips = els.map((_, k) => ({ x: x + 8 + k * (cw + 6), y: y + bh - 32, w: cw, h: 26 }));
        return { x, y, w: bw, h: bh, chips };
      });
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], slots = st.slots[cur], keys = slots.map(key), ok = complete(slots, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (complete(st.slots[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER); p.textSize(14);
        p.text(`Subconjuntos de {${r.elements.join(', ')}}`, 14, 56);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.RIGHT, p.CENTER);
        p.text(`${new Set(keys).size} de ${slots.length} distintos`, W - 14, 74);
        boxes.forEach((b, j) => {
          const dup = (touched[cur] || locked) && (keys.indexOf(keys[j]) !== j || keys.lastIndexOf(keys[j]) !== j);
          p.stroke(locked ? (ok ? C.ok : dup ? C.bad : C.line) : dup ? C.bad : C.line); p.strokeWeight(dup ? 2.2 : 1.5);
          p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(dup ? C.bad : C.ink); p.textStyle(p.BOLD); p.textAlign(p.LEFT, p.CENTER);
          p.textAlign(p.LEFT, p.CENTER); p.textSize(14);
          p.text(subsetText(r.elements, slots[j]), b.x + 10, b.y + 14);
          b.chips.forEach((c, k) => {
            const on = slots[j][k];
            // Elemento encendido: ficha color sol; apagado: casilla punteada con la letra en gris.
            if (on) drawTile(p, C, c, r.elements[k], { fill: C.sun, r: 8, lift: 2, size: 13 });
            else { drawSlot(p, C, c, 8); p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(r.elements[k], c.x + c.w / 2, c.y + c.h / 2 + 1); }
          });
        });
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textSize(11);
        if (locked && !ok) { p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, `Son ${slots.length}: del ∅ al conjunto completo`, W / 2, H - 12, W - 24, 11); }
        else { p.fill(C.mute); p.textStyle(p.NORMAL); p.text('Toca los elementos de cada caja para encenderlos', W / 2, H - 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; layout(W, H); api.sfx?.tap?.(); return false; }
        if (locked) return;
        for (let j = 0; j < boxes.length; j++) {
          const k = boxes[j].chips.findIndex(c => hitBox(c, p.mouseX, p.mouseY));
          if (k >= 0) {
            st.slots[cur][j][k] = !st.slots[cur][j][k];
            touched[cur] = true; api.ready(touched.every(Boolean)); api.sfx?.tap?.(); return false;
          }
        }
      };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ slots: st.slots.map(s => s.map(x => [...x])) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, subsetText };
})();
