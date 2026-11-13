// Arma la notación (Álgebra 0, cómo se escribe un conjunto): cada ronda describe un conjunto con palabras
// («los colores de la bandera de Colombia») y hay fichas con el nombre, «=», llaves, comas, elementos y algunas
// trampas («(», «[», elementos que no van). Se tocan las fichas en orden para escribir el conjunto por extensión
// en la pizarra; «⌫» borra la última. Vale cualquier orden de los elementos, pero sin repetir y con las comas
// entre ellos. Las fichas se pueden usar varias veces (las comas se necesitan muchas).
// params = { rounds: [{ prompt, name, members: [etiquetas], chips: [etiquetas] }] }   state = { seqs: [[índice de ficha]] }

GAMES['arma-notacion'] = (() => {
  const SYMS = ['=', '{', '}', ',', '(', ')', '[', ']'];
  // Lee una secuencia de etiquetas como «N = { a , b }»; devuelve { name, elems } o null si la forma está mal.
  function parse(labels) {
    if (labels.length < 4 || labels[1] !== '=' || labels[2] !== '{' || labels[labels.length - 1] !== '}') return null;
    const inner = labels.slice(3, -1), elems = [];
    for (let k = 0; k < inner.length; k++) {
      const isComma = inner[k] === ',';
      if (k % 2 === 1 ? !isComma : isComma || ['=', '{', '}', '(', ')', '[', ']'].includes(inner[k])) return null;
      if (k % 2 === 0) elems.push(inner[k]);
    }
    if (inner.length && inner.length % 2 === 0) return null;   // termina en coma
    return { name: labels[0], elems };
  }
  const labelsOf = (seq, r) => (seq || []).map(i => r.chips[i]);
  function good(seq, r) {
    const p = parse(labelsOf(seq, r));
    return !!p && p.name === r.name && p.elems.length === r.members.length && new Set(p.elems).size === p.elems.length && r.members.every(m => p.elems.includes(m));
  }
  const setText = r => `${r.name} = {${r.members.join(', ')}}`;

  function grade(state, params) {
    const ok = params.rounds.every((r, i) => good(state.seqs?.[i], r));
    return { ok, solution: params.rounds.map(setText).join(' · ') };
  }

  function create(host, params, api) {
    const C = api.palette, R = params.rounds;
    const st = { seqs: R.map(() => []) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], board = null, chipBoxes = [], back = null, flash = 0;

    function layout(w, h) {
      W = w; H = h;
      tabs = roundTabs(R.length, w);
      board = { x: 14, y: 96, w: w - 28, h: 72 };
      back = { x: w - 14 - 54, y: board.y + board.h + 8, w: 54, h: 30 };
      placeChips();
    }
    function placeChips() {
      const chips = R[cur].chips, gap = 6, rowH = 36;
      let x = 14, y = back.y + 42;
      chipBoxes = chips.map(label => {
        const short = SYMS.includes(label) || label.length <= 1;
        const w = short ? 36 : Math.min(W - 28, 22 + label.length * 9);
        if (x + w > W - 14) { x = 14; y += rowH + gap; }
        const b = { x, y, w, h: rowH }; x += w + gap; return b;
      });
    }
    const ready = () => api.ready(st.seqs.every(s => s.length > 0));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      p.draw = () => {
        p.background(C.bg);
        const r = R[cur], seq = st.seqs[cur], ok = good(seq, r), labels = labelsOf(seq, r);
        drawTabs(p, C, tabs, cur, i => (locked ? (good(st.seqs[i], R[i]) ? C.ok : C.bad) : i === cur ? C.brand : st.seqs[i].length ? C.Z : C.line));
        p.noStroke(); p.fill(C.ink); p.textStyle(p.NORMAL); p.textSize(13); p.textAlign(p.LEFT, p.TOP);
        p.text(r.prompt, 14, 46, W - 28, 54);
        // Pizarra
        const col = locked ? (ok ? C.ok : C.bad) : C.line;
        p.stroke(col); p.strokeWeight(2); p.fill(C.card); p.rect(board.x, board.y, board.w, board.h, 12);
        p.noStroke(); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.CENTER);
        const text = labels.length ? labels.map(l => (l === ',' ? ',' : ` ${l}`)).join('').replace(/\{ /g, '{').replace(/ \}/g, '}').trim() : '';
        flash = Math.max(0, flash - 0.05);
        p.fill(labels.length ? C.ink : C.mute);
        fitText(p, text || 'Toca las fichas en orden', W / 2, board.y + board.h / 2, board.w - 20, labels.length ? 22 : 13);
        // Borrar
        drawTile(p, C, back, '⌫', { fill: locked ? C.card : C.sky, ink: locked ? C.mute : undefined, r: 8, lift: 2, size: 15 });
        p.fill(C.mute); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.LEFT, p.CENTER);
        fitText(p, 'Las fichas se pueden usar varias veces', 14, back.y + back.h / 2, back.x - 24, 11);
        // Fichas
        chipBoxes.forEach((b, i) => {
          const lab = r.chips[i], sym = SYMS.includes(lab);
          // Fichas crema; los signos de la notación ({ } , …), color sol.
          drawTile(p, C, b, lab, { fill: sym ? C.sun : C.cream, r: 9, lift: 2, size: sym ? 20 : 15 });
        });
        p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.CENTER, p.CENTER);
        if (locked && !ok) { p.fill(C.ok); fitText(p, `Así: ${setText(r)}`, W / 2, H - 12, W - 24, 12); }
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; placeChips(); api.sfx?.tap?.(); return false; }
        if (locked) return;
        if (hitBox(back, p.mouseX, p.mouseY)) { st.seqs[cur].pop(); ready(); api.sfx?.tap?.(); return false; }
        const i = chipBoxes.findIndex(b => hitBox(b, p.mouseX, p.mouseY));
        if (i >= 0 && st.seqs[cur].length < 30) { st.seqs[cur].push(i); flash = 1; ready(); api.sfx?.tap?.(); return false; }
      };
    }, 1.7);

    return {
      loaded: m.ready,
      getState: () => ({ seqs: st.seqs.map(s => [...s]) }),
      lock() { locked = true; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, parse };
})();
