// El cofre de candados (cálculo, función inversa): f guarda un número en un cofre cerrando candados en
// orden (primero el de abajo). Para sacarlo hay que deshacer: tocar llaves (operaciones) que se prueban
// en el candado de arriba que siga cerrado, o sea del último al primero, con la operación contraria
// («medias y zapatos»). Las llaves elegidas arman la fórmula de f⁻¹ y una moneda de prueba muestra qué
// número devuelven. ↶ quita la última llave.
// params = { rounds: [{ fTxt, locks: [{ txt, f }], keys: [{ txt, tpl, f }], order: [i…], probe }] }
// state = { keys: [[i…]] }

GAMES['cofre-candados'] = (() => {
  const same = (seq, r) => !!seq && seq.length === r.order.length && r.order.every((k, j) => seq[j] === k);
  const formulaText = (keys, seq) => seq.reduce((inner, i) => keys[i].tpl.replace('□', inner).replace(/\(x\)/g, 'x'), 'x');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.keys[i], r));
    return { ok, solution: params.rounds.map((r, i) => `${i + 1}) ${r.order.map(k => r.keys[k].txt).join(', luego ')}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const seqs = params.rounds.map(() => []), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tray = [], undo = null;

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], cols = 3, cw = (W - 24 - (cols - 1) * 8) / cols, rows = Math.ceil((r.keys.length + 1) / cols);
      const y0 = H - rows * 48 - 4;
      tray = r.keys.map((k, i) => ({ i, x: 12 + (i % cols) * (cw + 8), y: y0 + Math.floor(i / cols) * 48, w: cw, h: 42 }));
      const j = r.keys.length; undo = { x: 12 + (j % cols) * (cw + 8), y: y0 + Math.floor(j / cols) * 48, w: cw, h: 42 };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], seq = seqs[cur], ok = same(seq, r), n = r.locks.length;
        drawTabs(p, C, tabs, cur, i => (locked ? (same(seqs[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fitText(p, `f(x) = ${r.fTxt}`, W / 2, 62, W - 24, 18);
        // Cofre con la pila de candados (el último cerrado queda arriba).
        const top = 90, lh = Math.max(24, Math.min(34, (tray[0].y - top - 62 - 70) / n - 6)), chestW = Math.min(150, W * 0.42), cx = 12 + chestW / 2;
        const chestY = top + n * (lh + 6) + 6;
        const open = locked && ok;
        p.stroke(C.N); p.strokeWeight(2.5); p.fill(C.card);
        p.rect(12, chestY, chestW, 62, 8);
        p.fill(C.N); p.noStroke(); p.rect(12, chestY + (open ? -20 : 0), chestW, 16, 8, 8, 0, 0);
        p.fill(C.bg); p.circle(cx, chestY + 38, 12);
        p.fill(open ? C.ok : C.mute); p.textSize(13); p.text(open ? `¡${numTxt(r.probe)}!` : 'x', cx, chestY + 38);
        for (let k = 0; k < n; k++) {
          const li = n - 1 - k, y = top + k * (lh + 6), tried = seq[k];
          const col = locked ? (tried === r.order[k] ? C.ok : C.bad) : tried != null ? C.Z : C.R;
          p.stroke(col); p.strokeWeight(2); p.fill(C.card); p.rect(cx - chestW / 2 + 10, y, chestW - 20, lh, 8);
          p.noStroke(); p.fill(C.ink); fitText(p, `🔒 ${r.locks[li].txt}`, cx, y + lh / 2, chestW - 28, 15);
          if (tried != null) {
            p.stroke(C.Z); p.strokeWeight(2); p.line(12 + chestW + 2, y + lh / 2, 12 + chestW + 18, y + lh / 2);
            p.noStroke(); p.fill(C.Z); p.textAlign(p.LEFT, p.CENTER); fitTextL(`🔑 ${r.keys[tried].txt}`, 12 + chestW + 22, y + lh / 2, W - 12 - (12 + chestW + 22)); p.textAlign(p.CENTER, p.CENTER);
          }
        }
        function fitTextL(t, x, y, maxW) { let sz = 15; p.textSize(sz); while (sz > 9 && p.textWidth(t) > maxW) p.textSize(--sz); p.text(t, x, y); }
        // Fórmula de f⁻¹ y moneda de prueba.
        const by = chestY + 62 + 22;
        const fx = r.locks.reduce((acc, l) => l.f(acc), r.probe), back = seq.reduce((acc, i) => r.keys[i].f(acc), fx);
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.fill(locked ? (ok ? C.ok : C.bad) : C.brand);
        fitText(p, `tus llaves: f⁻¹(x) = ${formulaText(r.keys, seq)}`, W / 2, by, W - 24, 15);
        p.fill(C.mute); p.textStyle(p.NORMAL);
        fitText(p, `moneda: guardo ${numTxt(r.probe)} → f da ${numTxt(+fx.toFixed(3))} → tus llaves devuelven ${Number.isFinite(back) ? numTxt(+back.toFixed(3)) : '¿?'}`, W / 2, by + 22, W - 24, 12);
        tray.forEach(b => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textStyle(p.BOLD); fitText(p, `🔑 ${r.keys[b.i].txt}`, b.x + b.w / 2, b.y + b.h / 2, b.w - 8, 15);
        });
        p.stroke(locked ? C.line : C.I); p.strokeWeight(1.5); p.fill(C.card); p.rect(undo.x, undo.y, undo.w, undo.h, 10);
        p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textSize(17); p.text('↶', undo.x + undo.w / 2, undo.y + undo.h / 2);
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const r = params.rounds[cur], seq = seqs[cur];
        if (hitBox(undo, p.mouseX, p.mouseY)) { seq.pop(); api.ready(seqs.every((s, i) => s.length === params.rounds[i].locks.length)); api.sfx?.tap?.(); return false; }
        const b = tray.find(b => hitBox(b, p.mouseX, p.mouseY));
        if (!b || seq.length >= r.locks.length) return;
        seq.push(b.i); touched[cur] = true; api.sfx?.tap?.();
        api.ready(seqs.every((s, i) => s.length === params.rounds[i].locks.length));
        return false;
      };
    }, 1.6);

    return {
      loaded: m.ready,
      getState: () => ({ keys: seqs.map(s => s.slice()) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, formulaText };
})();
