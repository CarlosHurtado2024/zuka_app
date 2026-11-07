// El lado del cuadrado (lección 1.2.a, raíces): un cuadrado cuya esquina se arrastra; el área se
// calcula en vivo. Meta en cada ronda: el lado cuya área es la pedida (la raíz cuadrada). Con
// área 3 el lado es √3 ≈ 1.73: no se puede dar exacto, de ahí la tolerancia, que es sobre el lado
// (en unidades) para que el margen sea el mismo en todas las rondas. Los botones − y + ajustan fino.
// params = { rounds: [{ area }], max, step, tol }   state = { sides: [número | null] }

GAMES['lado-del-cuadrado'] = (() => {
  const fmt = n => String(+n.toFixed(2));
  const near = (s, area, tol) => s != null && Math.abs(s - Math.sqrt(area)) <= tol;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => near(state.sides[i], r.area, params.tol));
    const solution = params.rounds.map(r => `$\\sqrt{${fmt(r.area)}} ${Number.isInteger(Math.sqrt(r.area)) || Number.isInteger(Math.sqrt(r.area) * 2) ? '=' : '\\approx'} ${fmt(Math.sqrt(r.area))}$`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { sides: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], btns = [], box = null, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      btns = [{ x: w - 104, y: 8, w: 44, h: 30, d: -1 }, { x: w - 56, y: 8, w: 44, h: 30, d: 1 }];
      const size = Math.min(w - 110, h - 190);
      box = { x: 48, y: h - 70, size };   // esquina inferior izquierda fija; crece hacia arriba y a la derecha
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const pxPer = () => box.size / params.max;
    const side = () => st.sides[cur] ?? 0;
    const ready = () => api.ready(st.sides.every(s => s !== null));
    const setSide = v => { st.sides[cur] = +Math.max(0, Math.min(params.max, v)).toFixed(4); ready(); };

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], s = side(), area = s * s, good = near(s, r.area, params.tol);
        tabs.forEach((t, i) => {
          const v = st.sides[i], ok = near(v, params.rounds[i].area, params.tol);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : v !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        btns.forEach(b => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(18); p.text(b.d < 0 ? '−' : '+', b.x + b.w / 2, b.y + b.h / 2 - 1);
        });
        p.noStroke(); p.fill(C.N); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`Arrastra la esquina hasta que el área sea ${fmt(r.area)}`, 12, 46, W - 24, 36);
        // Cuadrícula de fondo (unidades) y el cuadrado.
        p.stroke(C.line); p.strokeWeight(1);
        for (let k = 0; k <= params.max; k++) { const o = k * pxPer(); p.line(box.x + o, box.y, box.x + o, box.y - box.size); p.line(box.x, box.y - o, box.x + box.size, box.y - o); }
        const px = s * pxPer();
        const col = locked ? (good ? C.ok : C.bad) : C.brand;
        p.noStroke(); p.fill(p.color(col)); p.drawingContext.globalAlpha = 0.25; p.rect(box.x, box.y - px, px, px); p.drawingContext.globalAlpha = 1;
        p.stroke(col); p.strokeWeight(2.5); p.noFill(); p.rect(box.x, box.y - px, px, px);
        p.noStroke(); p.fill(col); p.circle(box.x + px, box.y - px, 16);
        // Rótulos del lado y del área.
        p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.TOP); p.text(`lado ${fmt(s)}`, box.x + px / 2, box.y + 6);
        p.textAlign(p.RIGHT, p.CENTER); p.push(); p.translate(box.x - 8, box.y - px / 2); p.rotate(-Math.PI / 2); p.textAlign(p.CENTER, p.BOTTOM); p.text(`lado ${fmt(s)}`, 0, 0); p.pop();
        p.fill(locked ? col : C.ink); p.textSize(18); p.textAlign(p.CENTER, p.CENTER);
        p.text(`área = ${fmt(s)}² = ${fmt(area)}`, W / 2, 96);
        if (locked && !good) { p.fill(C.ok); p.textSize(12); p.text(`el lado era √${fmt(r.area)} ≈ ${fmt(Math.sqrt(r.area))}`, W / 2, 118); }
        const pend = st.sides.findIndex((v, i) => v === null && i !== cur);
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL);
        p.text(locked ? (grade(st, params).ok ? '¡Cuadrados perfectos!' : 'Mira el lado correcto en verde') : st.sides[cur] !== null && pend >= 0 ? `Ajusta fino con − y + · luego toca la pestaña ${pend + 1}` : 'Arrastra la esquina o ajusta fino con − y +', 12, H - 20, W - 24, 18);
      };

      const setFrom = (x, y) => setSide(Math.round((Math.max(x - box.x, box.y - y) / pxPer()) / params.step) * params.step);
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const b = btns.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) { setSide(side() + b.d * params.step); api.sfx?.tap?.(); return false; }
        if (p.mouseX >= box.x - 20 && p.mouseX <= box.x + box.size + 20 && p.mouseY <= box.y + 20 && p.mouseY >= box.y - box.size - 20) { drag = true; setFrom(p.mouseX, p.mouseY); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; setFrom(p.mouseX, p.mouseY); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ sides: [...st.sides] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
