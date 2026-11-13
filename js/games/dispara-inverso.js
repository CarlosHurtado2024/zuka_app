// Dispara al inverso (Álgebra 1.2, axiomas de campo; juego dinámico de la lección alg-12b): abajo hay un cañón
// cargado con una ficha («7», «2/5», «9 + ?») y arriba flotan cuatro burbujas con números que se mueven de lado a
// lado. Se toca hacia dónde disparar: la ficha vuela en esa dirección. Hay que pegarle a su pareja según la misión
// de la ronda: su opuesto (suman 0), su recíproco (su producto es 1) o el neutro (la deja igual). Pegarle a otra
// quita una vida; fallar el tiro no quita nada. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ kind: 'sum'|'prod'|'neutro', title, mission, items: [{ ball, targets: [4], answer, say }] }], lives? }
// state = { done: [n] }      Spec 2026-11-13-juegos-dinamicos-valle.

GAMES['dispara-inverso'] = (() => {
  const SPEED = 430, RAD = 23;
  // Velocidad de la ficha para ir desde `from` hacia `to` a `speed` píxeles por segundo.
  function aim(from, to, speed) {
    const d = Math.hypot(to.x - from.x, to.y - from.y) || 1;
    return { vx: ((to.x - from.x) / d) * speed, vy: ((to.y - from.y) / d) * speed };
  }
  const touches = (ball, target, r) => Math.hypot(ball.x - target.x, ball.y - target.y) <= r;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => it.say).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, COLS = ['sky', 'coral', 'mint', 'cream'];
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, top = 104, cannon = { x: 0, y: 0 }, queue = [], targets = [], ball = null, gap = 0, n = 0, aimAt = null, good = false;
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); ball = null; load(); },
      lost(i) { st.done[i] = 0; ball = null; targets = []; },
    });
    const item = () => R[a.cur].items[queue[0]];

    function layout(w, h) { W = w; H = h; cannon = { x: w / 2, y: h - 62 }; }
    // Carga la pregunta: cuatro burbujas en una sola fila que pasa como una cinta (sale por un lado y entra por el
    // otro). Así ninguna tapa a otra y un tiro nunca le pega a una burbuja que no se apuntó.
    function load() {
      const it = item(); if (!it) { targets = []; return; }
      const order = shuffledOrder(4, it.ball + (n++));
      const sep = (W + 2 * RAD) / 4, v = (n % 2 ? -1 : 1) * (32 + a.cur * 6);
      targets = order.map((k, j) => ({ k, label: it.targets[k], ok: k === it.answer, x: sep * (j + 0.5) - RAD, y: top + 62, vx: v, col: COLS[j], hit: 0 }));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        if (a.phase !== 'play') return;
        const span = W + 2 * RAD;
        for (const t of targets) { t.x += t.vx * dt; if (t.x > W + RAD) t.x -= span; if (t.x < -RAD) t.x += span; t.hit = Math.max(0, t.hit - dt * 2.5); }
        if (gap > 0) { gap -= dt; if (gap <= 0) { if (!queue.length) { a.win(); targets = []; } else load(); } return; }
        if (!ball) return;
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        const t = targets.find(t => touches(ball, t, RAD + 9));
        if (t) {
          const it = item(); ball = null; t.hit = 1;
          good = t.ok;
          if (t.ok) { st.done[a.cur]++; queue.shift(); a.hit(); a.say(it.say, C.ok); gap = 0.9; }
          else { a.say(`${it.ball} con ${t.label}: no es su pareja`, C.bad); queue.push(queue.shift()); if (!a.miss()) gap = 0.7; }
        } else if (ball.y < top - 20 || ball.x < -20 || ball.x > W + 20) ball = null;
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = item();

        // Las burbujas.
        for (const t of targets) {
          const col = gap > 0 && good && t.ok ? C.ok : t.hit > 0 && !t.ok ? C.bad : C[t.col], d = RAD * 2 * (1 + 0.15 * t.hit);
          p.noStroke(); p.fill(shade(col, 0.78)); p.circle(t.x, t.y + 3, d);
          p.fill(col); p.circle(t.x, t.y, d);
          p.fill(inkOn(col, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fitText(p, t.label, t.x, t.y + 1, RAD * 2 - 8, 16);
        }
        // El cañón y la ficha cargada; una línea punteada marca hacia dónde se apuntó la última vez.
        if (aimAt && a.phase === 'play') { p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([3, 7]); p.line(cannon.x, cannon.y, aimAt.x, aimAt.y); p.drawingContext.setLineDash([]); }
        p.noStroke(); p.fill(C.mute); p.rect(cannon.x - 34, cannon.y + 22, 68, 10, 5);
        p.fill(shade(C.sun, 0.74)); p.circle(cannon.x, cannon.y + 4, 46);
        p.fill(C.sun); p.circle(cannon.x, cannon.y, 46);
        if (it && a.phase === 'play' && !ball && gap <= 0) { p.fill(inkOn(C.sun, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fitText(p, it.ball, cannon.x, cannon.y + 1, 38, 16); }
        if (ball) { p.noStroke(); p.fill(C.sun); p.circle(ball.x, ball.y, 30); p.fill(inkOn(C.sun, C.ink)); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fitText(p, ball.label, ball.x, ball.y + 1, 26, 12); }

        // Encabezado: ronda, vidas y la misión.
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, r.mission, W / 2, 46, W - 24, 15);
        p.fill(C.mute); p.textSize(11); p.text(`${r.title}: ${Math.min(st.done[a.cur], r.items.length)} de ${r.items.length}`, W / 2, 70);

        arcadeToast(p, C, a, W / 2, H - 17, locked);
        const mid = (top + cannon.y) / 2 + 30;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.flatMap((rr, i) => [{ ok: st.done[i] >= rr.items.length, text: rr.items.map(x => x.say).join(' · ') }]), (top + cannon.y) / 2);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Toca hacia dónde quieres disparar', lost: 'Demasiados tiros a la burbuja equivocada' });
        if (!a.toast || locked || a.phase === 'idle' || a.phase === 'all') {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Todas las parejas! Ya puedes comprobar' : 'Las burbujas se mueven: apunta un poco adelante', W / 2, H - 16);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || ball || gap > 0 || !item() || p.mouseY > cannon.y - 20) return false;
        aimAt = { x: p.mouseX, y: p.mouseY };
        ball = { x: cannon.x, y: cannon.y, label: item().ball, ...aim(cannon, aimAt, SPEED) };
        api.sfx?.tap?.();
        return false;
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, cannon, flying: !!ball, gap, speed: SPEED, targets: targets.map(t => ({ x: t.x, y: t.y, vx: t.vx, ok: t.ok })) }),
    };
  }

  return { grade, create, aim, touches };
})();
