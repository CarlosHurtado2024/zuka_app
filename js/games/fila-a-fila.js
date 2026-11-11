// Fila a fila (geometría vectorial, eliminación de Gauss y Gauss-Jordan): una matriz, aumentada o no, se
// transforma con las tres operaciones elementales de fila — intercambiar dos filas, multiplicar una por
// k ≠ 0 y sumarle a una k veces otra —. Se toca la fila que cambia (y la otra, si hace falta), se elige k
// con dos perillas (numerador y denominador) y se aplica; se puede deshacer. La meta de cada ronda es
// dejar el bloque izquierdo en forma escalonada o escalonada reducida (así sirve para sistemas sin
// solución y para [A | I] → [I | A⁻¹]). Con det: true se lleva la cuenta det A = factor · det(actual).
// params = { rounds: [{ M: [[números]], aug: columnas tras la barra, goal: 'escalonada' | 'reducida', det }] }
// state = { ops: [[{ t: 'swap', i, j } | { t: 'scale', i, k: [n, d] } | { t: 'add', i, j, k: [n, d] }]] }

GAMES['fila-a-fila'] = (() => {
  // ---------- Fracciones exactas [n, d] con d > 0 ----------
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const F = {
    of(n, d = 1) {
      if (Array.isArray(n)) return F.of(n[0], n[1]);
      if (!Number.isInteger(n)) { let q = 1; while (!Number.isInteger(+(n * q).toFixed(9)) && q < 1e6) q *= 10; return F.of(Math.round(n * q), d * q); }
      if (d < 0) { n = -n; d = -d; }
      const g = gcd(n, d) || 1;
      return [n / g || 0, d / g];
    },
    add: (a, b) => F.of(a[0] * b[1] + b[0] * a[1], a[1] * b[1]),
    mul: (a, b) => F.of(a[0] * b[0], a[1] * b[1]),
    div: (a, b) => F.of(a[0] * b[1], a[1] * b[0]),
    neg: a => [-a[0] || 0, a[1]],
    zero: a => a[0] === 0,
    one: a => a[0] === 1 && a[1] === 1,
    txt: a => (a[0] < 0 ? '−' : '') + Math.abs(a[0]) + (a[1] === 1 ? '' : '/' + a[1]),
  };

  const toF = M => M.map(r => r.map(v => (Array.isArray(v) ? F.of(v) : F.of(v))));
  const validK = k => Array.isArray(k) && k[1] !== 0 && Number.isInteger(k[0]) && Number.isInteger(k[1]);

  // Aplica las operaciones a una copia; una operación inválida (k = 0, misma fila) se ignora.
  function apply(M, ops) {
    const A = toF(M);
    for (const o of ops || []) {
      if (o.t === 'swap' && o.i !== o.j) [A[o.i], A[o.j]] = [A[o.j], A[o.i]];
      else if (o.t === 'scale' && validK(o.k) && o.k[0] !== 0) { const k = F.of(o.k); A[o.i] = A[o.i].map(v => F.mul(v, k)); }
      else if (o.t === 'add' && o.i !== o.j && validK(o.k)) { const k = F.of(o.k); A[o.i] = A[o.i].map((v, c) => F.add(v, F.mul(k, A[o.j][c]))); }
    }
    return A;
  }
  const isNull = (o) => (o.t !== 'swap' && (!validK(o.k) || o.k[0] === 0)) || (o.t !== 'scale' && o.i === o.j);

  const lead = (row, n) => { for (let c = 0; c < n; c++) if (!F.zero(row[c])) return c; return -1; };
  // Escalonada en las n primeras columnas: cada pivote a la derecha del de arriba y filas nulas abajo.
  function isEchelon(A, n) {
    let last = -1, zeroSeen = false;
    for (const row of A) {
      const l = lead(row, n);
      if (l < 0) { zeroSeen = true; continue; }
      if (zeroSeen || l <= last) return false;
      last = l;
    }
    return true;
  }
  // Reducida: además cada pivote vale 1 y es lo único distinto de cero en su columna.
  function isReduced(A, n) {
    if (!isEchelon(A, n)) return false;
    return A.every((row, i) => {
      const l = lead(row, n);
      if (l < 0) return true;
      return F.one(row[l]) && A.every((r2, j) => j === i || F.zero(r2[l]));
    });
  }

  // Forma escalonada reducida (Gauss-Jordan sobre las n primeras columnas), para mostrar la solución.
  function rref(M, n) {
    const A = toF(M);
    let r = 0;
    for (let c = 0; c < n && r < A.length; c++) {
      const p = A.findIndex((row, i) => i >= r && !F.zero(row[c]));
      if (p < 0) continue;
      [A[r], A[p]] = [A[p], A[r]];
      const inv = F.div([1, 1], A[r][c]);
      A[r] = A[r].map(v => F.mul(v, inv));
      A.forEach((row, i) => { if (i !== r && !F.zero(row[c])) { const k = F.neg(row[c]); A[i] = row.map((v, cc) => F.add(v, F.mul(k, A[r][cc]))); } });
      r++;
    }
    return A;
  }

  // det A = factor · det(matriz actual): intercambiar cambia el signo y multiplicar por k lo divide entre k.
  function detFactor(ops) {
    let f = [1, 1];
    for (const o of ops || []) {
      if (isNull(o)) continue;
      if (o.t === 'swap') f = F.neg(f);
      else if (o.t === 'scale') f = F.div(f, F.of(o.k));
    }
    return f;
  }
  function det(M) {
    const A = toF(M), n = A.length;
    let f = [1, 1];
    for (let c = 0; c < n; c++) {
      const p = A.findIndex((row, i) => i >= c && !F.zero(row[c]));
      if (p < 0) return [0, 1];
      if (p !== c) { [A[c], A[p]] = [A[p], A[c]]; f = F.neg(f); }
      f = F.mul(f, A[c][c]);
      for (let i = c + 1; i < n; i++) { const k = F.neg(F.div(A[i][c], A[c][c])); A[i] = A[i].map((v, cc) => F.add(v, F.mul(k, A[c][cc]))); }
    }
    return f;
  }

  const cols = r => r.M[0].length - (r.aug || 0);
  const meets = (A, r) => (r.goal === 'reducida' ? isReduced(A, cols(r)) : isEchelon(A, cols(r)));
  const matTxt = (A, r) => '[' + A.map(row => row.map((v, c) => (c === cols(r) ? '| ' : '') + F.txt(v)).join(' ')).join('; ') + ']';

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => (state.ops[i] || []).every(o => !isNull(o)) && meets(apply(r.M, state.ops[i]), r));
    return { ok, solution: params.rounds.map(r => `${r.goal === 'reducida' ? 'reducida' : 'por ejemplo'} ${matTxt(rref(r.M, cols(r)), r)}`).join(' · ') };
  }

  const MODES = [{ t: 'swap', name: 'Ri ↔ Rj' }, { t: 'scale', name: 'Ri ← k·Ri' }, { t: 'add', name: 'Ri ← Ri + k·Rj' }];

  function create(host, params, api) {
    const C = api.palette;
    const ops = params.rounds.map(() => []);
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], mode = 2, selI = null, selJ = null, kn = 1, kd = 1;
    let L = {};

    function layout() {
      tabs = roundTabs(params.rounds.length);
      const r = params.rounds[cur], m = r.M.length;
      const top = 48, rowH = 38, gridW = W - 24 - 44;
      L.top = top; L.rowH = rowH; L.gx = 12 + 44; L.cw = gridW / r.M[0].length;
      L.rows = r.M.map((_, i) => ({ x: 12, y: top + i * rowH, w: 40, h: rowH - 6 }));
      let y = top + m * rowH + 26;
      L.info = y - 10;
      const bw = (W - 24 - 12) / 3;
      L.modes = MODES.map((_, i) => ({ x: 12 + i * (bw + 6), y: y + 6, w: bw, h: 38 }));
      y += 54;
      L.preview = y + 10;
      y += 28;
      const half = (W - 24) / 2;
      L.kn = { minus: { x: 12, y, w: 38, h: 34 }, plus: { x: 12 + half - 50, y, w: 38, h: 34 }, mid: 12 + half / 2 - 6, y };
      L.kd = { minus: { x: 12 + half, y, w: 38, h: 34 }, plus: { x: W - 50, y, w: 38, h: 34 }, mid: 12 + half + half / 2 - 6, y };
      y += 46;
      L.undo = { x: 12, y, w: (W - 30) / 2, h: 40 };
      L.go = { x: 18 + (W - 30) / 2, y, w: (W - 30) / 2, h: 40 };
    }

    const curOp = () => {
      const t = MODES[mode].t;
      if (selI == null) return null;
      if (t === 'scale') return { t, i: selI, k: [kn, kd] };
      if (selJ == null) return null;
      return t === 'swap' ? { t, i: selI, j: selJ } : { t, i: selI, j: selJ, k: [kn, kd] };
    };
    function opTxt(o) {
      if (!o) return selI == null ? 'Toca la fila que cambia' : 'Ahora toca la otra fila';
      const k = F.of(o.k || [1, 1]), kt = k[1] === 1 && k[0] >= 0 ? F.txt(k) : `(${F.txt(k)})`;
      if (o.t === 'swap') return `R${o.i + 1} ↔ R${o.j + 1}`;
      if (o.t === 'scale') return `R${o.i + 1} ← ${kt}·R${o.i + 1}`;
      return `R${o.i + 1} ← R${o.i + 1} + ${kt}·R${o.j + 1}`;
    }

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); W = size.w; H = size.h; layout(); };
      p.onResize = () => { W = size.w; H = size.h; layout(); };

      function button(b, label, on, active) {
        p.stroke(active ? C.brand : on ? C.Z : C.line); p.strokeWeight(active ? 2.5 : 1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 9);
        p.noStroke(); p.fill(on ? C.ink : C.mute); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD);
        fitText(p, label, b.x + b.w / 2, b.y + b.h / 2, b.w - 8, 14);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], A = apply(r.M, ops[cur]), n = cols(r), done = meets(A, r);
        drawTabs(p, C, tabs, cur, i => {
          const g = meets(apply(params.rounds[i].M, ops[i]), params.rounds[i]);
          return locked ? (g ? C.ok : C.bad) : i === cur ? C.brand : ops[i].length ? C.Z : C.line;
        });
        p.noStroke(); p.fill(C.mute); p.textAlign(p.RIGHT, p.CENTER); p.textStyle(p.BOLD); p.textSize(12);
        p.text(r.goal === 'reducida' ? 'meta: reducida' : 'meta: escalonada', W - 12, 23);
        // Matriz.
        const show = locked && !done ? rref(r.M, n) : A;
        const gx = L.gx, gw = L.cw * r.M[0].length, top = L.top, hgt = r.M.length * L.rowH - 6;
        p.stroke(locked ? (done ? C.ok : C.bad) : done ? C.ok : C.line); p.strokeWeight(1.5); p.fill(C.card); p.rect(gx - 4, top - 4, gw + 8, hgt + 8, 10);
        if (r.aug) { p.stroke(C.mute); p.strokeWeight(1.5); p.line(gx + n * L.cw, top, gx + n * L.cw, top + hgt); }
        L.rows.forEach((b, i) => {
          const s = i === selI ? C.brand : i === selJ ? C.Z : C.line;
          p.stroke(s); p.strokeWeight(i === selI || i === selJ ? 2.5 : 1.5); p.fill(C.card); p.rect(b.x, b.y, b.w, b.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(`R${i + 1}`, b.x + b.w / 2, b.y + b.h / 2);
          show[i].forEach((v, c) => {
            const pivot = c < n && c === lead(show[i], n);
            p.fill(locked && !done ? C.ok : pivot ? C.brand : F.zero(v) ? C.mute : C.ink);
            p.textStyle(pivot ? p.BOLD : p.NORMAL);
            fitText(p, F.txt(v), gx + (c + 0.5) * L.cw, b.y + b.h / 2, L.cw - 4, 16);
          });
        });
        // Determinante.
        p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13);
        if (r.det) {
          const f = detFactor(ops[cur]);
          p.fill(done ? C.ok : C.N);
          fitText(p, F.one(f) ? 'det A = det(actual)' : `det A = ${F.txt(f)} · det(actual)`, W / 2, L.info, W - 24, 13);
        } else { p.fill(done ? C.ok : C.mute); p.text(done ? '¡Meta cumplida!' : `${ops[cur].length} ${ops[cur].length === 1 ? 'operación' : 'operaciones'}`, W / 2, L.info); }
        // Operación.
        L.modes.forEach((b, i) => button(b, MODES[i].name, !locked, i === mode));
        const o = curOp();
        p.noStroke(); p.fill(o ? C.ink : C.mute); p.textStyle(p.BOLD); fitText(p, opTxt(o), W / 2, L.preview, W - 24, 16);
        const needK = MODES[mode].t !== 'swap';
        [['k arriba', kn, L.kn], ['k abajo', kd, L.kd]].forEach(([lab, val, K]) => {
          button(K.minus, '−', needK && !locked); button(K.plus, '+', needK && !locked);
          p.noStroke(); p.fill(needK ? C.ink : C.mute); p.textStyle(p.BOLD); p.textSize(17); p.text(String(val).replace('-', '−'), K.minus.x + (K.plus.x + K.plus.w - K.minus.x) / 2, K.y + 13);
          p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(10); p.text(lab, K.minus.x + (K.plus.x + K.plus.w - K.minus.x) / 2, K.y + 30);
        });
        button(L.undo, 'Deshacer', !locked && ops[cur].length > 0);
        button(L.go, 'Aplicar', !locked && !!o && !isNull(o));
      };

      p.mousePressed = () => {
        const x = p.mouseX, y = p.mouseY;
        const tb = tabs.findIndex(t => hitBox(t, x, y));
        if (tb >= 0) { cur = tb; selI = selJ = null; layout(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const mi = L.modes.findIndex(b => hitBox(b, x, y));
        if (mi >= 0) { mode = mi; selJ = MODES[mi].t === 'scale' ? null : selJ; api.sfx?.tap?.(); return false; }
        const ri = L.rows.findIndex(b => hitBox({ x: b.x, y: b.y, w: W - 24, h: b.h }, x, y));
        if (ri >= 0) {
          if (selI == null || MODES[mode].t === 'scale') selI = ri;
          else if (ri === selI) { selI = null; selJ = null; }
          else selJ = ri;
          api.sfx?.tap?.(); return false;
        }
        const step = (K, d, get, set) => { if (hitBox(K.minus, x, y)) { set(get() - 1); return true; } if (hitBox(K.plus, x, y)) { set(get() + 1); return true; } return false; };
        if (MODES[mode].t !== 'swap') {
          if (step(L.kn, 1, () => kn, v => { kn = Math.max(-12, Math.min(12, v)); })) { api.sfx?.tap?.(); return false; }
          if (step(L.kd, 1, () => kd, v => { kd = Math.max(1, Math.min(12, v)); })) { api.sfx?.tap?.(); return false; }
        }
        if (hitBox(L.undo, x, y) && ops[cur].length) { ops[cur].pop(); api.sfx?.tap?.(); api.ready(ops.every(o => o.length)); return false; }
        if (hitBox(L.go, x, y)) {
          const o = curOp();
          if (!o || isNull(o)) return false;
          ops[cur].push(o); selI = selJ = null; api.sfx?.tap?.(); api.ready(ops.every(o2 => o2.length));
          return false;
        }
      };
    }, Math.max(...params.rounds.map(r => (264 + 38 * r.M.length) / 256))); // cabe entero aun con 256 px de ancho

    return {
      loaded: m.ready,
      getState: () => ({ ops: ops.map(o => o.map(x => ({ ...x }))) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, F, apply, isEchelon, isReduced, rref, detFactor, det };
})();
