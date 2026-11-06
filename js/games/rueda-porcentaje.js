// La rueda del porcentaje (lección 1.3): un pastel marcado en unidades del total (170, 180, 240)
// y una aguja que se gira; el sector sombreado dice cuántas unidades cubre y hay que dejarlo
// justo en la parte pedida para leer qué porcentaje es (ejercicios 1.9, 1.13 y 1.16).
// params = { rounds: [{ part, whole }], tol }   state = { pct: (número | null)[] }

GAMES['rueda-porcentaje'] = (() => {
  const answerOf = r => (100 * r.part) / r.whole;
  const fmt = n => String(+n.toFixed(1));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.pct[i] !== null && Math.abs(state.pct[i] - answerOf(r)) <= params.tol);
    return { ok, solution: params.rounds.map(r => `${fmt(r.part)} de ${r.whole} = ${fmt(answerOf(r))} %`).join(', ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const N = params.rounds.length;
    const st = { pct: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cx = 0, cy = 0, R = 0, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * ((w - 24) / N), y: 8, w: (w - 24) / N - 6, h: 34 }));
      R = Math.min(w, h) * 0.3; cx = w / 2; cy = 60 + R + 24;
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const angOf = pct => -Math.PI / 2 + (pct / 100) * Math.PI * 2;  // desde las 12, sentido horario
    function setFromPointer(x, y) {
      let a = Math.atan2(y - cy, x - cx) + Math.PI / 2;
      if (a < 0) a += Math.PI * 2;
      st.pct[cur] = Math.round((a / (Math.PI * 2)) * 1000) / 10;
      api.ready(st.pct.every(v => v !== null));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], pct = st.pct[cur], ans = answerOf(r);
        tabs.forEach((t, i) => {
          const v = st.pct[i], good = v !== null && Math.abs(v - answerOf(params.rounds[i])) <= params.tol;
          const col = locked ? (good ? C.ok : C.bad) : i === cur ? C.brand : v !== null ? C.ok : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(12);
          p.text(`${fmt(params.rounds[i].part)} de ${params.rounds[i].whole}`, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textAlign(p.CENTER, p.TOP); p.textSize(14); p.textStyle(p.BOLD);
        p.text(`¿Qué porcentaje es ${fmt(r.part)} de ${r.whole}?`, W / 2, 50);
        // Pastel y sector.
        p.stroke(C.line); p.strokeWeight(2); p.fill(C.card); p.circle(cx, cy, R * 2);
        const good = pct !== null && Math.abs(pct - ans) <= params.tol;
        const col = locked ? (good ? C.ok : C.bad) : C.brand;
        if (pct !== null && pct > 0) {
          p.noStroke(); p.fill(col + '99');
          p.arc(cx, cy, R * 2, R * 2, angOf(0), angOf(pct), p.PIE);
        }
        // Marcas en unidades (cada décimo del total) y anillo exterior en % (20 marcas, sin números).
        for (let k = 0; k < 10; k++) {
          const a = angOf(k * 10), x1 = cx + Math.cos(a) * (R - 8), y1 = cy + Math.sin(a) * (R - 8);
          p.stroke(C.mute); p.strokeWeight(1.5); p.line(x1, y1, cx + Math.cos(a) * R, cy + Math.sin(a) * R);
          p.noStroke(); p.fill(C.mute); p.textSize(10); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
          p.text(fmt((k * r.whole) / 10), cx + Math.cos(a) * (R - 22), cy + Math.sin(a) * (R - 22));
        }
        for (let k = 0; k < 20; k++) {
          const a = angOf(k * 5);
          p.stroke(locked ? col : C.line); p.strokeWeight(k % 2 ? 1 : 2);
          p.line(cx + Math.cos(a) * (R + 6), cy + Math.sin(a) * (R + 6), cx + Math.cos(a) * (R + (k % 2 ? 10 : 14)), cy + Math.sin(a) * (R + (k % 2 ? 10 : 14)));
          if (locked && k % 4 === 0) { p.noStroke(); p.fill(col); p.textSize(10); p.text(`${k * 5} %`, cx + Math.cos(a) * (R + 26), cy + Math.sin(a) * (R + 26)); }
        }
        // Aguja.
        const a = angOf(pct ?? 0);
        p.stroke(col); p.strokeWeight(4); p.line(cx, cy, cx + Math.cos(a) * (R + 2), cy + Math.sin(a) * (R + 2));
        p.noStroke(); p.fill(col); p.circle(cx + Math.cos(a) * (R + 2), cy + Math.sin(a) * (R + 2), 22); p.fill(C.ink); p.circle(cx, cy, 10);
        // Lectura: unidades cubiertas y, al bloquear, el porcentaje.
        p.fill(col); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.BOLD); p.textSize(18);
        const units = pct === null ? null : (pct / 100) * r.whole;
        p.text(units === null ? 'gira la aguja' : `${fmt(units)} de ${r.whole}`, W / 2, cy + R + 30);
        if (locked) { p.textSize(14); p.text(`${fmt(pct ?? 0)} %  ·  correcto: ${fmt(ans)} %`, W / 2, cy + R + 56); }
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? 'El anillo exterior marca el porcentaje' : 'Arrastra la aguja hasta cubrir la parte pedida', W / 2, H - 12);
      };

      p.mousePressed = () => {
        if (locked) return;
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (Math.hypot(p.mouseX - cx, p.mouseY - cy) <= R + 24) { drag = true; setFromPointer(p.mouseX, p.mouseY); return false; }
      };
      p.mouseDragged = () => { if (!drag) return; setFromPointer(p.mouseX, p.mouseY); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ pct: [...st.pct] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
