// El atajo de los axiomas (lección 1.2): una expresión se reescribe paso a paso tocando el axioma que
// se quiere usar (conmutativa, asociativa, distributiva, inverso, neutro) hasta llegar a la meta. Si el
// axioma no sirve en ese momento, la expresión tiembla. Se puede deshacer, y el contador compara los
// pasos con el atajo más corto. Rondas con pestañas.
// params = { rounds: [{ start, target, states: { expr: { axioma: expr } } }] }   state = { paths: [[expr, …]] }

GAMES['atajo-axiomas'] = (() => {
  const AXIOMS = ['Conmutativa', 'Asociativa', 'Distributiva', 'Inverso', 'Neutro'];

  // Camino más corto (búsqueda en anchura) de start a target, como lista de axiomas.
  function shortest(r) {
    const prev = new Map([[r.start, null]]), queue = [r.start];
    while (queue.length) {
      const e = queue.shift();
      if (e === r.target) break;
      for (const [ax, next] of Object.entries(r.states[e] || {})) if (!prev.has(next)) { prev.set(next, [e, ax]); queue.push(next); }
    }
    const out = [];
    for (let e = r.target; prev.get(e); e = prev.get(e)[0]) out.unshift(prev.get(e)[1]);
    return out;
  }
  const validPath = (r, path) => !!path && path[0] === r.start && path[path.length - 1] === r.target
    && path.every((e, i) => i === 0 || Object.values(r.states[path[i - 1]] || {}).includes(e));

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => validPath(r, state.paths[i]));
    const solution = params.rounds.map(r => `${r.start} = ${r.target}: ${shortest(r).join(' → ')}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { paths: params.rounds.map(r => [r.start]) };
    const steps = st.paths.map(() => []);            // axioma usado en cada paso
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], btns = [], card = null, msg = null, shake = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      card = { x: 16, y: h * 0.36, w: w - 32, h: 62 };
      const bw = (w - 24 - 8) / 2, bh = 38, y0 = h - 3 * (bh + 8) - 24;
      btns = [...AXIOMS, '↶ Deshacer'].map((a, k) => ({ a, x: 12 + (k % 2) * (bw + 8), y: y0 + Math.floor(k / 2) * (bh + 8), w: bw, h: bh }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const at = () => st.paths[cur][st.paths[cur].length - 1];
    const ready = () => api.ready(st.paths.every(p => p.length > 1));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function fitText(s, maxW, start) {
        let sz = start; p.textSize(sz);
        while (sz > 12 && p.textWidth(s) > maxW) { sz -= 1; p.textSize(sz); }
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], path = st.paths[cur], done = at() === r.target;
        tabs.forEach((t, i) => {
          const ri = params.rounds[i], fin = validPath(ri, st.paths[i]);
          const col = locked ? (fin ? C.ok : C.bad) : i === cur ? C.brand : fin ? C.Q : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        // La meta, arriba a la derecha.
        p.textStyle(p.BOLD); p.textSize(16);
        const goal = `meta: ${r.target}`, gw = p.textWidth(goal) + 24;
        p.stroke(C.Q); p.strokeWeight(2); p.fill(C.Q + '22'); p.rect(W - 12 - gw, 8, gw, 30, 15);
        p.noStroke(); p.fill(C.Q); p.textAlign(p.CENTER, p.CENTER); p.text(goal, W - 12 - gw / 2, 23);

        // Los pasos anteriores (los dos últimos), con el axioma que se usó.
        const shown = Math.min(2, path.length - 1);
        for (let k = 0; k < shown; k++) {
          const idx = path.length - 1 - shown + k, y = 54 + k * 44;
          p.fill(C.mute); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER); fitText(path[idx], W - 40, 15); p.text(path[idx], W / 2, y);
          p.fill(C.brand); p.textStyle(p.BOLD); p.textSize(11); p.text(`↓ ${steps[cur][idx]}`, W / 2, y + 20);
        }
        if (path.length === 1) { p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text('Toca un axioma para reescribir la expresión', 12, 64, W - 24, 36); }

        // La expresión actual.
        const dx = shake > 0 ? Math.sin(shake * 40) * 6 * shake : 0; shake = Math.max(0, shake - 0.04);
        const col = locked ? (done ? C.ok : C.bad) : done ? C.ok : C.brand;
        p.stroke(col); p.strokeWeight(2.5); p.fill(C.card); p.rect(card.x + dx, card.y, card.w, card.h, 14);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(at(), card.w - 24, 26); p.text(at(), W / 2 + dx, card.y + card.h / 2 + 1);

        // Mensaje: aviso, logro o el atajo al bloquear.
        const best = shortest(r).length;
        let text = msg ? msg.text : done ? `¡Llegaste a la meta en ${path.length - 1} pasos!` : '';
        let tcol = msg ? msg.col : C.ok;
        if (locked && !done) { text = `Atajo: ${shortest(r).join(' → ')}`; tcol = C.ok; }
        if (msg && --msg.t <= 0) msg = null;
        p.fill(tcol); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.TOP); p.text(text, 16, card.y + card.h + 10, W - 32, 40);

        // Botones de los axiomas.
        btns.forEach(b => {
          const undo = b.a.startsWith('↶'), off = locked || (undo ? path.length === 1 : done);
          p.stroke(off ? C.line : undo ? C.mute : C.Z); p.strokeWeight(1.8); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(off ? C.mute : C.ink); p.textStyle(p.BOLD); p.textSize(14); p.textAlign(p.CENTER, p.CENTER); p.text(b.a, b.x + b.w / 2, b.y + b.h / 2);
        });
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`pasos: ${path.length - 1} · el atajo más corto usa ${best}`, 12, H - 12, W - 24, 16);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; msg = null; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const b = btns.find(b => inside(b, p.mouseX, p.mouseY));
        if (!b) return;
        const r = params.rounds[cur], path = st.paths[cur];
        if (b.a.startsWith('↶')) {
          if (path.length > 1) { path.pop(); steps[cur].pop(); msg = null; api.sfx?.tap?.(); ready(); }
          return false;
        }
        if (at() === r.target) return false;
        const next = (r.states[at()] || {})[b.a];
        if (next) { path.push(next); steps[cur][path.length - 2] = b.a; msg = null; api.sfx?.tap?.(); ready(); }
        else { shake = 1; msg = { text: `La ${b.a.toLowerCase()} no sirve aquí: prueba otra regla`, col: C.bad, t: 90 }; }
        return false;
      };
    }, 1.35);

    return {
      loaded: m.ready,
      getState: () => ({ paths: st.paths.map(p => [...p]) }),
      lock() { locked = true; msg = null; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, shortest };
})();
