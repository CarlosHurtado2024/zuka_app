// Robot para probar en el navegador los juegos de Torres de Potencias y de la Escalera de Sigma (no es una prueba de Node: se carga con
// <script> o fetch + eval en la página de la app). Usa peek() de cada juego y eventos de ratón simulados.
// window.__robot.run(nombres) → resultados en window.__robot.res; window.__robot.shot(nombre, tema, pasos) deja un
// juego a medio resolver y congelado para una captura.
(() => {
  const ch = new MessageChannel(); let q = [], last = 0, id = 0, waiters = [], frames = 0;
  ch.port1.onmessage = () => {
    const now = performance.now();
    if (!window.__freeze && q.length && now - last >= 16) { last = now; const f = q; q = []; frames++; f.forEach(g => { try { g.cb(now); } catch (e) { window.__err = String(e.stack || e); } }); }
    const w = waiters; waiters = []; w.forEach(x => (now >= x.t ? x.r() : waiters.push(x)));
    if ((q.length && !window.__freeze) || waiters.length) ch.port2.postMessage(0);
  };
  window.requestAnimationFrame = cb => { q.push({ cb, id: ++id }); ch.port2.postMessage(0); return id; };
  window.cancelAnimationFrame = i => { q = q.filter(x => x.id !== i); };
  const sleep = ms => new Promise(r => { waiters.push({ t: performance.now() + ms, r }); ch.port2.postMessage(0); });
  const thaw = () => { window.__freeze = false; ch.port2.postMessage(0); };
  const exOf = (name, nth = 0) => COURSE_ALGEBRA.units.filter(u => ['potencias', 'progresiones'].includes(u.world)).flatMap(u => u.lessons).flatMap(l => l.ex).filter(e => e.game === name)[nth];

  async function mount(name, theme, width = 340, nth = 0) {
    thaw(); window.__err = null;
    if (theme) { S.tourDone = true; S.theme = theme; applyTheme(); }
    window.__inst?.destroy(); document.getElementById('bot-host')?.remove();
    const ex = exOf(name, nth), host = document.createElement('div');
    host.id = 'bot-host'; host.className = 'play';
    host.style.cssText = `position:fixed;left:0;top:0;width:${width}px;z-index:99999;background:${S.theme === 'light' ? '#f5f7fc' : '#0c0f1f'}`;
    document.body.appendChild(host);
    const st = { ready: false }, inst = GAMES[name].create(host, ex.params, { ready: v => { st.ready = v; }, sfx: {}, palette: PALETTE, tex: s => s });
    window.__inst = inst; await inst.loaded; await sleep(300);
    const cv = host.querySelector('canvas');
    const ev = (type, x, y) => { const r = cv.getBoundingClientRect(); window.dispatchEvent(new MouseEvent(type, { clientX: r.left + x, clientY: r.top + y, bubbles: true, button: 0, buttons: type === 'mouseup' ? 0 : 1 })); };
    const tap = async (x, y) => { ev('mousedown', x, y); await sleep(25); ev('mouseup', x, y); await sleep(25); };
    const drag = async pts => { ev('mousedown', ...pts[0]); await sleep(30); for (const q of pts.slice(1)) { ev('mousemove', ...q); await sleep(30); } ev('mouseup', ...pts[pts.length - 1]); await sleep(30); };
    return { inst, st, ex, tap, drag };
  }
  const mid = b => [b.x + b.w / 2, b.y + b.h / 2];
  const plus = b => [b.x + b.w - 20, b.y + b.h / 2], minus = b => [b.x + 20, b.y + b.h / 2];

  // Resuelve la ronda actual de un juego por rondas (bad: deja una respuesta mala).
  async function solveRound(name, inst, ex, tap, bad) {
    const G = GAMES[name], s = () => inst.peek(), r = ex.params.rounds[s().cur];
    const stepTo = async (box, get, want) => { for (let k = 0; k < 40 && get() !== want; k++) await tap(...(get() < want ? plus(box) : minus(box))); };
    if (name === 'arbol-potencia') { const [b, e] = G.powersOf(r.target)[0]; await stepTo(s().box[0], () => s().s.b, b); await stepTo(s().box[1], () => s().s.e, e + (bad ? 1 : 0)); }
    if (name === 'pares-negativos') { const p = s(), idx = p.negs.map((n, i) => (n ? i : -1)).filter(i => i >= 0); for (let k = 0; k + 1 < idx.length; k += 2) { await tap(...mid(p.boxes[idx[k]])); await tap(...mid(p.boxes[idx[k + 1]])); } await tap(...mid(p.btn.find(b => b.sign === (bad ? -p.sign : p.sign)))); }
    if (name === 'cuenta-factores') await stepTo(s().box, () => s().s.e, s().want + (bad ? 1 : 0));
    // Las fichas se reacomodan al moverlas: se vuelve a mirar antes de cada toque.
    if (name === 'cambia-de-piso') { if (bad) await tap(...mid(s().boxes[s().neg.indexOf(false)])); else for (let k = 0; k < 8 && s().neg.includes(true); k++) await tap(...mid(s().boxes[s().neg.indexOf(true)])); }
    if (name === 'salta-la-coma') { for (let k = 0; k < 20 && s().s.pt !== s().goal + (bad ? 1 : 0); k++) await tap(...mid(s().btn[s().s.pt < s().goal + (bad ? 1 : 0) ? 1 : 0])); }
    if (name === 'reparte-factores') { await stepTo(s().box[0], () => s().s.split, r.den); await stepTo(s().box[1], () => s().s.keep, bad ? 1 : r.num); }
    if (name === 'parte-baldosa') await stepTo(s().box, () => s().s.k, bad ? 2 : s().want);
    if (name === 'cuenta-saltos') { await stepTo(s().box[0], () => s().s.j, s().want + (bad ? 1 : 0)); if (s().mode === 'count') await stepTo(s().box[1], () => s().s.t, s().want + 1); }
    if (name === 'resta-corrida') { const cols = s().cols; for (let i = 0; i < cols.length; i++) if (cols[i].pair && !(bad && i === 1)) await tap(...mid(cols[i])); }
    if (name === 'parte-sigma') { await stepTo(s().box[0], () => s().s.a, s().want[0]); await stepTo(s().box[1], () => s().s.b, bad ? 1 : s().want[1]); }
    if (name === 'tabla-conjugado') { const p = s(); await tap(...mid(p.opt[bad ? (p.good + 1) % 4 : p.good])); }
  }
  async function playRounds(name, bad, nth = 0) {
    const { inst, st, ex, tap } = await mount(name, null, 340, nth);
    const n = ex.params.rounds.length;
    for (let i = 0; i < n; i++) { await tap(...mid(inst.peek().tabs[i])); await sleep(120); await solveRound(name, inst, ex, tap, bad && i === 0); await sleep(120); }
    const g = GAMES[name].grade(inst.getState(), ex.params);
    inst.lock(); await sleep(250);
    return { name, bad: !!bad, ready: st.ready, ok: g.ok, err: window.__err };
  }
  async function playArcade(name, maxMs = 70000, stop) {
    const { inst, st, ex, tap, drag } = await mount(name);
    const t0 = performance.now(), f0 = frames; let lost = 0, lose = true;
    while (!st.ready && performance.now() - t0 < maxMs && !window.__err) {
      const s = inst.peek();
      if (s.phase !== 'play') { if (s.phase === 'lost') { lost++; lose = false; } await tap(s.W / 2, s.H / 2); await sleep(250); continue; }
      if (s.pause > 0 || s.moving || s.busy || s.hopping) { await sleep(60); continue; }
      if (stop && stop(s)) { await sleep(300); window.__freeze = true; break; }
      if (name === 'torre-pisos') { const f = s.floors.find(q => q.k === (lose ? (s.target === 1 ? 2 : 1) : s.target)); if (Math.round(s.floor) !== f.k) { await tap(f.x, f.y); await sleep(200); continue; } await tap(s.ok.x, s.ok.y); }
      if (name === 'escala-leyes') { const order = lose ? [...s.sol].reverse() : s.sol, next = order[s.used.length]; await tap(s.cards[next].x, s.cards[next].y); }
      if (name === 'siembra-raices') { const want = lose ? [1] : s.want; for (const sd of s.seeds) if (sd.sel !== want.includes(sd.v)) await tap(sd.x, sd.y); await tap(s.ok.x, s.ok.y); }
      if (name === 'traza-progresion') { const pts = s.dots.slice(0, s.len).map(d => [d.x, d.y]); await drag(lose ? [pts[0], [s.dots[s.len].x, s.dots[s.len].y]] : pts); }
      if (name === 'encesta-suma') { const h = s.hoops.find(x => x.good !== lose), dx = h.x - s.home.x, dy = s.hoopY - s.home.y, d = Math.hypot(dx, dy); await drag([[s.home.x, s.home.y], [s.home.x + (dx / d) * 30, s.home.y + (dy / d) * 30], [s.home.x + (dx / d) * 70, s.home.y + (dy / d) * 70]]); }
      if (name === 'dobla-fichas') { let dir = 'left', bs = -1; for (const d of ['left', 'down', 'right', 'up']) { const r = GAMES[name].move(s.grid, d); if (!r.moved) continue; const sc = r.merged * 10 + r.grid.filter(v => !v).length + (d === 'left' || d === 'down' ? 0.5 : 0); if (sc > bs) { bs = sc; dir = d; } } const v = { left: [-50, 0], right: [50, 0], up: [0, -50], down: [0, 50] }[dir], cx = s.W / 2, cy = s.box.y + s.box.s / 2; await drag([[cx, cy], [cx + v[0] / 2, cy + v[1] / 2], [cx + v[0], cy + v[1]]]); }
      if (name === 'rana-zenon') { if (s.jumps < s.need) await tap(s.W / 2, s.pondY); else { const f = s.flags.find(x => x.good !== lose); await tap(f.x, f.y); } }
      if (name === 'maquina-sigma') { const t = s.tiles.find(x => (lose ? x.value !== s.want : x.value === s.want)); await drag([[t.x, t.y], [(t.x + s.machine.x) / 2, (t.y + s.machine.y) / 2], [s.machine.x, s.machine.y]]); }
      if (name === 'muro-radicales') { const want = lose ? [s.sol[0]] : s.sol; for (let i = 0; i < s.pile.length; i++) if (s.row.includes(i) !== want.includes(i)) await tap(s.pile[i].x, s.pile[i].y); await tap(s.ok.x, s.ok.y); }
      await sleep(120);
    }
    const g = GAMES[name].grade(inst.getState(), ex.params), ms = performance.now() - t0;
    return { name, ready: st.ready, ok: g.ok, done: inst.getState().done.join(), lost, s: Math.round(ms / 1000), hz: Math.round((frames - f0) / (ms / 1000)), err: window.__err, phase: inst.peek().phase };
  }
  const ARCADE = ['torre-pisos', 'escala-leyes', 'siembra-raices', 'muro-radicales', 'traza-progresion', 'encesta-suma', 'dobla-fichas', 'rana-zenon', 'maquina-sigma'];
  window.__robot = {
    res: [], busy: false, sleep, mount, solveRound, mid,
    async run(names) {
      this.busy = true; this.res = [];
      for (const n of names) {
        try { if (ARCADE.includes(n)) this.res.push(await playArcade(n)); else { const [g, nth] = n.split('#'); this.res.push(await playRounds(g, true, +nth || 0)); this.res.push(await playRounds(g, false, +nth || 0)); } }
        catch (e) { this.res.push({ name: n, thrown: String(e.stack || e) }); }
      }
      this.busy = false;
    },
    // Deja un juego a la vista: por rondas, la ronda `round` resuelta; de acción, detenido cuando stop(peek) es cierto.
    async shot(name, theme, round = 0, stop, width) {
      this.busy = true;
      try {
        if (ARCADE.includes(name)) { S.theme = theme; applyTheme(); await playArcade(name, 40000, stop || (s => s.cur === round)); }
        else { const { inst, ex, tap } = await mount(name, theme, width); await tap(...mid(inst.peek().tabs[round])); await sleep(150); await solveRound(name, inst, ex, tap, false); await sleep(400); window.__freeze = true; }
      } catch (e) { window.__err = String(e.stack || e); }
      this.busy = false;
    },
  };
})();
