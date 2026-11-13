// Pinta el Venn (Álgebra 0, operaciones entre conjuntos): un diagrama de Venn de 2 o 3 círculos dentro del
// universo U. Cada toque pinta o despinta la zona tocada. Meta: pintar exactamente las zonas de la operación
// pedida (A − B, (A ∪ B)ᶜ, A ∩ (B ∪ C)…). Cada zona se identifica por los círculos en los que está (máscara
// de bits: 1 = A, 2 = B, 4 = C; 0 = fuera de todos).
// params = { rounds: [{ text, n: 2 | 3, f(a, b, c) → bool }] }   state = { masks: [[máscaras pintadas]] }

GAMES['pinta-venn'] = (() => {
  const targetMasks = r => Array.from({ length: 2 ** r.n }, (_, m) => m).filter(m => r.f(!!(m & 1), !!(m & 2), !!(m & 4)));
  const good = (ms, r) => { const t = targetMasks(r); return !!ms && ms.length === t.length && t.every(m => ms.includes(m)); };
  const NAMES = ['A', 'B', 'C'];

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.masks?.[i], r));
    const zone = (m, n) => { const inn = NAMES.slice(0, n).filter((_, k) => m & (1 << k)), out = NAMES.slice(0, n).filter((_, k) => !(m & (1 << k))); return inn.length ? inn.join(' ∩ ') + (out.length ? ` sin ${out.join(' ni ')}` : '') : 'fuera de todos'; };
    const solution = params.rounds.map(r => `${r.text}: ${targetMasks(r).map(m => zone(m, r.n)).join(', ')}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { masks: R.map(() => []) };
    const touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, circles = [], buf = null, bufKey = '';
    const CELL = 3;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      box = { x: 14, y: 96, w: w - 28, h: h - 96 - 34 };
      placeCircles();
    }
    function placeCircles() {
      const n = R[cur].n, cx = box.x + box.w / 2, cy = box.y + box.h / 2;
      if (n === 2) {
        const r = Math.min(box.w / 3.4, box.h / 2.5);
        circles = [{ x: cx - r * 0.6, y: cy, r }, { x: cx + r * 0.6, y: cy, r }];
      } else {
        const r = Math.min(box.w / 3.3, box.h / 3.3);
        circles = [{ x: cx - r * 0.58, y: cy - r * 0.4, r }, { x: cx + r * 0.58, y: cy - r * 0.4, r }, { x: cx, y: cy + r * 0.6, r }];
      }
      bufKey = '';
    }
    const maskAt = (x, y) => circles.reduce((m, c, k) => m | (Math.hypot(x - c.x, y - c.y) < c.r ? 1 << k : 0), 0);
    const toggle = m => {
      const ms = st.masks[cur], i = ms.indexOf(m);
      if (i >= 0) ms.splice(i, 1); else ms.push(m);
      touched[cur] = true; api.ready(touched.every(Boolean));
    };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      // Las zonas pintadas se dibujan en una capa aparte (celdas de 3 px), que solo se rehace al cambiar algo.
      function paintLayer(fillCol, badCol) {
        const key = `${cur}|${st.masks[cur].slice().sort().join(',')}|${fillCol}|${badCol}|${locked}|${W}`;
        if (key === bufKey && buf) return buf;
        bufKey = key;
        buf?.remove?.();
        buf = p.createGraphics(Math.ceil(box.w), Math.ceil(box.h));
        buf.pixelDensity(1); buf.noStroke(); buf.clear();
        const tgt = targetMasks(R[cur]), ms = st.masks[cur];
        const cf = p.color(fillCol); cf.setAlpha(150);
        const cbd = p.color(badCol); cbd.setAlpha(150);
        const cmiss = p.color(fillCol); cmiss.setAlpha(55);
        for (let y = 0; y < box.h; y += CELL) for (let x = 0; x < box.w; x += CELL) {
          const mk = maskAt(box.x + x + CELL / 2, box.y + y + CELL / 2), on = ms.includes(mk);
          if (locked && on !== tgt.includes(mk)) { buf.fill(on ? cbd : cmiss); buf.rect(x, y, CELL, CELL); continue; }
          if (on) { buf.fill(cf); buf.rect(x, y, CELL, CELL); }
        }
        return buf;
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur];
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.masks[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.CENTER);
        drawKicker(p, C, 'Pinta las zonas de', 14, 54);
        p.noStroke();
        p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, r.text, W / 2, 78, W - 28, 22);
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 12);
        p.image(paintLayer(locked ? C.ok : C.sun, C.bad), box.x, box.y);
        const cols = [C.sky, C.coral, C.mint];
        circles.forEach((c, k) => { p.noFill(); p.stroke(cols[k]); p.strokeWeight(3); p.circle(c.x, c.y, 2 * c.r); });
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(16);
        const lab = [[-0.82, -0.82], [0.82, -0.82], [0, 1.12]];
        circles.forEach((c, k) => drawPill(p, C, NAMES[k], c.x + lab[k][0] * c.r, Math.min(box.y + box.h - 14, c.y + lab[k][1] * c.r), cols[k], 13));
        p.noStroke(); p.textStyle(p.BOLD);
        p.fill(C.mute); p.textSize(12); p.textAlign(p.LEFT, p.TOP); p.text('U', box.x + 8, box.y + 6);
        p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.NORMAL); p.textSize(11);
        p.fill(locked && !good(st.masks[cur], r) ? C.ok : C.mute);
        p.text(locked ? (good(st.masks[cur], r) ? '' : 'Verde claro: faltaba pintar · rojo: sobraba') : 'Toca una zona para pintarla o despintarla', W / 2, H - 14);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; placeCircles(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(box, p.mouseX, p.mouseY)) { toggle(maskAt(p.mouseX, p.mouseY)); api.sfx?.tap?.(); return false; }
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ masks: st.masks.map(x => [...x]) }),
      lock() { locked = true; bufKey = ''; },
      destroy: () => { buf?.remove?.(); m.remove(); },
    };
  }

  return { grade, create, targetMasks };
})();
