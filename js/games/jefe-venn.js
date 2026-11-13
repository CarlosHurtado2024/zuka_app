// El Guardián de la Pradera (Álgebra unidad 0, conjuntos; jefe final del mundo Pradera de Venn). Una batalla por
// turnos, sin reloj: el Guardián da una orden escrita con conjuntos y hay que armar la respuesta en el diagrama de
// Venn del prado (dos círculos A y B dentro del universo U, con números adentro). Cada fase usa lo de una lección:
//   · 'pick' (pertenencia y notación; operaciones): se tocan los elementos que forman el conjunto pedido. Si el
//     conjunto pedido es el vacío, se ataca sin elegir ninguno.
//   · 'move' (tipos y relaciones): se arrastran los elementos de una zona a otra hasta que A y B cumplan lo pedido
//     («A ⊆ B», «disjuntos», «A unitario»). Hay muchas respuestas buenas.
// Con «¡Atacar!» se comprueba: si está bien, el conjunto sale volando y le quita vida al Guardián; si no, él golpea,
// se pierde una vida y dice qué falló. Sin vidas, la fase empieza otra vez (y el Guardián recupera esa vida).
// params = { rounds: [{ title, mode: 'pick' | 'move', zones: { a, ab, b, out }, orders: [
//   { say, pick: (x, inA, inB) => bool, yes }                      (mode 'pick')
//   { say, check: (A, B, U) => bool, sample: zones, no (texto o (A, B, U) => texto), yes } ] }], lives? }     (mode 'move')
// state = { done: [n por fase] }      Spec 2026-11-14-jefe-final-pradera.

