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
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], box = null, circles = [];

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      box = { x: 12, y: 102, w: w - 24, h: h - 102 - 34 };
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
    }
    const maskAt = (x, y) => SK.maskAt(circles, x, y);
    const toggle = m => {
      const ms = st.masks[cur], i = ms.indexOf(m);
      if (i >= 0) ms.splice(i, 1); else ms.push(m);
      touched[cur] = true; api.ready(touched.every(Boolean));
    };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], ms = st.masks[cur], tgt = targetMasks(r), S = SK.sets(C), fine = good(ms, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.masks[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        SK.kicker(p, C, 'Pinta las zonas de', 14, 56);
        p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, r.text, W / 2, 82, W - 28, 23);
        SK.panel(p, C, box, { u: true });
        // Zonas pintadas, con su borde exacto. Al calificar: verde lo bien pintado, rojo lo que sobraba y rayado lo que faltaba.
        const fill = (masks, col, a) => SK.zones(p, box, circles, masks, { col, alpha: a });
        if (!locked) fill(ms, C.brand, 120);
        else {
          fill(ms.filter(k => tgt.includes(k)), C.ok, 130); fill(ms.filter(k => !tgt.includes(k)), C.bad, 130);
          SK.zones(p, box, circles, tgt.filter(k => !ms.includes(k)), { col: C.ok, hatch: true });
        }
        circles.forEach((c, k) => { p.noFill(); p.stroke(SK.al(p, S[k].line, 40)); p.strokeWeight(8); p.circle(c.x, c.y, 2 * c.r); p.stroke(S[k].line); p.strokeWeight(2.2); p.circle(c.x, c.y, 2 * c.r); });
        p.noStroke();
        const lab = [[-0.8, -0.8], [0.8, -0.8], [0, 1.1]];
        circles.forEach((c, k) => SK.tag(p, C, NAMES[k], c.x + lab[k][0] * c.r, Math.min(box.y + box.h - 16, c.y + lab[k][1] * c.r), S[k]));
        p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.NORMAL); p.textSize(11);
        p.fill(locked && !fine ? C.ok : C.mute);
        p.text(locked ? (fine ? '' : 'Rayado: faltaba pintar · rojo: sobraba') : 'Toca una zona para pintarla o despintarla', W / 2, H - 15);
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
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, targetMasks };
})();
