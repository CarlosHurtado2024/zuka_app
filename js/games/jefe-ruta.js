// El jefe final por rutas (jefes de los mundos de Álgebra desde el Taller de los Bloques; spec 2026-11-19-mundos-altos).
// Una batalla por turnos, sin reloj. El Guardián lanza un reto (una ecuación, una expresión, un problema) y la respuesta
// se arma como una ruta de pasos: en cada nivel, de abajo hacia arriba, se elige el paso que sí se justifica. Con la
// ruta completa se toca «¡Atacar!»: si todos los pasos son válidos, el Guardián pierde una barra de vida; si no, se
// pierde un corazón y el juego dice en qué nivel está el paso que falla (ese nivel se borra para repensarlo). Sin
// corazones, la fase empieza otra vez. Cada fase usa lo de una o dos lecciones del mundo.
// params = { name, color?: clave de la paleta, lives?, rounds: [{ title, attacks: [{ say, levels: [[válido, falso, falso?], …] }] }] }
// state = { done: ataques acertados }      (el paso válido se escribe primero; el juego rota el orden)

GAMES['jefe-ruta'] = (() => {
  const flat = params => params.rounds.flatMap((r, i) => r.attacks.map(a => ({ ...a, round: i })));
  const orderOf = (at, l) => {
    const n = at.levels[l].length; let h = 2166136261;
    for (const c of `${l}:${at.levels[l].join('|')}`) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
    return Array.from({ length: n }, (_, i) => (i + (h % n)) % n);
  };
  const rowsOf = lv => (lv.length === 3 && lv.some(t => t.length > 14) ? 2 : 1);
  const judge = (at, pick) => at.levels.findIndex((_, l) => pick[l] !== 0);   // −1: toda la ruta es válida
  function grade(state, params) {
    const all = flat(params);
    return { ok: (state?.done ?? 0) >= all.length, solution: all.map(a => a.levels[a.levels.length - 1][0]).map(t => (typeof mathStep === 'function' ? mathStep(t) : t)).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, A = flat(params), LIVES = params.lives ?? 3, tx = t => (typeof mathStep === 'function' ? mathStep(t) : t);
    let locked = false, W = 0, H = 0, phase = 'idle', ai = 0, lives = LIVES, pick = [], done = 0, wrong = -1, hurt = 0, shake = 0, msg = '', stopped = false, p5 = null;
    const at = () => A[Math.min(ai, A.length - 1)], startOf = round => A.findIndex(a => a.round === round);
    const reset = () => { pick = at().levels.map(() => -1); wrong = -1; };
    const hold = (l, k) => {
      const a = at(), top = 132, units = a.levels.reduce((t, lv) => t + rowsOf(lv), 0), u = Math.min(58, (H - 84 - top) / units), bottom = top + units * u, h = Math.min(44, u - 8);   /* la pared va pegada al reto */
      const lv = a.levels[l], rows = rowsOf(lv), below = a.levels.slice(0, l).reduce((t, x) => t + rowsOf(x), 0), y = bottom - (below + rows) * u + (u - h) / 2;
      if (rows === 2) { const w = (W - 44 - 8) / 2; return k < 2 ? { x: 32 + k * (w + 8), y, w, h } : { x: 32 + (W - 44 - w) / 2, y: y + u, w, h }; }
      const w = (W - 44 - (lv.length - 1) * 8) / lv.length;
      return { x: 32 + k * (w + 8), y, w, h };
    };
    const btn = () => ({ x: W / 2 - 76, y: H - 66, w: 152, h: 40 });
    reset();

    const m = mountSketch(host, (p, size) => {
      p5 = p;
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; };
      p.onResize = () => { W = size.w; H = size.h; if (stopped) p.redraw(); };

      function boss(x, y) {
        const col = C[params.color] || C.coral, sx = shake > 0 ? Math.sin(shake * 40) * 6 * shake : 0, alive = done < A.length;
        // Un núcleo con dos anillos que giran; al recibir un golpe se apaga un instante y, vencido, queda gris.
        const t = performance.now() / 1000, on = alive ? col : C.mute;
        p.stroke(C.line); p.strokeWeight(1); p.fill(C.card); p.circle(x + sx, y, 52);
        p.noFill(); p.strokeWeight(1.6);
        for (let i = 0; i < 2; i++) { p.stroke(i ? C.sky : on); p.push(); p.translate(x + sx, y); p.rotate((alive ? t : 0) * (0.6 + i * 0.3) * (i ? -1 : 1) + i); p.ellipse(0, 0, 74 - i * 10, 20 + i * 8); p.pop(); }
        const glow = p.color(on); glow.setAlpha(hurt > 0 ? 25 : 80); p.noStroke(); p.fill(glow); p.circle(x + sx, y, 30 + (alive ? Math.sin(t * 3) * 3 : 0));
        p.fill(hurt > 0 ? C.mute : on); p.circle(x + sx, y, 13);
      }

      p.draw = () => {
        p.background(C.bg);
        const dt = frameDt(p); hurt = Math.max(0, hurt - dt * 3); shake = Math.max(0, shake - dt * 2.5);
        const a = at(), r = params.rounds[a.round];
        drawKicker(p, C, r.title, 14, 18);
        drawHearts(p, C, W - 12, 18, phase === 'idle' || phase === 'all' || locked ? LIVES : lives, LIVES);
        // Vida del Guardián: una barra por ataque.
        const bw = Math.min(22, (W - 110) / A.length);
        for (let i = 0; i < A.length; i++) { p.noStroke(); p.fill(i < A.length - done ? C.coral : C.line); p.rect(14 + i * bw, 38, bw - 4, 10, 4); }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.BOLD); p.textSize(11); p.textAlign(p.LEFT, p.CENTER); p.text(params.name, 14, 62);
        boss(W - 46, 76);
        const all = locked || phase === 'all';
        if (!all) {
          // El reto y la pared de pasos.
          p.noStroke(); p.fill(C.N); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); fitText(p, tx(a.say), (W - 84) / 2 + 6, 104, W - 100, 17, 40);
          const pts = [];
          for (let l = 0; l < a.levels.length; l++) { const k = orderOf(a, l).indexOf(pick[l]); if (pick[l] < 0 || k < 0) break; const b = hold(l, k); pts.push([b.x + b.w / 2, b.y + b.h / 2]); }
          if (pts.length > 1) { p.noFill(); p.stroke(C.sky); p.strokeWeight(4); p.beginShape(); pts.forEach(q => p.vertex(q[0], q[1])); p.endShape(); }
          a.levels.forEach((lv, l) => {
            const b0 = hold(l, 0);
            p.noStroke(); p.fill(l === wrong ? C.bad : C.mute); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text(l + 1, 18, b0.y + b0.h / 2 + (rowsOf(lv) === 2 ? (hold(l, 2).y - b0.y) / 2 : 0));
            orderOf(a, l).forEach((opt, k) => {
              const b = hold(l, k), sel = pick[l] === opt, fill = sel ? C.sky : C.cream;
              drawTile(p, C, b, '', { fill, r: 12, lift: 3, ring: sel ? C.brand : l === wrong ? C.bad : null });
              p.noStroke(); p.fill(inkOn(fill, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
              const t = lv[opt], f = tx(t), parts = typeof stepLines === 'function' ? stepLines(t) : [t];
              if (parts.length === 2 && typeof drawFormulaCtx === 'function') parts.forEach((q, j) => { const g = tx(q); if (g !== q) drawFormulaCtx(p.drawingContext, g, b.x + b.w / 2, b.y + b.h / 2 + (j ? 9 : -8), { size: 13, maxW: b.w - 10, maxH: b.h / 2 - 2, weight: 700 }); else fitText(p, q, b.x + b.w / 2, b.y + b.h / 2 + (j ? 9 : -8), b.w - 8, 12); });
              else if (f !== t && typeof drawFormulaCtx === 'function') drawFormulaCtx(p.drawingContext, f, b.x + b.w / 2, b.y + b.h / 2 + 1, { size: 15, maxW: b.w - 10, maxH: b.h - 6, weight: 700 });
              else fitText(p, t, b.x + b.w / 2, b.y + b.h / 2 + 1, b.w - 8, 13);
            });
          });
          const full = pick.every(v => v >= 0), bb = btn();
          if (phase === 'play') drawTile(p, C, bb, '¡Atacar!', { fill: full ? C.coral : C.line, ink: full ? undefined : C.mute, size: 16, r: 14 });
        }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        const mid = (150 + H - 84) / 2;
        if (all) { drawBanner(p, C, `¡Venciste ${("a " + params.name).replace(/^a el /, "al ")}!`, 'Ya puedes comprobar', mid, C.ok); }
        else if (phase === 'idle') drawBanner(p, C, 'Toca para empezar', 'Sin prisa: arma la ruta y ataca', mid);
        else if (phase === 'lost') drawBanner(p, C, 'Te quedaste sin corazones', 'Toca para repetir la fase', mid, C.coral);
        else if (phase === 'hit') drawBanner(p, C, '¡Golpe certero!', 'Toca para seguir', mid, C.ok);
        if (!all && phase === 'play') fitText(p, msg || 'Un paso por nivel, de abajo hacia arriba', W / 2, H - 14, W - 20, 11);
        if (all && !stopped) { stopped = true; p.noLoop(); }
      };

      p.mousePressed = () => {
        if (locked || phase === 'all' || !inCanvas(p)) return;
        const x = p.mouseX, y = p.mouseY;
        if (phase === 'idle' || phase === 'lost') { lives = LIVES; ai = startOf(at().round); done = ai; reset(); msg = ''; phase = 'play'; api.sfx?.tap?.(); return false; }
        if (phase === 'hit') { if (done >= A.length) { phase = 'all'; api.ready(true); } else { ai = done; reset(); msg = ''; phase = ai > 0 && A[ai].round !== A[ai - 1].round ? 'idle' : 'play'; if (phase === 'idle') lives = LIVES; } return false; }
        const a = at();
        for (let l = 0; l < a.levels.length; l++) {
          const o = orderOf(a, l), k = o.findIndex((_, j) => hitBox(hold(l, j), x, y));
          if (k >= 0) { pick[l] = pick[l] === o[k] ? -1 : o[k]; if (l === wrong) wrong = -1; api.sfx?.tap?.(); return false; }
        }
        if (hitBox(btn(), x, y) && pick.every(v => v >= 0)) {
          const bad = judge(a, pick);
          if (bad < 0) { done = ai + 1; hurt = 1; shake = 1; phase = 'hit'; api.sfx?.ok?.(); }
          else { lives--; wrong = bad; pick[bad] = -1; msg = `El paso del nivel ${bad + 1} no se justifica: piénsalo otra vez`; api.sfx?.bad?.(); if (lives <= 0) phase = 'lost'; }
          return false;
        }
      };
    }, 1.45);

    return {
      loaded: m.ready,
      getState: () => ({ done }),
      peek: () => ({ phase, ai, lives, done, total: A.length, W, H, btn: btn(), holds: at().levels.map((_, l) => orderOf(at(), l).map((opt, k) => ({ opt, ...hold(l, k) }))) }),
      lock() { locked = true; if (p5 && stopped) p5.redraw(); },
      destroy: () => m.remove(),
    };
  }
  return { grade, create, flat, judge, orderOf };
})();
