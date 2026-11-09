// Duplica y mira (Álgebra 1.2, magnitudes directa e inversamente proporcionales): cada ronda cuenta una
// situación con dos magnitudes. «Antes» muestra sus barras; en «Después» la primera ya cambió (×2, ×3…) y
// hay que subir o bajar la barra de la segunda hasta su valor (arrastre o − / +). La flecha dice por cuánto
// se multiplicó cada una. Al comprobar se revela el tipo: directa (y/x fijo), inversa (x·y fijo) o ninguna.
// params = { rounds: [{ text, nx, ny, ux, uy, x0, y0, x1, y1, step, ymax }] }   state = { ys: [y | null] }

GAMES['duplica-magnitud'] = (() => {
  const EPS = 1e-9;
  function kindOf(x0, y0, x1, y1) {
    if (Math.abs(y1 / y0 - x1 / x0) < EPS) return 'directa';
    if (Math.abs(x1 * y1 - x0 * y0) < EPS) return 'inversa';
    return 'ninguna';
  }
  const near = (y, r) => y != null && Math.abs(y - r.y1) <= r.step / 2 + EPS;
  const fmt = v => { const r = +v.toFixed(2); return Number.isInteger(r) ? String(r).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(r); };
  const times = (a, b) => { const k = b / a; return k >= 1 ? `×${fmt(k)}` : `÷${fmt(1 / k)}`; };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => near(state.ys?.[i], r));
    const solution = params.rounds.map(r => `${fmt(r.y1)} ${r.uy || ''} (${kindOf(r.x0, r.y0, r.x1, r.y1)})`.replace('  ', ' ')).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { ys: R.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], area = null, bars = [], minus = null, plus = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      area = { y0: 166, y1: h - 100 };
      const bw = Math.min(46, (w - 60) / 6), cx = [w * 0.27, w * 0.73];
      bars = [cx[0] - bw - 6, cx[0] + 6, cx[1] - bw - 6, cx[1] + 6].map(x => ({ x, w: bw }));
      minus = { x: 14, y: h - 52, w: 64, h: 38 }; plus = { x: w - 78, y: h - 52, w: 64, h: 38 };
    }
    const scaleX = r => Math.max(r.x0, r.x1) * 1.15;
    const py = (v, top) => area.y1 - (v / top) * (area.y1 - area.y0);
    function setY(my) {
      const r = R[cur], v = (area.y1 - my) / (area.y1 - area.y0) * r.ymax;
      st.ys[cur] = Math.min(r.ymax, Math.max(0, Math.round(v / r.step) * r.step));
      api.ready(st.ys.every(y => y != null));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function bar(b, v, top, col, label, live) {
        const y = py(v, top);
        p.noStroke(); p.fill(C.card); p.rect(b.x, area.y0, b.w, area.y1 - area.y0, 8);
        p.fill(col); p.rect(b.x, y, b.w, area.y1 - y, 8);
        if (live) { p.stroke(C.ink); p.strokeWeight(2); p.line(b.x - 4, y, b.x + b.w + 4, y); }
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.BOTTOM);
        fitText(p, label, b.x + b.w / 2, y - 4, b.w + 30, 13);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], y1 = st.ys[cur], good = near(y1, r), xt = scaleX(r);
        drawTabs(p, C, tabs, cur, i => (locked ? (near(st.ys[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.ys[i] != null ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textStyle(p.NORMAL); p.textSize(13); p.textAlign(p.LEFT, p.TOP);
        p.text(r.text, 14, 48, W - 28, 60);
        // Encabezados de las columnas y leyenda de colores
        p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.fill(C.mute);
        p.text('Antes', W * 0.27, 118); p.text('Después', W * 0.73, 118);
        p.textSize(11); p.textStyle(p.NORMAL);
        p.fill(C.N); p.text(`■ ${r.nx}`, W * 0.27, 136); p.fill(C.Z); p.text(`■ ${r.ny}`, W * 0.73, 136);
        bar(bars[0], r.x0, xt, C.N, `${fmt(r.x0)}`, false);
        bar(bars[1], r.y0, r.ymax, C.Z, `${fmt(r.y0)}`, false);
        bar(bars[2], r.x1, xt, C.N, `${fmt(r.x1)}`, false);
        if (y1 != null) bar(bars[3], y1, r.ymax, good && locked ? C.ok : C.Z, `${fmt(y1)}`, !locked);
        else { p.noStroke(); p.fill(C.card); p.rect(bars[3].x, area.y0, bars[3].w, area.y1 - area.y0, 8); p.fill(C.mute); p.textSize(22); p.textStyle(p.BOLD); p.text('?', bars[3].x + bars[3].w / 2, (area.y0 + area.y1) / 2); }
        // Cuánto se multiplicó cada una (debajo de las barras)
        p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const yy = area.y1 + 16;
        p.fill(C.N); fitText(p, `${r.nx} ${times(r.x0, r.x1)}`, W * 0.3, yy, W * 0.42, 12);
        if (y1) { p.fill(C.Z); fitText(p, `${r.ny} ${times(r.y0, y1)}`, W * 0.72, yy, W * 0.42, 12); }
        // Botones y pie
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => {
          p.stroke(locked ? C.line : C.brand); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(locked ? C.mute : C.brand); p.textSize(20); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
        p.noStroke(); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
        if (locked) {
          const k = kindOf(r.x0, r.y0, r.x1, r.y1);
          p.fill(good ? C.ok : C.bad); p.textStyle(p.BOLD);
          fitText(p, `${fmt(r.y1)} ${r.uy || ''}`, W / 2, minus.y + 10, W - 170, 13); fitText(p, `relación ${k}`, W / 2, minus.y + 28, W - 170, 13);
        } else { p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, `Arrastra la barra azul de «Después»`, W / 2, minus.y + minus.h / 2, W - 170, 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const r = R[cur];
        if (hitBox(minus, p.mouseX, p.mouseY) || hitBox(plus, p.mouseX, p.mouseY)) {
          const d = hitBox(plus, p.mouseX, p.mouseY) ? 1 : -1, y = st.ys[cur] ?? r.y0;
          st.ys[cur] = Math.min(r.ymax, Math.max(0, +(y + d * r.step).toFixed(6)));
          api.ready(st.ys.every(y => y != null)); api.sfx?.tap?.(); return false;
        }
        const b = bars[3];
        if (p.mouseX > b.x - 24 && p.mouseX < b.x + b.w + 24 && p.mouseY > area.y0 - 20 && p.mouseY < area.y1 + 10) { drag = true; setY(p.mouseY); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { setY(p.mouseY); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ ys: [...st.ys] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, kindOf };
})();
