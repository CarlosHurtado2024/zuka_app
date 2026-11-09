// Los engranajes (Álgebra 1.2, proporcionalidad inversa): dos ruedas dentadas engranadas giran sin parar.
// Por el punto donde se tocan pasan los mismos dientes de las dos, así que dientes × vueltas es igual en
// ambas: la rueda chica da más vueltas. En cada ronda falta un dato de la rueda B (dientes o vueltas) y se
// fija con − / +; los contadores muestran cuántos dientes pasa cada rueda. La rueda B se dibuja con los
// dientes que se elijan.
// params = { rounds: [{ A: [dientes, vueltas], B: [dientes | null, vueltas | null], min, max }] }
// state = { vals: [número | null] }

GAMES['engranajes'] = (() => {
  const unknownOf = r => (r.B[0] == null ? 0 : 1);
  const answerOf = r => { const k = r.A[0] * r.A[1]; return unknownOf(r) === 0 ? k / r.B[1] : k / r.B[0]; };
  const answers = P => P.rounds.map(answerOf);
  const good = (v, r) => v != null && Math.abs(v - answerOf(r)) < 1e-9;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.vals?.[i], r));
    const solution = params.rounds.map(r => {
      const a = answerOf(r), tb = r.B[0] ?? a, vb = r.B[1] ?? a;
      return `${r.A[0]} · ${r.A[1]} = ${tb} · ${vb}: ${unknownOf(r) === 0 ? `${a} dientes` : `${a} vueltas`}`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { vals: R.map(() => null) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], minus = null, plus = null, t = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      minus = { x: 14, y: h - 52, w: 64, h: 38 }; plus = { x: w - 78, y: h - 52, w: 64, h: 38 };
    }
    const cur0 = r => (unknownOf(r) === 0 ? Math.round((r.min + r.max) / 2) : r.min);

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function gear(cx, cy, teeth, rad, ang, col) {
        const tooth = Math.min(10, rad * 0.22), n = teeth;
        p.push(); p.translate(cx, cy); p.rotate(ang);
        p.stroke(col); p.strokeWeight(2); p.fill(C.card);
        p.beginShape();
        for (let k = 0; k < n; k++) {
          const a0 = (k / n) * Math.PI * 2, da = Math.PI * 2 / n;
          [[0, rad - tooth / 2], [0.15, rad + tooth / 2], [0.45, rad + tooth / 2], [0.6, rad - tooth / 2]].forEach(([f, rr]) => p.vertex(rr * Math.cos(a0 + f * da), rr * Math.sin(a0 + f * da)));
        }
        p.endShape(p.CLOSE);
        p.noFill(); p.strokeWeight(1.5); p.circle(0, 0, rad * 0.9);
        p.line(0, 0, rad * 0.6, 0);
        p.noStroke(); p.fill(col); p.circle(0, 0, 10);
        p.pop();
      }

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], u = unknownOf(r), v = st.vals[cur] ?? cur0(r);
        const tB = u === 0 ? v : r.B[0], vB = u === 1 ? v : r.B[1], ok = good(st.vals[cur], r);
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.vals[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.vals[i] != null ? C.Z : C.line));
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(12); p.textAlign(p.LEFT, p.CENTER);
        p.text(u === 0 ? 'Elige los dientes de la rueda B' : 'Elige las vueltas de la rueda B', 14, 56);

        // Tamaños: radio proporcional a los dientes; las dos ruedas caben a lo ancho.
        const tMax = Math.max(r.A[0], u === 0 ? r.max : r.B[0]);
        const top = 70, y0 = H - 156, room = y0 - top - 12;
        const k = Math.min((W - 60) / (r.A[0] + tMax) / 1.08, room / (2.2 * tMax));
        const rA = r.A[0] * k, rB = tB * k, cy = top + room / 2 + 4;
        const cxA = 30 + rA, cxB = cxA + rA + rB + 2;
        t += locked ? 0 : 0.012;
        const angA = t, angB = -t * r.A[0] / tB + Math.PI / tB;
        gear(cxA, cy, r.A[0], rA, angA, C.N);
        gear(cxB, cy, tB, rB, angB, ok && locked ? C.ok : C.Z);
        p.noStroke(); p.textStyle(p.BOLD); p.textSize(14); p.textAlign(p.CENTER, p.CENTER);
        p.fill(C.N); p.text('A', cxA, cy - 22); p.fill(C.Z); p.text('B', cxB, cy - 22);

        // Fichas de datos y contadores de dientes que pasan
        const colW = (W - 36) / 2;
        [[14, 'Rueda A', r.A[0], r.A[1], C.N, -1], [22 + colW, 'Rueda B', tB, vB, C.Z, u]].forEach(([x, nm, tt, vv, col, unk]) => {
          p.stroke(col); p.strokeWeight(1.5); p.fill(C.card); p.rect(x, y0, colW, 92, 10);
          p.noStroke(); p.fill(col); p.textStyle(p.BOLD); p.textSize(13); p.textAlign(p.LEFT, p.TOP); p.text(nm, x + 10, y0 + 8);
          p.textStyle(p.NORMAL); p.fill(C.ink); p.textSize(13);
          const unset = unk >= 0 && st.vals[cur] == null, show = (v, k) => (unset && unk === k ? '?' : v);
          p.fill(unk === 0 ? C.brand : C.ink); p.text(`dientes: ${show(tt, 0)}${unk === 0 ? ' ◀' : ''}`, x + 10, y0 + 30);
          p.fill(unk === 1 ? C.brand : C.ink); p.text(`vueltas: ${show(vv, 1)}${unk === 1 ? ' ◀' : ''}`, x + 10, y0 + 50);
          p.fill(C.mute); p.textSize(12); p.text(unset ? 'pasan ?' : `pasan ${tt} · ${vv} = ${tt * vv}`, x + 10, y0 + 70);
        });
        [[minus, '−'], [plus, '+']].forEach(([b, s]) => {
          p.stroke(locked ? C.line : C.brand); p.strokeWeight(1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(locked ? C.mute : C.brand); p.textSize(20); p.textAlign(p.CENTER, p.CENTER); p.text(s, b.x + b.w / 2, b.y + b.h / 2);
        });
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textSize(12);
        if (locked && !ok) { p.fill(C.ok); p.textStyle(p.BOLD); fitText(p, `Era ${answerOf(r)}: ${r.A[0]} · ${r.A[1]} = ${r.A[0] * r.A[1]}`, W / 2, minus.y + 19, W - 170, 12); }
        else { p.fill(C.mute); p.textStyle(p.NORMAL); fitText(p, u === 0 ? 'Dientes de B' : 'Vueltas de B', W / 2, minus.y + 19, W - 170, 12); }
      };

      p.mousePressed = () => {
        const tb = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const r = R[cur];
        const d = hitBox(plus, p.mouseX, p.mouseY) ? 1 : hitBox(minus, p.mouseX, p.mouseY) ? -1 : 0;
        if (d) {
          const v = st.vals[cur] ?? cur0(r);
          st.vals[cur] = Math.min(r.max, Math.max(r.min, v + d));
          api.ready(st.vals.every(x => x != null)); api.sfx?.tap?.(); return false;
        }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ vals: [...st.vals] }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, answers };
})();
