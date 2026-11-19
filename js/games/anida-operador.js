// Operador anidado (Preuniversitario, pu-op-2; spec 2026-11-18-preuda-razonamiento-completo): una operación anidada como
// (3 ★ 1) ★ 4 se dibuja como cajas dentro de cajas. Se toca una caja para calcularla: solo se puede si adentro ya no quedan
// cajas sin calcular; entonces se cierra y queda su resultado. Así se ve que se resuelve de adentro hacia afuera.
// params = { rounds: [{ sym, tex, f(a, b), expr: número | [izq, der] }] }   state = { rounds: [{ done: [rutas calculadas] }] }
GAMES['anida-operador'] = (() => {
  const nodes = (e, path = '') => (Array.isArray(e) ? [...nodes(e[0], path + '0'), ...nodes(e[1], path + '1'), path] : []);
  const ok = (s, r) => s.done.includes('');
  const game = roundsGame({
    aspect: 1.05,
    init: () => ({ done: [] }),
    answered: s => s.done.length > 0,
    ok,
    solution: r => { const out = []; const ev = e => { if (!Array.isArray(e)) return e; const a = ev(e[0]), b = ev(e[1]), v = r.f(a, b); out.push(`$${a} ${r.sym} ${b} = ${v}$`); return v; }; ev(r.expr); return out.join('; '); },
    prompt: r => `Con $a ${r.sym} b = ${r.tex}$, calcula de adentro hacia afuera`,
    foot: () => 'Toca la caja que ya se puede calcular',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.msg = 0; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { done: nodes(r.expr) } : G.s, good = ok(s, r), D = new Set(s.done);
      const val = e => (Array.isArray(e) ? r.f(val(e[0]), val(e[1])) : e);
      const closed = (e, path) => !Array.isArray(e) || D.has(path);
      p.textSize(16); p.textFont('Jost');
      const tw = t => p.textWidth(String(t)) + 14;
      const meas = (e, path) => (closed(e, path) ? tw(val(e)) : 16 + meas(e[0], path + '0') + 26 + meas(e[1], path + '1'));
      const cols = [C.sky, C.coral, C.mint, C.brand];
      G.boxes = [];
      const draw = (e, path, x, y, h, dep) => {
        if (closed(e, path)) {
          const w = tw(val(e)), fresh = Array.isArray(e);
          p.noStroke(); p.fill(fresh ? RK.al(p, C.ok, 90) : RK.al(p, C.card, 220)); p.rect(x, y - 14, w, 28, 6);
          TK.label(p, C, String(val(e)), x + w / 2, y, C.ink, 15, w);
          return w;
        }
        const w = meas(e, path);
        p.stroke(cols[dep % 4]); p.strokeWeight(2); p.fill(RK.al(p, cols[dep % 4], 30)); p.rect(x, y - h / 2, w, h, 10);
        G.boxes.push({ x, y: y - h / 2, w, h, path, ready: closed(e[0], path + '0') && closed(e[1], path + '1') });
        let cx = x + 8;
        cx += draw(e[0], path + '0', cx, y, h - 14, dep + 1);
        TK.label(p, C, `$${r.sym}$`, cx + 13, y, C.ink, 15, 24); cx += 26;
        draw(e[1], path + '1', cx, y, h - 14, dep + 1);
        return w;
      };
      const W0 = meas(r.expr, ''), depth = (e => { const d = x => (Array.isArray(x) ? 1 + Math.max(d(x[0]), d(x[1])) : 0); return d(e); })(r.expr);
      draw(r.expr, '', Math.max(10, (G.W - W0) / 2), 190, 40 + depth * 14, 0);
      if (G.msg > 0) { G.msg -= p.deltaTime || 16; TK.label(p, C, 'primero lo de adentro', G.W / 2, 270, C.bad, 12, G.W - 30); }
      RK.strip(p, C, G.fb, good ? `$\\text{resultado: ${val(r.expr)}}$` : `$\\text{${s.done.length} de ${nodes(r.expr).length} cajas}$`, { col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const hit = (G.boxes || []).filter(b => hitBox(b, x, y)).sort((a, b) => b.path.length - a.path.length)[0];
      if (!hit) return false;
      if (hit.ready) { G.s.done.push(hit.path); G.touch(); } else G.msg = 1400;
      return true;
    },
    demo: G => { const b = (G.boxes || []).slice().sort((a, c) => c.path.length - a.path.length)[0]; return b ? { from: { x: b.x + 10, y: b.y + b.h / 2 }, to: { x: b.x + 10, y: b.y + b.h / 2 }, text: 'Toca la caja de adentro', ty: b.y + b.h + 40 } : null; },
    peek: G => ({ boxes: G.boxes }),
  });
  return Object.assign(game, { answer: r => ({ done: nodes(r.expr) }) });
})();
