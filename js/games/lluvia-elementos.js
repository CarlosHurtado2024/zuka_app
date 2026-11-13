// Lluvia de elementos (Álgebra 0, pertenencia; juego dinámico de la lección alg-0a): del cielo caen palabras y
// abajo hay una canasta con un conjunto descrito por comprensión (F = {x : x es una fruta}). Se arrastra la canasta
// de lado a lado para atrapar lo que pertenece (∈) y esquivar lo que no (∉). Con cada acierto el conjunto se va
// escribiendo por extensión arriba. Un intruso en la canasta quita una vida; sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ name, rule, members, others }], lives? }   state = { caught: [[etiquetas]] }
// Spec 2026-11-13-juegos-dinamicos-pradera.

GAMES['lluvia-elementos'] = (() => {
  const belongs = (label, r) => r.members.includes(label);
  const same = (pk, r) => !!pk && pk.length === r.members.length && r.members.every(m => pk.includes(m));
  const listText = xs => (xs.length ? `{${xs.join(', ')}}` : '{ }');
  // Qué cae en la gota número k: un bueno que falte o una trampa, con un ritmo irregular (nunca más de dos
  // trampas seguidas) para que no se pueda adivinar por turnos. Lo ya atrapado no vuelve a caer.
  const BEAT = [1, 0, 1, 1, 0, 0, 1, 0];
  function nextDrop(r, caught, k, rnd = Math.random) {
    const left = r.members.filter(m => !caught.includes(m));
    const pick = xs => xs[Math.min(xs.length - 1, Math.floor(rnd() * xs.length))];
    if (left.length && (BEAT[k % BEAT.length] || !r.others.length)) return pick(left);
    return pick(r.others.length ? r.others : left);
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => same(state.caught?.[i], r));
    return { ok, solution: params.rounds.map(r => `${r.name} = ${listText(r.members)}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, LIVES = params.lives ?? 3, SLOW = reducedMotion() ? 0.6 : 1;   // con «reducir movimiento», más despacio
    const st = { caught: R.map(() => []) };
    let locked = false, W = 0, H = 0, cur = 0, phase = 'idle', lives = LIVES, drops = [], spawnT = 0, k = 0, lastX = -999;
    let basket = { x: 0, tx: 0, w: 78 }, top = 104, ground = 0, drag = false, wait = 0, stopped = false, toast = null, shake = 0, bump = 0;

    function layout(w, h) {
      W = w; H = h; ground = h - 46;
      if (!basket.x) basket.x = basket.tx = w / 2;
      basket.x = Math.min(w - basket.w / 2 - 4, Math.max(basket.w / 2 + 4, basket.x)); basket.tx = basket.x;
    }
    const allDone = () => R.every((r, i) => same(st.caught[i], r));
    function start() { phase = 'play'; lives = LIVES; drops = []; spawnT = 0; k = 0; st.caught[cur] = []; }
    function say(text, col) { toast = { text, col, t: 1.3 }; }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (stopped) p.redraw(); };

      function spawn() {
        const r = R[cur], label = nextDrop(r, [...st.caught[cur], ...drops.map(d => d.label)], k++);
        p.textStyle(p.BOLD); p.textSize(14);
        const w = Math.max(44, p.textWidth(label) + 20);
        let x = 0;
        for (let t = 0; t < 8; t++) { x = w / 2 + 6 + Math.random() * (W - w - 12); if (Math.abs(x - lastX) > 70) break; }
        lastX = x;
        drops.push({ label, good: belongs(label, r), x, y: top - 18, w, vy: Math.min(120, 64 + cur * 9 + st.caught[cur].length * 4), ph: Math.random() * 6 });
      }

      function step(dt) {
        basket.x += (basket.tx - basket.x) * Math.min(1, dt * 18);
        if (phase === 'won') { wait -= dt; if (wait <= 0) { if (cur < R.length - 1) { cur++; phase = 'idle'; } else { phase = 'all'; api.ready(true); } } return; }
        if (phase !== 'play') return;
        spawnT -= dt;
        if (spawnT <= 0) { spawn(); spawnT = 1.05; }
        const by = ground - 30, r = R[cur];
        for (const d of drops) {
          d.y += d.vy * dt; d.ph += dt * 3;
          if (!d.gone && d.y + 15 >= by && d.y - 15 <= by + 14 && Math.abs(d.x - basket.x) <= basket.w / 2 + d.w * 0.2) {
            d.gone = true;
            if (d.good) {
              if (!st.caught[cur].includes(d.label)) st.caught[cur].push(d.label);
              bump = 1; say(`${d.label} ∈ ${r.name}`, C.ok); api.sfx?.ok?.();
              if (same(st.caught[cur], r)) { phase = 'won'; wait = 1.4; drops = []; api.sfx?.win?.(); return; }
            } else {
              lives--; shake = 1; say(`${d.label} ∉ ${r.name}`, C.bad); api.sfx?.bad?.();
              if (lives <= 0) { phase = 'lost'; drops = []; st.caught[cur] = []; return; }
            }
          }
        }
        drops = drops.filter(d => !d.gone && d.y < ground - 12);
      }

      function drawBasket() {
        const sx = shake > 0 ? Math.sin(shake * 30) * 5 * shake : 0, x = basket.x + sx, y = ground - 30, w = basket.w, name = R[cur].name;
        p.noStroke(); p.fill(shade(C.sun, 0.74)); p.quad(x - w / 2, y + 4, x + w / 2, y + 4, x + w / 2 - 10, y + 32, x - w / 2 + 10, y + 32);
        p.fill(C.sun); p.quad(x - w / 2, y, x + w / 2, y, x + w / 2 - 10, y + 27, x - w / 2 + 10, y + 27);
        p.fill(shade(C.sun, 0.74)); p.rect(x - w / 2 - 3, y - 4, w + 6, 8, 4);
        p.fill(inkOn(C.sun, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(15 + 3 * bump); p.text(name, x, y + 15);
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = Math.min(0.05, (p.deltaTime || 16) / 1000);
        if (!locked) step(dt * SLOW);
        shake = Math.max(0, shake - dt * 2.5); bump = Math.max(0, bump - dt * 3);
        const r = R[cur], got = st.caught[cur];

        // Lo que cae: fichas crema que se mecen un poco.
        for (const d of drops) drawTile(p, C, { x: d.x - d.w / 2 + Math.sin(d.ph) * 3, y: d.y - 15, w: d.w, h: 30 }, d.label, { size: 14, r: 9, lift: 2 });
        // El suelo de la pradera y la canasta.
        p.stroke(C.mint); p.strokeWeight(4); p.line(8, ground, W - 8, ground);
        drawBasket();

        // Encabezado (tapa lo que cae por detrás): ronda, vidas, la condición y el conjunto por extensión.
        p.noStroke(); p.fill(C.bg); p.rect(0, 0, W, top - 14);
        drawKicker(p, C, `Ronda ${cur + 1} de ${R.length}`, 14, 18);
        drawHearts(p, C, W - 12, 18, phase === 'play' || phase === 'won' ? lives : LIVES, LIVES);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        // La condición: si es larga, va en dos renglones (encogerla la dejaría ilegible en un celular angosto).
        const rule = `${r.name} = {${r.rule}}`;
        p.textSize(14);
        const lines = p.textWidth(rule) > W - 24 ? wrapWords(rule, W - 24, s => p.textWidth(s)).slice(0, 2) : [rule];
        if (lines.length === 1) fitText(p, rule, W / 2, 46, W - 24, 15);
        else lines.forEach((ln, i) => fitText(p, ln, W / 2, 38 + i * 17, W - 24, 14));
        p.fill(same(got, r) ? C.ok : C.N); p.textStyle(p.BOLD);
        fitText(p, `${r.name} = ${listText(got)}`, W / 2, lines.length === 1 ? 70 : 76, W - 24, 14);

        if (toast) { toast.t -= dt; if (toast.t <= 0) toast = null; }

        const mid = (top + ground) / 2 - 10;
        if (locked || phase === 'all') {
          // Al terminar: todos los conjuntos, ya escritos por extensión.
          p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          R.forEach((rr, i) => { p.fill(same(st.caught[i], rr) ? C.ok : C.mute); fitText(p, `${rr.name} = ${listText(same(st.caught[i], rr) ? rr.members : st.caught[i])}`, W / 2, mid - (R.length - 1) * 13 + i * 26, W - 28, 14); });
        } else if (phase === 'idle') drawBanner(p, C, 'Toca para empezar', 'Mueve la canasta con el dedo', mid);
        else if (phase === 'lost') drawBanner(p, C, 'Se colaron demasiados intrusos', 'Toca para intentar otra vez', mid, C.coral);
        else if (phase === 'won') drawBanner(p, C, `¡${r.name} quedó completo!`, null, mid, C.ok);

        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        if (toast && !locked && (phase === 'play' || phase === 'won' || phase === 'lost')) drawPill(p, C, toast.text, W / 2, H - 18, toast.col, 13);
        else p.text(locked || phase === 'all' ? '¡Lluvia atrapada! Ya puedes comprobar' : 'Atrapa lo que pertenece · deja caer lo que no', W / 2, H - 16);
        // Terminado o calificado: se deja de dibujar (no gasta batería); queda el último cuadro.
        if ((locked || phase === 'all') && !stopped) { stopped = true; p.noLoop(); }
      };

      const inside = () => p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H;
      const aim = () => { basket.tx = Math.min(W - basket.w / 2 - 4, Math.max(basket.w / 2 + 4, p.mouseX)); };
      p.mousePressed = () => {
        if (locked || phase === 'all' || !inside()) return;
        if (phase === 'idle' || phase === 'lost') { start(); drag = true; aim(); api.sfx?.tap?.(); return false; }
        if (phase === 'play') { drag = true; aim(); return false; }
        return false;
      };
      p.mouseDragged = () => { if (drag && phase === 'play' && !locked) { aim(); return false; } };
      p.mouseReleased = () => { drag = false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ caught: st.caught.map(c => [...c]) }),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase, cur, lives, W, H, ground, basket: basket.x, drops: drops.map(d => ({ label: d.label, good: d.good, x: d.x, y: d.y })) }),
      lock() { locked = true; drops = []; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, belongs, nextDrop, listText };
})();
