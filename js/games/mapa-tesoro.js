// El mapa del tesoro (trigonometría, forma polar de un complejo): en un mapa cartesiano hay una X en el
// punto a + bi. El pirata sale del origen y solo entiende instrucciones polares: un rumbo (se gira la
// brújula, de 15° en 15°) y una cantidad de pasos exacta (− / + recorren √1, √2, √3, 2, √5…). En el mapa
// solo se ve hacia dónde mira el pirata; la caminata (y el cofre) aparecen al comprobar. Rondas con pestañas.
// params = { rounds: [{ a, b, label }] }   state = { walks: [{ k, deg } | null] }   (pasos = √k)

GAMES['mapa-tesoro'] = (() => {
  const K_MAX = 50;
  function radTxt(k) {
    let out = 1, inn = k;
    for (let f = 2; f * f <= inn; f++) while (inn % (f * f) === 0) { out *= f; inn /= f * f; }
    return inn === 1 ? String(out) : `${out === 1 ? '' : out}√${inn}`;
  }
  function argDeg(a, b) {
    let d = Math.atan2(b, a) * 180 / Math.PI;
    if (d < 0) d += 360;
    return Math.round(d * 1e6) / 1e6 % 360;
  }
  const want = r => ({ k: Math.round(r.a * r.a + r.b * r.b), deg: argDeg(r.a, r.b) });
  const okOne = (w, r) => !!w && w.k === want(r).k && Math.abs(((w.deg - want(r).deg) % 360 + 360) % 360) < 1e-6;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => okOne(state.walks[i], r));
    const solution = params.rounds.map(r => { const w = want(r); return `${r.label}: ${radTxt(w.k)} pasos a ${w.deg}°`; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { walks: params.rounds.map(() => null) };
    const plan = params.rounds.map(() => ({ k: 1, deg: 0, touched: false }));
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], map = null, comp = null, minus = null, plus = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const side = Math.min(w - 24, h - 250);
      map = { x: (w - side) / 2, y: 74, s: side };
      comp = { x: 64, y: map.y + side + 82, r: 50 };
      minus = { x: w - 150, y: comp.y + 6, w: 44, h: 40 }; plus = { x: w - 56, y: comp.y + 6, w: 44, h: 40 };
    }
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const sync = () => { const P = plan[cur]; st.walks[cur] = P.touched ? { k: P.k, deg: P.deg } : null; api.ready(st.walks.every(Boolean)); };
    const span = r => Math.max(3, Math.ceil(Math.max(Math.abs(r.a), Math.abs(r.b), Math.sqrt(plan[cur].k)) + 1));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], P = plan[cur], good = okOne(st.walks[cur], r), L = span(r);
        tabs.forEach((t, i) => {
          const col = locked ? (okOne(st.walks[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.walks[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const ask = `El tesoro está en z = ${r.label}`;
        let ts = 16; p.textSize(ts); while (p.textWidth(ask) > W - 16 && ts > 10) p.textSize(--ts);
        p.text(ask, W / 2, 56);

        // Mapa: papel, cuadrícula y ejes.
        const u = map.s / (2 * L), X = x => map.x + map.s / 2 + x * u, Y = y => map.y + map.s / 2 - y * u;
        p.noStroke(); p.fill(C.N + '18'); p.rect(map.x, map.y, map.s, map.s, 10);
        p.stroke(C.line); p.strokeWeight(1);
        for (let k = -L; k <= L; k++) { p.line(X(k), map.y, X(k), map.y + map.s); p.line(map.x, Y(k), map.x + map.s, Y(k)); }
        p.stroke(C.mute); p.strokeWeight(2); p.line(map.x, Y(0), map.x + map.s, Y(0)); p.line(X(0), map.y, X(0), map.y + map.s);
        p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL);
        p.textAlign(p.RIGHT, p.TOP); p.text('Re', map.x + map.s - 4, Y(0) + 3); p.textAlign(p.LEFT, p.TOP); p.text('Im', X(0) + 4, map.y + 3);
        p.textAlign(p.CENTER, p.TOP); for (let k = -L + 1; k < L; k++) if (k) p.text(k, X(k), Y(0) + 3);
        // La X del tesoro.
        const tx = X(r.a), ty = Y(r.b);
        p.stroke(C.I); p.strokeWeight(4); p.line(tx - 8, ty - 8, tx + 8, ty + 8); p.line(tx - 8, ty + 8, tx + 8, ty - 8);
        // El plan: rumbo y pasos, con huellas.
        const rr = Math.sqrt(P.k), rad = P.deg * Math.PI / 180, ex = X(rr * Math.cos(rad)), ey = Y(rr * Math.sin(rad));
        if (P.touched && !locked) {   // solo el rumbo: una flecha corta de largo fijo
          const ax = X(0) + 34 * Math.cos(rad), ay = Y(0) - 34 * Math.sin(rad);
          p.stroke(C.Z); p.strokeWeight(3); p.line(X(0), Y(0), ax, ay); p.noStroke(); p.fill(C.Z); p.circle(ax, ay, 8);
        }
        if (P.touched && locked) {
          p.stroke(C.Z); p.strokeWeight(2.5); p.drawingContext.setLineDash([5, 6]); p.line(X(0), Y(0), ex, ey); p.drawingContext.setLineDash([]);
          const n = Math.max(2, Math.round(rr * 2));
          for (let j = 1; j <= n; j++) { const f = j / n; p.noStroke(); p.fill(C.Z + 'aa'); p.circle(X(0) + (ex - X(0)) * f + (j % 2 ? 3 : -3), Y(0) + (ey - Y(0)) * f, 5); }
        }
        // El pirata (en el origen) y, al comprobar, el cofre.
        p.noStroke(); p.fill(C.N); p.circle(X(0), Y(0) - 10, 12); p.fill(C.ink); p.rect(X(0) - 7, Y(0) - 16, 14, 4, 2);
        if (locked) {
          const col = good ? C.ok : C.bad, [cx, cy] = good ? [tx, ty] : [ex, ey];
          p.fill(col); p.rect(cx - 10, cy - 8, 20, 14, 3); p.fill(C.N); p.rect(cx - 10, cy - 12, 20, 5, 2);
          if (!good) { const w = want(r); p.fill(C.ok); p.textSize(13); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text(`era: ${radTxt(w.k)} pasos a ${w.deg}°`, W / 2, map.y + map.s + 14); }
        }

        // Brújula del rumbo.
        p.noFill(); p.stroke(C.line); p.strokeWeight(2); p.circle(comp.x, comp.y, comp.r * 2);
        for (let d = 0; d < 360; d += 45) { const a = d * Math.PI / 180; p.line(comp.x + (comp.r - 6) * Math.cos(a), comp.y - (comp.r - 6) * Math.sin(a), comp.x + comp.r * Math.cos(a), comp.y - comp.r * Math.sin(a)); }
        p.stroke(C.Z); p.strokeWeight(4); p.line(comp.x, comp.y, comp.x + (comp.r - 8) * Math.cos(rad), comp.y - (comp.r - 8) * Math.sin(rad));
        p.noStroke(); p.fill(C.Z); p.circle(comp.x + (comp.r - 8) * Math.cos(rad), comp.y - (comp.r - 8) * Math.sin(rad), 12);
        p.fill(C.ink); p.textSize(12); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.text('rumbo', comp.x + comp.r + 26, comp.y - comp.r + 6);
        // Pasos.
        const mid = (minus.x + plus.x + plus.w) / 2;
        p.textSize(13); p.fill(C.mute); p.text('pasos', mid, comp.y - 34);
        p.textSize(22); p.fill(P.touched ? C.ink : C.mute); p.text(radTxt(P.k), mid, comp.y - 12);
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => { p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10); p.noStroke(); p.fill(C.ink); p.textSize(22); p.text(s, b.x + b.w / 2, b.y + b.h / 2); });
        p.fill(P.touched ? C.Z : C.mute);
        const msg = P.touched ? `${radTxt(P.k)} pasos a ${P.deg}°` : 'gira la brújula y elige los pasos';
        let fs = 14; p.textSize(fs); while (p.textWidth(msg) > W - 16 && fs > 10) p.textSize(--fs);
        p.text(msg, W / 2, comp.y + comp.r + 34);
      };

      const setDeg = () => { let d = Math.atan2(comp.y - p.mouseY, p.mouseX - comp.x) * 180 / Math.PI; d = ((Math.round(d / 15) * 15) % 360 + 360) % 360; plan[cur].deg = d; plan[cur].touched = true; sync(); };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const P = plan[cur];
        if (inside(minus, p.mouseX, p.mouseY)) { P.k = Math.max(1, P.k - 1); P.touched = true; sync(); api.sfx?.tap?.(); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { P.k = Math.min(K_MAX, P.k + 1); P.touched = true; sync(); api.sfx?.tap?.(); return false; }
        if (Math.hypot(p.mouseX - comp.x, p.mouseY - comp.y) < comp.r + 24) { drag = true; setDeg(); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; setDeg(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ walks: st.walks.map(w => (w ? { ...w } : null)) }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, radTxt, argDeg };
})();
