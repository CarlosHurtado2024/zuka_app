// La máquina de multiplicar (lección 1.2, ley de signos): con unas mismas fichas (positivas,
// negativas y un 0 tramposo) hay que elegir dos o más cuyo producto dé la meta de cada ronda. La
// máquina multiplica en vivo y cuenta los factores negativos: una cantidad par da positivo, impar
// da negativo, y el 0 lo anula todo. Rondas con pestañas.
// params = { tiles: [números], rounds: [{ target }] }   state = { picks: [[índices de fichas]] }

GAMES['arma-producto'] = (() => {
  const product = xs => xs.reduce((a, b) => a * b, 1);
  const neg = n => String(n).replace('-', '−');
  const factor = n => (n < 0 ? `(${neg(n)})` : neg(n));
  const valueOf = (tiles, pk) => (pk && pk.length >= 2 ? product(pk.map(i => tiles[i])) : null);

  // Un ejemplo con la menor cantidad de fichas (al menos dos) que da la meta.
  function example(tiles, target) {
    const n = tiles.length;
    let best = null;
    for (let mask = 1; mask < 1 << n; mask++) {
      const idx = [...Array(n).keys()].filter(i => mask & (1 << i));
      if (idx.length < 2 || (best && idx.length >= best.length)) continue;
      if (product(idx.map(i => tiles[i])) === target) best = idx;
    }
    return best;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => valueOf(params.tiles, state.picks[i]) === r.target);
    const solution = params.rounds.map(r => {
      const ex = example(params.tiles, r.target);
      return ex ? `$${ex.map(i => factor(params.tiles[i])).join(' \\cdot ')} = ${r.target}$` : `$${r.target}$`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, tiles = params.tiles;
    const st = { picks: params.rounds.map(() => []) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tray = [], box = null, slots = [], bump = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(params.rounds.length);
      box = { x: 12, y: 96, w: w - 24, h: 128 };
      const cols = 3, tw = (w - 24 - (cols - 1) * 10) / cols, th = 46, y0 = h - 2 * (th + 10) - 24;
      tray = tiles.map((_, i) => ({ x: 12 + (i % cols) * (tw + 10), y: y0 + Math.floor(i / cols) * (th + 10), w: tw, h: th }));
      placeSlots();
    }
    // Las fichas elegidas, en fila dentro de la máquina.
    function placeSlots() {
      const pk = st.picks[cur], sw = Math.min(52, (box.w - 20) / Math.max(1, pk.length) - 18);
      const total = pk.length * sw + (pk.length - 1) * 18;
      slots = pk.map((_, k) => ({ x: W / 2 - total / 2 + k * (sw + 18), y: box.y + 14, w: sw, h: 40 }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.picks.every(pk => pk.length >= 2));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function tile(b, v, col, fill = C.card) {
        // Como en los videos: los negativos en fichas coral, el cero color sol y los positivos crema.
        drawTile(p, C, b, neg(v), { fill: v < 0 ? C.coral : v === 0 ? C.sun : C.cream, size: Math.min(20, b.w * 0.42) });
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], pk = st.picks[cur], val = valueOf(tiles, pk), good = val === r.target;
        drawTabs(p, C, tabs, cur, i => {
          const ok = valueOf(tiles, st.picks[i]) === params.rounds[i].target;
          return locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : ok ? C.Q : st.picks[i].length ? C.Z : C.line;
        });
        drawKicker(p, C, 'Elige fichas cuyo producto dé', 12, 56);
        p.noStroke(); p.fill(r.target < 0 ? C.I : C.ink); p.textStyle(p.BOLD); p.textSize(30); p.textAlign(p.LEFT, p.CENTER); p.text(neg(r.target), 12, 80);

        // La máquina: fichas elegidas, el producto en vivo y el conteo de signos.
        const bcol = locked ? (good ? C.ok : C.bad) : good ? C.ok : C.line;
        p.stroke(bcol); p.strokeWeight(2); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 14);
        if (!pk.length) { p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text('Toca las fichas de abajo para meterlas a la máquina', box.x + 12, box.y + 34, box.w - 24, 40); }
        slots.forEach((s, k) => {
          tile(s, tiles[pk[k]], C.brand);
          if (k < pk.length - 1) { p.noStroke(); p.fill(C.mute); p.textSize(18); p.textAlign(p.CENTER, p.CENTER); p.text('·', s.x + s.w + 9, s.y + s.h / 2); }
        });
        const nNeg = pk.filter(i => tiles[i] < 0).length, hasZero = pk.some(i => tiles[i] === 0);
        if (pk.length) {
          p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          p.fill(val === null ? C.mute : good ? C.ok : C.ink); p.textSize(26 + 6 * bump); bump = Math.max(0, bump - 0.08);
          p.text(val === null ? 'elige otra ficha' : `= ${neg(val)}`, W / 2, box.y + 78);
          p.fill(hasZero ? C.N : nNeg % 2 ? C.I : C.Z); p.textSize(12); p.textStyle(p.NORMAL);
          p.text(hasZero ? 'hay un 0: el producto es 0' : `${nNeg} ${nNeg === 1 ? 'factor negativo' : 'factores negativos'} → ${nNeg % 2 ? 'impar: negativo' : 'par: positivo'}`, W / 2, box.y + 108);
        }
        // La bandeja de fichas: las que ya están en la máquina quedan en sombra.
        tray.forEach((b, i) => {
          const used = pk.includes(i);
          if (used) drawSlot(p, C, b);
          else tile(b, tiles[i], locked ? C.line : C.mute);
        });
        p.noStroke(); p.fill(locked && !good ? C.ok : C.mute); p.textStyle(locked && !good ? p.BOLD : p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        const ex = locked && !good ? example(tiles, r.target) : null;
        p.text(ex ? `Por ejemplo: ${ex.map(i => factor(tiles[i])).join(' · ')} = ${neg(r.target)}` : 'Toca una ficha de la máquina para sacarla', 12, H - 12, W - 24, 16);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; placeSlots(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const pk = st.picks[cur];
        const s = slots.findIndex(b => inside(b, p.mouseX, p.mouseY));
        if (s >= 0) { pk.splice(s, 1); placeSlots(); bump = 1; api.sfx?.tap?.(); ready(); return false; }
        const i = tray.findIndex((b, i) => !pk.includes(i) && inside(b, p.mouseX, p.mouseY));
        if (i >= 0 && pk.length < 5) { pk.push(i); placeSlots(); bump = 1; api.sfx?.tap?.(); ready(); return false; }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ picks: st.picks.map(pk => [...pk]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, product };
})();
