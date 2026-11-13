// Reparte en el Venn (Álgebra 0, diagramas de Venn): A y B vienen por extensión y U es el universo. Se toca un
// elemento de la bandeja y luego la zona del diagrama donde va: solo en A, en A ∩ B, solo en B o fuera de los
// dos círculos (en U). Tocar un elemento ya puesto lo devuelve a la bandeja.
// params = { rounds: [{ U, A, B }] }   state = { zones: [[zona | null por elemento de U]] }
// Zonas: 0 solo A, 1 A ∩ B, 2 solo B, 3 fuera.

GAMES['reparte-venn'] = (() => {
  const zonesOf = r => r.U.map(x => { const a = r.A.includes(x), b = r.B.includes(x); return a && b ? 1 : a ? 0 : b ? 2 : 3; });
  const good = (z, r) => !!z && J(z) === J(zonesOf(r));
  const J = v => JSON.stringify(v);
  const NAMES = ['solo A', 'A ∩ B', 'solo B', 'fuera'];

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.zones?.[i], r));
    const solution = params.rounds.map(r => {
      const z = zonesOf(r), by = k => r.U.filter((_, i) => z[i] === k);
      return `A ∩ B = {${by(1).join(', ')}}, solo A = {${by(0).join(', ')}}, solo B = {${by(2).join(', ')}}, fuera = {${by(3).join(', ')}}`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { zones: R.map(r => r.U.map(() => null)) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], venn = null, sel = -1, tray = [];

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      const top = 100, vh = h * 0.42;
      const rr = Math.min((w - 40) / 3.3, vh / 2.3);
      venn = { box: { x: 14, y: top, w: w - 28, h: vh }, r: rr, ca: { x: w / 2 - rr * 0.62, y: top + vh / 2 + 4 }, cb: { x: w / 2 + rr * 0.62, y: top + vh / 2 + 4 } };
      const n = R[cur].U.length, cols = Math.min(6, n), tw = (w - 28 - (cols - 1) * 8) / cols, rows = Math.ceil(n / cols);
      const y0 = h - rows * 42 - 24;
      tray = R[cur].U.map((_, i) => ({ x: 14 + (i % cols) * (tw + 8), y: y0 + Math.floor(i / cols) * 42, w: tw, h: 34 }));
    }
    const zoneAt = (x, y) => {
      if (!hitBox(venn.box, x, y)) return -1;
      const a = Math.hypot(x - venn.ca.x, y - venn.ca.y) < venn.r, b = Math.hypot(x - venn.cb.x, y - venn.cb.y) < venn.r;
      return a && b ? 1 : a ? 0 : b ? 2 : 3;
    };
    // Dónde se dibujan los elementos de cada zona (en fila dentro de la zona).
    function slotPoint(zone, k, total) {
      const { ca, cb, r, box } = venn, mid = (ca.x + cb.x) / 2;
      const centers = [{ x: ca.x - r * 0.48, y: ca.y }, { x: mid, y: ca.y }, { x: cb.x + r * 0.48, y: cb.y }, null];
      if (zone === 3) {
        const spots = [[box.x + 22, box.y + 34], [box.x + box.w - 22, box.y + 34], [box.x + 22, box.y + box.h - 18], [box.x + box.w - 22, box.y + box.h - 18], [mid, box.y + 14], [mid, box.y + box.h - 12]];
        const s = spots[k % spots.length]; return { x: s[0], y: s[1] };
      }
      const c = centers[zone], step = Math.min(24, (r * 1.3) / Math.max(1, total));
      return { x: c.x, y: c.y + (k - (total - 1) / 2) * step };
    }
    const ready = () => api.ready(st.zones.every(z => z.every(v => v != null)));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);
      const tint = (col, a) => { const c = p.color(col); c.setAlpha(a); return c; };

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], z = st.zones[cur], target = zonesOf(r);
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.zones[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.zones[i].some(v => v != null) ? C.Z : C.line));
        p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        p.fill(C.Z); fitText(p, `A = {${r.A.join(', ')}}`, W / 2, 54, W - 28, 14);
        p.fill(C.I); fitText(p, `B = {${r.B.join(', ')}}`, W / 2, 76, W - 28, 14);
        const { box, ca, cb } = venn;
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 12);
        p.noStroke(); p.fill(C.mute); p.textSize(12); p.textAlign(p.LEFT, p.TOP); p.text('U', box.x + 8, box.y + 6);
        p.stroke(C.sky); p.strokeWeight(3); p.fill(tint(C.sky, 95)); p.circle(ca.x, ca.y, 2 * venn.r);
        p.stroke(C.coral); p.fill(tint(C.coral, 95)); p.circle(cb.x, cb.y, 2 * venn.r);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(15);
        // Letras sueltas (no píldoras): ahí mismo caen los elementos que van fuera de los dos conjuntos.
        p.fill(C.Z); p.text('A', ca.x - venn.r * 0.75, ca.y - venn.r * 0.95);
        p.fill(C.I); p.text('B', cb.x + venn.r * 0.6, cb.y - venn.r * 0.95);
        // Elementos puestos
        for (let zone = 0; zone < 4; zone++) {
          const idx = r.U.map((_, i) => i).filter(i => z[i] === zone);
          idx.forEach((i, k) => {
            const pt = slotPoint(zone, k, idx.length), bad = locked && target[i] !== zone;
            p.noStroke(); p.fill(bad ? C.bad : C.ink); p.textStyle(p.BOLD); p.textSize(15); p.textAlign(p.CENTER, p.CENTER);
            if (bad) drawPill(p, C, r.U[i], pt.x, pt.y, C.bad, 13);   // el que quedó mal, en píldora roja: sobre el círculo coral el rojo solo no se ve
            else p.text(r.U[i], pt.x, pt.y);
          });
        }
        // Bandeja
        tray.forEach((b, i) => {
          const placed = z[i] != null;
          if (placed) { drawSlot(p, C, b, 8); return; }
          drawTile(p, C, b, r.U[i], { fill: sel === i ? C.sun : C.cream, r: 8, lift: 2, size: 15, ring: sel === i ? C.sun : null });
        });
        p.noStroke(); p.textSize(11); p.textStyle(p.NORMAL); p.fill(C.mute);
        const msg = sel >= 0 ? `Ahora toca la zona donde va ${r.U[sel]}` : 'Toca un elemento y luego su zona';
        p.text(locked ? (good(z, r) ? '' : 'En rojo, los que estaban en otra zona') : msg, W / 2, H - 10);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; sel = -1; layout(W, H); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const z = st.zones[cur], r = R[cur];
        const i = tray.findIndex((b, i) => z[i] == null && hitBox(b, p.mouseX, p.mouseY));
        if (i >= 0) { sel = sel === i ? -1 : i; api.sfx?.tap?.(); return false; }
        // ¿Tocó un elemento ya puesto? Vuelve a la bandeja.
        for (let zone = 0; zone < 4; zone++) {
          const idx = r.U.map((_, k) => k).filter(k => z[k] === zone);
          for (let k = 0; k < idx.length; k++) {
            const pt = slotPoint(zone, k, idx.length);
            if (sel < 0 && Math.hypot(p.mouseX - pt.x, p.mouseY - pt.y) < 13) { z[idx[k]] = null; ready(); api.sfx?.tap?.(); return false; }
          }
        }
        const zone = zoneAt(p.mouseX, p.mouseY);
        if (zone >= 0 && sel >= 0) { z[sel] = zone; sel = -1; ready(); api.sfx?.tap?.(); return false; }
      };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ zones: st.zones.map(z => [...z]) }),
      lock() { locked = true; sel = -1; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, zonesOf, NAMES };
})();
