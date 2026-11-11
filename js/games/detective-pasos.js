// Detective de pasos (evaluaciones). Una solución resuelta paso a paso tiene un error escondido. Se toca
// la línea donde está el error y luego, con ‹ ›, se elige cómo debía quedar ese paso. Las líneas que siguen
// al error lo arrastran (son coherentes con él): el error es el primer paso que no se justifica.
// params = { rounds: [{ title?, steps: [texto], wrong, fixes: [texto], fix }] }
// state = { picks: [{ line, fix } por ronda] }

GAMES['detective-pasos'] = (() => {
  const right = (pk, r) => !!pk && pk.line === r.wrong && pk.fix === r.fix;

  function solve(params) { return { picks: params.rounds.map(r => ({ line: r.wrong, fix: r.fix })) }; }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => right(state.picks?.[i], r));
    const solution = params.rounds.map(r => `El error está en el paso ${r.wrong + 1}: debía ser «${r.fixes[r.fix]}»`).join(' · ');
    return { ok, solution };
  }

  // Alto del lienzo según el contenido (no según el ancho): así cabe igual en un celular de 300 px.
  const aspectFor = (host, px) => Math.max(1, px / Math.max(240, Math.floor(host.clientWidth || 320)));

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const PK = R.map(() => ({ line: null, fix: null }));
    const ORD = R.map((r, i) => shuffledOrder(r.fixes.length, `det${i}${r.fixes.join()}`));
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], hits = [];

    function layout(w, h) { W = w; H = h; tabs = R.length > 1 ? roundTabs(R.length, w) : []; }
    const update = () => api.ready(PK.every(pk => pk.line != null && pk.fix != null));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg); hits = [];
        const r = R[cur], pk = locked && !right(PK[cur], r) ? { line: r.wrong, fix: r.fix } : PK[cur], good = right(PK[cur], r);
        if (tabs.length) drawTabs(p, C, tabs, cur, i => (locked ? (right(PK[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : PK[i].line != null ? C.R : C.line));
        let y = tabs.length ? 52 : 12;
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, r.title || 'Toca el paso que tiene el error', W / 2, y + 8, W - 24, 15);
        y += 26;
        const lh = 40;
        r.steps.forEach((s, k) => {
          const sel = pk.line === k, x = 12, w = W - 24;
          const col = sel ? (locked ? C.ok : C.bad) : C.line;
          p.stroke(col); p.strokeWeight(sel ? 3 : 1.5); p.fill(sel ? C.bg : C.card); p.rect(x, y, w, lh, 9);
          p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.text(k + 1, x + 14, y + lh / 2);
          p.fill(C.ink); p.textStyle(sel ? p.BOLD : p.NORMAL);
          const txt = sel && pk.fix != null ? r.fixes[pk.fix] : s;
          if (sel && pk.fix != null) { p.fill(locked ? C.ok : C.brand); p.textStyle(p.BOLD); }
          fitText(p, txt, x + w / 2 + 8, y + lh / 2, w - 44, 16);
          hits.push({ x, y, w, h: lh, line: k });
          y += lh + 6;
        });
        // Selector de la corrección
        y += 8;
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL);
        if (pk.line == null) { fitText(p, 'Primero señala la línea equivocada', W / 2, y + 20, W - 24, 13); return; }
        fitText(p, locked ? (good ? '¡Bien visto!' : 'El error y su corrección') : `¿Cómo debía quedar el paso ${pk.line + 1}?`, W / 2, y + 8, W - 24, 13);
        y += 22;
        // La corrección ocupa todo el ancho (cabe a 260 px); las flechas van debajo.
        const bw = 52, bh = 40, mid = { x: 12, y, w: W - 24, h: bh }, ay = y + bh + 8;
        [['‹', W / 2 - bw - 34, -1], ['›', W / 2 + 34, 1]].forEach(([s, x, d]) => {
          p.stroke(locked ? C.line : C.brand); p.strokeWeight(2); p.fill(C.card); p.rect(x, ay, bw, bh, 9);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(22); p.text(s, x + bw / 2, ay + bh / 2 - 2);
          hits.push({ x, y: ay, w: bw, h: bh, step: d });
        });
        p.stroke(pk.fix != null ? (locked ? C.ok : C.brand) : C.line); p.strokeWeight(2); p.fill(C.card); p.rect(mid.x, mid.y, mid.w, mid.h, 9);
        p.noStroke(); p.fill(pk.fix != null ? C.ink : C.mute); p.textStyle(pk.fix != null ? p.BOLD : p.NORMAL);
        fitText(p, pk.fix != null ? r.fixes[pk.fix] : 'Usa ‹ › para elegir', mid.x + mid.w / 2, mid.y + mid.h / 2, mid.w - 12, 15);
        if (pk.fix != null) {
          const n = r.fixes.length, at = ORD[cur].indexOf(pk.fix);
          p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.text(`${at + 1} de ${n}`, W / 2, ay + bh / 2);
        }
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const h = hits.find(b => hitBox(b, x, y));
        if (!h) return;
        const pk = PK[cur];
        if (h.line != null) { if (pk.line !== h.line) { pk.line = h.line; pk.fix = null; } }
        else {
          const o = ORD[cur], at = pk.fix == null ? (h.step > 0 ? -1 : 0) : o.indexOf(pk.fix);
          pk.fix = o[(at + h.step + o.length) % o.length];
        }
        api.sfx?.tap?.(); update();
        return false;
      };
    }, aspectFor(host, (R.length > 1 ? 52 : 12) + 26 + 46 * Math.max(...R.map(r => r.steps.length)) + 8 + 22 + 40 + 8 + 40 + 12));

    return {
      loaded: m.ready,
      getState: () => ({ picks: PK.map(pk => ({ ...pk })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, solve };
})();
