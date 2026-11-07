// Pesca de raíces (trigonometría, ecuaciones): el lado izquierdo de la ecuación es una ola (la gráfica)
// y el lado derecho, el nivel del agua. Los peces viven justo donde la ola cruza o toca el agua: esas son
// las soluciones en [0, 2π). Se tocan las marcas del muelle (cada π/12) para lanzar anzuelos; tocar otra
// vez lo recoge. Hay que atrapar todas sin anzuelos de más. Rondas con pestañas.
// params = { rounds: [{ label, g, k } | { label, f }] }   (f = g − k; si hay g se dibuja g y el agua en k)
// state = { hooks: [[grados]] }

GAMES['pesca-raices'] = (() => {
  const MAX_HOOKS = 6;
  const D = Math.PI / 180;
  const fOf = r => r.f || (x => r.g(x) - (r.k || 0));
  function rootsOf(f) {
    if (typeof f !== 'function') f = fOf(f);        // también acepta una ronda { g, k } o { f }
    return Array.from({ length: 24 }, (_, k) => k * 15).filter(d => { const v = f(d * D); return Number.isFinite(v) && Math.abs(v) < 1e-7; });
  }
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  function piTxt(d) {
    if (d === 0) return '0';
    const k = d / 15, g = gcd(k, 12), n = k / g, den = 12 / g;
    return `${n === 1 ? '' : n}π${den === 1 ? '' : '/' + den}`;
  }
  const same = (hooks, roots) => !!hooks && hooks.length === roots.length && roots.every(r => hooks.includes(r));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.hooks[i], rootsOf(fOf(r))));
    const solution = params.rounds.map(r => `${r.label || 'ecuación'}: x = ${rootsOf(fOf(r)).map(d => `${piTxt(d)} (${d}°)`).join(', ')}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { hooks: params.rounds.map(() => []) };
    const touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], scr = null, last = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      scr = { x: 16, y: 120, w: w - 32, h: h - 250 };
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const X = d => scr.x + (d / 360) * scr.w;
    const yr = r => r.yr || 3;
    const Y = (v, r) => scr.y + scr.h / 2 - (v / yr(r)) * (scr.h / 2 - 8);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], g = r.g || r.f, k = r.g ? r.k || 0 : 0, hooks = st.hooks[cur], roots = rootsOf(fOf(r));
        tabs.forEach((t, i) => {
          const col = locked ? (same(st.hooks[i], rootsOf(fOf(params.rounds[i]))) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        let ts = 18; p.textSize(ts); const lab = r.label || '';
        while (p.textWidth(lab) > W - 20 && ts > 11) p.textSize(--ts);
        p.fill(C.ink); p.text(lab, W / 2, 56);
        p.textSize(12); p.textStyle(p.NORMAL); p.fill(C.mute); p.text(`en [0, 2π)  ·  anzuelos: ${hooks.length} de ${MAX_HOOKS}`, W / 2, 80);

        // Agua (debajo del nivel k) y la ola.
        const wy = Y(k, r);
        p.noStroke(); p.fill(C.Z + '30'); p.rect(scr.x, wy, scr.w, scr.y + scr.h - wy, 0, 0, 10, 10);
        p.stroke(C.Z); p.strokeWeight(2); p.line(scr.x, wy, scr.x + scr.w, wy);
        for (let j = 0; j < 3; j++) { const sx = scr.x + ((p.frameCount * 0.6 + j * scr.w / 3) % scr.w); p.noFill(); p.stroke(C.Z + '88'); p.strokeWeight(1.5); p.arc(sx, wy + 14 + j * 10, 14, 6, 0, Math.PI); }
        p.stroke(C.line); p.strokeWeight(1); [90, 180, 270].forEach(d => p.line(X(d), scr.y, X(d), scr.y + scr.h));
        p.noFill(); p.stroke(C.I); p.strokeWeight(3.5);
        let open = false, prev = null;
        for (let px = 0; px <= scr.w; px += 2) {
          const v = g((px / scr.w) * 2 * Math.PI), inR = Number.isFinite(v) && Math.abs(v) <= yr(r) * 1.05;
          if (!inR || (prev !== null && Math.abs(v - prev) > yr(r))) { if (open) p.endShape(); open = false; prev = inR ? v : null; if (!inR) continue; }
          if (!open) { p.beginShape(); open = true; }
          p.vertex(scr.x + px, Y(v, r)); prev = v;
        }
        if (open) p.endShape();
        p.noStroke(); p.fill(C.Z); p.textSize(11); p.textAlign(p.RIGHT, p.BOTTOM); p.text(`agua: y = ${String(k).replace('-', '−')}`, scr.x + scr.w - 4, wy - 3);

        // Muelle con 24 marcas y anzuelos.
        const my = scr.y + scr.h + 24;
        p.stroke(C.N); p.strokeWeight(5); p.line(scr.x, my, scr.x + scr.w, my);
        for (let j = 0; j < 24; j++) {
          const d = j * 15, x = X(d), on = hooks.includes(d), isRoot = roots.includes(d);
          p.stroke(C.ink); p.strokeWeight(j % 6 === 0 ? 2.5 : 1.2); p.line(x, my - (j % 6 === 0 ? 8 : 5), x, my + (j % 6 === 0 ? 8 : 5));
          if (on) {
            const col = locked ? (isRoot ? C.ok : C.bad) : C.N;
            p.stroke(col); p.strokeWeight(1.5); p.line(x, my, x, wy);
            p.noFill(); p.strokeWeight(2.5); p.arc(x - 3, wy + 6, 8, 10, 0, Math.PI);
            if (locked && isRoot) { p.noStroke(); p.fill(C.ok); p.ellipse(x, wy + 18, 16, 8); p.triangle(x + 7, wy + 18, x + 13, wy + 13, x + 13, wy + 23); }
          } else if (locked && isRoot) { p.noStroke(); p.fill(C.ok + '99'); p.ellipse(x, wy + 18, 16, 8); }
        }
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textAlign(p.CENTER, p.TOP);
        ['0', 'π/2', 'π', '3π/2', '2π'].forEach((s, j) => p.text(s, X(j * 90), my + 12));
        p.textSize(15); p.textStyle(p.BOLD); p.fill(last === null ? C.mute : C.ink);
        p.text(last === null ? 'toca el muelle para lanzar un anzuelo' : `x = ${piTxt(last)}  (${last}°)`, W / 2, my + 34);
        if (locked && !same(hooks, roots)) { p.fill(C.ok); p.textSize(13); p.text(`peces en ${roots.map(piTxt).join(', ')}`, W / 2, my + 56); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; last = null; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (p.mouseY < scr.y || p.mouseY > scr.y + scr.h + 50 || p.mouseX < scr.x - 10 || p.mouseX > scr.x + scr.w + 10) return;
        const d = Math.round(((p.mouseX - scr.x) / scr.w) * 24) * 15;
        if (d < 0 || d >= 360) return false;
        const hooks = st.hooks[cur], i = hooks.indexOf(d);
        if (i >= 0) hooks.splice(i, 1); else if (hooks.length < MAX_HOOKS) hooks.push(d);
        last = d; touched[cur] = true; api.ready(touched.every(Boolean)); api.sfx?.tap?.(); return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ hooks: st.hooks.map(h => [...h]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, rootsOf, MAX_HOOKS };
})();
