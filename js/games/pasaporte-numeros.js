// El pasaporte de los números (lección 1.1): cada número trae su pasaporte y en él se ponen los
// sellos de todas las familias (ℕ, ℤ, ℚ…) a las que pertenece; un número puede llevar varios sellos.
// Tocar una casilla pone o quita el sello. Al bloquear, los sellos que faltan salen punteados en verde.
// params = { sets: ['N', 'Z', 'Q'], numbers: [{ label, in: [familias] }] }   state = { stamps: [[bool]] }

GAMES['pasaporte-numeros'] = (() => {
  const NAMES = { N: 'ℕ', Z: 'ℤ', Q: 'ℚ', I: '𝕀', R: 'ℝ' };
  const list = ks => (ks.length > 1 ? `${ks.slice(0, -1).map(k => NAMES[k]).join(', ')} y ${NAMES[ks[ks.length - 1]]}` : ks.map(k => NAMES[k]).join(''));
  const rowOk = (row, num, sets) => sets.every((k, j) => !!row?.[j] === num.in.includes(k));

  function grade(state, params) {
    const wrong = params.numbers.filter((n, i) => !rowOk(state.stamps[i], n, params.sets));
    if (!wrong.length) return { ok: true, solution: 'Cada pasaporte tiene todos sus sellos.' };
    return { ok: false, solution: wrong.map(n => `${n.label}: ${list(params.sets.filter(k => n.in.includes(k)))}`).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, sets = params.sets, nums = params.numbers;
    const st = { stamps: nums.map(() => sets.map(() => false)) };
    let locked = false, W = 0, H = 0, rows = [], colX = [], rh = 0, r0 = 0, pop = null;

    function layout(w, h) {
      W = w; H = h;
      const top = 74, foot = 30;
      rh = Math.min(54, (h - top - foot) / nums.length);
      r0 = Math.min(rh * 0.36, 18);
      const labelW = Math.min(110, w * 0.33), x0 = 12 + labelW, cw = (w - 12 - x0) / sets.length;
      colX = sets.map((_, j) => x0 + (j + 0.5) * cw);
      rows = nums.map((_, i) => ({ x: 12, y: top + i * rh, w: w - 24, h: rh - 6, labelW }));
    }
    const ready = () => api.ready(st.stamps.every(r => r.some(Boolean)));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function stamp(x, y, k, alpha = 1, rot = -0.18) {
        p.push(); p.translate(x, y); p.rotate(rot); p.drawingContext.globalAlpha = alpha;
        p.stroke(C[k]); p.strokeWeight(3); p.fill(C[k] + '26'); p.circle(0, 0, r0 * 2);
        p.strokeWeight(1.2); p.noFill(); p.circle(0, 0, r0 * 2 - 7);
        p.noStroke(); p.fill(C[k]); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(r0 * 0.95); p.text(NAMES[k], 0, 1);
        p.drawingContext.globalAlpha = 1; p.pop();
      }

      p.draw = () => {
        p.background(C.bg);
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.TOP); p.textStyle(p.NORMAL); p.textSize(12);
        p.text('Pon en cada pasaporte el sello de todas las familias donde el número puede entrar', 12, 6, W - 24, 34);
        sets.forEach((k, j) => {
          p.fill(C[k]); p.textStyle(p.BOLD); p.textSize(22); p.textAlign(p.CENTER, p.CENTER); p.text(NAMES[k], colX[j], 54);
        });
        rows.forEach((r, i) => {
          const ok = rowOk(st.stamps[i], nums[i], sets);
          p.stroke(locked ? (ok ? C.ok : C.bad) : C.line); p.strokeWeight(locked ? 2.5 : 1.5); p.fill(C.card); p.rect(r.x, r.y, r.w, r.h, 10);
          // Lomo del pasaporte y el número.
          p.noStroke(); p.fill(C.brand + '30'); p.rect(r.x, r.y, 8, r.h, 10, 0, 0, 10);
          p.fill(C.ink); p.textStyle(p.BOLD); p.textSize(Math.min(22, r.h * 0.5)); p.textAlign(p.LEFT, p.CENTER); p.text(nums[i].label, r.x + 18, r.y + r.h / 2 + 1);
          sets.forEach((k, j) => {
            const x = colX[j], y = r.y + r.h / 2, on = st.stamps[i][j], should = nums[i].in.includes(k);
            if (on) {
              const s = pop && pop.i === i && pop.j === j ? 1 + 0.35 * pop.t : 1;
              p.push(); p.translate(x, y); p.scale(s); stamp(0, 0, k, 1, -0.18 + 0.1 * ((i + j) % 3)); p.pop();
              if (locked && !should) { p.stroke(C.bad); p.strokeWeight(3); p.line(x - r0, y - r0, x + r0, y + r0); p.line(x + r0, y - r0, x - r0, y + r0); }
            } else if (locked && should) {
              p.noFill(); p.stroke(C.ok); p.strokeWeight(2); p.drawingContext.setLineDash([4, 4]); p.circle(x, y, r0 * 2); p.drawingContext.setLineDash([]);
              p.noStroke(); p.fill(C.ok); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(r0 * 0.9); p.text(NAMES[k], x, y + 1);
            } else {
              p.noFill(); p.stroke(C.line); p.strokeWeight(1.5); p.drawingContext.setLineDash([3, 4]); p.circle(x, y, r0 * 2); p.drawingContext.setLineDash([]);
            }
          });
        });
        if (pop) { pop.t -= 0.12; if (pop.t <= 0) pop = null; }
        p.noStroke(); p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        p.text(locked ? (grade(st, params).ok ? '¡Pasaportes en regla!' : 'Faltan los sellos punteados en verde; sobran los tachados') : 'Toca una casilla para poner o quitar el sello', 12, H - 16, W - 24, 28);
      };

      p.mousePressed = () => {
        if (locked) return;
        for (let i = 0; i < rows.length; i++) for (let j = 0; j < sets.length; j++) {
          if (Math.hypot(p.mouseX - colX[j], p.mouseY - (rows[i].y + rows[i].h / 2)) <= r0 + 8) {
            st.stamps[i][j] = !st.stamps[i][j];
            if (st.stamps[i][j]) pop = { i, j, t: 1 };
            api.sfx?.tap?.(); ready(); return false;
          }
        }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ stamps: st.stamps.map(r => [...r]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create };
})();
