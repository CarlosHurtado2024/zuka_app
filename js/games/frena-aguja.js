// Construye el irracional (Álgebra 1.1, irracionales y reales; juego dinámico de la lección alg-11c; conserva el nombre
// «frena-aguja» para no perder progreso). La idea del video: √2 es el lado de un cuadrado de área 2, no es ninguna
// fracción, y aun así tiene un lugar exacto en la recta. Aquí no hay aguja que frenar ni prisa: se arrastra un punto
// sobre la recta y con él crece un cuadrado apoyado en ella (su lado va del 0 al punto) que muestra su área; hay que
// dejarlo en el área pedida (7 → el lado es √7). Para π se hace rodar una rueda de diámetro 1: una vuelta completa
// mide π. Los negativos se construyen hacia la izquierda del 0. Con «¡Listo!» se comprueba: si está bien se abre una
// lupa con las décimas y los decimales del número (que nunca terminan) y se ganan estrellas; si no, se pierde una
// vida, se ilumina el tramo entre los dos enteros que lo encierran y sale una pista. Sin vidas, la ronda empieza otra vez.
// params = { rounds: [{ title, min, max, tol, items: [{ label, value, why }] }], lives? }   state = { done: [n] }
// Specs 2026-11-13-juegos-dinamicos-valle, 2026-11-14-mejoras-carrera-y-aguja y 2026-11-14-juegos-conceptuales-valle.

