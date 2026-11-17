// Robot para probar en el navegador los juegos nuevos de Trigonometría (spec 2026-11-22-trigonometria-juegos). No es
// una prueba de Node: se carga en la página de la app con fetch + eval. Sirve para cualquier juego hecho con `questGame`.
//   __trig.run()                 → juega todos (un error a propósito y luego bien); resultados en __trig.res
//   __trig.shot(juego, tema, ancho, nth, retos) → deja el juego a la vista con `retos` retos ya resueltos
(() => {
  const ch = new MessageChannel(); let q = [], last = 0, id = 0, waiters = [];
  ch.port1.onmessage = () => {
    const now = performance.now();
    if (q.length && now - last >= 12) { last = now; const f = q; q = []; f.forEach(g => { try { g.cb(now); } catch (e) { window.__err = String(e.stack || e); } }); }
    const w = waiters; waiters = []; w.forEach(x => (now >= x.t ? x.r() : waiters.push(x)));
    if (q.length || waiters.length) ch.port2.postMessage(0);
  };
  window.requestAnimationFrame = cb => { q.push({ cb, id: ++id }); ch.port2.postMessage(0); return id; };
  window.cancelAnimationFrame = i => { q = q.filter(x => x.id !== i); };
  const sleep = ms => new Promise(r => { waiters.push({ t: performance.now() + ms, r }); ch.port2.postMessage(0); });
  const uses = () => COURSE_TRIG.units.flatMap(u => u.lessons).flatMap(l => l.ex.filter(e => GAMES[e.game]?.answer && e.params?.rounds?.[0]?.items).map(ex => ({ id: l.id, ex })));

  async function mount(ex, theme, width = 340) {
    window.__err = null;
    if (theme) { S.tourDone = true; S.theme = theme; applyTheme(); }
    window.__inst?.destroy(); document.getElementById('bot-host')?.remove();
    const host = document.createElement('div');
    host.id = 'bot-host'; host.className = 'play';
    host.style.cssText = `position:fixed;left:0;top:0;width:${width}px;z-index:99999;background:${S.theme === 'light' ? '#f4f6fb' : '#07080f'}`;
    document.body.appendChild(host);
    const st = { ready: false }, inst = GAMES[ex.game].create(host, ex.params, { ready: v => { st.ready = v; }, sfx: {}, palette: PALETTE, tex: s => s });
    window.__inst = inst; await inst.loaded; await sleep(250);
    const cv = host.querySelector('canvas');
    const ev = (type, x, y) => { const r = cv.getBoundingClientRect(); window.dispatchEvent(new MouseEvent(type, { clientX: r.left + x, clientY: r.top + y, bubbles: true, button: 0, buttons: type === 'mouseup' ? 0 : 1 })); };
    const tap = async b => { const x = b.x + b.w / 2, y = b.y + b.h / 2; ev('mousedown', x, y); await sleep(20); ev('mouseup', x, y); await sleep(20); };
    return { inst, st, tap };
  }
  // Juega hasta resolver `stop` retos (o todos). Devuelve vidas perdidas a propósito y errores.
  async function play(ex, theme, width, stop = Infinity, fail = true) {
    const { inst, st, tap } = await mount(ex, theme, width), t0 = performance.now();
    let solved = 0, missed = 0, tried = !fail, notes = [];
    while (!st.ready && solved < stop && performance.now() - t0 < 60000 && !window.__err) {
      const s = inst.peek();
      if (s.phase !== 'play') { await tap({ x: s.W / 2, y: s.H / 2, w: 0, h: 0 }); await sleep(120); continue; }
      if (s.wait > 0 || !s.solve) { await sleep(60); continue; }
      if (!tried && s.wrong) { tried = true; const l = s.lives; await tap(s.wrong); await sleep(80); if (inst.peek().lives === l - 1) missed++; else notes.push('el error no quitó vida'); continue; }
      const before = s.done.join() + s.cur;
      for (const b of s.solve) await tap(b);
      await sleep(60);
      const a = inst.peek();
      if (a.wait > 0 || a.done.join() + a.cur !== before || a.phase !== 'play') solved++; else { notes.push(`no resolvió (ronda ${s.cur})`); break; }
      while (inst.peek().wait > 0) await sleep(60);
    }
    return { game: ex.game, solved, missed, ready: st.ready, ok: GAMES[ex.game].grade(inst.getState(), ex.params).ok, notes: notes.join('; '), err: window.__err };
  }
  window.__trig = {
    res: [], busy: false, uses, mount, play, sleep,
    async run(theme = 'dark', width = 340) {
      this.busy = true; this.res = [];
      for (const { id, ex } of uses()) { try { this.res.push({ id, ...(await play(ex, theme, width)) }); } catch (e) { this.res.push({ id, game: ex.game, thrown: String(e.stack || e) }); } }
      window.__inst?.destroy(); document.getElementById('bot-host')?.remove(); this.busy = false;
    },
    async shot(game, theme, width = 340, nth = 0, stop = 0) {
      this.busy = true;
      try { const u = uses().filter(q => q.ex.game === game)[nth]; this.last = await play(u.ex, theme, width, stop, false); if (!stop) { const s = window.__inst.peek(); if (s.phase !== 'play') { const cv = document.querySelector('#bot-host canvas'), r = cv.getBoundingClientRect(); for (const t of ['mousedown', 'mouseup']) window.dispatchEvent(new MouseEvent(t, { clientX: r.left + s.W / 2, clientY: r.top + s.H / 2, bubbles: true })); await sleep(300); } } }
      catch (e) { this.last = { thrown: String(e.stack || e) }; }
      this.busy = false;
    },
  };
})();
