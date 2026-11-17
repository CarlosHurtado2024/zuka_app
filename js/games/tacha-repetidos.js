// Tacha los repetidos (Álgebra 0, en un conjunto nada se repite): se escribe una palabra letra por letra y hay
// que tachar (tocar) las letras que sobran para que quede el conjunto de sus letras, cada una una sola vez.
// Abajo se arma en vivo el conjunto con las letras sin tachar y su cardinal n(L). Tocar una letra tachada la
// recupera. Vale dejar cualquier copia de cada letra.
// params = { rounds: [{ word, name }] }   state = { crossed: [[índices tachados]] }

GAMES['tacha-repetidos'] = (() => {
  const distinct = w => [...new Set([...w])];
  function good(cr, r) {
    if (!cr) return false;
    const left = [...r.word].filter((_, i) => !cr.includes(i));
    return left.length === distinct(r.word).length && new Set(left).size === left.length;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.crossed?.[i], r));
    const solution = params.rounds.map(r => `${r.name || 'L'} = {${distinct(r.word).join(', ')}}, n = ${distinct(r.word).length}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { crossed: R.map(() => []) };
    const touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], cells = [];

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      placeCells();
    }
    function placeCells() {
      const n = R[cur].word.length, per = n > 7 ? Math.ceil(n / 2) : n, cw = Math.min(46, (W - 28 - (per - 1) * 6) / per);
      cells = [...R[cur].word].map((_, i) => {
        const row = Math.floor(i / per), inRow = row ? n - per : per, total = inRow * cw + (inRow - 1) * 6;
        return { x: W / 2 - total / 2 + (i % per) * (cw + 6), y: 100 + row * (cw * 1.2 + 9), w: cw, h: cw * 1.2 };
      });
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], cr = st.crossed[cur], ok = good(cr, r), name = r.name || 'L', A = SK.sets(C)[0];
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.crossed[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        SK.kicker(p, C, 'En un conjunto nada se repite', 14, 56);
        p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${name} = {x : x es una letra de ${r.word}}`, W / 2, 80, W - 28, 14);
        // La palabra, letra por letra: en ámbar, la que todavía está repetida; tachada, queda el hueco.
        cells.forEach((b, i) => {
          const off = cr.includes(i), ch = r.word[i], dup = !off && [...r.word].some((c, j) => j !== i && c === ch && !cr.includes(j));
          SK.chip(p, C, b, '', { state: off ? 'ghost' : dup && !locked ? 'on' : 'idle', col: C.sun, r: 9 });
          SK.serif(p, ch, b.x + b.w / 2, b.y + b.h / 2 + 1, Math.min(25, b.w * 0.62), off ? C.mute : C.ink);
          if (off) { p.stroke(C.coral); p.strokeWeight(2); p.line(b.x + 7, b.y + b.h - 7, b.x + b.w - 7, b.y + 7); p.noStroke(); }
        });
        const last = cells[cells.length - 1];
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text('Resaltada: esa letra todavía está repetida', W / 2, last.y + last.h + 16);
        // El conjunto que queda, en la franja formal.
        const left = [...r.word].filter((_, i) => !cr.includes(i)), col = locked ? (ok ? C.ok : C.bad) : A.line;
        SK.formal(p, C, { x: 12, y: last.y + last.h + 34, w: W - 24, h: 78 },
          `$${name} = \\{${left.join(', ')}\\} \\quad n(${name}) = ${touched[cur] ? new Set(left).size : '?'}$`, { kicker: 'Lo que queda', col, size: 20 });
        p.textAlign(p.CENTER, p.CENTER);
        if (locked && !ok) { p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, `${name} = {${distinct(r.word).join(', ')}}`, W / 2, H - 14, W - 24, 12); }
        else { p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.text('Toca una letra para tacharla o recuperarla', W / 2, H - 14); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; placeCells(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const i = cells.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (i >= 0) {
          const cr = st.crossed[cur], k = cr.indexOf(i);
          if (k >= 0) cr.splice(k, 1); else cr.push(i);
          touched[cur] = true; api.ready(touched.every(Boolean)); api.sfx?.tap?.(); return false;
        }
      };
    }, 1.4);

    return {
      loaded: m.ready,
      getState: () => ({ crossed: st.crossed.map(c => [...c]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, distinct };
})();
