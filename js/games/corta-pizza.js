// Corta la pizza (trigonometría, arco y sector): se abre la porción arrastrando su borde y, si la
// ronda lo permite, se cambia el radio de la pizza, hasta que el arco (s = rθ) o el área del sector
// (A = ½r²θ) sea la pedida. El ángulo en radianes y las dos medidas se ven en vivo. Rondas con pestañas.
// params = { rounds: [{ goal: 'arc' | 'area', value, label, r?, deg?, rMin?, rMax? }] }   state = { cuts: [{ deg, r }] }

GAMES['corta-pizza'] = (() => {
  const measure = ({ deg, r }) => { const t = deg * Math.PI / 180; return { arc: r * t, area: 0.5 * r * r * t }; };
  const hit = (cut, round) => !!cut && Math.abs(measure(cut)[round.goal] - round.value) <= 0.02 * round.value + 1e-9;
  const fmt = v => String(+v.toFixed(2));

  // Lo que había que poner: el ángulo (si el radio es fijo) o el radio (si el ángulo es fijo).
  function answer(r) {
    if (r.r != null) {
      const t = r.goal === 'arc' ? r.value / r.r : 2 * r.value / (r.r * r.r);
      return { deg: Math.round(t * 180 / Math.PI), r: r.r };
    }
    const t = r.deg * Math.PI / 180;
    return { deg: r.deg, r: Math.round(r.goal === 'arc' ? r.value / t : Math.sqrt(2 * r.value / t)) };
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => hit(state.cuts[i], r));
    const solution = params.rounds.map(r => { const a = answer(r); return `$r = ${a.r},\\ \\theta = ${a.deg}^\\circ$`; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, CRUST = '#D9A066', CHEESE = '#F6D365', TOP = '#D64545';
    const st = { cuts: params.rounds.map(r => ({ deg: r.deg ?? 30, r: r.r ?? (r.rMin ?? 2) })) };
    const touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], btns = [], cx = 0, cy = 0, Rmax = 0, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      Rmax = Math.min(w * 0.36, h * 0.26); cx = w / 2; cy = 84 + Rmax;
      const by = h - 46;
      btns = [{ d: -1, x: w / 2 - 110, y: by, w: 44, h: 34, t: '−' }, { d: 1, x: w / 2 + 66, y: by, w: 44, h: 34, t: '+' }];
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const rr = round => round.rMax ?? round.r ?? 10;
    const pxR = (round, r) => Rmax * r / rr(round);
    const ready = () => api.ready(touched.every(Boolean));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const round = params.rounds[cur], cut = st.cuts[cur], good = hit(cut, round), meas = measure(cut);
        tabs.forEach((t, i) => {
          const ok = hit(st.cuts[i], params.rounds[i]);
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.CENTER);
        p.text('Corta una porción con', 12, 52);
        p.fill(C.N); p.textStyle(p.BOLD); let ts = 17; p.textSize(ts); while (ts > 11 && p.textWidth(round.label) > W - 24) p.textSize(--ts); p.text(round.label, 12, 70);

        // La pizza entera (tenue) y la porción.
        const R = pxR(round, cut.r), a = cut.deg * Math.PI / 180;
        p.noStroke(); p.fill(CRUST + '55'); p.circle(cx, cy, 2 * R);
        p.fill(CHEESE + '40'); p.circle(cx, cy, 2 * R - 14);
        p.fill(CHEESE); p.stroke(locked ? (good ? C.ok : C.bad) : CRUST); p.strokeWeight(3);
        p.arc(cx, cy, 2 * R, 2 * R, -a, 0, p.PIE);
        p.noStroke(); p.fill(TOP);
        for (let k = 1; k <= Math.floor(cut.deg / 25); k++) { const t = -a * (k - 0.5) / Math.floor(cut.deg / 25 + 0.0001); p.circle(cx + R * 0.6 * Math.cos(t), cy + R * 0.6 * Math.sin(t), Math.max(5, R * 0.12)); }
        // El arco resaltado (la orilla) y el ángulo.
        p.noFill(); p.stroke(C.Z); p.strokeWeight(6); p.arc(cx, cy, 2 * R, 2 * R, -a, 0);
        p.stroke(C.brand); p.strokeWeight(3); p.arc(cx, cy, 44, 44, -a, 0);   // se ve sobre el queso en los dos temas
        // Asas: borde de la porción (ángulo) y orilla (radio, si se puede cambiar).
        if (round.deg == null) { p.noStroke(); p.fill(C.brand); p.circle(cx + R * Math.cos(-a), cy + R * Math.sin(-a), 20); }
        if (round.r == null) { p.noStroke(); p.fill(C.Q); p.circle(cx + R, cy, 18); }

        // Lecturas en vivo.
        const y0 = cy + Rmax + 24;
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`θ = ${cut.deg}° = ${fmt(a)} rad   ·   r = ${cut.r}`, W / 2, y0);
        p.textSize(13);
        p.fill(round.goal === 'arc' ? (good ? C.ok : C.Z) : C.mute); p.text(`arco s = rθ = ${fmt(meas.arc)}`, W / 2, y0 + 22);
        p.fill(round.goal === 'area' ? (good ? C.ok : C.Z) : C.mute); p.text(`área A = ½ r² θ = ${fmt(meas.area)}`, W / 2, y0 + 42);
        if (locked && !good) { const ans = answer(round); p.fill(C.ok); p.text(`era θ = ${ans.deg}° con r = ${ans.r}`, W / 2, y0 + 62); }
        // Botones: ajustan el ángulo (de a 5°) o el radio (de a 1), según lo que se pueda mover.
        const what = round.deg == null ? 'ángulo' : 'radio';
        btns.forEach(b => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textStyle(p.BOLD); p.textSize(18); p.text(b.t, b.x + b.w / 2, b.y + b.h / 2);
        });
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.text(`${what}`, W / 2, btns[0].y + 17);
      };

      const touch = () => { touched[cur] = true; ready(); };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const round = params.rounds[cur], cut = st.cuts[cur];
        const b = btns.find(b => inside(b, p.mouseX, p.mouseY));
        if (b) {
          if (round.deg == null) cut.deg = Math.max(5, Math.min(355, cut.deg + 5 * b.d));
          else cut.r = Math.max(round.rMin ?? 1, Math.min(rr(round), cut.r + b.d));
          touch(); api.sfx?.tap?.(); return false;
        }
        if (Math.hypot(p.mouseX - cx, p.mouseY - cy) <= Rmax + 24 && p.mouseY < cy + Rmax + 12) { drag = true; p.mouseDragged(); return false; }
      };
      p.mouseDragged = () => {
        if (!drag) return;
        const round = params.rounds[cur], cut = st.cuts[cur];
        if (round.deg == null) {
          let d = Math.atan2(cy - p.mouseY, p.mouseX - cx) * 180 / Math.PI; if (d < 0) d += 360;
          cut.deg = Math.max(5, Math.min(355, Math.round(d / 5) * 5));
        } else {
          cut.r = Math.max(round.rMin ?? 1, Math.min(rr(round), Math.round(Math.hypot(p.mouseX - cx, p.mouseY - cy) / Rmax * rr(round))));
        }
        touch(); return false;
      };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.42);

    return {
      loaded: m.ready,
      getState: () => ({ cuts: st.cuts.map(c => ({ ...c })) }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, measure };
})();
