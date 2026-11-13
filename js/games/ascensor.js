// El ascensor (lección 1.1, enteros): un edificio con pisos (positivos), la calle (0) y sótanos
// (negativos). Cada viaje dice en qué piso estás y cuántos pisos subes o bajas; se toca el piso donde
// termina el ascensor. El panel cuenta en vivo cuánto se ha movido. Rondas con pestañas.
// params = { min, max, rounds: [{ start, move, text }] }   state = { floors: [entero | null] }

GAMES['ascensor'] = (() => {
  const neg = n => String(n).replace('-', '−');
  const expr = r => `${r.start} ${r.move < 0 ? '-' : '+'} ${Math.abs(r.move)} = ${r.start + r.move}`;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.floors[i] === r.start + r.move);
    return { ok, solution: params.rounds.map(r => `$${expr(r)}$`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { floors: params.rounds.map(() => null) };
    const nF = params.max - params.min + 1;
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], b = null, car = params.rounds[0].start, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(params.rounds.length, w);
      const top = 92, bottom = h - 34;
      b = { x: 46, w: Math.min(150, w * 0.42), top, fh: (bottom - top) / nF };
    }
    const yOf = f => b.top + (params.max - f) * b.fh;   // borde superior del piso f
    const floorAt = y => Math.max(params.min, Math.min(params.max, params.max - Math.floor((y - b.top) / b.fh)));
    const inside = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
    const target = () => st.floors[cur] ?? params.rounds[cur].start;
    const ready = () => api.ready(st.floors.every(f => f !== null));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], want = r.start + r.move, good = st.floors[cur] === want;
        drawTabs(p, C, tabs, cur, i => {
          const v = st.floors[i], ok = v === params.rounds[i].start + params.rounds[i].move;
          return locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : v !== null ? C.Z : C.line;
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.LEFT, p.TOP); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`${r.text}. ¿En qué piso quedas?`, 12, 44, W - 24, 44);

        // El edificio: pisos arriba, la calle (0) y los sótanos bajo tierra.
        for (let f = params.max; f >= params.min; f--) {
          // Pisos rellenos: arriba color sol, la calle menta y los sótanos coral (como los negativos de los videos).
          const y = yOf(f), col = f > 0 ? C.sun : f === 0 ? C.mint : C.coral;
          p.noStroke(); p.fill(col + (f === 0 ? 'FF' : f > 0 ? '59' : '70')); p.rect(b.x, y + 1.5, b.w, b.fh - 3, 5);
          p.fill(f === r.start ? C.ink : f < 0 ? C.I : f === 0 ? C.Q : C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.RIGHT, p.CENTER);
          p.text(neg(f), b.x - 8, y + b.fh / 2);
          if (f === 0 || f === -1) { p.fill(f === 0 ? inkOn(C.mint, C.ink) : C.ink); p.textStyle(p.BOLD); p.textSize(10); p.textAlign(p.LEFT, p.CENTER); p.text(f === 0 ? 'calle' : 'sótanos', b.x + 6, y + b.fh / 2); }
        }
        p.stroke(C.mint); p.strokeWeight(4); p.line(b.x - 30, yOf(-1), b.x + b.w + 18, yOf(-1));   // el nivel del suelo
        // Banderita en el piso de partida.
        const ys = yOf(r.start) + b.fh / 2;
        p.noStroke(); p.fill(C.mute); p.triangle(b.x + b.w - 16, ys - 7, b.x + b.w - 16, ys + 1, b.x + b.w - 4, ys - 3);
        p.stroke(C.mute); p.strokeWeight(2); p.line(b.x + b.w - 16, ys - 8, b.x + b.w - 16, ys + 8);

        // El ascensor se desliza hasta el piso elegido; una flecha muestra el recorrido.
        car = p.lerp(car, target(), 0.18);
        const yc = yOf(car) + b.fh / 2, col = locked ? (good ? C.ok : C.bad) : C.brand;
        if (Math.abs(target() - r.start) > 0.01) {
          const xa = b.x + b.w + 10;
          p.stroke(col); p.strokeWeight(3); p.line(xa, ys, xa, yc);
          const dir = Math.sign(yc - ys);
          p.noStroke(); p.fill(col); p.triangle(xa - 6, yc - dir * 9, xa + 6, yc - dir * 9, xa, yc);
        }
        // La cabina: bloque crema con borde del color del estado y la raya de las puertas.
        p.stroke(col); p.strokeWeight(3); p.fill(C.cream); p.rect(b.x + b.w * 0.3, yc - b.fh / 2 + 3, b.w * 0.4, b.fh - 6, 6);
        p.stroke(C.night); p.strokeWeight(1.5); p.line(b.x + b.w / 2, yc - b.fh / 2 + 7, b.x + b.w / 2, yc + b.fh / 2 - 7);
        if (locked && !good) {
          const yw = yOf(want) + b.fh / 2;
          p.noFill(); p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.rect(b.x + b.w * 0.3, yw - b.fh / 2 + 3, b.w * 0.4, b.fh - 6, 5); p.drawingContext.setLineDash([]);
        }

        // Panel: de dónde sales, qué pide el viaje y cuánto te has movido.
        const x0 = b.x + b.w + 30, pw = W - x0 - 10, d = Math.round(target() - r.start);
        p.noStroke(); p.textAlign(p.LEFT, p.TOP);
        drawKicker(p, C, 'salida', x0, b.top + 10);
        p.noStroke(); p.textAlign(p.LEFT, p.TOP);
        p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(26); p.text(neg(r.start), x0, b.top + 20);
        drawPill(p, C, `${r.move > 0 ? '↑ sube' : '↓ baja'} ${Math.abs(r.move)}`, x0 + 42, b.top + 70, r.move > 0 ? C.mint : C.coral, 14);
        drawKicker(p, C, 'llegada', x0, b.top + 102);
        p.noStroke(); p.textAlign(p.LEFT, p.TOP);
        p.fill(col); p.textStyle(p.BOLD); p.textSize(26); p.text(st.floors[cur] === null ? '?' : neg(target()), x0, b.top + 110);
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12);
        p.text(st.floors[cur] === null ? 'toca un piso' : d === 0 ? 'no te has movido' : `${d > 0 ? 'subiste' : 'bajaste'} ${Math.abs(d)}`, x0, b.top + 146, pw);
        if (locked && !good) { p.fill(C.ok); p.textStyle(p.BOLD); p.text(`era el piso ${neg(want)}`, x0, b.top + 166, pw); }
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        const pend = st.floors.findIndex((v, i) => v === null && i !== cur);
        p.text(locked ? (grade(st, params).ok ? '¡Todos los viajes llegaron!' : 'El piso correcto está punteado en verde') : st.floors[cur] !== null && pend >= 0 ? `Toca la pestaña ${pend + 1} para el siguiente viaje` : 'Toca o arrastra en el edificio para mover el ascensor', 12, H - 18, W - 24, 18);
      };

      const pick = () => { st.floors[cur] = p.constrain(floorAt(p.mouseY), params.min, params.max); ready(); };
      const onBuilding = () => p.mouseX >= b.x - 34 && p.mouseX <= b.x + b.w + 24 && p.mouseY >= b.top && p.mouseY <= b.top + nF * b.fh;
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; car = params.rounds[t].start; api.sfx?.tap?.(); return false; }
        if (locked || !onBuilding()) return;
        drag = true; pick(); api.sfx?.tap?.(); return false;
      };
      p.mouseDragged = () => { if (!drag) return; pick(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; return false; };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ floors: [...st.floors] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
