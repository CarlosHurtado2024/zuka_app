// Galería para revisar en el navegador los juegos del mundo Teoría de Conjuntos (spec 2026-11-26-conjuntos-lamina).
// No es una prueba de Node: se carga en la página de la app con fetch + eval.
//   await __conj.gallery(['lazo-conjunto', …] | null, 'dark' | 'light', ancho) → monta los juegos lado a lado
//   __conj.insts[i] → { game, inst, st, tap(caja) }   para jugar con peek().solve
(() => {
  // El panel del navegador puede estar oculto (requestAnimationFrame casi parado): los cuadros se mueven con un canal de mensajes.
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
  const uses = () => COURSE_ALGEBRA.units[0].lessons.flatMap(l => l.ex.filter(e => e.type === 'play').map(ex => ({ id: l.id, ex })));
  window.__conj = {
    insts: [], uses, sleep,
    clear() { this.insts.forEach(i => i.inst.destroy()); this.insts = []; document.getElementById('conj-gal')?.remove(); },
    async gallery(names, theme = 'dark', width = 328, start = true) {
      this.clear(); window.__err = null;
      S.tourDone = true; S.theme = theme; applyTheme();
      const wrap = document.createElement('div');
      wrap.id = 'conj-gal';
      wrap.style.cssText = `position:fixed;inset:0;z-index:99999;overflow:auto;display:flex;flex-wrap:wrap;gap:10px;padding:8px;align-content:flex-start;background:${theme === 'light' ? '#e9edf5' : '#0a0d1c'}`;
      document.body.appendChild(wrap);
      const seen = new Set();
      for (const { ex } of uses()) {
        if (names ? !names.includes(ex.game) : seen.has(ex.game)) continue;
        seen.add(ex.game);
        const host = document.createElement('div'); host.className = 'play'; host.style.cssText = `width:${width}px;flex:none`;
        wrap.appendChild(host);
        const st = { ready: false }, inst = GAMES[ex.game].create(host, ex.params, { ready: v => { st.ready = v; }, sfx: {}, palette: PALETTE, tex: s => s });
        await inst.loaded;
        const cv = host.querySelector('canvas');
        const ev = (type, x, y) => { const r = cv.getBoundingClientRect(); const o = { clientX: r.left + x, clientY: r.top + y, bubbles: true, button: 0, buttons: type === 'mouseup' ? 0 : 1 }; cv.dispatchEvent(new MouseEvent(type, o)); };
        const tap = async b => { const x = b.x + b.w / 2, y = b.y + b.h / 2; ev('mousedown', x, y); await sleep(40); ev('mouseup', x, y); await sleep(40); };
        this.insts.push({ game: ex.game, ex, inst, st, tap, cv });
        if (start && inst.peek?.().phase === 'idle') await tap({ x: width / 2, y: 200, w: 0, h: 0 });
      }
      await sleep(400);
      return this.insts.map(i => i.game);
    },
    // Juega un juego de retos hasta el final con peek().solve; devuelve si quedó listo y bien calificado.
    async play(i, max = 60) {
      const g = this.insts[i];
      for (let n = 0; n < max && !g.st.ready; n++) {
        const s = g.inst.peek();
        if (s.phase === 'idle') { await g.tap({ x: s.W / 2, y: 200, w: 0, h: 0 }); continue; }
        if (!s.solve) { await sleep(120); continue; }
        for (const b of s.solve) await g.tap(b);
        await sleep(100);
      }
      return { game: g.game, ready: g.st.ready, ok: GAMES[g.game].grade(g.inst.getState(), g.ex.params).ok, err: window.__err };
    },
  };
})();
