// La balanza que cancela (Álgebra 1.2, ley cancelativa). Una igualdad es una balanza en equilibrio: a cada lado hay
// fichas que se suman (o se multiplican). Se toca una ficha de la izquierda y luego una igual de la derecha: las dos
// se van, porque quitar lo mismo de los dos lados mantiene el equilibrio (a + b = a + c ⇒ b = c; con productos,
// ab = ac y a ≠ 0 ⇒ b = c). Un 0 que multiplica no se deja cancelar (0 · 2 = 0 · 5 y 2 ≠ 5). Se gana cuando a la
// izquierda queda la x sola.
// params = { rounds: [{ op: '+' | '·', left: [texto], right: [texto], ans }] }   state = { pairs: [[[i, j], …] por ronda] }

GAMES['cancela-balanza'] = (() => {
  const canCancel = (r, i, j) => r.left[i] != null && r.left[i] !== 'x' && r.left[i] === r.right[j] && !(r.op === '·' && r.left[i] === '0');

  function solved(r, pairs) {
    if (!Array.isArray(pairs)) return false;
    const L = new Set(), Rr = new Set();
    for (const pr of pairs) {
      const [i, j] = pr || [];
      if (L.has(i) || Rr.has(j) || !canCancel(r, i, j)) return false;
      L.add(i); Rr.add(j);
    }
    return r.left.every((t, i) => (t === 'x') !== L.has(i));
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => solved(r, state.pairs?.[i]));
    return { ok, solution: params.rounds.map(r => r.ans).join(' · ') };
  }

  const expr = (tiles, op) => tiles.map((t, k) => (k && t.startsWith('−') ? `(${t})` : t)).join(` ${op} `) || (op === '+' ? '0' : '1');

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const P = R.map(() => []);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], sel = null, msg = '', msgT = 0, boxes = { L: [], R: [] }, reset = null;

    function layout(w, h) { W = w; H = h; tabs = roundTabs(R.length, w); reset = { x: w / 2 - 50, y: h - 46, w: 100, h: 30 }; }
    const goneL = () => new Set(P[cur].map(p => p[0]));
    const goneR = () => new Set(P[cur].map(p => p[1]));
    function say(t) { msg = t; msgT = 150; }

    function placeTiles(side, tiles, gone, x0, x1, y0) {
      const out = [], tw = Math.min(54, (x1 - x0 - 6) / 2), th = 30;
      let col = 0, row = 0;
      tiles.forEach((t, i) => {
        if (gone.has(i)) { out.push(null); return; }
        out.push({ x: x0 + 3 + col * (tw + 6), y: y0 - (row + 1) * (th + 6), w: tw, h: th, t, i });
        if (++col === 2) { col = 0; row++; }
      });
      return out;
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], gL = goneL(), gR = goneR(), done = solved(r, P[cur]);
        drawTabs(p, C, tabs, cur, i => (locked ? (solved(R[i], P[i]) ? C.ok : C.bad) : i === cur ? C.brand : P[i].length ? C.Q : C.line));
        // La igualdad que queda
        const left = r.left.filter((_, i) => !gL.has(i)), right = r.right.filter((_, j) => !gR.has(j));
        p.textAlign(p.CENTER, p.CENTER); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD);
        fitText(p, `${expr(left, r.op)} = ${expr(right, r.op)}`, W / 2, 58, W - 24, 18);
        // Balanza en equilibrio
        const beamY = H * 0.6, cx = W / 2;
        p.stroke(C.mute); p.strokeWeight(4); p.line(18, beamY, W - 18, beamY);
        p.noStroke(); p.fill(C.mute); p.triangle(cx, beamY, cx - 18, beamY + 40, cx + 18, beamY + 40);
        p.fill(C.card); p.stroke(C.line); p.strokeWeight(1.5);
        p.rect(14, beamY - 2, cx - 26, 8, 4); p.rect(cx + 12, beamY - 2, cx - 26, 8, 4);
        boxes.L = placeTiles('L', r.left, gL, 14, cx - 12, beamY - 4);
        boxes.R = placeTiles('R', r.right, gR, cx + 12, W - 14, beamY - 4);
        for (const [side, list] of [['L', boxes.L], ['R', boxes.R]]) for (const b of list) {
          if (!b) continue;
          const isX = b.t === 'x', on = side === 'L' && sel === b.i;
          p.stroke(on ? C.brand : isX ? C.Q : C.line); p.strokeWeight(on ? 3 : 1.5); p.fill(isX ? C.Q : C.card);
          p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(isX ? C.bg : C.ink); p.textStyle(p.BOLD); fitText(p, b.t, b.x + b.w / 2, b.y + b.h / 2, b.w - 6, 15);
        }
        p.noStroke(); p.textStyle(p.NORMAL); p.fill(C.mute); p.textSize(11);
        p.text(r.op === '+' ? 'fichas que se suman' : 'fichas que se multiplican', W / 2, beamY + 56);
        // Mensajes
        if (msgT > 0) { msgT--; p.fill(C.bad); p.textStyle(p.BOLD); fitText(p, msg, W / 2, 86, W - 24, 12); }
        else if (done) { p.fill(locked ? C.ok : C.Q); p.textStyle(p.BOLD); fitText(p, '¡La x quedó sola!', W / 2, 86, W - 24, 14); }
        else { p.fill(C.mute); fitText(p, sel == null ? 'Toca una ficha de la izquierda…' : '…y luego su gemela de la derecha', W / 2, 86, W - 24, 12); }
        if (locked && !done) { p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, `Quedaba ${r.ans}`, W / 2, H - 31, W - 24, 13); }
        else if (!locked) {
          p.stroke(C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(reset.x, reset.y, reset.w, reset.h, 8);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.NORMAL); p.textSize(12); p.text('Reiniciar', reset.x + reset.w / 2, reset.y + reset.h / 2);
        }
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY, r = R[cur];
        const tb = tabs.findIndex(b => hitBox(b, x, y));
        if (tb >= 0) { cur = tb; sel = null; msgT = 0; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(reset, x, y)) { P[cur] = []; sel = null; api.ready(R.every((rr, i) => P[i].length > 0)); return false; }
        const bl = boxes.L.find(b => b && hitBox(b, x, y));
        if (bl) {
          if (bl.t === 'x') say('La x es la que queremos dejar sola');
          else if (r.op === '·' && bl.t === '0') say('El 0 no se cancela: 0 · 2 = 0 · 5 y 2 ≠ 5');
          else { sel = bl.i; api.sfx?.tap?.(); }
          return false;
        }
        const br = boxes.R.find(b => b && hitBox(b, x, y));
        if (br) {
          if (sel == null) { say('Empieza por una ficha de la izquierda'); return false; }
          if (canCancel(r, sel, br.i)) { P[cur].push([sel, br.i]); sel = null; api.sfx?.tap?.(); api.ready(R.every((rr, i) => P[i].length > 0)); }
          else say('Solo se quitan dos fichas iguales');
          return false;
        }
      };
    }, 1.2);

    return {
      loaded: m.ready,
      getState: () => ({ pairs: P.map(l => l.map(pr => [...pr])) }),
      lock() { locked = true; sel = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, canCancel };
})();
