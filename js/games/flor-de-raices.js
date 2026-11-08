// La flor de raíces (trigonometría, raíces n-ésimas): las n raíces de z son los pétalos de una flor
// regular, separados 360°/n. Se gira la flor arrastrando cualquier pétalo (de 5° en 5°) y se elige el
// radio con − / + entre módulos candidatos (ⁿ√r, r/n, √r…). Al girar se ven el ángulo φ del pétalo
// dorado y su potencia nφ; z aparece como un punto fantasma. Rondas con pestañas.
// params = { rounds: [{ n, r, deg, label }] }   state = { flowers: [{ rho, rot } | null] }

GAMES['flor-de-raices'] = (() => {
  const SUP = { 2: '', 3: '∛', 4: '∜' };
  const norm = d => ((Math.round(d) % 360) + 360) % 360;
  const rootR = R => Math.pow(R.r, 1 / R.n);
  const isInt = v => Math.abs(v - Math.round(v)) < 1e-9;
  function radTxt(n, r) {
    const v = Math.pow(r, 1 / n);
    if (isInt(v)) return String(Math.round(v));
    return n === 2 ? `√${r}` : SUP[n] ? `${SUP[n]}${r}` : `${r}^(1/${n})`;
  }
  // Radios candidatos con su etiqueta.
  function radii(R) {
    const w = rootR(R), wt = radTxt(R.n, R.r);
    // La correcta nunca queda en un extremo: hay una trampa menor (ⁿ√r − 1 o ⁿ√r / 2) y otras mayores.
    const low = w - 1 > 0.3 ? [w - 1, isInt(w) ? String(Math.round(w) - 1) : `${wt} − 1`] : [w / 2, `${wt}/2`];
    const c = [[w, wt], low, [R.r / R.n, isInt(R.r / R.n) ? String(R.r / R.n) : `${R.r}/${R.n}`], [Math.sqrt(R.r), radTxt(2, R.r)], [w + 1, isInt(w) ? String(Math.round(w) + 1) : `${wt} + 1`]];
    const out = [];
    for (const [v, t] of c) if (out.length < 4 && !out.some(o => Math.abs(o.v - v) < 1e-9)) out.push({ v, t });
    return out.sort((a, b) => a.v - b.v);
  }
  const step = R => 360 / R.n;
  const okOne = (f, R) => !!f && Math.abs(f.rho - rootR(R)) < 1e-9 && Math.abs((((f.rot - R.deg / R.n) % step(R)) + step(R)) % step(R)) < 1e-6
    || (!!f && Math.abs(f.rho - rootR(R)) < 1e-9 && Math.abs(step(R) - (((f.rot - R.deg / R.n) % step(R)) + step(R)) % step(R)) < 1e-6);
  const angles = R => Array.from({ length: R.n }, (_, k) => +(R.deg / R.n + k * step(R)).toFixed(2));

  function grade(state, params) {
    const ok = params.rounds.every((R, i) => okOne(state.flowers[i], R));
    const solution = params.rounds.map(R => `${R.label || 'z'}: radio ${radTxt(R.n, R.r)}, pétalos en ${angles(R).map(a => `${a}°`).join(', ')}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { flowers: params.rounds.map(() => null) };
    const fl = params.rounds.map(R => ({ i: radii(R).length - 1, rot: 10, touched: false }));   // empieza en el radio mayor, que nunca es el correcto
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cx = 0, cy = 0, Rpx = 0, minus = null, plus = null, drag = false, grabOff = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      Rpx = Math.min(w * 0.42, (h - 230) / 2); cx = w / 2; cy = 100 + Rpx;
      minus = { x: 12, y: h - 54, w: 52, h: 44 }; plus = { x: w - 64, y: h - 54, w: 52, h: 44 };
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const sync = () => { const F = fl[cur], R = params.rounds[cur]; st.flowers[cur] = F.touched ? { rho: radii(R)[F.i].v, rot: F.rot } : null; api.ready(st.flowers.every(Boolean)); };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const R = params.rounds[cur], F = fl[cur], rads = radii(R), rho = rads[F.i].v, good = okOne(st.flowers[cur], R);
        tabs.forEach((t, i) => {
          const col = locked ? (okOne(st.flowers[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.flowers[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const ask = `Raíces ${['', '', 'cuadradas', 'cúbicas', 'cuartas', 'quintas', 'sextas'][R.n] || `${R.n}-ésimas`} de z = ${R.label}`;
        let ts = 16; p.textSize(ts); while (p.textWidth(ask) > W - 16 && ts > 10) p.textSize(--ts);
        p.text(ask, W / 2, 56);
        p.textSize(12); p.textStyle(p.NORMAL); p.fill(C.mute); p.text(`z = ${R.r} cis ${R.deg}°  ·  ${R.n} pétalos`, W / 2, 78);

        const maxV = rads[rads.length - 1].v * 1.12, k = Rpx / maxV;
        const P = (mod, deg) => [cx + mod * k * Math.cos(deg * Math.PI / 180), cy - mod * k * Math.sin(deg * Math.PI / 180)];
        p.stroke(C.line); p.strokeWeight(1.5); p.line(cx - Rpx, cy, cx + Rpx, cy); p.line(cx, cy - Rpx, cx, cy + Rpx);
        rads.forEach((o, j) => { p.noFill(); p.stroke(j === F.i ? C.Q : C.line); p.strokeWeight(j === F.i ? 2 : 1); p.drawingContext.setLineDash([3, 5]); p.circle(cx, cy, 2 * o.v * k); p.drawingContext.setLineDash([]); });
        // z fantasma.
        const far = R.r > maxV, [zx, zy] = P(far ? maxV * 0.97 : R.r, R.deg);
        p.noFill(); p.stroke(C.I); p.strokeWeight(2); if (far) p.drawingContext.setLineDash([3, 3]); p.circle(zx, zy, 16); p.drawingContext.setLineDash([]);
        p.noStroke(); p.fill(C.I); p.textSize(12); p.textStyle(p.BOLD); p.text(far ? 'z (más lejos)' : 'z', zx + (far ? 0 : 13), zy - 14);
        // Pétalos.
        for (let j = 0; j < R.n; j++) {
          const d = F.rot + j * step(R), [px, py] = P(rho, d), a = Math.atan2(py - cy, px - cx);
          const col = locked ? (good ? C.ok : C.bad) : j === 0 ? C.N : C.Q;
          p.push(); p.translate((cx + px) / 2, (cy + py) / 2); p.rotate(a);
          p.noStroke(); p.fill(col + '55'); p.ellipse(0, 0, Math.hypot(px - cx, py - cy), 22);
          p.pop();
          p.noStroke(); p.fill(col); p.circle(px, py, 13);
        }
        p.fill(C.N); p.circle(cx, cy, 10);
        if (locked && !good) angles(R).forEach(d => { const [x, y] = P(rootR(R), d); p.noFill(); p.stroke(C.ok); p.strokeWeight(2.5); p.circle(x, y, 22); });

        // Lecturas.
        const y0 = cy + Rpx + 22, phi = norm(F.rot);
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(16); p.fill(F.touched ? C.ink : C.mute);
        const msg = F.touched ? `radio ${rads[F.i].t}  ·  pétalo dorado en ${phi}°` : 'gira la flor y elige el radio';
        let fs = 16; p.textSize(fs); while (p.textWidth(msg) > W - 16 && fs > 10) p.textSize(--fs);
        p.text(msg, W / 2, y0);
        p.textSize(12); p.textStyle(p.NORMAL); p.fill(C.mute); p.text(`los pétalos van cada ${+step(R).toFixed(2)}°`, W / 2, y0 + 20);
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(13); p.text(`radio ${radTxt(R.n, R.r)}, un pétalo en ${angles(R)[0]}°`, W / 2, y0 + 40); }
        [[minus, '− radio'], [plus, '+ radio']].forEach(([b, s]) => { p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10); p.noStroke(); p.fill(C.ink); p.textSize(11); p.textStyle(p.BOLD); p.text(s, b.x + b.w / 2, b.y + b.h / 2); });
      };

      const angAt = () => Math.atan2(cy - p.mouseY, p.mouseX - cx) * 180 / Math.PI;
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const F = fl[cur], R = params.rounds[cur];
        if (inside(minus, p.mouseX, p.mouseY)) { F.i = Math.max(0, F.i - 1); F.touched = true; sync(); api.sfx?.tap?.(); return false; }
        if (inside(plus, p.mouseX, p.mouseY)) { F.i = Math.min(radii(R).length - 1, F.i + 1); F.touched = true; sync(); api.sfx?.tap?.(); return false; }
        if (Math.hypot(p.mouseX - cx, p.mouseY - cy) < Rpx + 10) { drag = true; grabOff = angAt() - F.rot; return false; }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        const F = fl[cur], R = params.rounds[cur];
        F.rot = ((Math.round((angAt() - grabOff) / 5) * 5) % step(R) + step(R)) % step(R);
        F.touched = true; sync(); return false;
      };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ flowers: st.flowers.map(f => (f ? { ...f } : null)) }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, rootR, radTxt, radii, angles, okOne };
})();
