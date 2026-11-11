// Flecha vector (geometría vectorial): se arrastra la punta de una flecha sobre la cuadrícula (y su cola,
// si la ronda lo permite) para construir el vector que pide cada ronda: una suma, una resta, un múltiplo,
// la proyección sobre otro, uno perpendicular, uno que encierre cierta área, la fuerza que equilibra
// otras… Se califica comparando el vector (punta − cola) con `ans`, la punta con `ans` si at: 'tip',
// o con una condición `check(w, cola)`. Abajo pueden ir lecturas en vivo: componentes, norma, producto
// escalar y producto cruz con el primer vector dado, y la suma de todos.
// params = { rounds: [{ ask, given: [{ v, at, name }], points: [{ p, name }], lines: [[a, b, c]] (ax + by = c), tail, tip (posición inicial de la punta), freeTail, at, ans | check + sol, show, name, range }] }
// state = { vecs: [{ tail: [x, y], tip: [x, y] }] }

GAMES['flecha-vector'] = (() => {
  const n = v => String(+(+v).toFixed(3)).replace('-', '−');
  const vt = w => `(${n(w[0])}, ${n(w[1])})`;
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const same = (a, b) => Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
  const tailOf = r => r.tail || [0, 0];

  function meets(vec, r) {
    if (!vec) return false;
    const w = sub(vec.tip, vec.tail);
    if (r.check) return !!r.check(w, vec.tail, vec.tip);
    return r.at === 'tip' ? same(vec.tip, r.ans) : same(w, r.ans);
  }
  const solOf = r => r.sol || (r.at === 'tip' ? `el punto ${vt(r.ans)}` : vt(r.ans));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => meets(state.vecs[i], r));
    return { ok, solution: params.rounds.map(solOf).join(' · ') };
  }

  function readouts(r, w, vec) {
    const g = (r.given || [])[0]?.v, nm = r.name || 'w', out = [];
    for (const k of r.show || []) {
      if (k === 'comp') out.push(`${nm} = ${vt(w)}`);
      if (k === 'norm') { const q = dot(w, w), s = Math.sqrt(q); out.push(`|${nm}| = ${Number.isInteger(s) ? s : `√${q}`}`); }
      if (k === 'dot' && g) out.push(`${r.given[0].name}·${nm} = ${n(dot(g, w))}`);
      if (k === 'cross' && g) out.push(`${r.given[0].name}×${nm} = ${n(cross(g, w))}`);
      if (k === 'det' && g) out.push(`det(${r.given[0].name}, ${nm}) = ${n(cross(g, w))}`);
      if (k === 'sum') { const s = (r.given || []).reduce((a, G) => [a[0] + G.v[0], a[1] + G.v[1]], w); out.push(`suma = ${vt(s)}`); }
      if (k === 'tip') out.push(`punta ${vt(vec.tip)}`);
    }
    return out.join('   ');
  }

  function create(host, params, api) {
    const C = api.palette;
    const vecs = params.rounds.map(r => ({ tail: tailOf(r).slice(), tip: (r.tip || tailOf(r)).slice() })), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], view = null, drag = null;
    const FAM = ['Z', 'I', 'Q', 'R'];

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const R = params.rounds[cur].range || 6, side = Math.min(W - 24, H - 150);
      view = planeView({ x: (W - side) / 2, y: 98, w: side, h: side }, [-R, R], [-R, R]);
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      function arrow(a, b, col, w = 3) {
        const X0 = view.X(a[0]), Y0 = view.Y(a[1]), X1 = view.X(b[0]), Y1 = view.Y(b[1]), ang = Math.atan2(Y1 - Y0, X1 - X0);
        if (Math.hypot(X1 - X0, Y1 - Y0) < 2) return;
        p.stroke(col); p.strokeWeight(w); p.line(X0, Y0, X1 - Math.cos(ang) * 6, Y1 - Math.sin(ang) * 6);
        p.noStroke(); p.fill(col); p.triangle(X1, Y1, X1 - 13 * Math.cos(ang - 0.4), Y1 - 13 * Math.sin(ang - 0.4), X1 - 13 * Math.cos(ang + 0.4), Y1 - 13 * Math.sin(ang + 0.4));
      }
      const label = (txt, x, y, col) => { p.noStroke(); p.fill(col); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text(txt, x, y); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], vec = vecs[cur], w = sub(vec.tip, vec.tail), ok = meets(vec, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (meets(vecs[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        if (r.ask) fitText(p, r.ask, W / 2, 54, W - 24, 15);
        p.fill(ok ? C.ok : C.mute); fitText(p, readouts(r, w, vec) || `${r.name || 'w'} = ${vt(w)}`, W / 2, 78, W - 24, 14);
        drawPlane(p, C, view);
        const ctx = p.drawingContext; ctx.save(); ctx.beginPath(); ctx.rect(view.box.x, view.box.y, view.box.w, view.box.h); ctx.clip();
        (r.lines || []).forEach(([a, b, c]) => {
          p.stroke(C.mute); p.strokeWeight(2); const R = 20;
          if (Math.abs(b) > 1e-9) p.line(view.X(-R), view.Y((c + a * R) / b), view.X(R), view.Y((c - a * R) / b));
          else p.line(view.X(c / a), view.Y(-R), view.X(c / a), view.Y(R));
        });
        (r.given || []).forEach((G, i) => {
          const at = G.at || [0, 0], end = [at[0] + G.v[0], at[1] + G.v[1]], col = C[G.fam || FAM[i % FAM.length]];
          arrow(at, end, col, 2.5);
          label(G.name, view.X(at[0] + G.v[0] / 2) + 10, view.Y(at[1] + G.v[1] / 2) - 10, col);
        });
        (r.points || []).forEach(P => {
          p.noStroke(); p.fill(C.N); p.circle(view.X(P.p[0]), view.Y(P.p[1]), 10);
          label(P.name, view.X(P.p[0]) + 12, view.Y(P.p[1]) - 10, C.N);
        });
        const col = locked ? (ok ? C.ok : C.bad) : ok ? C.ok : C.brand;
        arrow(vec.tail, vec.tip, col, 4);
        ctx.restore(); p.fill(C.bg); p.stroke(C.bg); // p5 guarda el último color: lo resincroniza tras el recorte
        p.noStroke(); p.fill(col); p.circle(view.X(vec.tip[0]), view.Y(vec.tip[1]), 14);
        if (r.freeTail) { p.stroke(col); p.strokeWeight(2.5); p.fill(C.card); p.circle(view.X(vec.tail[0]), view.Y(vec.tail[1]), 13); }
        else { p.noStroke(); p.fill(C.ink); p.circle(view.X(vec.tail[0]), view.Y(vec.tail[1]), 7); }
        if (locked && !ok) { p.noStroke(); p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, `era ${solOf(r)}`, W / 2, view.box.y + view.box.h + 18, W - 24, 13); }
        else if (!touched[cur] && !locked) { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, r.freeTail ? 'Arrastra la punta y la cola' : 'Arrastra la punta de la flecha', W / 2, view.box.y + view.box.h + 18, W - 24, 13); }
      };

      const snap = (px, py) => {
        const R = params.rounds[cur].range || 6;
        return [Math.max(-R, Math.min(R, Math.round(view.toX(px)))), Math.max(-R, Math.min(R, Math.round(view.toY(py))))];
      };
      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; drag = null; layout(); api.sfx?.tap?.(); return false; }
        if (locked || !hitBox(view.box, p.mouseX, p.mouseY)) return;
        const r = params.rounds[cur], vec = vecs[cur];
        const pts = [{ x: view.X(vec.tip[0]), y: view.Y(vec.tip[1]) }];
        if (r.freeTail) pts.push({ x: view.X(vec.tail[0]), y: view.Y(vec.tail[1]) });
        // La punta tiene prioridad: la cola solo se agarra si está estrictamente más cerca.
        const d = pts.map(q => Math.hypot(q.x - p.mouseX, q.y - p.mouseY));
        drag = pts.length > 1 && d[1] < 26 && d[1] < d[0] ? 'tail' : 'tip';
        p.mouseDragged();
        return false;
      };
      p.mouseDragged = () => {
        if (!drag || locked) return;
        const vec = vecs[cur], s = snap(p.mouseX, p.mouseY);
        if (s[0] !== vec[drag][0] || s[1] !== vec[drag][1]) { vec[drag] = s; api.sfx?.tap?.(); }
        touched[cur] = true; api.ready(touched.every(Boolean));
        return false;
      };
      p.mouseReleased = () => { drag = null; };
    }, 1.42);

    return {
      loaded: m.ready,
      getState: () => ({ vecs: vecs.map(v => ({ tail: v.tail.slice(), tip: v.tip.slice() })) }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, dot, cross, meets };
})();
