// Corta las proporciones (Álgebra, proporciones; juego dinámico de la lección alg-12e): arriba hay una fracción de
// referencia («2/3») y desde abajo saltan fichas con otras fracciones, como frutas. Se desliza el dedo para cortar
// solo las que forman proporción con la de arriba (valen lo mismo). Cortar una que no, quita una vida; dejar caer una
// buena no quita nada (vuelve a saltar). Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, ref, items: [{ label }], traps: [...] }], lives? }   state = { done: [n] }
// Spec 2026-11-13-juegos-dinamicos-razones.

GAMES['corta-proporciones'] = (() => {
  const parse = s => String(s).split('/').map(Number);
  // a/b y c/d forman proporción si ad = bc.
  const sameRatio = (x, y) => { const [a, b] = parse(x), [c, d] = parse(y); return a * d === b * c; };
  // Distancia del punto (px, py) al segmento (x1, y1)–(x2, y2).
  function segDist(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1, len = dx * dx + dy * dy, t = len ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len)) : 0;
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }
  const BEAT = [1, 0, 1, 1, 0, 1, 0, 0];

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => `${r.ref} = ${r.items.map(it => it.label).join(' = ')}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, GRAV = 190;
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, top = 104, queue = [], tiles = [], spawnT = 0, k = 0, trail = [], cutting = false, last = null;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, n) => n); tiles = []; spawnT = 0.3; k = 0; },
      lost(i) { st.done[i] = 0; tiles = []; },
    });

    function layout(w, h) { W = w; H = h; }
    function spawn() {
      const r = R[a.cur], flying = tiles.filter(t => t.state === 'fly').map(t => t.label);
      const goods = queue.map(n => r.items[n].label).filter(l => !flying.includes(l)), bads = r.traps.filter(l => !flying.includes(l));
      const pool = (BEAT[k++ % 8] && goods.length) || !bads.length ? goods : bads;
      if (!pool.length) return;
      const label = pool[Math.floor(Math.random() * pool.length)], x = 46 + Math.random() * (W - 92);
      // Sale desde abajo con el impulso justo para llegar un poco por debajo del encabezado.
      const apex = top + 46 + Math.random() * 40, vy = -Math.sqrt(2 * GRAV * (H + 24 - apex));
      tiles.push({ label, good: sameRatio(r.ref, label), x, y: H + 24, vx: (W / 2 - x) * 0.12, vy, state: 'fly', t: 0 });
    }
    function cut(x1, y1, x2, y2) {
      for (const t of tiles) {
        if (t.state !== 'fly' || segDist(t.x, t.y, x1, y1, x2, y2) > 24) continue;
        t.state = 'cut'; t.t = 0;
        if (t.good) {
          const r = R[a.cur], n = queue.findIndex(q => r.items[q].label === t.label);
          if (n >= 0) { queue.splice(n, 1); st.done[a.cur]++; }
          a.hit(); a.say(`${t.label} = ${r.ref}`, C.ok);
          if (!queue.length) { a.win(); return; }
        } else { t.state = 'no'; a.say(`${t.label} no vale lo mismo que ${R[a.cur].ref}`, C.bad); if (a.miss()) return; }
      }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        trail = trail.filter(s => (s.t -= dt) > 0);
        for (const t of tiles) { t.t += dt; t.vy += GRAV * dt; t.x += t.vx * dt; t.y += t.vy * dt; }
        tiles = tiles.filter(t => t.y < H + 40 && !(t.state !== 'fly' && t.t > 0.5));
        if (a.phase !== 'play') return;
        spawnT -= dt;
        if (spawnT <= 0) { spawn(); spawnT = 1.7; }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur];

        for (const t of tiles) {
          const b = { x: t.x - 34, y: t.y - 19, w: 68, h: 38 };
          if (t.state === 'fly') drawTile(p, C, b, t.label, { size: 17 });
          else {
            // Cortada: dos mitades que se separan (verde si era buena, roja si no).
            const q = Math.min(1, t.t / 0.5), col = p.color(t.state === 'cut' ? C.ok : C.bad); col.setAlpha(255 * (1 - q));
            p.noStroke(); p.fill(col); p.rect(b.x - q * 16, b.y - q * 6, b.w / 2 - 2, b.h, 9, 0, 0, 9); p.rect(b.x + b.w / 2 + 2 + q * 16, b.y + q * 6, b.w / 2 - 2, b.h, 0, 9, 9, 0);
          }
        }
        // El trazo del corte.
        p.stroke(C.sun); p.strokeWeight(4); p.noFill();
        for (const s of trail) { p.drawingContext.globalAlpha = Math.max(0, s.t / 0.25); p.line(s.x1, s.y1, s.x2, s.y2); }
        p.drawingContext.globalAlpha = 1;

        // Encabezado (tapa las fichas que suben): ronda, vidas y la fracción de referencia.
        p.noStroke(); p.fill(C.bg); p.rect(0, 0, W, top - 8);
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, `${r.title} · corta las que forman proporción con`, W / 2, 40, W - 24, 11);
        drawPill(p, C, r.ref, W / 2, 68, C.sun, 20);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.RIGHT, p.CENTER);
        p.text(`${Math.min(st.done[a.cur], r.items.length)} de ${r.items.length}`, W - 14, 68);

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (top + H) / 2 - 20;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: `${rr.ref} = ${rr.items.map(it => it.label).join(' = ')}` })), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Desliza el dedo sobre la ficha para cortarla', lost: 'Demasiadas fichas mal cortadas' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Cortes limpios! Ya puedes comprobar' : 'Corta solo las que valen lo mismo', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp === 'play') { cutting = true; last = { x: p.mouseX, y: p.mouseY }; }
        return false;
      };
      p.mouseDragged = () => {
        if (!cutting || locked || a.phase !== 'play') return;
        const now = { x: p.mouseX, y: p.mouseY };
        trail.push({ x1: last.x, y1: last.y, x2: now.x, y2: now.y, t: 0.25 });
        cut(last.x, last.y, now.x, now.y); last = now;
        return false;
      };
      p.mouseReleased = () => { cutting = false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; tiles = []; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, top, tiles: tiles.filter(t => t.state === 'fly').map(t => ({ x: t.x, y: t.y, good: t.good })) }),
    };
  }

  return { grade, create, sameRatio, segDist };
})();