GAMES['jefe-venn'] = (() => {
  const ZONES = ['a', 'ab', 'b', 'out'];
  const sorted = xs => [...xs].sort((p, q) => p - q);
  // Los conjuntos que forma un reparto por zonas: A, B y el universo.
  const setsOf = z => ({ A: sorted([...z.a, ...z.ab]), B: sorted([...z.b, ...z.ab]), U: sorted(ZONES.flatMap(k => z[k])) });
  // Conjunto que pide una orden de tocar: los x del universo que cumplen la condición.
  function wantOf(order, zones) { const { A, B, U } = setsOf(zones); return U.filter(x => order.pick(x, A.includes(x), B.includes(x))); }
  const fmtSet = xs => (xs.length ? `{${sorted(xs).join(', ')}}` : '∅');
  // ¿El conjunto elegido es el pedido? Si no, dice qué sobra o que falta algo (sin decir cuál falta).
  function judgePick(order, zones, sel) {
    const want = wantOf(order, zones), extra = sorted(sel).find(x => !want.includes(x));
    if (extra !== undefined) return { ok: false, msg: `El ${extra} no cumple: sobra` };
    if (want.some(x => !sel.includes(x))) return { ok: false, msg: sel.length ? 'Va bien, pero falta al menos uno' : 'No es el vacío: algún elemento cumple' };
    return { ok: true, msg: order.yes || '' };
  }
  // ¿El reparto logrado cumple la relación pedida?
  function judgeMove(order, zones) { const { A, B, U } = setsOf(zones), ok = !!order.check(A, B, U), no = typeof order.no === 'function' ? order.no(A, B, U) : order.no; return { ok, msg: ok ? order.yes || '' : no || 'Todavía no se cumple' }; }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.orders.length);
    const solution = params.rounds.map(r => r.orders.map(o => (r.mode === 'pick' ? `${o.say} = ${fmtSet(wantOf(o, r.zones))}` : `${o.say}: por ejemplo A = ${fmtSet(setsOf(o.sample).A)} y B = ${fmtSet(setsOf(o.sample).B)}`)).join(' · ')).join(' · ');
    return { ok, solution };
  }

  // Sitios de cada zona, medidos desde el centro del diagrama (círculos de radio 72 con centros a ±40).
  const RAD = 72, OFF = 40, DISC = 24;
  const SLOTS = {
    a: [[-62, 0], [-92, 0], [-62, -28], [-62, 28], [-92, -28], [-92, 28]],
    b: [[62, 0], [92, 0], [62, -28], [62, 28], [92, -28], [92, 28]],
    ab: [[0, -14], [0, 14], [0, -42], [0, 42], [-22, 0], [22, 0]],
  };
  // Los de afuera van en las esquinas del universo (medio ancho hw), lejos de los dos círculos: así nunca se duda si están adentro.
  const outSlot = (i, hw) => [[-(hw - 16), -74], [hw - 16, -74], [-(hw - 16), 74], [hw - 16, 74], [-(hw - 42), -78], [hw - 42, -78]][Math.min(i, 5)];
  // Zona del diagrama en la que cae un punto (dx, dy medidos desde el centro); null fuera del universo.
  function zoneAt(dx, dy, halfW, halfH) {
    if (Math.abs(dx) > halfW || Math.abs(dy) > halfH) return null;
    const inA = Math.hypot(dx + OFF, dy) <= RAD, inB = Math.hypot(dx - OFF, dy) <= RAD;
    return inA && inB ? 'ab' : inA ? 'a' : inB ? 'b' : 'out';
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds, TOTAL = R.reduce((s, r) => s + r.orders.length, 0);
    const st = { done: R.map(() => 0) };
    let locked = false, W = 0, H = 0, cy = 0, els = [], ord = 0, drag = null, pause = 0, result = null, fly = [], hurt = 0, rage = 0, t = 0, btn = { x: 0, y: 0, w: 0, h: 0 };
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; load(); },
      lost(i) { st.done[i] = 0; drag = null; },
    });
    const round = () => R[a.cur], order = () => round().orders[Math.min(st.done[a.cur], round().orders.length - 1)];
    const shownOrder = () => (pause > 0 && result && result.ok ? round().orders[Math.max(0, st.done[a.cur] - 1)] : order());
    const hp = () => TOTAL - st.done.reduce((s, v, i) => s + Math.min(v, R[i].orders.length), 0);
    const zonesNow = () => { const z = { a: [], ab: [], b: [], out: [] }; [...els].sort((p, q) => p.ord - q.ord).forEach(e => z[e.zone].push(e.v)); return z; };
    const home = e => { const list = els.filter(x => x.zone === e.zone).sort((p, q) => p.ord - q.ord), i = Math.min(list.indexOf(e), 5), s = e.zone === 'out' ? outSlot(i, halfW()) : SLOTS[e.zone][i]; return { x: W / 2 + s[0], y: cy + s[1] }; };
    const halfW = () => Math.min(150, (W - 28) / 2), halfH = 92;

    function layout(w, h) { W = w; H = h; cy = 312; btn = { x: w / 2 - 62, y: h - 64, w: 124, h: 32 }; els.forEach(e => { const q = home(e); e.x = q.x; e.y = q.y; }); }
    // Pone los elementos de la fase en sus zonas de partida (también antes de cada orden de arrastrar).
    function load() {
      const z = round().zones; els = []; ord = 0; drag = null; pause = 0; result = null;
      ZONES.forEach(k => z[k].forEach(v => els.push({ v, zone: k, ord: ord++, sel: false, x: 0, y: 0 })));
      els.forEach(e => { const q = home(e); e.x = q.x; e.y = q.y; });
    }
    function attack() {
      const r = round(), o = order(), sel = els.filter(e => e.sel).map(e => e.v);
      const res = r.mode === 'pick' ? judgePick(o, zonesNow(), sel) : judgeMove(o, zonesNow());
      result = res; pause = res.ok ? 1.5 : 1.1; drag = null;
      if (res.ok) {
        st.done[a.cur]++; a.hit(); hurt = 1;
        const shots = r.mode === 'pick' ? els.filter(e => e.sel) : els.filter(e => e.zone !== 'out');
        fly = (shots.length ? shots : [{ x: W / 2, y: cy, v: '∅' }]).map((e, i) => ({ x: e.x, y: e.y, v: e.v, t: -i * 0.06 }));
        a.say(res.msg, C.ok);
      } else {
        rage = 1; a.say(res.msg, C.bad);
        if (a.miss()) { result = null; pause = 0; a.say(`${res.msg} · el Guardián se recupera`, C.bad); }
      }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt); t += dt;
        hurt = Math.max(0, hurt - dt * 2); rage = Math.max(0, rage - dt * 1.6);
        fly = fly.filter(f => (f.t += dt * 2.2) < 1);
        els.forEach(e => { if (e !== drag) { const q = home(e); e.x += (q.x - e.x) * Math.min(1, dt * 12); e.y += (q.y - e.y) * Math.min(1, dt * 12); } });
        if (a.phase !== 'play' || pause <= 0) return;
        pause -= dt;
        if (pause <= 0) {
          const good = result && result.ok; result = null;
          if (!good) return;
          if (st.done[a.cur] >= round().orders.length) { a.win(); return; }
          if (round().mode === 'move') load(); else els.forEach(e => { e.sel = false; });
        }
      }

      // El Guardián: una mole con corona que respira, se enoja al golpear y se encoge de dolor al recibir.
      function drawBoss(x, y) {
        const k = 1 + Math.sin(t * 2.2) * 0.03 - hurt * 0.12, sx = rage > 0 ? Math.sin(rage * 50) * 6 * rage : hurt > 0 ? Math.sin(hurt * 40) * 4 * hurt : 0;
        const body = hurt > 0.5 ? C.cream : [C.coral, C.Q, C.I][a.cur % 3], w = 92 * k, h = 70 * k;
        p.push(); p.translate(x + sx, y);
        p.noStroke(); const sh = p.color(C.night); sh.setAlpha(70); p.fill(sh); p.ellipse(0, 40, 84, 12);
        p.fill(shade(body, 0.72)); p.rect(-w / 2, -h / 2 + 5, w, h, 26);
        p.fill(body); p.rect(-w / 2, -h / 2, w, h, 26);
        p.fill(C.sun); p.beginShape(); [[-26, -h / 2 + 2], [-30, -h / 2 - 20], [-14, -h / 2 - 8], [0, -h / 2 - 24], [14, -h / 2 - 8], [30, -h / 2 - 20], [26, -h / 2 + 2]].forEach(q => p.vertex(q[0], q[1])); p.endShape(p.CLOSE);
        const eyeY = -6, blink = Math.sin(t * 0.9) > 0.985 ? 1 : 9;
        p.fill(C.cream); p.ellipse(-18, eyeY, 20, hurt > 0.3 ? 4 : blink * 2); p.ellipse(18, eyeY, 20, hurt > 0.3 ? 4 : blink * 2);
        if (hurt <= 0.3 && blink > 1) { p.fill(C.night); p.circle(-18, eyeY + 1, 8); p.circle(18, eyeY + 1, 8); }
        p.stroke(C.night); p.strokeWeight(3); p.line(-30, eyeY - 14, -10, eyeY - 9 - rage * 4); p.line(30, eyeY - 14, 10, eyeY - 9 - rage * 4);
        p.noFill(); if (hurt > 0.3) p.arc(0, 20, 22, 14, Math.PI, 0); else p.line(-10, 17, 10, 17);
        p.pop();
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = round(), o = shownOrder(), live = a.phase === 'play', over = locked || a.phase === 'all';

        // Encabezado, vida del Guardián y el Guardián.
        drawArcadeHead(p, C, a, R.length);
        const bw = W - 120, life = hp(), seg = bw / TOTAL;
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.LEFT, p.CENTER); p.text('GUARDIÁN', 14, 44);
        for (let i = 0; i < TOTAL; i++) { p.fill(i < life ? C.coral : C.line); p.rect(80 + i * seg, 39, seg - 2, 10, 3); }
        if (!over) drawBoss(W / 2, 112); else { p.noStroke(); p.fill(C.sun); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.textSize(18); p.text('¡Venciste al Guardián!', W / 2, 100); }

        // La orden: qué hay que hacer y con qué.
        if (live) {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          fitText(p, `${r.title} · ${r.mode === 'pick' ? 'toca los elementos de' : 'arrastra hasta lograr que'}`, W / 2, 166, W - 24, 11);
          p.fill(C.card); p.rect(14, 176, W - 28, 34, 10);
          p.noFill(); p.stroke(C.sun); p.strokeWeight(2); p.rect(14, 176, W - 28, 34, 10);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, o.say, W / 2, 193, W - 48, 17);
        }

        // El prado: universo U con los círculos A y B.
        const hw = halfW();
        p.noStroke(); p.fill(C.halo); p.rect(W / 2 - hw, cy - halfH, hw * 2, halfH * 2, 14);
        p.noFill(); p.stroke(C.line); p.strokeWeight(2); p.rect(W / 2 - hw, cy - halfH, hw * 2, halfH * 2, 14);
        const fa = p.color(C.sky), fb = p.color(C.mint); fa.setAlpha(60); fb.setAlpha(60);
        p.stroke(C.sky); p.strokeWeight(3); p.fill(fa); p.circle(W / 2 - OFF, cy, RAD * 2);
        p.stroke(C.mint); p.fill(fb); p.circle(W / 2 + OFF, cy, RAD * 2);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(15); p.textAlign(p.CENTER, p.CENTER);
        p.fill(C.sky); p.text('A', W / 2 - OFF - 22, cy - RAD + 19); p.fill(C.mint); p.text('B', W / 2 + OFF + 22, cy - RAD + 19);
        p.fill(C.mute); p.textSize(12); p.text('U', W / 2, cy + halfH - 10);
        if (a.phase !== 'idle') [...els].sort((x, y) => (x === drag) - (y === drag)).forEach(e => {
          const fill = e.sel ? C.sun : C.cream, up = e === drag ? 4 : 0;
          p.noStroke(); p.fill(shade(fill, 0.74)); p.circle(e.x, e.y + 3, DISC + up);
          p.fill(fill); p.circle(e.x, e.y - up, DISC + up);
          if (e.sel) { p.noFill(); p.stroke(C.ink); p.strokeWeight(2); p.circle(e.x, e.y, DISC + 6); }
          p.noStroke(); p.fill(inkOn(fill, C.ink)); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text(e.v, e.x, e.y - up + 1);
        });
        // El conjunto lanzado vuela hacia el Guardián.
        fly.forEach(f => { if (f.t < 0) return; const k = f.t * f.t, x = f.x + (W / 2 - f.x) * k, y = f.y + (112 - f.y) * k; p.noStroke(); p.fill(C.sun); p.circle(x, y, DISC); p.fill(C.night); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.CENTER, p.CENTER); p.text(f.v, x, y + 1); });

        // Lo que se lleva armado y el botón.
        if (live) {
          const z = zonesNow(), s = setsOf(z);
          p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
          fitText(p, r.mode === 'pick' ? `Tu conjunto: ${fmtSet(els.filter(e => e.sel).map(e => e.v))}` : `A = ${fmtSet(s.A)}   B = ${fmtSet(s.B)}`, W / 2, H - 74, W - 24, 14);
          if (pause <= 0) drawTile(p, C, btn, '¡Atacar!', { fill: C.coral, size: 15, r: 10, lift: 2 });
        }

        arcadeToast(p, C, a, W / 2, H - 13, locked);
        if (over) drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.orders.length, text: `${rr.title}: ${Math.min(st.done[i], rr.orders.length)} de ${rr.orders.length}` })), 168, W - 44);
        else drawArcadeBanner(p, C, a, cy, { idle: 'Sin prisa: piensa cada ataque', lost: 'El Guardián resistió esta fase', won: '¡Fase superada!' });
        if (!a.toast && (over || a.phase === 'idle')) {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(over ? 'La pradera es tuya. Ya puedes comprobar' : 'Arma el conjunto que pide el Guardián y ataca', W / 2, H - 13);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const x = p.mouseX, y = p.mouseY;
        if (x >= btn.x - 6 && x <= btn.x + btn.w + 6 && y >= btn.y - 6 && y <= btn.y + btn.h + 6) { attack(); return false; }
        const e = els.find(q => Math.hypot(q.x - x, q.y - y) <= DISC / 2 + 6);
        if (!e) return;   // nada agarrado: el toque puede desplazar la lección
        if (round().mode === 'pick') { e.sel = !e.sel; api.sfx?.tap?.(); } else drag = e;
        return false;
      };
      p.mouseDragged = () => { if (drag && !locked && a.phase === 'play') { drag.x = p.mouseX; drag.y = p.mouseY; return false; } };
      p.mouseReleased = () => {
        if (!drag) return;
        const e = drag; drag = null;
        if (locked || a.phase !== 'play') return;
        const z = zoneAt(e.x - W / 2, e.y - cy, halfW(), halfH);
        if (z && z !== e.zone) { e.zone = z; e.ord = ord++; api.sfx?.tap?.(); }
      };
    }, 1.5);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; drag = null; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => {
        const r = round(), o = order(), drop = { a: [-78, 0], ab: [0, 0], b: [78, 0], out: outSlot(0, halfW()) };
        return { phase: a.phase, cur: a.cur, lives: a.lives, W, H, pause, mode: r.mode, hp: hp(), ok: { x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 },
          want: r.mode === 'pick' ? wantOf(o, zonesNow()) : null, sample: r.mode === 'move' ? o.sample : null,
          drop: Object.fromEntries(ZONES.map(k => [k, { x: W / 2 + drop[k][0], y: cy + drop[k][1] }])), els: els.map(e => ({ v: e.v, x: e.x, y: e.y, zone: e.zone, sel: e.sel })) };
      },
    };
  }

  return { grade, create, setsOf, wantOf, fmtSet, judgePick, judgeMove, zoneAt };
})();
