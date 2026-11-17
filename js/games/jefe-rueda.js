// Jefe de la rueda (Trigonometría; spec 2026-11-23-trig-jefes-y-movimiento): batalla por turnos, sin reloj, contra el jefe
// de un mundo. Cada ataque es un reto cuya respuesta son uno o varios nudos de una rueda de ángulos (y de anillos, en la
// Galaxia Polar). Se marcan las runas y se toca «¡Atacar!»: si están todas y solo ellas, salen rayos y el jefe pierde vida.
// params = { name, kind: 'kraken'|'faro'|'nebulosa', rounds: [{ title, items: [{ say, targets: [[deg, anillo?]], rings?, step?, rad?, why }] }] }
// Juego con `questGame` y las ayudas `TK` del kit.   state = { done: [n] }
GAMES['jefe-rueda'] = (() => {
  const key = t => `${TK.mod(t[0], 360)}:${t[1] ?? 0}`;
  const want = it => it.targets.map(key).sort().join('|');
  const nRings = it => (it.rings ? it.rings.length : 1), stepOf = it => it.step || (nRings(it) > 1 ? 30 : 15);
  const total = P => P.rounds.reduce((n, r) => n + r.items.length, 0);
  const hits = G => G.params.rounds.slice(0, G.a.cur).reduce((n, r) => n + r.items.length, 0) + G.round.items.indexOf(G.item) + (G.solved ? 1 : 0);

  // El jefe: tres figuras hechas con formas, que se mueven solas y tiemblan al recibir un golpe.
  function drawBoss(G, x, y) {
    const { p, C } = G, t = G.t, hit = G.solved, dx = hit ? Math.sin(t * 55) * 3 : 0, kind = G.params.kind, core = (cx, cy, r, col) => { const g = p.color(col); g.setAlpha(80); p.noStroke(); p.fill(g); p.circle(cx, cy, r * 3.2 + Math.sin(t * 3) * 2); p.fill(col); p.circle(cx, cy, r * 1.4); };
    x += dx;
    if (kind === 'kraken') {
      p.noFill();
      for (let k = 0; k < 3; k++) {
        p.stroke(k === 1 ? C.sky : C.coral); p.strokeWeight(1.6 - k * 0.3); p.beginShape();
        for (let i = 0; i <= 40; i++) { const u = -1 + i / 20, amp = (8 - k * 2) * (1 - u * u); p.vertex(x + u * (48 - k * 2), y - 2 + Math.sin(u * 7 + t * (1.6 + k * 0.4) + k * 2) * amp + (k - 1) * 9); }
        p.endShape();
      }
      p.stroke(C.coral); p.strokeWeight(1.5); p.fill(C.card); p.circle(x, y - 2, 30); core(x, y - 2, 5, C.coral);
    } else if (kind === 'faro') {
      const beam = p.color(C.sun); beam.setAlpha(70); const a = t * 1.1;
      p.noStroke(); p.fill(beam); p.triangle(x, y - 18, x + Math.cos(a) * 120, y - 18 + Math.sin(a) * 26 - 14, x + Math.cos(a) * 120, y - 18 + Math.sin(a) * 26 + 14);
      p.fill(C.sky); p.quad(x - 13, y - 8, x + 13, y - 8, x + 19, y + 32, x - 19, y + 32); p.fill(C.cream); p.rect(x - 15, y + 6, 30, 8); p.rect(x - 17, y + 20, 34, 7);
      p.fill(C.card); p.stroke(C.sun); p.strokeWeight(1.5); p.rect(x - 16, y - 30, 32, 22, 6); core(x, y - 19, 4, C.sun);
    } else {
      p.noFill(); p.strokeWeight(3);
      for (let k = 0; k < 3; k++) { p.stroke([C.sky, C.mint, C.coral][k]); p.push(); p.translate(x, y); p.rotate(t * (0.5 + k * 0.25) + k); p.ellipse(0, 0, 96 - k * 14, 30 + k * 8); p.pop(); }
      p.noStroke(); p.fill(C.card); p.circle(x, y, 44); p.stroke(C.sky); p.strokeWeight(1.5); p.noFill(); p.circle(x, y, 44); core(x, y, 6, C.sky);
    }
  }

  return questGame({
    aspect: 1.6,
    idle: 'Sin reloj: piensa, marca los puntos y ataca',
    init: () => ({ marks: [] }),
    ok: (s, it) => [...s.marks].sort().join('|') === want(it),
    answer: it => ({ marks: it.targets.map(key) }),
    solution: it => `${it.say}: ${it.targets.map(t => `${it.rings ? `${it.rings[t[1] ?? 0]} cis ` : ''}${TK.mod(t[0], 360)}°`).join(', ')}`,
    prompt: it => it.say,
    foot: (it, s) => `Puntos marcados: ${s.marks.length}. Tócalos otra vez para quitarlos`,
    yes: it => it.why,
    layout(G) {
      const it = G.item, n = nRings(it);
      G.go = { x: G.W / 2 - 80, y: G.bottom - 46, w: 160, h: 38 };
      G.R = Math.min(G.W * 0.34, (G.go.y - G.top - 138) / 2); G.cx = G.W / 2; G.cy = G.top + 116 + G.R;
      G.rad = j => G.R * (n === 1 ? 1 : 0.4 + 0.6 * j / (n - 1));
      G.node = (deg, j = 0) => { const [x, y] = TK.at(G.cx, G.cy, G.rad(j), deg); return { x: x - 7, y: y - 7, w: 14, h: 14 }; };
    },
    draw(G) {
      const { p, C, s, item: it, cx, cy, R } = G, n = nRings(it), step = stepOf(it), P = G.params, hp = total(P) - hits(G), by = G.top + 38;
      // Jefe, nombre y vida.
      const dead = hp <= 0;
      if (dead) { p.push(); p.translate(cx, by + 10); p.rotate(0.55); drawBoss(G, 0, 0); p.pop(); TK.label(p, C, '¡Vencido!', cx, G.top + 6, C.ok, 15, 160); } else drawBoss(G, cx, by);
      const bw = Math.min(150, G.W - 60), bx = cx - bw / 2, byy = G.top + 82;
      p.noStroke(); p.fill(C.line); p.rect(bx, byy, bw, 8, 4); p.fill(hp / total(P) > 0.34 ? C.coral : C.bad); p.rect(bx, byy, bw * TK.glide(G, 'hp', hp / total(P), 5), 8, 4);
      TK.label(p, C, `${hp} de ${total(P)}`, bx + bw + 26, byy + 4, C.mute, 11, 50);
      // Tablero: anillos, radios y nudos.
      for (let j = 0; j < n; j++) { p.noFill(); p.stroke(j === n - 1 ? C.mute : C.line); p.strokeWeight(j === n - 1 ? 2 : 1.2); p.circle(cx, cy, 2 * G.rad(j)); }
      for (let d = 0; d < 180; d += step) { const [x1, y1] = TK.at(cx, cy, R, d), [x2, y2] = TK.at(cx, cy, R, d + 180); p.stroke(C.line); p.strokeWeight(d % 90 ? 0.7 : 1.8); p.line(x1, y1, x2, y2); }
      const ax = it.rad ? ['$0$', '$\\tfrac{\\pi}{2}$', '$\\pi$', '$\\tfrac{3\\pi}{2}$'] : ['0°', '90°', '180°', '270°'];
      ax.forEach((txt, k) => { const [x, y] = TK.at(cx, cy, R + (k % 2 ? 11 : 17), 90 * k); TK.label(p, C, txt, x, y, C.mute, 11, 40); });
      if (it.rings) it.rings.forEach((txt, j) => TK.label(p, C, txt, cx + G.rad(j) - 9, cy + 10, C.mute, 10, 24));
      for (let j = 0; j < n; j++) for (let d = 0; d < 360; d += step) { const [x, y] = TK.at(cx, cy, G.rad(j), d); p.noStroke(); p.fill(C.mute); p.circle(x, y, 6); }
      // Runas marcadas y, al acertar, los rayos que salen hacia el jefe.
      const k = G.solved ? Math.min(1, (1.2 - G.wait) / 0.5) : 0;
      for (const m of s.marks) {
        const [d, j] = m.split(':').map(Number), [x, y] = TK.at(cx, cy, G.rad(j), d), col = G.solved ? C.ok : C.sky;
        if (k > 0) { p.stroke(C.sun); p.strokeWeight(4); p.line(x, y, x + (cx - x) * k, y + (by - y) * k); }
        drawDot(p, C, x, y, 13, col);
      }
      drawBtn(p, C, G.go, '¡Atacar!', G.solved, G.solved ? C.ok : C.coral);
    },
    press(G, x, y) {
      const s = G.s, it = G.item;
      if (hitBox(G.go, x, y)) {
        if (!s.marks.length) { G.a.say('Marca al menos un punto en la rueda', G.C.N); return true; }
        const tg = it.targets.map(key), extra = s.marks.some(m => !tg.includes(m)), miss = tg.some(m => !s.marks.includes(m));
        G.submit(extra && miss ? 'Hay puntos mal puestos' : extra ? 'Sobra algún punto' : 'Faltan puntos: hay más soluciones');
        return true;
      }
      const step = stepOf(it), a = TK.mod(Math.atan2(G.cy - y, x - G.cx) * 180 / Math.PI, 360), d = TK.mod(Math.round(a / step) * step, 360);
      const rr = Math.hypot(x - G.cx, y - G.cy), n = nRings(it);
      if (rr > G.R + 22 || rr < G.rad(0) - 16) return false;
      let best = 0;
      for (let j = 1; j < n; j++) if (Math.abs(rr - G.rad(j)) < Math.abs(rr - G.rad(best))) best = j;
      const m = `${d}:${best}`, i = s.marks.indexOf(m);
      if (i >= 0) s.marks.splice(i, 1); else s.marks.push(m);
      G.api.sfx?.tap?.();
      return true;
    },
    peek: G => {
      const tg = G.item.targets.map(key), box = m => G.node(...m.split(':').map(Number)), off = G.s.marks.filter(m => !tg.includes(m)), on = tg.filter(m => !G.s.marks.includes(m));
      return { solve: [...off.map(box), ...on.map(box), G.go], wrong: G.s.marks.length && (off.length || on.length) ? G.go : null };
    },
  });
})();
