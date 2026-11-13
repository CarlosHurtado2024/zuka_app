// Arma el conjunto (Álgebra 0, tipos y relaciones): arriba están A y B escritos por extensión y abajo una bandeja
// de fichas. Cada ronda pide armar, dentro de las llaves, un conjunto con ciertas condiciones: vacío, unitario,
// subconjunto de A, igual a B, disjunto de A… Muchas veces vale más de una respuesta. Tocar una ficha la mete o la
// saca; «∅ Vaciar» deja las llaves vacías (también cuenta como respuesta).
// params = { pool, sets: { A: [...], B: [...] }, rounds: [{ text, rule: { size, minSize, subsetOf, equal,
//            disjointFrom, contains }, example }] }   state = { picks: [[etiquetas]] }

GAMES['arma-conjunto'] = (() => {
  function check(pk, rule) {
    if (!pk) return false;
    const s = new Set(pk);
    if (s.size !== pk.length) return false;
    if (rule.size != null && pk.length !== rule.size) return false;
    if (rule.minSize != null && pk.length < rule.minSize) return false;
    if (rule.subsetOf && !pk.every(x => rule.subsetOf.includes(x))) return false;
    if (rule.equal && !(pk.length === rule.equal.length && rule.equal.every(x => s.has(x)))) return false;
    if (rule.disjointFrom && pk.some(x => rule.disjointFrom.includes(x))) return false;
    if (rule.contains && !rule.contains.every(x => s.has(x))) return false;
    return true;
  }
  const listText = xs => (xs.length ? `{${xs.join(', ')}}` : '∅');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => check(state.picks?.[i], r.rule));
    const solution = params.rounds.map(r => `${r.text}: por ejemplo ${listText(r.example || [])}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, pool = params.pool, sets = params.sets || {};
    const st = { picks: R.map(() => []) };
    const touched = R.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tray = [], bag = null, clear = null;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      const setLines = Object.keys(sets).length;
      bag = { x: 14, y: 100 + setLines * 20, w: w - 28, h: 78 };
      clear = { x: w - 14 - 96, y: bag.y + bag.h + 8, w: 96, h: 30 };
      const cols = 3, tw = (w - 28 - 2 * 8) / cols, rows = Math.ceil(pool.length / cols), y0 = clear.y + 42;
      tray = pool.map((_, i) => ({ x: 14 + (i % cols) * (tw + 8), y: y0 + Math.floor(i / cols) * 44, w: tw, h: 36 }));
    }
    const ready = () => api.ready(touched.every(Boolean));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], pk = st.picks[cur], ok = check(pk, r.rule);
        drawTabs(p, C, tabs, cur, i => (locked ? (check(st.picks[i], R[i].rule) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        p.noStroke(); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD);
        const cols = [C.Z, C.I, C.N];
        Object.entries(sets).forEach(([k, v], j) => { p.fill(cols[j % 3]); fitText(p, `${k} = ${listText(v)}`, 14, 56 + j * 20, W - 28, 13); });
        p.fill(C.ink); p.textSize(14); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, r.text, W / 2, bag.y - 16, W - 28, 14);
        // Caja con llaves
        p.fill(C.card); p.stroke(locked ? (ok ? C.ok : C.bad) : C.R); p.strokeWeight(2.5); p.rect(bag.x, bag.y, bag.w, bag.h, 16);
        p.noStroke(); p.fill(C.R); p.textSize(36); p.textStyle(p.NORMAL); p.text('{', bag.x + 14, bag.y + bag.h / 2 - 2); p.text('}', bag.x + bag.w - 14, bag.y + bag.h / 2 - 2);
        const inside = pool.filter(x => pk.includes(x));
        p.fill(inside.length ? C.ink : C.mute); p.textStyle(p.BOLD);
        fitText(p, inside.length ? inside.join(', ') : (touched[cur] ? '∅' : 'vacía'), W / 2, bag.y + bag.h / 2, bag.w - 60, 18);
        // Vaciar
        drawTile(p, C, clear, '∅ Vaciar', { fill: locked ? C.card : C.sky, ink: locked ? C.mute : undefined, r: 8, lift: 2, size: 13 });
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.LEFT, p.CENTER);
        p.text(`n = ${inside.length}`, 14, clear.y + clear.h / 2);
        // Fichas
        tray.forEach((b, i) => {
          const on = pk.includes(pool[i]);
          // Ficha crema; la que ya entró a las llaves queda color sol y hundida.
          drawTile(p, C, b, pool[i], on ? { fill: C.sun, r: 9, lift: 1, size: 14, ring: locked ? null : C.sun } : { r: 9, lift: 2, size: 14 });
        });
        if (locked && !ok) { p.noStroke(); p.fill(C.ok); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); fitText(p, `Por ejemplo: ${listText(r.example || [])}`, W / 2, H - 12, W - 24, 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(clear, p.mouseX, p.mouseY)) { st.picks[cur] = []; touched[cur] = true; ready(); api.sfx?.tap?.(); return false; }
        const i = tray.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (i >= 0) {
          const pk = st.picks[cur], k = pk.indexOf(pool[i]);
          if (k >= 0) pk.splice(k, 1); else pk.push(pool[i]);
          touched[cur] = true; ready(); api.sfx?.tap?.(); return false;
        }
      };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ picks: st.picks.map(pk => [...pk]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, check };
})();
