// Auditoría de colores de los juegos en el navegador (no es una prueba de Node: se carga en la página de la app con
// fetch + eval). Monta cada juego de cada curso en los dos temas y, en cada cosa que p5 dibuja, mira el píxel que hay
// debajo: avisa de textos que casi no contrastan con su fondo y de figuras rellenas del mismo color que lo que tapan
// (amarillo sobre amarillo). Spec 2026-11-16-guia-y-colores.
//   await __colores.run()            → __colores.res = [{ game, theme, kind, fg, bg, what, n }]
//   __colores.run(['bolsa-razon'])   → solo esos juegos
(() => {
  const ch = new MessageChannel(); let q = [], last = 0, id = 0, waiters = [];
  ch.port1.onmessage = () => {
    const now = performance.now();
    if (q.length && now - last >= 8) { last = now; const f = q; q = []; f.forEach(g => { try { g.cb(now); } catch (e) { window.__err = String(e.stack || e); } }); }
    const w = waiters; waiters = []; w.forEach(x => (now >= x.t ? x.r() : waiters.push(x)));
    if (q.length || waiters.length) ch.port2.postMessage(0);
  };
  window.requestAnimationFrame = cb => { q.push({ cb, id: ++id }); ch.port2.postMessage(0); return id; };
  window.cancelAnimationFrame = i => { q = q.filter(x => x.id !== i); };
  const sleep = ms => new Promise(r => { waiters.push({ t: performance.now() + ms, r }); ch.port2.postMessage(0); });

  const rgbOf = css => {
    if (typeof css !== 'string') return null;
    let m = css.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
    if (m) return [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)).concat(m[2] ? parseInt(m[2], 16) / 255 : 1);
    m = css.match(/^rgba?\(([^)]+)\)/);
    if (m) { const v = m[1].split(',').map(Number); return [v[0], v[1], v[2], v[3] ?? 1]; }
    return null;
  };
  const lum = c => { const v = c.slice(0, 3).map(x => x / 255).map(x => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const yellow = c => c[0] > 200 && c[1] > 150 && c[2] < 140 && c[0] - c[2] > 90;

  let cur = null;   // { game, theme, found: Map }
  const note = (kind, fg, bg, what) => {
    if (!cur) return;
    const key = `${kind}|${hex(fg)}|${hex(bg)}`, o = cur.found.get(key) || { game: cur.game, theme: cur.theme, kind, fg: hex(fg), bg: hex(bg), what: String(what).slice(0, 40), n: 0, yellow: yellow(fg) && yellow(bg) };
    o.n++; cur.found.set(key, o);
  };
  const under = (p, x, y) => {
    const d = p.pixelDensity(), cv = p.drawingContext.canvas, px = Math.round(x * d), py = Math.round(y * d);
    if (px < 0 || py < 0 || px >= cv.width || py >= cv.height) return null;
    const t = p.drawingContext.getTransform();   // el punto va con la transformación que tenga el lienzo
    const X = Math.round(t.a * x + t.c * y + t.e), Y = Math.round(t.b * x + t.d * y + t.f);
    if (X < 0 || Y < 0 || X >= cv.width || Y >= cv.height) return null;
    return [...p.drawingContext.getImageData(X, Y, 1, 1).data];
  };
  let patched = false;
  function patch() {
    if (patched || !window.p5) return; patched = true;
    const P = p5.prototype, wrap = (name, at) => {
      const orig = P[name];
      P[name] = function (...a) {
        try {
          const r = this._renderer, ctx = this.drawingContext;
          if (cur && r && r._doFill && ctx.globalAlpha > 0.7) {
            const fg = rgbOf(ctx.fillStyle), pt = at.call(this, a);
            if (fg && fg[3] > 0.7 && pt) {
              const bg = under(this, pt[0], pt[1]);
              if (bg) {
                if (name === 'text') { if (ratio(fg, bg) < 2.2) note('texto', fg, bg, a[0]); }
                else if (!r._doStroke && pt[2] >= 6 && dist(fg, bg) < 34 && !(fg[0] === bg[0] && fg[1] === bg[1] && fg[2] === bg[2] && !yellow(fg))) note('figura', fg, bg, name);
                else if (!r._doStroke && pt[2] >= 6 && yellow(fg) && yellow(bg)) note('figura', fg, bg, name);
              }
            }
          }
        } catch (e) { window.__err2 = String(e); }
        return orig.apply(this, a);
      };
    };
    wrap('rect', a => [a[0] + a[2] / 2, a[1] + (a[3] ?? a[2]) / 2, Math.min(Math.abs(a[2]), Math.abs(a[3] ?? a[2]))]);
    wrap('circle', a => [a[0], a[1], a[2]]);
    wrap('ellipse', a => [a[0], a[1], Math.min(a[2], a[3] ?? a[2])]);
    wrap('text', function (a) {
      const al = this._renderer._textAlign, w = this.textWidth(String(a[0]).split('\n')[0]), s = this.textSize();
      const x = al === 'center' ? a[1] : al === 'right' ? a[1] - w / 2 : a[1] + w / 2;
      const bl = this._renderer._textBaseline, y = bl === 'center' ? a[2] : bl === 'top' ? a[2] + s / 2 : a[2] - s / 3;
      return [x - Math.min(w, 8) / 2 - 1, y, 99];
    });
  }

  const plays = () => {
    const out = [];
    for (const c of COURSES) for (const u of c.units || []) {
      const ls = [...(u.lessons || []), ...(u.boss ? [u.boss] : []), ...((u.exam?.items || []).map(i => ({ ex: [i.ex] })))];
      for (const l of ls) for (const e of l.ex || []) if (e && e.type === 'play' && GAMES[e.game]) out.push(e);
    }
    return out;
  };

  async function one(ex, theme, width = 340) {
    S.tourDone = true; S.theme = theme; applyTheme();
    document.getElementById('bot-host')?.remove();
    const host = document.createElement('div');
    host.id = 'bot-host'; host.className = 'play';
    host.style.cssText = `position:fixed;left:0;top:0;width:${width}px;z-index:99999`;
    document.body.appendChild(host);
    let inst;
    try {
      inst = GAMES[ex.game].create(host, ex.params, { ready() {}, sfx: new Proxy({}, { get: () => () => {} }), palette: PALETTE, tex: s => s });
      await inst.loaded; patch();
      cur = { game: ex.game, theme, found: cur?.game === ex.game && cur.theme === theme ? cur.found : new Map() };
      await sleep(160);
      const cv = host.querySelector('canvas'), r = cv.getBoundingClientRect();
      const ev = (type, x, y) => window.dispatchEvent(new MouseEvent(type, { clientX: r.left + x, clientY: r.top + y, bubbles: true, button: 0, buttons: type === 'mouseup' ? 0 : 1 }));
      // Unos toques repartidos por el lienzo: empiezan los juegos de acción y prenden fichas y botones.
      for (const [fx, fy] of [[0.5, 0.5], [0.25, 0.7], [0.75, 0.7], [0.5, 0.88], [0.2, 0.4], [0.8, 0.4]]) { ev('mousedown', r.width * fx, r.height * fy); await sleep(20); ev('mouseup', r.width * fx, r.height * fy); await sleep(40); }
      await sleep(120);
      try { inst.lock(true); } catch {}
      await sleep(120);
    } catch (e) { (window.__colores.errors ||= []).push(`${ex.game}: ${e}`); }
    const found = cur ? [...cur.found.values()] : [];
    try { inst?.destroy(); } catch {}
    host.remove();
    return found;
  }

  window.__colores = {
    res: [], busy: false, done: 0, total: 0, plays,
    async run(names, perGame = 2) {
      this.busy = true; this.res = []; this.errors = [];
      const seen = {}, list = plays().filter(e => (!names || names.includes(e.game)) && (seen[e.game] = (seen[e.game] || 0) + 1) <= perGame);
      this.total = list.length * 2; this.done = 0;
      const all = new Map();
      for (const ex of list) for (const theme of ['dark', 'light']) {
        cur = null;
        for (const o of await one(ex, theme)) { const k = `${o.game}|${o.theme}|${o.kind}|${o.fg}|${o.bg}`; if (!all.has(k)) all.set(k, o); else all.get(k).n += o.n; }
        this.done++;
      }
      cur = null; this.res = [...all.values()]; this.busy = false;
      return this.res.length;
    },
  };
})();
