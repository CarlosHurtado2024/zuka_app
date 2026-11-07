// Mide la altura (trigonometría, medición indirecta): un edificio, un árbol o un faro de altura conocida.
// Con elevación se arrastra al topógrafo por el suelo hasta que vea la cima con el ángulo pedido; con
// depresión, el vigía está arriba del faro y se arrastra el barco. El ángulo y la distancia se ven en
// vivo, a escala. Rondas con pestañas.
// params = { rounds: [{ kind: 'edificio' | 'arbol' | 'faro', h, angle, mode?: 'elev' | 'dep', maxD }] }
// state = { ds: [metros | null] }

GAMES['mide-altura'] = (() => {
  const angleAt = (h, d) => Math.atan2(h, d) * 180 / Math.PI;
  const NAMES = { edificio: 'la azotea del edificio', arbol: 'la copa del árbol', faro: 'el barco desde el faro' };

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.ds[i] != null && Math.abs(angleAt(r.h, state.ds[i]) - r.angle) <= 1);
    const solution = params.rounds.map(r => `$d = \\frac{${r.h}}{\\tan ${r.angle}^\\circ} \\approx ${(r.h / Math.tan(r.angle * Math.PI / 180)).toFixed(2)}$ m`).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { ds: params.rounds.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], groundY = 0, objX = 0, s = 1, drag = false;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      groundY = h - 92; objX = w - 46;
    }
    const scaleFor = r => Math.min((objX - 24) / r.maxD, (groundY - 110) / r.h);
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.ds.every(d => d !== null));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function object(r, topY) {
        const x = objX;
        if (r.kind === 'edificio') {
          p.noStroke(); p.fill(C.line); p.rect(x - 18, topY, 36, groundY - topY, 3);
          p.fill(C.N + '88'); for (let y = topY + 8; y < groundY - 10; y += 14) { p.rect(x - 12, y, 8, 7); p.rect(x + 4, y, 8, 7); }
        } else if (r.kind === 'arbol') {
          p.noStroke(); p.fill('#8A5A3B'); p.rect(x - 5, topY + (groundY - topY) * 0.45, 10, (groundY - topY) * 0.55);
          p.fill(C.Q); p.circle(x, topY + (groundY - topY) * 0.32, (groundY - topY) * 0.64);
        } else {
          p.noStroke(); p.fill(C.ink); p.quad(x - 12, groundY, x + 12, groundY, x + 7, topY, x - 7, topY);
          p.fill(C.I); for (let k = 1; k <= 3; k++) p.rect(x - 11 + k, groundY - k * (groundY - topY) / 4, 22 - 2 * k, 8);
          p.fill(C.N); p.circle(x, topY - 6, 12);
        }
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], dep = r.mode === 'dep', d = st.ds[cur];
        s = scaleFor(r);
        const topY = groundY - r.h * s, good = d !== null && Math.abs(angleAt(r.h, d) - r.angle) <= 1;
        tabs.forEach((t, i) => {
          const di = st.ds[i], ok = di !== null && Math.abs(angleAt(params.rounds[i].h, di) - params.rounds[i].angle) <= 1;
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : di !== null ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(14); p.textAlign(p.LEFT, p.TOP);
        p.text(dep ? `Mueve el barco hasta que el vigía lo vea ${r.angle}° por debajo de la horizontal` : `Camina hasta ver ${NAMES[r.kind]} a ${r.angle}° de elevación`, 12, 44, W - 24, 44);

        // Suelo o mar, el objeto y su altura.
        p.noStroke(); p.fill(dep ? C.Z + '33' : C.line + '66'); p.rect(0, groundY, W, H - groundY);
        p.stroke(C.mute); p.strokeWeight(2); p.line(0, groundY, W, groundY);
        object(r, topY);
        p.noStroke(); p.fill(C.I); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.RIGHT, p.CENTER);
        p.text(`${r.h} m`, objX - 24, (topY + groundY) / 2);

        // El observador (o el barco) en la distancia elegida.
        const dd = d ?? r.maxD * 0.5, x = objX - dd * s, col = locked ? (good ? C.ok : C.bad) : C.brand;
        if (dep) {
          p.noStroke(); p.fill(col); p.quad(x - 16, groundY + 4, x + 16, groundY + 4, x + 11, groundY + 14, x - 11, groundY + 14);
          p.stroke(col); p.strokeWeight(2); p.line(x, groundY + 4, x, groundY - 14);
          p.stroke(C.mute); p.strokeWeight(1.5); p.drawingContext.setLineDash([5, 5]); p.line(objX, topY, 12, topY); p.drawingContext.setLineDash([]);
          p.stroke(C.N); p.strokeWeight(2.5); p.line(objX, topY, x, groundY);
          const a = Math.atan2(groundY - topY, objX - x);
          p.noFill(); p.stroke(C.N); p.strokeWeight(2.5); p.arc(objX, topY, 70, 70, Math.PI, Math.PI + a);
        } else {
          p.stroke(col); p.strokeWeight(3);
          p.line(x, groundY, x, groundY - 22); p.line(x, groundY - 22, x - 7, groundY - 12); p.line(x, groundY - 22, x + 7, groundY - 12);
          p.line(x, groundY, x - 6, groundY + 0); p.noStroke(); p.fill(col); p.circle(x, groundY - 28, 11);
          p.stroke(C.N); p.strokeWeight(2.5); p.line(x, groundY, objX, topY);
          p.noFill(); p.arc(x, groundY, 70, 70, -Math.atan2(groundY - topY, objX - x), 0);
        }
        // Cinta métrica y lecturas.
        p.stroke(C.Z); p.strokeWeight(3); p.line(x, groundY + 28, objX, groundY + 28);
        p.noStroke(); p.fill(C.Z); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.TOP);
        p.text(d === null ? 'arrastra' : `d = ${d} m`, (x + objX) / 2, groundY + 34);
        const ang = angleAt(r.h, dd);
        p.fill(d === null ? C.mute : good ? C.ok : C.ink); p.textSize(18); p.textAlign(p.CENTER, p.CENTER);
        p.text(d === null ? `meta: ${r.angle}°` : `ángulo = ${ang.toFixed(1)}°   (meta ${r.angle}°)`, W / 2, H - 20);
        if (locked && !good) { p.fill(C.ok); p.textSize(12); p.textStyle(p.BOLD); p.text(`era d ≈ ${(r.h / Math.tan(r.angle * Math.PI / 180)).toFixed(1)} m`, W / 2, groundY + 60); }
      };

      const place = () => { const r = params.rounds[cur]; st.ds[cur] = Math.max(0.5, Math.min(r.maxD, Math.round((objX - p.mouseX) / s * 2) / 2)); ready(); };
      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked || p.mouseY < groundY - 60 || p.mouseY > groundY + 50 || p.mouseX > objX - 4) return;
        drag = true; place(); return false;
      };
      p.mouseDragged = () => { if (!drag) return; place(); return false; };
      p.mouseReleased = () => { if (!drag) return; drag = false; api.sfx?.tap?.(); return false; };
    }, 1.05);

    return {
      loaded: m.ready,
      getState: () => ({ ds: [...st.ds] }),
      lock() { locked = true; drag = false; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, angleAt };
})();
