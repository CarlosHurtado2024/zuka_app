// Saca factores del radical (lección 1.2.b): el radicando aparece como sus factores primos, fichas
// dentro del signo de raíz. Tocar `index` fichas iguales (dos para raíz cuadrada, tres para cúbica)
// las saca como un solo factor afuera; tocar un factor de afuera lo devuelve. Rondas con pestañas.
// params = { rounds: [{ index, n }] }   state = { rounds: [{ out: [primos sacados], in: [primos que quedan] }] }

GAMES['saca-del-radical'] = (() => {
  function primes(n) {
    const out = [];
    for (let d = 2; d * d <= n; d++) while (n % d === 0) { out.push(d); n /= d; }
    if (n > 1) out.push(n);
    return out;
  }
  // Forma simplificada: coeficiente afuera y radicando adentro.
  function simplify(index, n) {
    const counts = {};
    primes(n).forEach(p => { counts[p] = (counts[p] || 0) + 1; });
    let out = 1, inside = 1;
    for (const p of Object.keys(counts).map(Number)) { out *= p ** Math.floor(counts[p] / index); inside *= p ** (counts[p] % index); }
    return { out, in: inside };
  }
  const prod = a => a.reduce((x, y) => x * y, 1);
  const rootTex = (index, inside, out) => `${out === 1 ? '' : out}${inside === 1 ? '' : (index === 2 ? '\\sqrt{' : `\\sqrt[${index}]{`) + inside + '}'}` || '1';

  function grade(state, params) {
    const ok = params.rounds.every((r, k) => {
      const want = simplify(r.index, r.n), st = state.rounds[k];
      return st && prod(st.out) === want.out && prod(st.in) === want.in;
    });
    const solution = params.rounds.map(r => { const w = simplify(r.index, r.n); return `$${rootTex(r.index, r.n, 1)} = ${rootTex(r.index, w.in, w.out)}$`; }).join(' · ');
    return { ok, solution };
  }

  function create(host, params, api) {
    const C = api.palette;
    const st = { rounds: params.rounds.map(r => ({ out: [], in: primes(r.n) })) };
    let locked = false, W = 0, H = 0, cur = 0, tabs = [], tiles = [], outTiles = [], sel = [];

    function layout(w, h) {
      W = w; H = h;
      tabs = params.rounds.map((_, i) => ({ x: 12 + i * 52, y: 8, w: 44, h: 30 }));
      const r = st.rounds[cur], tw = 40, gap = 8;
      const x0 = 70 + Math.max(0, (w - 70 - 12 - r.in.length * (tw + gap)) / 2);
      tiles = r.in.map((_, i) => ({ x: x0 + i * (tw + gap), y: h * 0.52, w: tw, h: tw }));
      outTiles = r.out.map((_, i) => ({ x: 20 + i * (tw + gap), y: h * 0.52 - 62, w: tw, h: tw }));
    }
    const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
    const ready = () => api.ready(st.rounds.every((r, k) => r.out.length > 0 || simplify(params.rounds[k].index, params.rounds[k].n).out === 1));

    const m = mountSketch(host, (p, size) => {
      p.setup = () => { p.createCanvas(size.w, size.h); p.textFont('system-ui'); layout(size.w, size.h); };
      p.onResize = () => layout(size.w, size.h);

      function tile(b, v, col, fill = C.card) {
        p.stroke(col); p.strokeWeight(2); p.fill(fill); p.rect(b.x, b.y, b.w, b.h, 8);
        p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(16); p.text(v, b.x + b.w / 2, b.y + b.h / 2);
      }

      p.draw = () => {
        p.background(C.bg);
        const r = params.rounds[cur], s = st.rounds[cur], want = simplify(r.index, r.n), good = prod(s.out) === want.out && prod(s.in) === want.in;
        tabs.forEach((t, i) => {
          const w = simplify(params.rounds[i].index, params.rounds[i].n), si = st.rounds[i], ok = prod(si.out) === w.out && prod(si.in) === w.in;
          const col = locked ? (ok ? C.ok : C.bad) : i === cur ? C.brand : si.out.length ? C.Z : C.line;   // tocada ≠ correcta: el verde solo al bloquear
          p.stroke(col); p.strokeWeight(i === cur ? 2.5 : 1.5); p.fill(C.card); p.rect(t.x, t.y, t.w, t.h, 8);
          p.noStroke(); p.fill(C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(13); p.text(i + 1, t.x + t.w / 2, t.y + t.h / 2);
        });
        p.noStroke(); p.fill(C.N); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(14);
        p.text(`${r.index === 2 ? '√' : '∛'}${r.n}: toca ${r.index} fichas iguales para sacarlas`, 12, 44, W - 24, 34);
        // El signo de raíz: una «v» y una línea sobre las fichas de adentro.
        const y = H * 0.52, left = tiles.length ? tiles[0].x - 6 : 70, right = tiles.length ? tiles[tiles.length - 1].x + 46 : W - 12;
        p.stroke(C.ink); p.strokeWeight(3); p.noFill();
        p.line(left - 22, y + 20, left - 12, y + 44); p.line(left - 12, y + 44, left - 2, y - 8); p.line(left - 2, y - 8, right + 4, y - 8);
        if (r.index !== 2) { p.noStroke(); p.fill(C.ink); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text(r.index, left - 20, y + 10); }
        p.noStroke(); p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL); p.textAlign(p.LEFT, p.BOTTOM); p.text('afuera', 20, y - 66); p.text('adentro', left - 2, y - 14);
        s.in.forEach((v, i) => tile(tiles[i], v, sel.includes(i) ? C.brand : locked ? (good ? C.ok : C.bad) : C.Z));
        s.out.forEach((v, i) => tile(outTiles[i], v, locked ? (good ? C.ok : C.bad) : C.N));
        if (!s.in.length) { p.noStroke(); p.fill(C.mute); p.textSize(14); p.textAlign(p.LEFT, p.CENTER); p.text('1', left + 10, y + 20); }
        // Resultado en vivo.
        p.noStroke(); p.fill(locked ? (good ? C.ok : C.bad) : C.ink); p.textAlign(p.CENTER, p.CENTER); p.textStyle(p.BOLD); p.textSize(20);
        const outV = prod(s.out), inV = prod(s.in);
        p.text(`${outV === 1 ? '' : outV}${inV === 1 ? '' : (r.index === 2 ? '√' : '∛') + inV}` || '1', W / 2, y + 90);
        if (locked && !good) { p.fill(C.ok); p.textSize(14); p.text(`era ${want.out === 1 ? '' : want.out}${want.in === 1 ? '' : (r.index === 2 ? '√' : '∛') + want.in}`, W / 2, y + 116); }
        p.fill(C.mute); p.textSize(11); p.textStyle(p.NORMAL);
        const pend = st.rounds.findIndex((o, k) => k !== cur && !o.out.length && simplify(params.rounds[k].index, params.rounds[k].n).out !== 1);
        p.text(locked ? (grade(st, params).ok ? '¡Radicales simplificados!' : 'Mira la forma correcta en verde') : sel.length ? `${sel.length} de ${r.index} seleccionadas` : s.out.length && pend >= 0 ? `Toca la pestaña ${pend + 1} para el siguiente radical` : 'Toca un factor de afuera para devolverlo', 12, H - 22, W - 24, 20);
      };

      p.mousePressed = () => {
        const t = tabs.findIndex(t => inside(t, p.mouseX, p.mouseY));
        if (t >= 0) { cur = t; sel = []; layout(W, H); api.sfx?.tap?.(); return false; }
        if (locked) return;
        const r = params.rounds[cur], s = st.rounds[cur];
        const o = outTiles.findIndex(b => inside(b, p.mouseX, p.mouseY));
        if (o >= 0) { const v = s.out.splice(o, 1)[0]; for (let k = 0; k < r.index; k++) s.in.push(v); s.in.sort((a, b) => a - b); sel = []; layout(W, H); ready(); return false; }
        const i = tiles.findIndex(b => inside(b, p.mouseX, p.mouseY));
        if (i < 0) return;
        if (sel.includes(i)) { sel = sel.filter(k => k !== i); return false; }
        if (sel.length && s.in[sel[0]] !== s.in[i]) { sel = [i]; return false; }   // solo se agrupan iguales
        sel.push(i);
        if (sel.length === r.index) {
          const v = s.in[i];
          sel.sort((a, b) => b - a).forEach(k => s.in.splice(k, 1));
          s.out.push(v); s.out.sort((a, b) => a - b); sel = []; layout(W, H); api.sfx?.tap?.(); ready();
        }
        return false;
      };
    }, 1.0);

    return {
      loaded: m.ready,
      getState: () => ({ rounds: st.rounds.map(r => ({ out: [...r.out], in: [...r.in] })) }),
      lock() { locked = true; sel = []; },
      destroy: () => m.remove(),
    };
  }

  return { grade, create, primes, simplify };
})();
