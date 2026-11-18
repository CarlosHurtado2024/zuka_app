// Ajusta el planeador en vertical. El vuelo empieza al soltar y usa la altura que ya elegiste.
GAMES['vuela-precios'] = (() => {
  const flightAt = (x0, x1, y, t) => ({ x: x0 + (x1 - x0) * t, y: y - 10 * Math.sin(Math.PI * t) });
  function ringAt(y, centers, radius) {
    let best = -1, distance = radius;
    centers.forEach((c, i) => {
      const d = Math.abs(y - c);
      if (d <= distance) { distance = d; best = i; }
    });
    return best;
  }
  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.ask}: ${it.options[it.answer]}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, st = { done: R.map(() => 0) };
    let W = 0, H = 0, y = 0, locked = false, held = false, flight = null, result, queue = [], order = [];
    const top = 102, rail = 44;
    const rings = () => [1, 2, 3].map(i => top + (H - top - 52) * i / 4);
    const dock = () => W * .59;
    const item = () => R[a.cur].items[queue[0]];
    const reset = () => {
      const it = item();
      flight = null; result = null; held = false; y = rings()[1];
      order = shuffledOrder(it.options.length, it.ask + a.cur);
    };
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; queue = R[i].items.map((_, k) => k); reset(); },
      lost(i) { st.done[i] = 0; held = false; },
    });
    const layout = (w, h) => {
      const old = rings();
      const position = H ? (y - old[0]) / (old[2] - old[0]) : .5;
      W = w; H = h;
      const next = rings();
      y = next[0] + position * (next[2] - next[0]);
    };
    function advance(dt) {
      a.tick(dt);
      if (a.phase !== 'play') return;
      if (result) {
        result.wait -= dt;
        if (result.wait > 0) return;
        const answered = queue.shift();
        if (!result.ok) queue.push(answered);
        if (!queue.length) a.win();
        else reset();
        return;
      }
      if (!flight) return;
      flight.t = reducedMotion() ? 1 : Math.min(1, flight.t + dt / .78);
      if (flight.t < 1) return;
      const it = item(), centers = rings(), i = ringAt(y, centers, (centers[1] - centers[0]) * .36);
      const ok = order[i] === it.answer;
      result = { i, ok, wait: .85 };
      if (ok) { st.done[a.cur]++; a.hit(); a.say(`${it.ask}: ${it.options[it.answer]}`, C.ok); }
      else if (i < 0) a.say('Quedaste entre dos aros. Ajusta la altura y vuelve a intentar.', C.mute);
      else { a.say(`${it.options[order[i]]} no es el resultado`, C.bad); a.miss(); }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };
      p.draw = () => {
        p.background(C.bg);
        if (!locked) advance(frameDt(p) * a.slow);
        const cs = rings(), x = dock(), it = item(), live = a.phase === 'play' && !locked;
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fitText(p, live && it ? it.ask : R[a.cur].title, W / 2, 67, W - 28, 16);
        drawPracticePanel(p, { x: 13, y: top, w: W - 26, h: H - top - 51 }, C.card, C.line, 12);
        if (live && it) {
          p.stroke(C.mute); p.strokeWeight(1); p.line(rail, cs[0], rail, cs[2]);
          for (const [i, cy] of cs.entries()) {
            const tint = result?.i === i ? (result.ok ? C.ok : C.bad) : C.brand;
            p.stroke(C.line); p.line(rail, cy, x - 20, cy);
            p.noFill(); p.stroke(tint); p.strokeWeight(2); p.circle(x, cy, Math.min(34, (cs[1] - cs[0]) * .72));
            p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER);
            fitText(p, it.options[order[i]], (x + W) / 2 + 8, cy, W - x - 36, 15);
          }
          const pos = flight ? flightAt(rail, x, y, flight.t) : { x: rail, y };
          p.noFill(); p.stroke(C.brand); p.strokeWeight(2);
          if (!flight) {
            p.drawingContext.setLineDash([4, 5]); p.line(rail + 14, y, x - 16, y); p.drawingContext.setLineDash([]);
            p.fill(C.card); p.circle(rail, y, 29);
          }
          p.noStroke(); p.fill(C.brand);
          p.triangle(pos.x - 10, pos.y - 7, pos.x + 12, pos.y, pos.x - 10, pos.y + 7);
          p.fill(C.mute); p.textStyle(p.NORMAL); p.textAlign(p.CENTER, p.CENTER);
          fitText(p, flight ? 'Trayectoria del planeador' : 'Arrastra en vertical y suelta', W / 2, H - 33, W - 32, 12);
        }
        const mid = (top + H - 51) / 2;
        if (locked || a.phase === 'all') drawArcadeSummary(p, C, R.map((r, i) => ({ ok: st.done[i] >= r.items.length, text: `${r.title} · ${st.done[i]} de ${r.items.length}` })), mid);
        else drawArcadeBanner(p, C, a, mid, { idle: 'Alinea el planeador con un aro', lost: 'Vuelve a comparar las alturas' });
        arcadeToast(p, C, a, W / 2, H - 14, locked);
        arcadeStop(p, a, locked);
      };
      const aim = () => { const cs = rings(); y = Math.min(cs[2], Math.max(cs[0], p.mouseY)); };
      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const phase = a.tap(locked);
        if (phase === 'off') return;
        if (phase !== 'play') return false;
        if (flight || p.mouseX > rail + 31 || p.mouseY < top || p.mouseY > H - 51) return;
        held = true; aim();
        return false;
      };
      p.mouseDragged = () => { if (held && !locked) { aim(); return false; } };
      p.mouseReleased = e => {
        if (held && !locked && e?.type !== 'touchcancel') flight = { t: 0 };
        held = false;
      };
    }, 1.12, () => {
      if (locked || flight || a.phase !== 'play') return null;
      return { from: { x: rail, y }, to: { x: rail, y: y - 22 } };
    });
    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      demo: m.demo,
      peek: () => ({ phase: a.phase, flight, rail, y, W, H, target: item() && rings()[order.indexOf(item().answer)] }),
    };
  }
  return { grade, create, flightAt, ringAt, demo: true };
})();
