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
    const aspect = Math.max(1.4, (248 + rowsMax * 46) / 256);
    const st = { picks: R.map(() => []) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tray = [], bag = null, pop = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      bag = { x: 14, y: 116, w: w - 28, h: 96 };
      placeTray();
    }
    function placeTray() {
      const pool = R[cur].pool, long = pool.some(x => x.length > 5), cols = long ? 3 : pool.length > 12 ? 6 : 5, gap = 8;
      const tw = (W - 28 - (cols - 1) * gap) / cols, th = 38, rows = Math.ceil(pool.length / cols);
      const y0 = H - rows * (th + gap) - 22;
      tray = pool.map((_, i) => ({ x: 14 + (i % cols) * (tw + gap), y: y0 + Math.floor(i / cols) * (th + gap), w: tw, h: th }));
    }
    const ready = () => api.ready(st.picks.every(pk => pk.length > 0));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], pk = st.picks[cur], good = same(pk, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (same(st.picks[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.picks[i].length ? C.Z : C.line));
        // La regla (comprensión)
        if (!r.given) drawKicker(p, C, 'Por comprensión', 14, 54);
        p.noStroke();
        p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        if (r.given) {
          const cols = [C.Z, C.I, C.N];
          r.given.forEach((g, j) => { p.fill(cols[j % 3]); fitText(p, g, W / 2, 52 + j * 20, W - 28, 14); });
          p.fill(C.ink); fitText(p, `Escribe ${r.expr}`, W / 2, 52 + r.given.length * 20 + 2, W - 28, 15);
        } else fitText(p, `${r.name || 'A'} = {${r.rule}}`, W / 2, 80, W - 28, 16);
        // Las llaves (extensión en vivo)
        const col = locked ? (good ? C.ok : C.bad) : C.R;
        p.fill(C.card); p.stroke(col); p.strokeWeight(2.5); p.rect(bag.x, bag.y, bag.w, bag.h, 16);
        p.noStroke(); p.fill(col); p.textSize(40); p.textStyle(p.NORMAL);
        p.text('{', bag.x + 14, bag.y + bag.h / 2 - 2); p.text('}', bag.x + bag.w - 14, bag.y + bag.h / 2 - 2);
        const inside = ordered(pk, r);
        p.fill(C.ink); p.textStyle(p.BOLD);
        pop = Math.max(0, pop - 0.06);
        // Si la lista no cabe en una línea, se parte en dos.
        const txt = inside.length ? inside.join(', ') : ' ';
        p.textSize(15);
        if (inside.length > 1 && p.textWidth(txt) > bag.w - 60) {
          const h = Math.ceil(inside.length / 2);
          fitText(p, inside.slice(0, h).join(', ') + ',', W / 2, bag.y + bag.h / 2 - 20, bag.w - 60, 15);
          fitText(p, inside.slice(h).join(', '), W / 2, bag.y + bag.h / 2 + 2, bag.w - 60, 15);
        } else fitText(p, txt, W / 2, bag.y + bag.h / 2 - 8, bag.w - 60, 22 + 4 * pop);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12);
        p.text(inside.length ? `n(${r.expr || r.name || 'A'}) = ${inside.length}` : 'Toca las fichas que pertenecen', W / 2, bag.y + bag.h - 16);
        // Fichas
        tray.forEach((b, i) => {
          const lab = r.pool[i], on = pk.includes(lab);
          // Ficha crema; la que ya entró a las llaves queda color sol y hundida.
          drawTile(p, C, b, lab, on ? { fill: C.sun, lift: 1, ring: locked ? null : C.sun } : { fill: C.cream });
        });
        p.textSize(11); p.textStyle(p.BOLD);
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
          pop = 1; api.sfx?.tap?.(); ready(); return false;
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
