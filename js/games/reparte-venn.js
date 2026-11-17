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
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], venn = null, sel = -1, tray = [], pos = [];

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      const n = R[cur].U.length, cols = Math.min(4, n), tw = (w - 24 - (cols - 1) * 7) / cols, rows = Math.ceil(n / cols);
      const y0 = h - rows * 40 - 26, top = 100, box = { x: 12, y: top, w: w - 24, h: y0 - 12 - top };
      const [ca, cb] = SK.venn2(box, 0.62, 6);
      venn = { box, r: ca.r, ca, cb };
      tray = R[cur].U.map((_, i) => ({ x: 12 + (i % cols) * (tw + 7), y: y0 + Math.floor(i / cols) * 40, w: tw, h: 32 }));
      pos = R[cur].U.map((_, i) => ({ ...boxOf(i) }));
    }
    const zoneAt = (x, y) => {
      if (!hitBox(venn.box, x, y)) return -1;
      const a = Math.hypot(x - venn.ca.x, y - venn.ca.y) < venn.r, b = Math.hypot(x - venn.cb.x, y - venn.cb.y) < venn.r;
      return a && b ? 1 : a ? 0 : b ? 2 : 3;
    };
    // Dónde va cada elemento de una zona (en columna dentro de la zona; los de afuera, en las esquinas de U).
    function slotPoint(zone, k, total) {
      const { ca, cb, r, box } = venn, mid = (ca.x + cb.x) / 2;
      if (zone === 3) {
        const spots = [[box.x + 34, box.y + box.h - 18], [box.x + box.w - 34, box.y + box.h - 18], [box.x + box.w - 34, box.y + 18], [mid, box.y + box.h - 14], [mid, box.y + 14], [box.x + 60, box.y + 18]];
        const s = spots[k % spots.length]; return { x: s[0], y: s[1] };
      }
      const c = [{ x: ca.x - r * 0.5, y: ca.y }, { x: mid, y: ca.y }, { x: cb.x + r * 0.5, y: cb.y }][zone], step = Math.min(26, (r * 1.4) / Math.max(1, total));
      return { x: c.x, y: c.y + (k - (total - 1) / 2) * step };
    }
    // Caja de un elemento: en la bandeja o en su zona.
    function boxOf(i) {
      const z = st.zones[cur], zone = z[i];
      if (zone == null) return tray[i];
      const idx = z.map((v, k) => (v === zone ? k : -1)).filter(k => k >= 0), pt = slotPoint(zone, idx.indexOf(i), idx.length), w = Math.min(60, venn.r * 0.72);
      return { x: pt.x - w / 2, y: pt.y - 11, w, h: 22 };
    }
    const ready = () => api.ready(st.zones.every(z => z.every(v => v != null)));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], z = st.zones[cur], target = zonesOf(r), dt = frameDt(p), [A, B] = SK.sets(C);
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.zones[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.zones[i].some(v => v != null) ? C.Z : C.line));
        p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        p.fill(A.ink); fitText(p, `A = {${r.A.join(', ')}}`, W / 2, 56, W - 28, 14);
        p.fill(B.ink); fitText(p, `B = {${r.B.join(', ')}}`, W / 2, 78, W - 28, 14);
        const { box, ca, cb } = venn;
        SK.panel(p, C, box, { u: true });
        // Con un elemento elegido, la zona bajo el dedo no se resalta sola: se elige tocándola.
        SK.membrane(p, C, ca.x, ca.y, venn.r, venn.r, A.line, { fill: sel >= 0 ? 52 : 34 });
        SK.membrane(p, C, cb.x, cb.y, venn.r, venn.r, B.line, { fill: sel >= 0 ? 52 : 34 });
        SK.tag(p, C, 'A', ca.x - venn.r * 0.72, ca.y - venn.r * 0.76, A);
        SK.tag(p, C, 'B', cb.x + venn.r * 0.72, cb.y - venn.r * 0.76, B);
        // Huecos de la bandeja y píldoras (se deslizan a su zona).
        r.U.forEach((_, i) => { if (z[i] != null) SK.chip(p, C, tray[i], '', { state: 'ghost' }); });
        r.U.forEach((lab, i) => {
          const t = boxOf(i), b = pos[i], placed = z[i] != null, bad = locked && target[i] !== z[i];
          for (const k of ['x', 'y', 'w', 'h']) SK.ease(b, k, t[k], dt);
          SK.chip(p, C, b, lab, { state: bad ? 'bad' : locked && placed ? 'ok' : placed ? 'on' : 'idle', col: z[i] === 2 ? B.line : z[i] === 3 ? C.sky : A.line, sel: sel === i, size: placed ? 12 : 14 });
        });
        p.noStroke(); p.textSize(11); p.textStyle(p.NORMAL); p.fill(C.mute); p.textAlign(p.CENTER, p.CENTER);
        const msg = sel >= 0 ? `Ahora toca la zona donde va ${r.U[sel]}` : 'Toca un elemento y luego su zona';
        p.text(locked ? (good(z, r) ? '' : 'En rojo, los que estaban en otra zona') : msg, W / 2, H - 11);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; sel = -1; layout(W, H); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const z = st.zones[cur], r = R[cur];
        const i = tray.findIndex((b, i) => z[i] == null && hitBox(b, p.mouseX, p.mouseY));
        if (i >= 0) { sel = sel === i ? -1 : i; api.sfx?.tap?.(); return false; }
        // ¿Tocó un elemento ya puesto? Vuelve a la bandeja.
        if (sel < 0) {
          const k = r.U.findIndex((_, k) => z[k] != null && hitBox(boxOf(k), p.mouseX, p.mouseY));
          if (k >= 0) { z[k] = null; ready(); api.sfx?.tap?.(); return false; }
        }
        const zone = zoneAt(p.mouseX, p.mouseY);
        if (zone >= 0 && sel >= 0) { z[sel] = zone; sel = -1; ready(); api.sfx?.tap?.(); return false; }
      };
    }, 1.4);

    return {
      loaded: m.ready,
      getState: () => ({ zones: st.zones.map(z => [...z]) }),
      lock() { locked = true; sel = -1; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, zonesOf, NAMES };
})();
