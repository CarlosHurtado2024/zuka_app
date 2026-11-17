// Auditoría de elementos encimados en los juegos, en el navegador (no es una prueba de Node: se carga en la página de
// la app con fetch + eval, como tests/robot-colores.js). Monta cada juego y, en cada cuadro que dibuja, guarda la caja
// de cada texto (p.text y las fórmulas de formula.js) y de cada rectángulo (fichas, pestañas, casillas). Avisa de:
//   · «texto-texto»: dos textos distintos cuyas cajas se pisan;
//   · «texto-borde»: un texto que cruza el borde de una ficha o casilla (ni adentro ni afuera);
//   · «fuera»: un texto que se sale del lienzo.
//   await __encima.run()                 → __encima.res = [{ game, kind, a, b, n, fase, box }]
//   __encima.run(['rueda-angulo'], 3)    → solo esos juegos, hasta 3 ejercicios de cada uno
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

  let cur = null;          // { game, fase, found: Map, W, H }
  let frame = { texts: [], rects: [] };
  const alphaOf = css => { const m = typeof css === 'string' && css.match(/^rgba\(([^)]+)\)/); return m ? Number(m[1].split(',')[3]) : 1; };
  // Caja en coordenadas del lienzo (con la traslación y la escala que tenga); nada si está girado.
  const place = (ctx, d, x, y, w, h) => {
    const t = ctx.getTransform();
    if (Math.abs(t.b) > 1e-6 || Math.abs(t.c) > 1e-6) return null;
    return { x: (t.a * x + t.e) / d, y: (t.d * y + t.f) / d, w: (t.a * w) / d, h: (t.d * h) / d };
  };
  const inter = (a, b) => { const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); return w > 0 && h > 0 ? { w, h, area: w * h } : null; };
  const inside = (a, b, tol = 2) => a.x >= b.x - tol && a.y >= b.y - tol && a.x + a.w <= b.x + b.w + tol && a.y + a.h <= b.y + b.h + tol;
  const short = s => String(s).replace(/\s+/g, ' ').slice(0, 28);
  const note = (kind, a, b, box) => {
    if (!cur) return;
    const key = `${kind}|${a}|${b}`, o = cur.found.get(key) || { game: cur.game, kind, a, b, n: 0, fase: cur.fase, box };
    o.n++; cur.found.set(key, o);
  };
  function flush() {
    if (!cur) { frame = { texts: [], rects: [] }; return; }
    const { texts, rects } = frame;
    frame = { texts: [], rects: [] };
    for (let i = 0; i < texts.length; i++) {
      const A = texts[i];
      if (A.x < -1 || A.y < -1 || A.x + A.w > cur.W + 1 || A.y + A.h > cur.H + 1) {
        if (inter(A, { x: 0, y: 0, w: cur.W, h: cur.H })) note('fuera', short(A.s), `${Math.round(A.x)},${Math.round(A.y)} ${Math.round(A.w)}×${Math.round(A.h)}`, A);
      }
      for (let j = i + 1; j < texts.length; j++) {
        const B = texts[j];
        if (A.s === B.s && Math.abs(A.x - B.x) < 3 && Math.abs(A.y - B.y) < 3) continue;   // el mismo texto dos veces (sombra)
        if (/^(Toca para empezar|Sin prisa)/.test(A.s) || /^(Toca para empezar|Sin prisa)/.test(B.s)) continue;
        if (inside(A, B, 1) || inside(B, A, 1)) continue;                                  // una parte de la misma fórmula
        const it = inter(A, B);
        if (it && it.w > 2.5 && it.h > 2.5 && it.area > 0.06 * Math.min(A.w * A.h, B.w * B.h)) note('texto-texto', short(A.s), short(B.s), [A, B]);
      }
      for (const R of rects) {
        if (/^(Toca para empezar|Sin prisa)/.test(A.s)) continue;   // el cartel de inicio va encima de todo, sobre su propia placa
        if (inside(A, R, 2) || inside(R, A, 2)) continue;
        const it = inter(A, R);
        if (it && it.w > 6 && it.h > 2.5) note(R.order > A.order ? 'tapado' : 'texto-borde', short(A.s), `ficha ${Math.round(R.w)}×${Math.round(R.h)}`, [A, R]);
      }
    }
  }
  let patched = false, order = 0;
  function patch() {
    if (patched || !window.p5) return; patched = true;
    const P = p5.prototype;
    const bg0 = P.background;
    P.background = function (...a) { flush(); order = 0; return bg0.apply(this, a); };
    const rect0 = P.rect;
    P.rect = function (...a) {
      try {
        const r = this._renderer, ctx = this.drawingContext, w = a[2], h = a[3] ?? a[2];
        if (cur && r && (r._doFill || r._doStroke) && ctx.globalAlpha > 0.4 && w >= 14 && h >= 14 && w * h < 0.55 * cur.W * cur.H) {
          const b = place(ctx, this.pixelDensity(), a[0], a[1], w, h);
          if (b) frame.rects.push({ ...b, order: ++order });
        }
      } catch (e) { window.__err2 = String(e); }
      return rect0.apply(this, a);
    };
    const text0 = P.text;
    P.text = function (...a) {
      try {
        const r = this._renderer, ctx = this.drawingContext;
        if (cur && r && r._doFill && ctx.globalAlpha > 0.4 && alphaOf(ctx.fillStyle) > 0.4 && a[3] == null && String(a[0]).trim()) {
          const lines = String(a[0]).split('\n'), s = this.textSize(), w = Math.max(...lines.map(l => this.textWidth(l)));
          const lead = r._leadingSet && r._textLeading ? r._textLeading : s * 1.25, h = s * 0.78 + (lines.length - 1) * lead;
          const al = r._textAlign, bl = r._textBaseline;
          const x = al === 'center' ? a[1] - w / 2 : al === 'right' ? a[1] - w : a[1];
          const y = bl === 'center' ? a[2] - h / 2 : bl === 'top' ? a[2] + s * 0.14 : bl === 'bottom' ? a[2] - h - s * 0.1 : a[2] - s * 0.74;
          const b = place(ctx, this.pixelDensity(), x, y, w, h);
          if (b && b.w > 3) frame.texts.push({ ...b, s: String(a[0]), order: ++order });
        }
      } catch (e) { window.__err2 = String(e); }
      return text0.apply(this, a);
    };
    // Fórmulas (js/games/formula.js): la caja que arma formulaBox dice dónde se dibuja.
    if (typeof formulaBox === 'function' && !window.__fb0) {
      const fb0 = window.__fb0 = formulaBox;
      let depth = 0;
      window.formulaBox = formulaBox = function (ctx, str, size, weight) {
        depth++;
        let b; try { b = fb0(ctx, str, size, weight); } finally { depth--; }
        if (depth === 0 && b && typeof b.draw === 'function') {
          const d0 = b.draw;
          b.draw = (c, x0, y0) => {
            try {
              if (cur && c.globalAlpha > 0.4 && alphaOf(c.fillStyle) > 0.4) {
                const cv = c.canvas, d = cv.width / (parseFloat(cv.style.width) || cv.width) || 1;
                const box = place(c, cur.d || d, x0, y0 - b.a, b.w, b.a + b.d);
                if (box) frame.texts.push({ ...box, s: String(str), order: ++order });
              }
            } catch (e) { window.__err2 = String(e); }
            return d0(c, x0, y0);
          };
        }
        return b;
      };
    }
  }

  const plays = () => {
    const out = [];
    for (const c of COURSES) for (const u of c.units || []) {
      const ls = [...(u.lessons || []), ...(u.boss ? [u.boss] : []), ...((u.exam?.items || []).map(i => ({ ex: [i.ex] })))];
      for (const l of ls) for (const e of l.ex || []) if (e && e.type === 'play' && GAMES[e.game]) out.push({ ex: e, course: c.id });
    }
    return out;
  };

  async function one({ ex, course }, width) {
    setGameCourse(course);
    document.getElementById('bot-host')?.remove();
    const host = document.createElement('div');
    host.id = 'bot-host'; host.className = 'play';
    host.style.cssText = `position:fixed;left:0;top:0;width:${width}px;z-index:99999`;
    document.body.appendChild(host);
    let inst;
    const found = cur?.game === ex.game ? cur.found : new Map();
    try {
      inst = GAMES[ex.game].create(host, ex.params, { ready() {}, sfx: new Proxy({}, { get: () => () => {} }), palette: PALETTE, tex: s => s });
      await inst.loaded; patch();
      const cv = host.querySelector('canvas'), r = cv.getBoundingClientRect();
      const d = cv.width / r.width;
      cur = { game: ex.game, fase: 'inicio', found, W: r.width, H: r.height, d };
      await sleep(420);                                    // pasa la animación de entrada
      const ev = (type, x, y) => window.dispatchEvent(new MouseEvent(type, { clientX: r.left + x, clientY: r.top + y, bubbles: true, button: 0, buttons: type === 'mouseup' ? 0 : 1 }));
      cur.fase = 'toques';
      for (const [fx, fy] of [[0.5, 0.5], [0.25, 0.7], [0.75, 0.7], [0.5, 0.88], [0.2, 0.4], [0.8, 0.4]]) { ev('mousedown', r.width * fx, r.height * fy); await sleep(20); ev('mouseup', r.width * fx, r.height * fy); await sleep(40); }
      await sleep(160);
      cur.fase = 'solución';
      try { inst.lock(true); } catch {}
      await sleep(200);
      flush();
    } catch (e) { (window.__encima.errors ||= []).push(`${ex.game}: ${e}`); }
    try { inst?.destroy(); } catch {}
    host.remove();
    return found;
  }

  window.__encima = {
    res: [], busy: false, done: 0, total: 0, plays,
    async run(names, perGame = 2, width = 340) {
      this.busy = true; this.res = []; this.errors = [];
      const seen = {}, list = plays().filter(e => (!names || names.includes(e.ex.game)) && (seen[e.ex.game] = (seen[e.ex.game] || 0) + 1) <= perGame);
      this.total = list.length; this.done = 0;
      const all = new Map();
      cur = null;
      for (const item of list) {
        if (cur && cur.game !== item.ex.game) cur = null;
        const found = await one(item, width);
        all.set(item.ex.game, found);
        this.done++;
      }
      cur = null; setGameCourse(null);
      this.res = [...all.values()].flatMap(m => [...m.values()]);
      this.busy = false;
      return this.res.length;
    },
  };
})();