GAMES['frena-aguja'] = (() => {
  const FINE = 0.05;   // qué tan cerca debe quedar el punto (el área que se lee ya sale redonda con ±0.01)
  const hits = (pos, value, tol) => Math.abs(pos - value) <= tol;
  // Estrellas por puntería: dentro de un tercio de la tolerancia 3, de dos tercios 2, de la tolerancia 1.
  const starsOf = (err, tol) => (err > tol ? 0 : err <= tol / 3 ? 3 : err <= (2 * tol) / 3 ? 2 : 1);
  // Los dos enteros seguidos que encierran al número.
  const bracket = value => [Math.floor(value), Math.floor(value) + 1];
  // Cómo se construye: π con una rueda, las raíces con un cuadrado.
  const kindOf = label => (String(label).includes('π') ? 'wheel' : 'square');
  // Área del cuadrado cuyo lado es el número (7 para √7 y para −√7).
  const areaOf = it => Math.round(it.value * it.value);
  // Vueltas que da una rueda de diámetro 1 al rodar hasta pos.
  const turnsOf = pos => Math.abs(pos) / Math.PI;
  // El número con seis decimales (cortados, no redondeados): se muestra seguido de «…».
  function digitsOf(it) {
    const exact = (kindOf(it.label) === 'wheel' ? Math.PI : Math.sqrt(areaOf(it))) * Math.sign(it.value);
    return negTxt((Math.trunc(exact * 1e6) / 1e6).toFixed(6));
  }
  const askOf = it => (kindOf(it.label) === 'wheel' ? (it.value < 0 ? 'Una vuelta hacia la izquierda' : 'Una vuelta completa de la rueda') : it.value < 0 ? `Área ${areaOf(it)}, a la izquierda del 0` : `Un cuadrado de área ${areaOf(it)}`);

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.done?.[i] ?? 0) >= r.items.length);
    return { ok, solution: params.rounds.map(r => r.items.map(it => `${it.label} ≈ ${negTxt(it.value.toFixed(2))}`).join(', ')).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { done: R.map(() => 0) }, stars = R.map(() => 0);
    let locked = false, W = 0, H = 0, lineY = 0, pos = 1, pause = 0, shown = null, why = '', lens = 0, drag = false, btn = {};
    const a = makeArcade(R.length, params.lives ?? 3, api, {
      start(i) { st.done[i] = 0; stars[i] = 0; pos = 1; pause = 0; shown = null; why = ''; drag = false; },
      lost(i) { st.done[i] = 0; drag = false; },
    });
    const X = v => { const r = R[a.cur]; return 22 + ((v - r.min) / (r.max - r.min)) * (W - 44); };
    const unit = () => (W - 44) / (R[a.cur].max - R[a.cur].min);
    const item = () => R[a.cur].items[Math.min(st.done[a.cur], R[a.cur].items.length - 1)];
    // El punto no sale de la recta ni deja que el cuadrado suba hasta el encabezado.
    const clamp = v => { const r = R[a.cur], top = (lineY - 76) / unit(); return Math.max(r.min, -top, Math.min(r.max, top, Math.round(v * 100) / 100)); };
    const inBox = (b, x, y) => x >= b.x - 4 && x <= b.x + b.w + 4 && y >= b.y - 6 && y <= b.y + b.h + 6;

    function layout(w, h) {
      W = w; H = h; lineY = h - 92;
      btn = { minus: { x: w / 2 - 104, y: h - 60, w: 44, h: 30 }, ok: { x: w / 2 - 50, y: h - 60, w: 100, h: 30 }, plus: { x: w / 2 + 60, y: h - 60, w: 44, h: 30 } };
    }
    function check() {
      const it = item(), fine = Math.min(R[a.cur].tol ?? FINE, FINE), ok = hits(pos, it.value, fine), s = starsOf(Math.abs(pos - it.value), fine);
      shown = { pos, ok, it, stars: s }; pause = ok ? 2.6 : 0.9; drag = false;
      if (ok) { st.done[a.cur]++; stars[a.cur] += s; why = ''; a.hit(); a.say(kindOf(it.label) === 'wheel' ? `Una vuelta mide ${it.label.replace('−', '')}` : `El lado de ese cuadrado es ${it.label.replace('−', '')}`, C.ok); }
      else {
        why = it.why;
        const wheel = kindOf(it.label) === 'wheel', less = Math.abs(pos) < Math.abs(it.value);
        a.say(pos === 0 ? (wheel ? 'La rueda aún no ha rodado' : 'Aún no hay cuadrado') : Math.sign(pos) !== Math.sign(it.value) ? 'Va hacia el otro lado del 0' : wheel ? (less ? 'Aún no completa la vuelta' : 'Dio más de una vuelta') : less ? 'Al cuadrado le falta área' : 'Al cuadrado le sobra área', C.bad);
        if (a.miss()) { shown = null; pause = 0; why = ''; }
      }
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => { layout(size.w, size.h); if (a.stopped) p.redraw(); };

      function step(dt) {
        a.tick(dt);
        lens = shown && shown.ok ? Math.min(1, lens + dt * 5) : 0;
        if (a.phase !== 'play' || pause <= 0) return;
        // Pausa tras comprobar: se ve el resultado; luego sigue (con el siguiente número si acertó).
        pause -= dt;
        if (pause <= 0) {
          const r = R[a.cur];
          if (shown && shown.ok) { shown = null; why = ''; pos = 1; if (st.done[a.cur] >= r.items.length) a.win(); } else shown = null;
        }
      }

      function star(cx, cy, rad, on) {
        if (on) { p.noStroke(); p.fill(C.sun); } else { p.noFill(); p.stroke(C.mute); p.strokeWeight(1.5); }
        p.beginShape();
        for (let k = 0; k < 10; k++) { const ang = -Math.PI / 2 + (k * Math.PI) / 5, q = k % 2 ? rad * 0.45 : rad; p.vertex(cx + Math.cos(ang) * q, cy + Math.sin(ang) * q); }
        p.endShape(p.CLOSE);
      }

      // El cuadrado apoyado en la recta: su lado va del 0 al punto. Dentro, la cuadrícula de unidades y su área.
      function drawSquare(v, col) {
        const u = unit(), s = Math.abs(v) * u, x0 = Math.min(X(0), X(v)), y0 = lineY - s, f = p.color(col); f.setAlpha(70);
        p.stroke(col); p.strokeWeight(2.5); p.fill(f); p.rect(x0, y0, s, s, 3);
        p.stroke(col); p.strokeWeight(1); p.drawingContext.setLineDash([3, 4]);
        for (let k = 1; k < Math.abs(v); k++) { p.line(x0, lineY - k * u, x0 + s, lineY - k * u); const gx = v < 0 ? X(0) - k * u : X(0) + k * u; p.line(gx, y0, gx, lineY); }
        p.drawingContext.setLineDash([]);
        if (s > 34) { p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.textSize(s > 70 ? 15 : 11); p.text(`área ${(v * v).toFixed(1)}`, x0 + s / 2, y0 + s / 2); }
      }
      // La rueda de diámetro 1: rueda sin resbalar; lo que ya rodó queda pintado en la recta.
      function drawWheel(v, col) {
        const d = unit(), cx = X(v), cy = lineY - d / 2, ang = 2 * v;   // arco = radio · ángulo, radio = 1/2
        p.stroke(C.coral); p.strokeWeight(10); p.line(X(0), lineY, cx, lineY);   // el borde ya desenrollado (la recta se dibuja encima)
        const f = p.color(col); f.setAlpha(60);
        p.stroke(C.ink); p.strokeWeight(2.5); p.fill(f); p.circle(cx, cy, d);
        p.strokeWeight(1.2); for (let k = 0; k < 4; k++) { const t = ang + (k * Math.PI) / 2 + Math.PI / 2; p.line(cx, cy, cx + (Math.cos(t) * d) / 2, cy + (Math.sin(t) * d) / 2); }
        const t = ang + Math.PI / 2;   // la marca empieza tocando el suelo
        p.noStroke(); p.fill(C.coral); p.circle(cx + (Math.cos(t) * d) / 2, cy + (Math.sin(t) * d) / 2, 9);
        p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
        p.text(`${turnsOf(v).toFixed(2)} vueltas`, Math.max(60, Math.min(W - 60, cx)), cy - d / 2 - 14);
      }

      // La lupa: el tramo de una unidad alrededor del número, con sus décimas, el número y dónde quedó el punto.
      function drawLens(it) {
        const c = Math.round(it.value * 10) / 10, lo = c - 0.5, hi = c + 0.5, bx = 16, bw = W - 32, by = 94, bh = 126 * lens;
        const LX = v => bx + 16 + ((v - lo) / (hi - lo)) * (bw - 32), ly = by + 68;
        p.noStroke(); p.fill(C.card); p.rect(bx, by, bw, bh, 14);
        p.noFill(); p.stroke(C.ok); p.strokeWeight(2); p.rect(bx, by, bw, bh, 14);
        if (lens < 1) return;
        for (let k = 0; k < 3; k++) star(W / 2 + (k - 1) * 26, by + 18, 10, k < shown.stars);
        p.stroke(C.ink); p.strokeWeight(2.5); p.line(bx + 10, ly, bx + bw - 10, ly);
        for (let k = 0; k <= 10; k++) {
          const v = lo + k / 10, whole = Math.abs(v - Math.round(v)) < 1e-6;
          p.stroke(C.ink); p.strokeWeight(whole ? 2.5 : 1.2); p.line(LX(v), ly - (whole ? 9 : 5), LX(v), ly + (whole ? 9 : 5));
          // Se rotulan las décimas pares y siempre el entero (π queda «un poco después del 3»: el 3 debe verse).
          if (whole || Math.abs(Math.round(v * 10)) % 2 === 0) { p.noStroke(); p.fill(whole ? C.ink : C.mute); p.textStyle(p.BOLD); p.textSize(whole ? 12 : 10); p.textAlign(p.CENTER, p.CENTER); p.text(whole ? negTxt(Math.round(v)) : negTxt(v.toFixed(1)), LX(v), ly + 20); }
        }
        p.stroke(C.ok); p.strokeWeight(3); p.line(LX(it.value), ly - 16, LX(it.value), ly + 10);
        drawPill(p, C, `${it.label} = ${digitsOf(it)}…`, Math.max(bx + 74, Math.min(bx + bw - 74, LX(it.value))), ly - 28, C.ok, 12);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text('sus decimales nunca terminan ni se repiten', W / 2, by + 108);
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p);
        if (!locked) step(dt * a.slow);
        const r = R[a.cur], it = shown ? shown.it : item(), live = a.phase === 'play', v = shown ? shown.pos : pos;
        const col = shown ? (shown.ok ? C.ok : C.bad) : C.sky;

        // Tras fallar: el tramo entre los dos enteros que encierran al número.
        if (why && live) {
          const [b0, b1] = bracket(it.value), band = p.color(C.sun); band.setAlpha(110);
          p.stroke(C.N); p.strokeWeight(2); p.fill(band); p.rect(X(b0), lineY - 15, X(b1) - X(b0), 30, 6);
        }
        // La figura que se construye.
        if (live && Math.abs(v) > 0.005) (kindOf(it.label) === 'wheel' ? drawWheel : drawSquare)(v, col);
        // La recta: enteros con número y décimas sin número.
        p.stroke(C.ink); p.strokeWeight(3); p.line(14, lineY, W - 14, lineY);
        for (let k = Math.round(r.min * 10); k <= Math.round(r.max * 10); k++) {
          const t = k / 10, whole = k % 10 === 0, half = k % 5 === 0;
          p.stroke(whole && t === 0 ? C.sun : C.ink); p.strokeWeight(whole ? 2.5 : 1); p.line(X(t), lineY - (whole ? 8 : half ? 5 : 3), X(t), lineY + (whole ? 8 : half ? 5 : 3));
          if (whole) { p.noStroke(); p.fill(t === 0 ? C.N : t < 0 ? C.I : C.ink); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text(negTxt(t), X(t), lineY + 19); }
        }
        // El punto que se arrastra.
        if (live) {
          p.noStroke(); p.fill(shade(C.sun, 0.7)); p.circle(X(v), lineY + 2, 24);
          p.fill(shown ? col : C.sun); p.circle(X(v), lineY, 24);
          p.stroke(C.night); p.strokeWeight(2); p.line(X(v) - 4, lineY - 4, X(v) - 4, lineY + 4); p.line(X(v) + 4, lineY - 4, X(v) + 4, lineY + 4);
        }

        // Encabezado: ronda, vidas y lo que hay que construir.
        drawArcadeHead(p, C, a, R.length);
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        fitText(p, live ? `${r.title} · ${kindOf(it.label) === 'wheel' ? 'una vuelta de la rueda mide' : 'el lado del cuadrado es'} ${it.label.replace('−', '')}${it.value < 0 ? ', a la izquierda del 0' : ''}` : r.title, W / 2, 40, W - 24, 11);
        if (live) drawPill(p, C, askOf(it), W / 2, 64, C.sun, 15);
        // La pista, después de un fallo (se quita al volver a mover el punto).
        if (why && live && !shown) {
          p.noStroke(); p.fill(C.card); p.rect(14, 84, W - 28, 52, 10);
          p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.TOP); p.text(why, 22, 91, W - 44, 44);
        }
        if (shown && shown.ok && live) drawLens(it);

        // Botones: afinar de a una centésima y comprobar.
        if (live && !shown) {
          drawTile(p, C, btn.minus, '−', { fill: C.cream, size: 18, r: 9, lift: 2 });
          drawTile(p, C, btn.plus, '+', { fill: C.cream, size: 18, r: 9, lift: 2 });
          drawTile(p, C, btn.ok, '¡Listo!', { fill: C.mint, size: 15, r: 9, lift: 2 });
        }

        arcadeToast(p, C, a, W / 2, H - 13, locked);
        if (locked || a.phase === 'all') {
          drawArcadeSummary(p, C, R.map((rr, i) => ({ ok: st.done[i] >= rr.items.length, text: rr.items.map(x => `${x.label} ≈ ${negTxt(x.value.toFixed(2))}`).join(' · ') })), H * 0.4);
          const total = stars.reduce((s, t) => s + t, 0), max = R.reduce((s, rr) => s + rr.items.length * 3, 0);
          if (total) { star(W / 2 - 62, H * 0.4 + 62, 9, true); p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.LEFT, p.CENTER); p.text(`${total} de ${max} estrellas`, W / 2 - 46, H * 0.4 + 63); }
        } else drawArcadeBanner(p, C, a, H * 0.45, { idle: 'Sin prisa: arrastra el punto por la recta', lost: 'Varias construcciones quedaron lejos' });
        if (!a.toast && (locked || a.phase === 'idle' || a.phase === 'all')) {
          p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
          p.text(locked || a.phase === 'all' ? '¡Irracionales construidos! Ya puedes comprobar' : 'Construye cada número y toca «¡Listo!»', W / 2, H - 13);
        }
        arcadeStop(p, a, locked);
      };

      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tp = a.tap(locked);
        if (tp === 'off') return;
        if (tp !== 'play' || pause > 0) return false;
        const x = p.mouseX, y = p.mouseY;
        if (inBox(btn.ok, x, y)) { check(); return false; }
        if (inBox(btn.minus, x, y)) { pos = clamp(pos - 0.01); why = ''; return false; }
        if (inBox(btn.plus, x, y)) { pos = clamp(pos + 0.01); why = ''; return false; }
        if (y > 84 && y < btn.ok.y - 8) { drag = true; why = ''; const r = R[a.cur]; pos = clamp(r.min + ((x - 22) / (W - 44)) * (r.max - r.min)); }
        return false;
      };
      p.mouseDragged = () => {
        if (!drag || locked || a.phase !== 'play' || pause > 0) return;
        const r = R[a.cur]; pos = clamp(r.min + ((p.mouseX - 22) / (W - 44)) * (r.max - r.min));
        return false;
      };
      p.mouseReleased = () => { drag = false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ done: [...st.done] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
      // Para pruebas en el navegador: lo que hay en pantalla en este momento.
      peek: () => ({ phase: a.phase, cur: a.cur, lives: a.lives, W, H, pos, pause, value: item().value, kind: kindOf(item().label), stars: [...stars], help: !!why, lineY, targetX: X(item().value), ok: { x: btn.ok.x + btn.ok.w / 2, y: btn.ok.y + btn.ok.h / 2 } }),
    };
  }

  return { grade, create, hits, starsOf, bracket, kindOf, areaOf, turnsOf, digitsOf };
})();
