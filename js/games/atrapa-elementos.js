// Atrapa los elementos (Álgebra 0, conjuntos por comprensión y por extensión): arriba está un conjunto descrito
// por comprensión ({x ∈ ℕ : x es múltiplo de 3, x < 16}). Abajo hay fichas; las que se tocan entran a las
// llaves y el conjunto se va escribiendo por extensión, con su cardinal n(A). Tocar una ficha de las llaves la
// saca. Meta: que la extensión tenga exactamente los elementos que cumplen la condición.
// Con `given` (líneas como «A = {…}») y `expr` («A ∩ B») sirve para escribir el resultado de una operación.
// params = { rounds: [{ name, rule, pool, members, given?, expr? }] }   state = { picks: [[etiquetas]] }

GAMES['atrapa-elementos'] = (() => {
  const same = (pk, r) => !!pk && pk.length === r.members.length && r.members.every(m => pk.includes(m));
  const listText = xs => (xs.length ? `{${xs.join(', ')}}` : '∅');
  const ordered = (pk, r) => r.pool.filter(x => pk.includes(x));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.picks?.[i], r));
    const solution = params.rounds.map(r => `${r.expr || r.name || 'A'} = ${listText(r.members)}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    // Con palabras largas van 3 por fila: la altura crece para que la bandeja no tape las llaves (ancho mínimo 256 px).
    const colsOf = pool => (pool.some(x => x.length > 5) ? 3 : pool.length > 12 ? 6 : 5);
    const rowsMax = Math.max(...R.map(r => Math.ceil(r.pool.length / colsOf(r.pool))));
    const aspect = Math.max(1.1, (262 + rowsMax * 43) / 328);
    const st = { picks: R.map(() => []) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tray = [], bag = null, pop = { i: -1, t: 0 };

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      bag = { x: 12, y: 118, w: w - 24, h: 96 };
      placeTray();
    }
    function placeTray() {
      const pool = R[cur].pool, cols = colsOf(pool), gap = 7;
      const tw = (W - 24 - (cols - 1) * gap) / cols, th = 34, rows = Math.ceil(pool.length / cols);
      const y0 = bag.y + bag.h + 16;
      tray = pool.map((_, i) => ({ x: 12 + (i % cols) * (tw + gap), y: y0 + Math.floor(i / cols) * (th + gap + 2), w: tw, h: th }));
    }
    const ready = () => api.ready(st.picks.every(pk => pk.length > 0));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], pk = st.picks[cur], good = same(pk, r), S = SK.sets(C);
        drawTabs(p, C, tabs, cur, i => (locked ? (same(st.picks[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.picks[i].length ? C.Z : C.line));
        // Lo que se da: la condición (comprensión) o los conjuntos de la operación.
        p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        if (r.given) {
          r.given.forEach((g, j) => { p.fill(/^U/.test(g) ? C.mute : S[j % 3].ink); fitText(p, g, W / 2, 52 + j * 20, W - 28, 14); });
          p.fill(C.ink); fitText(p, `Escribe ${r.expr}`, W / 2, 52 + r.given.length * 20 + 4, W - 28, 16);
        } else {
          drawKicker(p, C, 'Por comprensión', 14, 56, { bar: C.mint, col: C.Q }); p.noStroke();
          p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          fitText(p, `${r.name || 'A'} = {${r.rule}}`, W / 2, 84, W - 28, 16);
        }
        // Las llaves: el conjunto por extensión, en vivo.
        const col = locked ? (good ? C.ok : C.bad) : S[0].line, ink = locked ? col : S[0].ink;
        SK.panel(p, C, bag, { col: locked ? col : null });
        SK.serif(p, '{', bag.x + 18, bag.y + bag.h / 2 - 6, 46, ink); SK.serif(p, '}', bag.x + bag.w - 18, bag.y + bag.h / 2 - 6, 46, ink);
        const inside = ordered(pk, r);
        p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        // Si la lista no cabe en una línea, se parte en dos.
        const txt = inside.length ? inside.join(', ') : ' ';
        p.textSize(15);
        if (inside.length > 1 && p.textWidth(txt) > bag.w - 76) {
          const h = Math.ceil(inside.length / 2);
          fitText(p, inside.slice(0, h).join(', ') + ',', W / 2, bag.y + bag.h / 2 - 22, bag.w - 76, 15);
          fitText(p, inside.slice(h).join(', '), W / 2, bag.y + bag.h / 2, bag.w - 76, 15);
        } else fitText(p, txt, W / 2, bag.y + bag.h / 2 - 10, bag.w - 76, 21);
        if (inside.length) SK.serif(p, `n(${r.expr || r.name || 'A'}) = ${inside.length}`, W / 2, bag.y + bag.h - 15, 13, ink, bag.w - 80);
        else { p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.text('Toca los elementos que pertenecen', W / 2, bag.y + bag.h / 2); }
        // Elementos disponibles: el que ya entró a las llaves queda encendido.
        pop.t = Math.max(0, pop.t - 0.08);
        tray.forEach((b, i) => {
          const lab = r.pool[i], on = pk.includes(lab);
          SK.chip(p, C, b, lab, { state: !on ? 'idle' : locked ? (r.members.includes(lab) ? 'ok' : 'bad') : 'on', size: 14, k: pop.i === i ? 1 + 0.12 * pop.t : 1 });
        });
        p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        if (locked && !good) { p.fill(C.ok); fitText(p, `Era ${listText(r.members)}`, W / 2, H - 10, W - 24, 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; placeTray(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const i = tray.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (i >= 0) {
          const lab = R[cur].pool[i], pk = st.picks[cur], k = pk.indexOf(lab);
          if (k >= 0) pk.splice(k, 1); else pk.push(lab);
          pop = { i, t: 1 }; api.sfx?.tap?.(); ready(); return false;
        }
      };
    }, aspect);

    return {
      loaded: m.ready,
      getState: () => ({ picks: st.picks.map(pk => [...pk]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, listText };
})();
