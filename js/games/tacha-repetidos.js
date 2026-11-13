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
        return { x: W / 2 - total / 2 + (i % per) * (cw + 6), y: 86 + row * (cw * 1.25 + 8), w: cw, h: cw * 1.25 };
      });
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], cr = st.crossed[cur], ok = good(cr, r), name = r.name || 'L';
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.crossed[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.CENTER);
        fitText(p, `${name} = {x : x es una letra de la palabra ${r.word}}`, 14, 60, W - 28, 12);
        // La palabra, letra por letra
        cells.forEach((b, i) => {
          const off = cr.includes(i), ch = r.word[i], dupLeft = !off && [...r.word].some((c, j) => j !== i && c === ch && !cr.includes(j));
          // Letra en ficha crema; color sol si todavía está repetida; tachada, queda la casilla punteada.
          if (off) drawSlot(p, C, b, 8); else drawTile(p, C, b, '', { fill: dupLeft && !locked ? C.sun : C.cream, r: 8, lift: 2 });
          p.noStroke(); p.fill(off ? C.mute : inkOn(C.cream, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.textSize(Math.min(24, b.w * 0.6));
          p.text(ch, b.x + b.w / 2, b.y + b.h / 2 + 1);
          if (off) { p.stroke(C.bad); p.strokeWeight(3); p.line(b.x + 6, b.y + b.h - 6, b.x + b.w - 6, b.y + 6); }
        });
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        const last = cells[cells.length - 1];
        p.text('Resaltada: esa letra todavía está repetida', W / 2, last.y + last.h + 14);
        // El conjunto que queda
        const left = [...r.word].filter((_, i) => !cr.includes(i));
        const by = last.y + last.h + 32, bh = 70;
        p.stroke(locked ? (ok ? C.ok : C.bad) : C.line); p.strokeWeight(2); p.fill(C.card); p.rect(14, by, W - 28, bh, 12);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${name} = {${left.join(', ')}}`, W / 2, by + 26, W - 48, 20);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(13); p.text(touched[cur] ? `n(${name}) = ${new Set(left).size} letras distintas` : `n(${name}) = ?`, W / 2, by + 52);
        if (locked && !ok) { p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(12); fitText(p, `${name} = {${distinct(r.word).join(', ')}}`, W / 2, H - 14, W - 24, 12); }
        else { p.fill(C.mute); p.textSize(11); p.text('Toca una letra para tacharla o recuperarla', W / 2, H - 14); }
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
