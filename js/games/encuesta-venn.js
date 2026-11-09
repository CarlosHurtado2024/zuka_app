// La encuesta en Venn (Álgebra 0, cardinal de la unión): una encuesta dice cuántas personas hay en total, cuántas
// están en A, en B y en los dos. En cada zona del diagrama hay un contador con − / +: hay que poner cuántas
// personas quedan SOLO en A, en A ∩ B, SOLO en B y en ninguno. Debajo se ven en vivo las sumas de cada círculo y
// del total, para comparar con los datos. n(A ∪ B) = n(A) + n(B) − n(A ∩ B).
// params = { rounds: [{ text, labels: [A, B], total, a, b, both }] }   state = { counts: [[soloA, ambos, soloB, ninguno]] }

GAMES['encuesta-venn'] = (() => {
  const target = r => [r.a - r.both, r.both, r.b - r.both, r.total - r.a - r.b + r.both];
  const good = (c, r) => !!c && JSON.stringify(c) === JSON.stringify(target(r));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.counts?.[i], r));
    const solution = params.rounds.map(r => { const t = target(r), [la, lb] = r.labels || ['A', 'B']; return `solo ${la}: ${t[0]}, ambos: ${t[1]}, solo ${lb}: ${t[2]}, ninguno: ${t[3]}`; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { counts: R.map(() => [0, 0, 0, 0]) };
    const touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], venn = null, ctrls = [], hold = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      const top = 112, vh = h - top - 132, rr = Math.min((w - 40) / 3.2, vh / 2.25);
      venn = { box: { x: 14, y: top, w: w - 28, h: vh }, r: rr, ca: { x: w / 2 - rr * 0.6, y: top + vh / 2 + 6 }, cb: { x: w / 2 + rr * 0.6, y: top + vh / 2 + 6 } };
      const { ca, cb, box } = venn, mid = (ca.x + cb.x) / 2;
      const spots = [{ x: ca.x - rr * 0.5, y: ca.y }, { x: mid, y: ca.y }, { x: cb.x + rr * 0.5, y: cb.y }, { x: w / 2 + 50, y: box.y + box.h + 22 }];
      ctrls = spots.map((s, i) => (i < 3
        ? { c: s, minus: { x: s.x - 31, y: s.y + 12, w: 29, h: 28 }, plus: { x: s.x + 2, y: s.y + 12, w: 29, h: 28 } }
        // «ninguno» va debajo del diagrama, en su propia fila: número entre − y +.
        : { c: { x: s.x, y: s.y + 6 }, minus: { x: s.x - 52, y: s.y - 14, w: 29, h: 28 }, plus: { x: s.x + 23, y: s.y - 14, w: 29, h: 28 } }));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);
      const tint = (col, a) => { const c = p.color(col); c.setAlpha(a); return c; };

      p.draw = () => {
        repeat();
        p.background(C.bg);
        const r = R[cur], cnt = st.counts[cur], t = target(r);
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.counts[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textStyle(p.NORMAL); p.textSize(12.5); p.textAlign(p.LEFT, p.TOP);
        p.text(r.text, 14, 46, W - 28, 64);
        const { box, ca, cb } = venn;
        p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 12);
        p.stroke(C.Z); p.strokeWeight(2.5); p.fill(tint(C.Z, 40)); p.circle(ca.x, ca.y, 2 * venn.r);
        p.stroke(C.I); p.fill(tint(C.I, 40)); p.circle(cb.x, cb.y, 2 * venn.r);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
        p.fill(C.Z); fitText(p, r.labels[0], ca.x - venn.r * 0.35, ca.y - venn.r * 1.08, venn.r * 1.3, 12);
        p.fill(C.I); fitText(p, r.labels[1], cb.x + venn.r * 0.35, cb.y - venn.r * 1.08, venn.r * 1.3, 12);
        p.fill(C.mute); p.textAlign(p.LEFT, p.TOP); p.text('U', box.x + 8, box.y + 6);
        ctrls.forEach((k, i) => {
          const bad = locked && cnt[i] !== t[i];
          p.noStroke(); p.fill(bad ? C.bad : locked ? C.ok : C.ink); p.textStyle(p.BOLD); p.textSize(20); p.textAlign(p.CENTER, p.CENTER);
          p.text(cnt[i], k.c.x, k.c.y - 6);
          if (i === 3) { p.fill(C.mute); p.textSize(12); p.textStyle(p.NORMAL); p.textAlign(p.RIGHT, p.CENTER); p.text('fuera de los dos:', k.minus.x - 8, k.c.y - 6); p.textAlign(p.CENTER, p.CENTER); }
          [[k.minus, '−'], [k.plus, '+']].forEach(([b, s]) => {
            p.stroke(locked ? C.line : C.brand); p.strokeWeight(1.2); p.fill(C.bg); p.rect(b.x, b.y, b.w, b.h, 6);
            p.noStroke(); p.fill(locked ? C.mute : C.brand); p.textSize(15); p.textStyle(p.BOLD); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
          });
        });
        // Sumas en vivo
        const sA = cnt[0] + cnt[1], sB = cnt[1] + cnt[2], tot = cnt.reduce((a, b) => a + b, 0);
        const y0 = box.y + box.h + 62, mark = (v, w) => (v === w ? C.ok : C.mute);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(12.5); p.textAlign(p.CENTER, p.CENTER);
        p.fill(mark(sA, r.a)); fitText(p, `${r.labels[0]}: ${sA} de ${r.a}`, W * 0.25, y0, W * 0.46, 12.5);
        p.fill(mark(sB, r.b)); fitText(p, `${r.labels[1]}: ${sB} de ${r.b}`, W * 0.75, y0, W * 0.46, 12.5);
        p.fill(mark(tot, r.total)); p.text(`total: ${tot} de ${r.total}`, W / 2, y0 + 22);
        p.textStyle(p.NORMAL); p.textSize(11);
        p.fill(locked && !good(cnt, r) ? C.ok : C.mute);
        fitText(p, locked && !good(cnt, r) ? `Era: ${t[0]}, ${t[1]}, ${t[2]} y ${t[3]} ninguno` : 'Cada zona cuenta a las personas una sola vez', W / 2, H - 12, W - 24, 11);
      };

      const bump = (i, d) => {
        const cnt = st.counts[cur];
        cnt[i] = Math.max(0, Math.min(R[cur].total, cnt[i] + d));
        touched[cur] = true; api.ready(touched.every(Boolean));
      };
      p.mousePressed = () => {
        const tb = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        for (let i = 0; i < 4; i++) {
          const d = hitBox(ctrls[i].plus, p.mouseX, p.mouseY) ? 1 : hitBox(ctrls[i].minus, p.mouseX, p.mouseY) ? -1 : 0;
          if (d) { bump(i, d); hold = { i, d, t: p.millis() + 450 }; api.sfx?.tap?.(); return false; }
        }
      };
      // Dejar presionado − o + repite el cambio (para no tocar 25 veces).
      p.mouseReleased = () => { hold = null; };
      const repeat = () => { if (hold && !locked && p.millis() > hold.t) { bump(hold.i, hold.d); hold.t = p.millis() + 90; } };
    }, 1.55);

    return {
      loaded: m.ready,
      getState: () => ({ counts: st.counts.map(c => [...c]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, target };
})();
