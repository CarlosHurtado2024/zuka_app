// Completa el cuadrado (polinomio cuadrático): fichas de álgebra de x² + bx + c. El cuadrado x², las
// tiras de bx partidas mitad a la derecha y mitad abajo, y en la esquina un hueco de (b/2)² cuadritos.
// Las c unidades esperan en la bandeja; con − / + se pasan a la esquina (si la bandeja se vacía, se
// piden prestadas y se ven en rojo, como −1). Con la esquina llena se lee (x + b/2)² ± lo que sobra.
// params = { rounds: [{ b, c }] }  (b par y positivo)   state = { placed: [n] }

GAMES['completa-cuadrado'] = (() => {
  const MAX = 30;
  // Tope de cuadritos por ronda: la esquina más 9 de más (tres filas de tres), para que no tapen la bandeja.
  const maxFor = b => Math.min(MAX, (b / 2) ** 2 + 9);
  const signed = v => (v > 0 ? ` + ${v}` : v < 0 ? ` - ${-v}` : '');
  const texOf = (b, c) => `x^2 + ${b}x${signed(c)} = (x + ${b / 2})^2${signed(c - (b / 2) ** 2)}`;
  const txt = s => s.replace(/x\^2/g, 'x²').replace(/\^2/g, '²').replace(/ - /g, ' − ');

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => state.placed[i] === (r.b / 2) ** 2);
    return { ok, solution: params.rounds.map(r => `$${texOf(r.b, r.c)}$`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette;
    const placed = params.rounds.map(() => 0), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], minus = null, plus = null;
    const inside = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const by = h - 92;
      minus = { x: 14, y: by, w: 48, h: 40 };
      plus = { x: w - 62, y: by, w: 48, h: 40 };
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);
      // Texto que se encoge hasta caber en `maxW`.
      function fit(s, x, y, sz, maxW) {
        p.textSize(sz);
        while (sz > 9 && p.textWidth(s) > maxW) { sz -= 1; p.textSize(sz); }
        p.text(s, x, y);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], n = r.b / 2, need = n * n, mm = placed[cur];
        const full = mm === need;
        tabs.forEach((t, i) => {
          const ok = placed[i] === (params.rounds[i].b / 2) ** 2;
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line;
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fit(txt(`x^2 + ${r.b}x${signed(r.c)}`), W / 2, 62, 20, W - 24);

        // Fichas: x² (lado 4u), tiras de x a la derecha y abajo, esquina de n × n cuadritos.
        const top = 84, trayH = 58, availH = H - top - trayH - 112;
        const u = Math.min(30, (W - 24) / (4 + n), availH / (4 + n));
        const S = 4 * u, ox = (W - (4 + n) * u) / 2, oy = top;
        p.stroke(C.bg); p.strokeWeight(1.5);
        p.fill(C.R); p.rect(ox, oy, S, S, 4);
        p.fill(C.Z);
        for (let k = 0; k < n; k++) { p.rect(ox + S + k * u, oy, u, S, 3); p.rect(ox, oy + S + k * u, S, u, 3); }
        p.noStroke(); p.fill(C.bg); p.textAlign(p.CENTER, p.CENTER); p.textSize(Math.max(12, u * 0.8)); p.text('x²', ox + S / 2, oy + S / 2);
        p.textSize(Math.max(9, u * 0.45));
        for (let k = 0; k < n; k++) { p.text('x', ox + S + k * u + u / 2, oy + S / 2); p.text('x', ox + S / 2, oy + S + k * u + u / 2); }
        // Esquina: huecos punteados y los cuadritos puestos (los que sobran se salen, en rojo).
        const cx = ox + S, cy = oy + S;
        p.drawingContext.setLineDash([4, 4]); p.noFill(); p.stroke(full ? C.ok : C.mute); p.strokeWeight(1.5);
        p.rect(cx, cy, n * u, n * u, 3); p.drawingContext.setLineDash([]);
        for (let k = 0; k < Math.min(mm, need); k++) {
          p.stroke(C.bg); p.strokeWeight(1.5); p.fill(C.N); p.rect(cx + (k % n) * u, cy + Math.floor(k / n) * u, u, u, 3);
        }
        for (let k = need; k < mm; k++) {   // de más: fuera de la esquina, a la derecha
          const j = k - need;
          p.stroke(C.bg); p.fill(C.bad); p.rect(cx + n * u + 4 + (j % 3) * (u * 0.6), cy + Math.floor(j / 3) * (u * 0.6), u * 0.55, u * 0.55, 2);
        }

        // Bandeja: las unidades que quedan (o las prestadas, en rojo con −).
        const left = r.c - mm, ty = H - 112 - trayH + 8, t = 15, per = Math.floor((W - 24) / (t + 3));
        p.noStroke(); p.fill(C.mute); p.textAlign(p.LEFT, p.TOP); p.textStyle(p.BOLD); p.textSize(11);
        p.text(left >= 0 ? `bandeja: ${left}` : `prestadas: ${-left}`, 12, ty - 4);
        for (let k = 0; k < Math.abs(left); k++) {
          const x = 12 + (k % per) * (t + 3), y = ty + 12 + Math.floor(k / per) * (t + 3);
          p.stroke(C.bg); p.strokeWeight(1); p.fill(left >= 0 ? C.N : C.bad); p.rect(x, y, t, t, 2);
          if (left < 0) { p.noStroke(); p.fill(C.bg); p.textAlign(p.CENTER, p.CENTER); p.textSize(11); p.text('−', x + t / 2, y + t / 2); }
        }

        // Controles y lectura.
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => {
          p.stroke(locked ? C.line : C.Z); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 10);
          p.noStroke(); p.fill(locked ? C.mute : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(22); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fit(`en la esquina: ${mm}`, W / 2, minus.y + 20, 15, W - 140);
        const rest = left > 0 ? ` + ${left}` : left < 0 ? ` − ${-left}` : '';
        const res = full ? txt(texOf(r.b, r.c)) : mm === 0 ? txt(`x^2 + ${r.b}x${signed(r.c)}`) : `(x² + ${r.b}x + ${mm})${rest}`;
        p.fill(full ? C.ok : C.mute); fit(res, W / 2, H - 28, 16, W - 24);
        if (locked && !full) { p.fill(C.ok); p.textStyle(p.BOLD); fit(`era ${txt(texOf(r.b, r.c))}`, W / 2, H - 10, 12, W - 24); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const d = inside(minus, p.mouseX, p.mouseY) ? -1 : inside(plus, p.mouseX, p.mouseY) ? 1 : 0;
        if (!d) return;
        placed[cur] = Math.max(0, Math.min(maxFor(params.rounds[cur].b), placed[cur] + d));
        touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean));
        return false;
      };
    }, 1.4);

    return {
      loaded: m.ready,
      getState: () => ({ placed: placed.slice() }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, texOf, MAX, maxFor };
})();
