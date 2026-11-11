// Combina vectores (geometría vectorial, combinaciones lineales): dos vectores u y v y una estrella.
// Con las perillas de a y b se arma el camino a·u (desde el origen) seguido de b·v; la meta es que la
// punta llegue exactamente a la estrella. Sirve para la vista por columnas de un sistema 2×2, para las
// coordenadas de un punto en otra base y para ubicar puntos de una recta.
// params = { rounds: [{ u, v, target, step, names: ['u', 'v'] }] }   state = { ab: [[a, b]] }

GAMES['combina-vectores'] = (() => {
  const RANGE = 6, LIM = 6;
  const n = v => String(+(+v).toFixed(3)).replace('-', '−');
  const hits = (ab, r) => !!ab && [0, 1].every(c => Math.abs(ab[0] * r.u[c] + ab[1] * r.v[c] - r.target[c]) < 1e-9);
  function coefs(r) {
    const d = r.u[0] * r.v[1] - r.u[1] * r.v[0];
    return [(r.target[0] * r.v[1] - r.target[1] * r.v[0]) / d, (r.u[0] * r.target[1] - r.u[1] * r.target[0]) / d].map(x => Math.round(x * 1e9) / 1e9 || 0);
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => hits(state.ab[i], r));
    return { ok, solution: params.rounds.map(r => { const [a, b] = coefs(r); return `a = ${n(a)}, b = ${n(b)}`; }).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const ab = params.rounds.map(() => [0, 0]), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], view = null, knobs = [];

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const side = Math.min(W - 24, H - 192);
      view = planeView({ x: (W - side) / 2, y: 92, w: side, h: side }, [-RANGE, RANGE], [-RANGE, RANGE]);
      const y0 = view.box.y + side + 12;
      knobs = [0, 1].map(i => ({ i, y: y0 + i * 42, minus: { x: W - 150, y: y0 + i * 42, w: 42, h: 34 }, plus: { x: W - 54, y: y0 + i * 42, w: 42, h: 34 } }));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      function arrow(x0, y0, x1, y1, col, w = 3) {
        const X0 = view.X(x0), Y0 = view.Y(y0), X1 = view.X(x1), Y1 = view.Y(y1), ang = Math.atan2(Y1 - Y0, X1 - X0), L = Math.hypot(X1 - X0, Y1 - Y0);
        if (L < 2) return;
        p.stroke(col); p.strokeWeight(w); p.line(X0, Y0, X1 - Math.cos(ang) * 6, Y1 - Math.sin(ang) * 6);
        p.noStroke(); p.fill(col); p.triangle(X1, Y1, X1 - 12 * Math.cos(ang - 0.4), Y1 - 12 * Math.sin(ang - 0.4), X1 - 12 * Math.cos(ang + 0.4), Y1 - 12 * Math.sin(ang + 0.4));
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], [a, b] = ab[cur], ok = hits(ab[cur], r), nm = r.names || ['u', 'v'];
        drawTabs(p, C, tabs, cur, i => (locked ? (hits(ab[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.fill(C.Z);
        fitText(p, `${nm[0]} = (${n(r.u[0])}, ${n(r.u[1])})   ${nm[1]} = (${n(r.v[0])}, ${n(r.v[1])})`, W / 2, 52, W - 24, 14);
        p.fill(ok ? C.ok : C.ink); fitText(p, `${n(a)}·${nm[0]} + ${n(b)}·${nm[1]} = (${n(a * r.u[0] + b * r.v[0])}, ${n(a * r.u[1] + b * r.v[1])})`, W / 2, 74, W - 24, 16);
        drawPlane(p, C, view);
        // Estrella.
        const sx = view.X(r.target[0]), sy = view.Y(r.target[1]);
        p.stroke(C.ink); p.strokeWeight(1); p.fill(ok ? C.ok : C.N); p.beginShape();
        for (let k = 0; k < 10; k++) { const rr = k % 2 ? 5 : 12, t = -Math.PI / 2 + k * Math.PI / 5; p.vertex(sx + rr * Math.cos(t), sy + rr * Math.sin(t)); }
        p.endShape(p.CLOSE);
        // Vectores base (tenues) y camino.
        p.drawingContext.globalAlpha = 0.35; arrow(0, 0, r.u[0], r.u[1], C.Z, 2); arrow(0, 0, r.v[0], r.v[1], C.I, 2); p.drawingContext.globalAlpha = 1;
        const mx = a * r.u[0], my = a * r.u[1], ex = mx + b * r.v[0], ey = my + b * r.v[1];
        const ctx = p.drawingContext; ctx.save(); ctx.beginPath(); ctx.rect(view.box.x, view.box.y, view.box.w, view.box.h); ctx.clip();
        arrow(0, 0, mx, my, C.Z); arrow(mx, my, ex, ey, C.I);
        ctx.restore(); p.fill(C.bg); p.stroke(C.bg); // p5 guarda el último color: lo resincroniza tras el recorte
        p.noStroke(); p.fill(ok ? C.ok : C.ink); p.circle(view.X(ex), view.Y(ey), 8);
        if (locked && !ok) { const [A, B] = coefs(r); p.fill(C.ok); p.textSize(13); p.text(`era a = ${n(A)}, b = ${n(B)}`, W / 2, view.box.y + view.box.h - 14); }
        knobs.forEach(k => {
          p.noStroke(); p.fill(k.i ? C.I : C.Z); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
          p.text(k.i ? `b (con ${nm[1]})` : `a (con ${nm[0]})`, 14, k.y + 17);
          p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(16); p.text(n(ab[cur][k.i]), W - 81, k.y + 17);
          [[k.minus, '−'], [k.plus, '+']].forEach(([bx, s]) => {
            p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(bx.x, bx.y, bx.w, bx.h, 9);
            p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(18); p.text(s, bx.x + bx.w / 2, bx.y + bx.h / 2);
          });
        });
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        for (const k of knobs) {
          const d = hitBox(k.minus, p.mouseX, p.mouseY) ? -1 : hitBox(k.plus, p.mouseX, p.mouseY) ? 1 : 0;
          if (!d) continue;
          const step = params.rounds[cur].step || 1;
          ab[cur][k.i] = Math.max(-LIM, Math.min(LIM, +(ab[cur][k.i] + d * step).toFixed(3)));
          touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean));
          return false;
        }
      };
    }, 1.52);

    return {
      loaded: m.ready,
      getState: () => ({ ab: ab.map(x => x.slice()) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, coefs, LIM };
})();
