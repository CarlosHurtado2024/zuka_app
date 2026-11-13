// Revienta los globos (Álgebra 0, tipos de conjuntos y relaciones; juego dinámico de la lección alg-0b): suben
// globos y cada uno lleva escrito un conjunto. Arriba está la misión de la ronda («los subconjuntos de A», «los
// iguales a A», «los disjuntos con A», «los unitarios», «los vacíos»). Se tocan a tiempo los que la cumplen; tocar
// uno que no la cumple quita una vida y dice por qué. Dejar pasar uno bueno no quita nada. Sin vidas, la ronda
// empieza otra vez.
// params = { rounds: [{ kind: 'sub'|'igual'|'disj'|'unit'|'vacio', A?: [...], sets: [[...]] }], goal?, lives? }
// state = { pops: [n] }      Spec 2026-11-13-juegos-dinamicos-pradera.

GAMES['revienta-globos'] = (() => {
  const KIND = {
    sub: { say: 'Revienta los subconjuntos de A', short: 'subconjuntos de A', needsA: true },
    igual: { say: 'Revienta los conjuntos iguales a A', short: 'iguales a A', needsA: true },
    disj: { say: 'Revienta los disjuntos con A', short: 'disjuntos con A', needsA: true },
    unit: { say: 'Revienta los conjuntos unitarios', short: 'unitarios', needsA: false },
    vacio: { say: 'Revienta los conjuntos vacíos', short: 'vacíos', needsA: false },
  };
  const setText = xs => (xs.length ? `{${xs.join(', ')}}` : '∅');
  const goalOf = params => params.goal ?? 4;

  function fits(set, A, kind) {
    const s = [...new Set(set)], a = new Set(A || []);
    if (kind === 'sub') return s.every(x => a.has(x));
    if (kind === 'igual') return s.length === a.size && s.every(x => a.has(x));
    if (kind === 'disj') return s.every(x => !a.has(x));
    if (kind === 'unit') return s.length === 1;
    return s.length === 0;
  }
  // Por qué un globo no cumple la misión (para el aviso al tocarlo).
  function why(set, A, kind) {
    const s = [...new Set(set)], a = new Set(A || []);
    if (kind === 'sub') return `${s.find(x => !a.has(x))} ∉ A`;
    if (kind === 'igual') { const extra = s.find(x => !a.has(x)); return extra ? `${extra} ∉ A` : 'le faltan elementos de A'; }
    if (kind === 'disj') return `comparten ${s.find(x => a.has(x))}`;
    if (kind === 'unit') return s.length ? 'tiene más de un elemento' : 'el vacío no tiene elementos';
    return 'sí tiene elementos';
  }

  function grade(state, params) {
    const goal = goalOf(params), ok = params.rounds.every((_, i) => (state.pops?.[i] ?? 0) >= goal);
    const solution = params.rounds.map(r => `${KIND[r.kind].short}: ${r.sets.filter(s => fits(s, r.A, r.kind)).map(setText).join(', ')}`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, LIVES = params.lives ?? 3, GOAL = goalOf(params), SLOW = reducedMotion() ? 0.6 : 1;   // con «reducir movimiento», más despacio
    const COLS = ['coral', 'sky', 'mint', 'sun'];
    const st = { pops: R.map(() => 0) };
    let locked = false, W = 0, H = 0, cur = 0, phase = 'idle', lives = LIVES, balls = [], spawnT = 0, k = 0, lane = -1, lane2 = -1, stopped = false, wait = 0, toast = null, top = 112;

    function layout(w, h) { W = w; H = h; }
    function start() { phase = 'play'; lives = LIVES; balls = []; spawnT = 0; k = 0; st.pops[cur] = 0; }
    function say(text, col) { toast = { text, col, t: 1.5 }; }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (stopped) p.redraw(); };

      function spawn() {
        const r = R[cur], flying = balls.filter(b => b.state === 'up').map(b => b.set);
        // Bueno o trampa con ritmo irregular; se evita repetir un conjunto que ya va subiendo.
        const wantGood = [1, 0, 1, 1, 0, 1, 0, 0][k++ % 8];
        let pool = r.sets.filter(s => fits(s, r.A, r.kind) === !!wantGood && !flying.includes(s));
        if (!pool.length) pool = r.sets.filter(s => !flying.includes(s));
        if (!pool.length) return;
        const set = pool[Math.floor(Math.random() * pool.length)];
        // Carril distinto a los dos anteriores: así dos globos seguidos nunca salen encimados.
        const ln = lane < 0 ? Math.floor(Math.random() * 3) : [0, 1, 2].find(c => c !== lane && c !== lane2) ?? (lane + 1) % 3;
        lane2 = lane; lane = ln;
        const bw = Math.min(92, W / 3 - 8);
        balls.push({ set, ok: fits(set, r.A, r.kind), x: W * (ln + 0.5) / 3 + (Math.random() - 0.5) * 10, y: H + 56, w: bw, h: bw * 1.14, vy: 46 + cur * 5, col: COLS[(k + ln) % 4], ph: Math.random() * 6, state: 'up', t: 0 });
      }

      function step(dt) {
        if (phase === 'won') { wait -= dt; if (wait <= 0) { if (cur < R.length - 1) { cur++; phase = 'idle'; } else { phase = 'all'; api.ready(true); } } return; }
        if (phase !== 'play') return;
        spawnT -= dt;
        if (spawnT <= 0) { spawn(); spawnT = 1.15; }
        for (const b of balls) {
          b.ph += dt * 2; b.t += dt;
          if (b.state === 'up' || b.state === 'no') b.y -= b.vy * dt;
        }
        balls = balls.filter(b => (b.state === 'pop' ? b.t < 0.3 : b.y > top - 70));
      }

      function drawBalloon(b) {
        const col = b.state === 'no' ? C.line : C[b.col];
        const sx = b.state === 'no' && b.t < 0.4 ? Math.sin(b.t * 50) * 4 : Math.sin(b.ph) * 3, x = b.x + sx, y = b.y;
        if (b.state === 'pop') {
          // Reventado: un aro que crece y trocitos que salen.
          const q = b.t / 0.3;
          p.noFill(); p.stroke(C[b.col]); p.strokeWeight(3 * (1 - q)); p.circle(x, y, b.w * (0.8 + q));
          p.noStroke(); p.fill(C[b.col]);
          for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; p.circle(x + Math.cos(a) * b.w * (0.4 + q * 0.5), y + Math.sin(a) * b.w * (0.4 + q * 0.5), 6 * (1 - q)); }
          return;
        }
        p.stroke(C.mute); p.strokeWeight(1.5); p.noFill(); p.bezier(x, y + b.h / 2 + 6, x - 6, y + b.h / 2 + 18, x + 6, y + b.h / 2 + 28, x, y + b.h / 2 + 40);
        p.noStroke(); p.fill(shade(col, 0.8)); p.triangle(x - 6, y + b.h / 2 + 7, x + 6, y + b.h / 2 + 7, x, y + b.h / 2 - 3);
        p.fill(col); p.ellipse(x, y, b.w, b.h);
        p.fill(255, 255, 255, 70); p.ellipse(x - b.w * 0.2, y - b.h * 0.24, b.w * 0.2, b.h * 0.16);
        p.fill(b.state === 'no' ? C.mute : inkOn(col, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fitText(p, setText(b.set), x, y + 1, b.w - 12, 15);
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = Math.min(0.05, (p.deltaTime || 16) / 1000);
        if (!locked) step(dt * SLOW);
        const r = R[cur], K = KIND[r.kind];
        balls.forEach(drawBalloon);

        // Encabezado (tapa los globos que salen por arriba): ronda, vidas, la misión, el conjunto A y la cuenta.
        p.noStroke(); p.fill(C.bg); p.rect(0, 0, W, top - 12);
        drawKicker(p, C, `Ronda ${cur + 1} de ${R.length}`, 14, 18);
        drawHearts(p, C, W - 12, 18, phase === 'play' || phase === 'won' ? lives : LIVES, LIVES);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, K.say, W / 2, 46, W - 24, 15);
        if (K.needsA) drawPill(p, C, `A = ${setText(r.A)}`, W / 2, 74, C.sun, 14);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(`reventados: ${st.pops[cur]} de ${GOAL}`, W / 2, K.needsA ? 94 : 72);

        if (toast) { toast.t -= dt; if (toast.t <= 0) toast = null; else if (!locked && phase !== 'all') drawPill(p, C, toast.text, W / 2, top + 10, toast.col, 13); }

        const mid = (top + H) / 2 - 20;
        if (locked || phase === 'all') {
          p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          R.forEach((rr, i) => { p.fill(st.pops[i] >= GOAL ? C.ok : C.mute); fitText(p, `${KIND[rr.kind].short}: ${Math.min(st.pops[i], GOAL)} de ${GOAL}`, W / 2, mid - (R.length - 1) * 13 + i * 26, W - 28, 14); });
        } else if (phase === 'idle') drawBanner(p, C, 'Toca para empezar', 'Toca solo los globos que cumplen la misión', mid);
        else if (phase === 'lost') drawBanner(p, C, 'Demasiados globos equivocados', 'Toca para intentar otra vez', mid, C.coral);
        else if (phase === 'won') drawBanner(p, C, '¡Ronda lista!', null, mid, C.ok);

        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        if (locked || phase === 'all') p.text('¡Todos reventados! Ya puedes comprobar', W / 2, H - 14);
        // Terminado o calificado: se deja de dibujar (no gasta batería); queda el último cuadro.
        if ((locked || phase === 'all') && !stopped) { stopped = true; p.noLoop(); }
      };

      const inside = () => p.mouseX >= 0 && p.mouseX <= W && p.mouseY >= 0 && p.mouseY <= H;
      p.mousePressed = () => {
        if (locked || phase === 'all' || !inside()) return;
        if (phase === 'idle' || phase === 'lost') { start(); api.sfx?.tap?.(); return false; }
        if (phase !== 'play') return false;
        const r = R[cur];
        // El globo tocado (el de más arriba en el dibujo, que es el último).
        for (let i = balls.length - 1; i >= 0; i--) {
          const b = balls[i];
          if (b.state !== 'up' || p.mouseY < top - 6) continue;
          const dx = (p.mouseX - b.x) / (b.w / 2 + 6), dy = (p.mouseY - b.y) / (b.h / 2 + 6);
          if (dx * dx + dy * dy > 1) continue;
          if (b.ok) {
            b.state = 'pop'; b.t = 0; st.pops[cur]++; api.sfx?.ok?.();
            if (st.pops[cur] >= GOAL) { phase = 'won'; wait = 1.3; balls = []; api.sfx?.win?.(); }
          } else {
            b.state = 'no'; b.t = 0; lives--; say(`No: ${why(b.set, r.A, r.kind)}`, C.bad); api.sfx?.bad?.();
            if (lives <= 0) { phase = 'lost'; balls = []; st.pops[cur] = 0; }
          }
          break;
        }
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ pops: [...st.pops] }),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase, cur, lives, W, H, top, balls: balls.map(b => ({ ok: b.ok, state: b.state, x: b.x, y: b.y, w: b.w, h: b.h })) }),
      lock() { locked = true; balls = []; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, fits, why, setText, KIND };
})();
