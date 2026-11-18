// Afina el sistema (geometría vectorial, sistemas 2×2 y su interpretación geométrica): cada ecuación
// ax + by = c es una recta del plano. Uno o dos coeficientes tienen manijas; al moverlas se ve cómo
// gira o se desliza la recta. La meta de cada ronda es que el sistema no tenga solución (rectas
// paralelas), tenga infinitas (la misma recta) o que su única solución sea un punto dado.
// params = { rounds: [{ e1: [a, b, c], e2: [a, b, c], free: [[ecuación, coeficiente]], goal: 'ninguna' | 'infinitas' | 'punto', P, step }] }
// state = { eqs: [[e1, e2]] }

GAMES['afina-sistema'] = (() => {
  const RANGE = 6, LIM = 12;
  const eps = 1e-9;
  const D = (e1, e2) => e1[0] * e2[1] - e1[1] * e2[0];
  function kind(e1, e2) {
    if (Math.abs(D(e1, e2)) > eps) return 'unica';
    const r1 = e1[0] * e2[2] - e1[2] * e2[0], r2 = e1[1] * e2[2] - e1[2] * e2[1];
    return Math.abs(r1) < eps && Math.abs(r2) < eps ? 'infinitas' : 'ninguna';
  }
  const solve = (e1, e2) => { const d = D(e1, e2); return [(e1[2] * e2[1] - e1[1] * e2[2]) / d, (e1[0] * e2[2] - e1[2] * e2[0]) / d].map(v => Math.round(v * 1e9) / 1e9 || 0); };
  const isLine = e => Math.abs(e[0]) > eps || Math.abs(e[1]) > eps;
  function meets(eqs, r) {
    if (!eqs || !isLine(eqs[0]) || !isLine(eqs[1])) return false;
    const k = kind(eqs[0], eqs[1]);
    if (r.goal === 'punto') return k === 'unica' && solve(eqs[0], eqs[1]).every((v, i) => Math.abs(v - r.P[i]) < 1e-9);
    return k === r.goal;
  }
  const n = v => String(+v.toFixed(3)).replace('-', '−');
  const NAMES = ['a', 'b', 'c'], SUB = ['₁', '₂'];
  function eqText(e) {
    const term = (v, s, first) => {
      if (Math.abs(v) < eps) return '';
      const a = Math.abs(v), sign = v < 0 ? (first ? '−' : ' − ') : first ? '' : ' + ';
      return sign + (a === 1 ? '' : n(a)) + s;
    };
    const lhs = (term(e[0], 'x', true) + term(e[1], 'y', !e[0])) || '0';
    return `${lhs} = ${n(e[2])}`;
  }

  // Un valor de las perillas que cumple la meta (para la solución): se barre el rango de cada perilla.
  function answer(r) {
    const step = r.step || 1, vals = [];
    for (let v = -LIM; v <= LIM + eps; v += step) vals.push(+v.toFixed(3));
    const free = r.free, base = [r.e1.slice(), r.e2.slice()];
    const tryAll = (idx, eqs) => {
      if (idx === free.length) return meets(eqs, r) ? eqs : null;
      for (const v of vals) {
        const e = eqs.map(x => x.slice()); e[free[idx][0]][free[idx][1]] = v;
        const got = tryAll(idx + 1, e);
        if (got) return got;
      }
      return null;
    };
    return tryAll(0, base);
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => meets(state.eqs[i], r));
    const solution = params.rounds.map(r => {
      const a = answer(r);
      return a ? r.free.map(([e, c]) => `${NAMES[c]}${SUB[e]} = ${n(a[e][c])}`).join(', ') : '—';
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const eqs = params.rounds.map(r => [r.e1.slice(), r.e2.slice()]), touched = params.rounds.map(() => false);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], view = null, knobs = [], drag = null;

    function layout() {
      tabs = roundTabs(params.rounds.length, W);
      const r = params.rounds[cur], side = Math.min(W - 24, H - 148 - 39 * r.free.length);
      view = planeView({ x: (W - side) / 2, y: 112, w: side, h: side }, [-RANGE, RANGE], [-RANGE, RANGE]);
      const y0 = view.box.y + side + 24;
      knobs = r.free.map((f, i) => ({ f, rail: practiceTrack(61, W - 56, y0 + i * 37, -LIM, LIM, r.step || 1) }));
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      function drawLine(e, col) {
        const v = view, ctx = p.drawingContext;
        ctx.save(); ctx.beginPath(); ctx.rect(v.box.x, v.box.y, v.box.w, v.box.h); ctx.clip();
        p.stroke(col); p.strokeWeight(3);
        if (Math.abs(e[1]) > eps) { const y = x => (e[2] - e[0] * x) / e[1]; p.line(v.X(-RANGE - 1), v.Y(y(-RANGE - 1)), v.X(RANGE + 1), v.Y(y(RANGE + 1))); }
        else if (Math.abs(e[0]) > eps) { const x = e[2] / e[0]; p.line(v.X(x), v.box.y, v.X(x), v.box.y + v.box.h); }
        ctx.restore(); p.fill(C.bg); p.stroke(C.bg); // p5 guarda el último color: lo resincroniza tras el recorte
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], E = eqs[cur], ok = meets(E, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (meets(eqs[i], params.rounds[i]) ? C.ok : C.bad) : i === cur ? C.brand : touched[i] ? C.Z : C.line));
        const goal = r.goal === 'ninguna' ? 'Meta: que no tenga solución' : r.goal === 'infinitas' ? 'Meta: infinitas soluciones' : `Meta: la solución es (${n(r.P[0])}, ${n(r.P[1])})`;
        p.noStroke(); p.fill(C.mute); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); fitText(p, `${goal}  ·  det = ${n(D(E[0], E[1]))}`, W / 2, 52, W - 24, 13);
        [[E[0], C.Z], [E[1], C.I]].forEach(([e, col], i) => { p.fill(col); p.textStyle(p.BOLD); fitText(p, eqText(e), W / 2, 76 + i * 20, W - 24, 16); });
        drawPlane(p, C, view);
        if (r.goal === 'punto') { p.noFill(); p.stroke(C.N); p.strokeWeight(2.5); p.circle(view.X(r.P[0]), view.Y(r.P[1]), 18); }
        if (isLine(E[0])) drawLine(E[0], C.Z);
        if (isLine(E[1])) drawLine(E[1], C.I);
        if (isLine(E[0]) && isLine(E[1]) && kind(E[0], E[1]) === 'unica') {
          const s = solve(E[0], E[1]);
          if (Math.abs(s[0]) <= RANGE + 0.5 && Math.abs(s[1]) <= RANGE + 0.5) { p.noStroke(); p.fill(ok ? C.ok : C.ink); p.circle(view.X(s[0]), view.Y(s[1]), 10); }
        }
        if (locked) { p.noStroke(); p.fill(ok ? C.ok : C.bad); p.textSize(13); p.textStyle(p.BOLD); p.text(ok ? '¡Bien!' : 'Mira la solución abajo', W / 2, view.box.y + view.box.h - 14); }
        knobs.forEach(k => {
          const [e, c] = k.f;
          drawPracticeTrack(p, C, k.rail, E[e][c], NAMES[c] + SUB[e], n(E[e][c]), e ? C.I : C.Z, drag === k);
        });
      };

      const move = x => {
        const [e, c] = drag.f, next = drag.rail.value(x);
        if (!touched[cur] || eqs[cur][e][c] !== next) {
          eqs[cur][e][c] = next; touched[cur] = true; api.sfx?.tap?.(); api.ready(touched.every(Boolean));
        }
      };
      p.mousePressed = () => {
        if (!inCanvas(p)) return;
        const tb = tabs.findIndex(t => hitBox(t, p.mouseX, p.mouseY));
        if (tb >= 0) { cur = tb; drag = null; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        drag = knobs.find(k => k.rail.hit(p.mouseX, p.mouseY));
        if (drag) { move(p.mouseX); return false; }
      };
      p.mouseDragged = () => { if (drag && !locked) { move(p.mouseX); return false; } };
      p.mouseReleased = () => { drag = null; };
    }, 1.41, () => {
      const k = knobs[0];
      if (locked || !k) return null;
      return k.rail.gesture(eqs[cur][k.f[0]][k.f[1]]);
    });

    return {
      loaded: m.ready,
      getState: () => ({ eqs: eqs.map(E => E.map(e => e.slice())) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
      demo: m.demo,
    };
  }

  return { grade, create, kind, solve, answer, eqText, demo: true };
})();
