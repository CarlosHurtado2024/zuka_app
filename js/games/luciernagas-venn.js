// Luciérnagas en el diagrama de Venn (Álgebra 0, operaciones entre conjuntos; juego dinámico de la lección alg-0c):
// sobre un diagrama de dos círculos vuelan luciérnagas que van cambiando de zona. Cada ronda pide una operación
// (A ∩ B, A − B, (A ∪ B)ᶜ, A △ B…) y hay que tocar una luciérnaga justo cuando está en la zona de esa operación.
// Tocarla en otra zona quita una vida y dice dónde estaba. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ op: 'union'|'inter'|'diffAB'|'diffBA'|'comp'|'sim' }], goal?, flies?, lives? }
// state = { catches: [n] }      Spec 2026-11-13-juegos-dinamicos-pradera.

GAMES['luciernagas-venn'] = (() => {
  const ASPECT = 1.3;
  const OPS = {
    union: { text: 'A ∪ B', say: 'las que están en A o en B' },
    inter: { text: 'A ∩ B', say: 'las que están en A y en B a la vez' },
    diffAB: { text: 'A − B', say: 'las que están en A pero no en B' },
    diffBA: { text: 'B − A', say: 'las que están en B pero no en A' },
    comp: { text: '(A ∪ B)ᶜ', say: 'las que están fuera de A y de B' },
    sim: { text: 'A △ B', say: 'las que están en uno solo de los dos' },
  };
  const ZONE = ['fuera de los dos', 'solo en A', 'solo en B', 'en A y en B'];
  const goalOf = params => params.goal ?? 4;
  const EDGE = 7, REACH = 26;   // margen del borde de un círculo y alcance de un toque, en píxeles

  // Zona de un punto como máscara de bits: 1 = dentro de A, 2 = dentro de B.
  function maskAt(x, y, geo) {
    return (Math.hypot(x - geo.ca.x, y - geo.ca.y) <= geo.r ? 1 : 0) | (Math.hypot(x - geo.cb.x, y - geo.cb.y) <= geo.r ? 2 : 0);
  }
  function inOp(mask, op) {
    if (op === 'union') return mask > 0;
    if (op === 'inter') return mask === 3;
    if (op === 'diffAB') return mask === 1;
    if (op === 'diffBA') return mask === 2;
    if (op === 'comp') return mask === 0;
    return mask === 1 || mask === 2;
  }
  // Distancia de un punto al borde de círculo más cercano: encima del borde no se sabe en qué zona está.
  function edgeDist(x, y, geo) {
    return Math.min(Math.abs(Math.hypot(x - geo.ca.x, y - geo.ca.y) - geo.r), Math.abs(Math.hypot(x - geo.cb.x, y - geo.cb.y) - geo.r));
  }
  // La luciérnaga que se quiso tocar: entre las que están al alcance del dedo, se prefiere una que esté claramente
  // en la zona pedida (un toque un poco corrido no castiga por la vecina equivocada); si no hay, la más cercana.
  function pickFly(flies, x, y, geo, op) {
    const near = flies.map(f => ({ f, d: Math.hypot(f.x - x, f.y - y) })).filter(o => o.d <= REACH).sort((a, b) => a.d - b.d);
    const good = near.find(o => inOp(maskAt(o.f.x, o.f.y, geo), op) && edgeDist(o.f.x, o.f.y, geo) >= EDGE);
    return (good || near[0] || { f: null }).f;
  }
  // El diagrama dentro del lienzo: la caja del universo y los dos círculos.
  function vennGeo(w, h) {
    const box = { x: 12, y: 108, w: w - 24, h: h - 108 - 50 };
    const r = Math.min(box.w * 0.3, box.h * 0.36), cy = box.y + box.h * 0.52;
    return { box, r, ca: { x: w / 2 - r * 0.55, y: cy }, cb: { x: w / 2 + r * 0.55, y: cy } };
  }

  function grade(state, params) {
    const goal = goalOf(params), ok = params.rounds.every((_, i) => (state.catches?.[i] ?? 0) >= goal);
    return { ok, solution: params.rounds.map(r => `${OPS[r.op].text}: ${OPS[r.op].say}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, LIVES = params.lives ?? 3, GOAL = goalOf(params), N = params.flies ?? 7, SLOW = reducedMotion() ? 0.6 : 1;
    const st = { catches: R.map(() => 0) };
    let locked = false, W = 0, H = 0, geo = null, cur = 0, phase = 'idle', lives = LIVES, flies = [], wait = 0, stopped = false, toast = null, herd = 0, flash = 0;

    const rand = (a, b) => a + Math.random() * (b - a);
    function place(f, avoidOp) {
      const b = geo.box;
      for (let t = 0; t < 40; t++) {
        f.x = rand(b.x + 14, b.x + b.w - 14); f.y = rand(b.y + 14, b.y + b.h - 14);
        if (!avoidOp || !inOp(maskAt(f.x, f.y, geo), avoidOp)) break;
      }
      const a = rand(0, Math.PI * 2), v = rand(30, 48);
      f.vx = Math.cos(a) * v; f.vy = Math.sin(a) * v; f.ph = rand(0, 6); f.turn = rand(-1, 1);
      return f;
    }
    function layout(w, h) {
      W = w; H = h; geo = vennGeo(w, h);
      if (!flies.length) flies = Array.from({ length: N }, () => place({}));
      else flies.forEach(f => { f.x = Math.min(geo.box.x + geo.box.w - 14, Math.max(geo.box.x + 14, f.x)); f.y = Math.min(geo.box.y + geo.box.h - 14, Math.max(geo.box.y + 14, f.y)); });
    }
    function start() { phase = 'play'; lives = LIVES; st.catches[cur] = 0; herd = 2; flies.forEach(f => place(f, R[cur].op)); }
    function say(text, col) { toast = { text, col, t: 1.5 }; }
    // Un punto dentro de la zona de la operación, hacia donde se anima a volar a una luciérnaga cuando la zona
    // lleva un rato vacía (si no, en las zonas pequeñas habría que esperar demasiado).
    function targetPoint(op) {
      const { ca, cb, r, box } = geo;
      if (op === 'inter') return { x: (ca.x + cb.x) / 2, y: ca.y };
      if (op === 'diffBA') return { x: cb.x + r * 0.5, y: cb.y };
      if (op === 'comp') return { x: box.x + box.w / 2, y: box.y + 20 };
      if (op === 'sim') return Math.random() < 0.5 ? { x: ca.x - r * 0.5, y: ca.y } : { x: cb.x + r * 0.5, y: cb.y };
      return { x: ca.x - r * 0.5, y: ca.y };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (stopped) p.redraw(); };
      const tint = (col, a) => { const c = p.color(col); c.setAlpha(a); return c; };

      function step(dt) {
        if (phase === 'won') { wait -= dt; if (wait <= 0) { if (cur < R.length - 1) { cur++; phase = 'idle'; } else { phase = 'all'; api.ready(true); } } }
        const b = geo.box, moving = phase === 'play' ? 1 : 0.35;   // fuera de la partida vuelan despacio, de adorno
        for (const f of flies) {
          // Vuelo errante: la dirección gira poco a poco y rebota en los bordes del universo.
          f.turn += rand(-1, 1) * dt * 3; f.turn = Math.max(-1.6, Math.min(1.6, f.turn));
          const a = Math.atan2(f.vy, f.vx) + f.turn * dt, v = Math.hypot(f.vx, f.vy);
          f.vx = Math.cos(a) * v; f.vy = Math.sin(a) * v;
          f.x += f.vx * dt * moving; f.y += f.vy * dt * moving; f.ph += dt * 4;
          if (f.x < b.x + 12) { f.x = b.x + 12; f.vx = Math.abs(f.vx); } if (f.x > b.x + b.w - 12) { f.x = b.x + b.w - 12; f.vx = -Math.abs(f.vx); }
          if (f.y < b.y + 12) { f.y = b.y + 12; f.vy = Math.abs(f.vy); } if (f.y > b.y + b.h - 12) { f.y = b.y + b.h - 12; f.vy = -Math.abs(f.vy); }
        }
        if (phase !== 'play') return;
        herd -= dt;
        const op = R[cur].op;
        if (herd <= 0) {
          herd = 2.2;
          if (!flies.some(f => inOp(maskAt(f.x, f.y, geo), op))) {
            const t = targetPoint(op), f = flies.reduce((best, g) => (Math.hypot(g.x - t.x, g.y - t.y) < Math.hypot(best.x - t.x, best.y - t.y) ? g : best));
            const a = Math.atan2(t.y - f.y, t.x - f.x), v = Math.hypot(f.vx, f.vy);
            f.vx = Math.cos(a) * v; f.vy = Math.sin(a) * v; f.turn = 0;
          }
        }
      }

      function drawFly(f) {
        const dark = inkOn(C.bg) === '#FFFFFF', glow = 0.5 + 0.5 * Math.sin(f.ph);
        p.noStroke(); p.fill(tint(C.sun, 60 + 70 * glow)); p.circle(f.x, f.y, 22 + 5 * glow);
        p.fill(C.sun); p.circle(f.x, f.y, 11);
        // Alas y cabeza: en el tema claro el cuerpo lleva borde azul noche para que se vea sobre el papel.
        const a = Math.atan2(f.vy, f.vx);
        p.fill(dark ? C.cream : C.night); p.circle(f.x + Math.cos(a) * 6, f.y + Math.sin(a) * 6, 5);
        if (!dark) { p.noFill(); p.stroke(C.night); p.strokeWeight(1.5); p.circle(f.x, f.y, 11); }
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = Math.min(0.05, (p.deltaTime || 16) / 1000);
        if (!locked) step(dt * SLOW);
        flash = Math.max(0, flash - dt * 2);
        const r = R[cur], O = OPS[r.op], { box, ca, cb } = geo;

        // Encabezado: ronda, vidas y la operación de la ronda.
        drawKicker(p, C, `Ronda ${cur + 1} de ${R.length}`, 14, 18);
        drawHearts(p, C, W - 12, 18, phase === 'play' || phase === 'won' ? lives : LIVES, LIVES);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
        p.text('Atrapa las luciérnagas de', W / 2, 42);
        drawPill(p, C, O.text, W / 2, 68, C.sun, 20);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER); fitText(p, O.say, W / 2, 94, W - 24, 12);

        // El universo y los dos conjuntos.
        p.stroke(flash > 0 ? C.ok : C.line); p.strokeWeight(flash > 0 ? 3 : 1.5); p.fill(C.card); p.rect(box.x, box.y, box.w, box.h, 14);
        p.stroke(C.sky); p.strokeWeight(3); p.fill(tint(C.sky, 95)); p.circle(ca.x, ca.y, 2 * geo.r);
        p.stroke(C.coral); p.fill(tint(C.coral, 95)); p.circle(cb.x, cb.y, 2 * geo.r);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(16); p.textAlign(p.CENTER, p.CENTER);
        p.fill(C.Z); p.text('A', ca.x - geo.r * 0.78, ca.y - geo.r * 0.92);
        p.fill(C.I); p.text('B', cb.x + geo.r * 0.78, cb.y - geo.r * 0.92);
        p.fill(C.mute); p.textSize(12); p.textAlign(p.LEFT, p.TOP); p.text('U', box.x + 9, box.y + 7);

        flies.forEach(drawFly);
        if (toast) { toast.t -= dt; if (toast.t <= 0) toast = null; else if (!locked && phase !== 'all') drawPill(p, C, toast.text, W / 2, box.y + box.h - 18, toast.col, 13); }

        const mid = box.y + box.h / 2;
        if (locked || phase === 'all') {
          p.noStroke(); p.fill(C.card); p.rect(box.x + 10, mid - R.length * 13 - 8, box.w - 20, R.length * 26 + 16, 12);
          p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          R.forEach((rr, i) => { p.fill(st.catches[i] >= GOAL ? C.ok : C.mute); fitText(p, `${OPS[rr.op].text}: ${OPS[rr.op].say.replace('las que están ', '')}`, W / 2, mid - (R.length - 1) * 13 + i * 26, box.w - 36, 13); });
        } else if (phase === 'idle') drawBanner(p, C, 'Toca para empezar', 'Tócala cuando esté en la zona pedida', mid);
        else if (phase === 'lost') drawBanner(p, C, 'Demasiadas en la zona equivocada', 'Toca para intentar otra vez', mid, C.coral);
        else if (phase === 'won') drawBanner(p, C, '¡Ronda lista!', null, mid, C.ok);

        // El frasco: cuántas van atrapadas.
        const y = H - 26;
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER);
        if (locked || phase === 'all') { p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.text('¡Frasco lleno! Ya puedes comprobar', W / 2, y); }
        else {
          const x0 = W / 2 - (GOAL - 1) * 11;
          for (let i = 0; i < GOAL; i++) {
            if (i < st.catches[cur]) { p.noStroke(); p.fill(C.sun); p.circle(x0 + i * 22, y, 13); }
            else { p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); p.circle(x0 + i * 22, y, 12); }
          }
        }
        // Terminado o calificado: se deja de dibujar (no gasta batería); queda el último cuadro.
        if ((locked || phase === 'all') && !stopped) { stopped = true; p.noLoop(); }
      };

      const inside = () => p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H;
      p.mousePressed = () => {
        if (locked || phase === 'all' || !inside()) return;
        if (phase === 'idle' || phase === 'lost') { start(); api.sfx?.tap?.(); return false; }
        if (phase !== 'play') return false;
        const op = R[cur].op, best = pickFly(flies, p.mouseX, p.mouseY, geo, op);
        if (!best) return false;
        const mask = maskAt(best.x, best.y, geo);
        // Justo sobre el borde de un círculo no se ve en qué zona está: ni cuenta ni quita vida.
        if (edgeDist(best.x, best.y, geo) < EDGE) { say('Está sobre el borde: espera a que entre', C.sun); api.sfx?.tap?.(); return false; }
        if (inOp(mask, op)) {
          st.catches[cur]++; flash = 1; say(`¡Sí! Estaba ${ZONE[mask]}`, C.ok); api.sfx?.ok?.();
          place(best, op);
          if (st.catches[cur] >= GOAL) { phase = 'won'; wait = 1.3; api.sfx?.win?.(); }
        } else {
          lives--; say(`No: estaba ${ZONE[mask]}`, C.bad); api.sfx?.bad?.();
          if (lives <= 0) { phase = 'lost'; st.catches[cur] = 0; }
        }
        return false;
      };
    }, ASPECT);

    return {
      loaded: m.ready,
      getState: () => ({ catches: [...st.catches] }),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase, cur, lives, W, H, geo, op: R[cur].op, flies: flies.map(f => ({ x: f.x, y: f.y })) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, maskAt, inOp, edgeDist, pickFly, vennGeo, OPS, ASPECT };
})();
