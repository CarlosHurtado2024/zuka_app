// La x dentro del operador (Preuniversitario, pu-op-2; spec 2026-11-18-preuda-razonamiento-completo): una ecuación como
// x ⊕ 4 = 19 se resuelve reemplazando el operador por su regla. Se desliza x; el juego escribe la regla con x ya puesta, su
// valor, y lo compara con el lado derecho en una balanza que se inclina hasta quedar pareja.
// params = { rounds: [{ sym, tex, f(a, b), k, side: 'left' | 'right', target, lo, hi }] }   state = { rounds: [{ x }] }
GAMES['busca-x-operador'] = (() => {
  const val = (r, x) => (r.side === 'right' ? r.f(r.k, x) : r.f(x, r.k));
  const need = r => { for (let x = r.lo; x <= r.hi; x++) if (val(r, x) === r.target) return x; return null; };
  const ok = (s, r) => val(r, s.x) === r.target;
  const N = r => r.hi - r.lo + 1;
  const eq = r => (r.side === 'right' ? `${r.k} ${r.sym} x` : `x ${r.sym} ${r.k}`);
  const sub = (r, a, b) => r.tex.replace(/(?<![\\a-zA-Z])a(?![a-zA-Z])/g, `(${a})`).replace(/(?<![\\a-zA-Z(])b(?![a-zA-Z])/g, `(${b})`).replace(/(\d)\(/g, '$1\\cdot(');
  const show = (r, x) => (r.side === 'right' ? sub(r, r.k, x) : sub(r, x, r.k));
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ x: need(r) === r.lo ? r.lo + 1 : r.lo }),
    ok,
    solution: r => `x = ${need(r)}`,
    prompt: r => `Con $a ${r.sym} b = ${r.tex}$, halla $x$: $${eq(r)} = ${r.target}$`,
    foot: () => 'Desliza x hasta que la balanza quede pareja',
    layout(G) { G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { x: need(r) } : G.s, good = ok(s, r), v = val(r, s.x), cx = G.W / 2, cy = 200;
      const ang = Math.max(-0.3, Math.min(0.3, (r.target - v) * 0.03));
      p.noStroke(); p.fill(C.ink); p.triangle(cx, cy, cx - 14, cy + 40, cx + 14, cy + 40);
      p.push(); p.translate(cx, cy); p.rotate(ang);
      p.stroke(C.ink); p.strokeWeight(3); p.line(-G.W * 0.38, 0, G.W * 0.38, 0);
      [[-G.W * 0.28, `$${show(r, s.x)} = ${v}$`, good ? C.ok : C.brand], [G.W * 0.28, `$${r.target}$`, C.coral]].forEach(([x, t, col]) => {
        p.stroke(C.line); p.strokeWeight(1); p.line(x, 0, x, 22); p.noStroke(); p.fill(RK.al(p, col, 60)); p.rect(x - 62, 22, 124, 34, 8);
        TK.label(p, C, t, x, 39, C.ink, 12, 118);
      });
      p.pop();
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, N(r), s.x - r.lo, k => ((r.lo + k) % 2 === 0 ? String(r.lo + k) : null), good ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$x = ${s.x}$`, { kicker: good ? 'la balanza queda pareja' : v < r.target ? 'falta peso a la izquierda' : 'sobra peso a la izquierda', col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 28) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.x - G.r.lo), y: G.tY }, to: { x: G.X(G.s.x - G.r.lo) + 60, y: G.tY }, text: 'Desliza x', ty: G.tY - 30 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const r = G.r, v = r.lo + RK.pick(x, 30, G.W - 30, N(r)); if (v !== G.s.x || !G.touched[G.cur]) { G.s.x = v; G.touch(); } };
  return Object.assign(game, { answer: r => ({ x: need(r) }) });
})();
