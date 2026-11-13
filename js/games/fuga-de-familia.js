// La fuga de la familia (Álgebra 1.1, por qué se amplían los números): cada ronda es la casa de una familia
// (ℕ, ℤ, 𝕀…) con fichas que viven en ella y una operación fija. Hay que meter dos fichas en la máquina
// (a ∘ b, en orden) para que el resultado se ESCAPE de la casa: 3 − 8 no es natural, 12 ÷ 5 no es entero,
// √2 + (5 − √2) = 5 ya no es irracional. Si el resultado se queda adentro, rebota contra la pared.
// Las fichas valen r + k√2 (k = 0 para los racionales), así la cuenta es exacta.
// params = { rounds: [{ set: 'N'|'Z'|'Q'|'I', op: '+'|'−'|'×'|'÷', tiles: [{ label, r, k }] }] }
// state = { picks: [[i, j]] }

GAMES['fuga-de-familia'] = (() => {
  const EPS = 1e-9;
  const SETS = { N: { sym: 'ℕ', name: 'naturales', col: 'N' }, Z: { sym: 'ℤ', name: 'enteros', col: 'Z' }, Q: { sym: 'ℚ', name: 'racionales', col: 'Q' }, I: { sym: '𝕀', name: 'irracionales', col: 'I' } };
  const clean = x => (Math.abs(x - Math.round(x)) < EPS ? Math.round(x) : x);

  // a ∘ b con a = r₁ + k₁√2, b = r₂ + k₂√2. La división solo entre fichas racionales (k₂ = 0, b ≠ 0).
  function combine(a, b, op) {
    let r, k;
    if (op === '+') { r = a.r + b.r; k = a.k + b.k; }
    else if (op === '−') { r = a.r - b.r; k = a.k - b.k; }
    else if (op === '×') { r = a.r * b.r + 2 * a.k * b.k; k = a.r * b.k + b.r * a.k; }
    else { if (b.k !== 0 || Math.abs(b.r) < EPS) return null; r = a.r / b.r; k = a.k / b.r; }
    return { r: clean(r), k: clean(k) };
  }
  function inSet(v, set) {
    if (!v) return false;
    const rational = Math.abs(v.k) < EPS, integer = rational && Number.isInteger(v.r);
    if (set === 'I') return !rational;
    if (set === 'Q') return rational;
    if (set === 'Z') return integer;
    return integer && v.r >= 1;
  }
  const escapes = (round, pk) => {
    if (!pk || pk.length !== 2 || pk[0] === pk[1]) return false;
    const v = combine(round.tiles[pk[0]], round.tiles[pk[1]], round.op);
    return !!v && !inSet(v, round.set);
  };
  function valText(v) {
    if (!v) return '—';
    const num = x => { const s = String(+x.toFixed(4)); return s.replace('-', '−'); };
    if (Math.abs(v.k) < EPS) return num(v.r);
    const kk = Math.abs(v.k) === 1 ? '' : num(Math.abs(v.k));
    if (Math.abs(v.r) < EPS) return (v.k < 0 ? '−' : '') + kk + '√2';
    return `${num(v.r)} ${v.k < 0 ? '−' : '+'} ${kk}√2`;
  }
  const paren = t => (/[ ]/.test(t.label) || t.label.startsWith('−') ? `(${t.label})` : t.label);
  function example(round) {
    const n = round.tiles.length;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (escapes(round, [i, j])) return [i, j];
    return null;
  }

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => escapes(r, state.picks?.[i]));
    const solution = params.rounds.map(r => {
      const e = example(r);
      if (!e) return '';
      const v = combine(r.tiles[e[0]], r.tiles[e[1]], r.op);
      return `${paren(r.tiles[e[0]])} ${r.op} ${paren(r.tiles[e[1]])} = ${valText(v)} (no es ${SETS[r.set].sym})`;
    }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { picks: R.map(() => []) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tray = [], house = null, slots = [], fly = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length);
      house = { x: 14, y: 98, w: w - 28, h: h * 0.4 };
      const sw = Math.min(78, (house.w - 90) / 2);
      slots = [0, 1].map(k => ({ x: w / 2 - sw - 26 + k * (sw + 52), y: house.y + house.h * 0.38, w: sw, h: 42 }));
      placeTray();
    }
    function placeTray() {
      const tiles = R[cur].tiles, cols = Math.min(4, tiles.length), tw = (W - 28 - (cols - 1) * 10) / cols, th = 42;
      const rows = Math.ceil(tiles.length / cols), y0 = H - rows * (th + 10) - 26;
      tray = tiles.map((_, i) => ({ x: 14 + (i % cols) * (tw + 10), y: y0 + Math.floor(i / cols) * (th + 10), w: tw, h: th }));
    }
    const ready = () => api.ready(st.picks.every(pk => pk.length === 2));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      const chip = (b, t, fill) => drawTile(p, C, b, t.label, { fill, size: 18 });

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], S = SETS[r.set], fam = C[S.col], pk = st.picks[cur];
        drawTabs(p, C, tabs, cur, i => (locked ? (escapes(R[i], st.picks[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.picks[i].length === 2 ? C.Z : C.line));
        drawKicker(p, C, `Sal de los ${S.name}`, W / 2, 56, { center: true });

        // La casa de la familia: techo y paredes con el color de la familia.
        const hb = house, roofH = 26;
        // Paredes de tarjeta y techo relleno con el color de la familia (formas planas, como en los videos).
        p.stroke(fam); p.strokeWeight(3); p.fill(C.card); p.rect(hb.x, hb.y + roofH, hb.w, hb.h - roofH, 0, 0, 14, 14);
        p.noStroke(); p.fill(fam); p.triangle(hb.x - 6, hb.y + roofH + 1.5, hb.x + hb.w / 2, hb.y - 2, hb.x + hb.w + 6, hb.y + roofH + 1.5);
        p.fill(inkOn(fam, C.ink)); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER); p.textSize(15);
        p.text(`casa ${S.sym}`, hb.x + hb.w / 2, hb.y + roofH * 0.66);

        // La máquina: a ∘ b
        slots.forEach((s, k) => {
          if (pk[k] != null) chip(s, r.tiles[pk[k]], C.sun);
          else drawSlot(p, C, s);
        });
        p.noStroke(); p.fill(C.ink); p.textSize(22); p.textStyle(p.BOLD);
        p.text(r.op, W / 2, slots[0].y + slots[0].h / 2);
        const v = pk.length === 2 ? combine(r.tiles[pk[0]], r.tiles[pk[1]], r.op) : null;
        const out = pk.length === 2 && pk[0] !== pk[1] && !!v && !inSet(v, r.set);
        if (pk.length === 2) {
          fly = Math.min(1, fly + 0.04);
          const txt = v ? `= ${valText(v)}` : 'no se divide entre 0';
          // El resultado sube: si se escapa, atraviesa el techo; si no, rebota adentro.
          const y0 = slots[0].y + 64, yTop = out ? hb.y - 14 : hb.y + roofH + 22;
          const e = 1 - (1 - fly) ** 3, y = y0 + (yTop - y0) * e - (out ? 0 : Math.sin(fly * Math.PI) * 6);
          drawPill(p, C, txt, W / 2, out ? Math.max(y, 80) : y0, out ? C.ok : C.bad, 18);
          p.textSize(12); p.textStyle(p.NORMAL); p.fill(out ? C.ok : C.mute);
          p.text(out ? `¡Se escapó! No es de los ${S.name}` : v ? `Sigue siendo de los ${S.name}: rebota` : 'Prueba con otro divisor', W / 2, hb.y + hb.h - 16);
        } else {
          fly = 0;
          p.textStyle(p.NORMAL); p.textSize(12); p.fill(C.mute);
          p.text('Toca dos fichas: la primera va a la izquierda', W / 2, hb.y + hb.h - 16);
        }

        tray.forEach((b, i) => {
          if (pk.includes(i)) drawSlot(p, C, b);
          else chip(b, r.tiles[i], C.cream);
        });
        p.noStroke(); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.CENTER, p.CENTER);
        if (locked && !escapes(r, pk)) {
          const e = example(r);
          p.fill(C.ok); p.textStyle(p.BOLD);
          fitText(p, e ? `Por ejemplo: ${paren(r.tiles[e[0]])} ${r.op} ${paren(r.tiles[e[1]])} = ${valText(combine(r.tiles[e[0]], r.tiles[e[1]], r.op))}` : '', W / 2, H - 12, W - 24, 12);
        } else { p.fill(C.mute); p.text('Toca una ficha de la máquina para sacarla', W / 2, H - 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; placeTray(); fly = 0; api.sfx?.tap?.(); return false; }
        if (locked) return;
        const pk = st.picks[cur];
        const s = slots.findIndex((b, k) => pk[k] != null && hitBox(b, p.mouseX, p.mouseY));
        if (s >= 0) { pk.splice(s, 1); fly = 0; api.sfx?.tap?.(); ready(); return false; }
        const i = tray.findIndex((b, i) => !pk.includes(i) && hitBox(b, p.mouseX, p.mouseY));
        if (i >= 0 && pk.length < 2) { pk.push(i); fly = 0; api.sfx?.tap?.(); ready(); return false; }
      };
    }, 1.3);

    return {
      loaded: m.ready,
      getState: () => ({ picks: st.picks.map(pk => [...pk]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, combine, inSet };
})();
