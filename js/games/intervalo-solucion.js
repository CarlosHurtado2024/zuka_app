// La solución de una desigualdad (Preuniversitario, pu-ec-3; spec 2026-11-18-preuda-razonamiento-completo): en la recta se
// arrastra el punto frontera, se toca el punto para dejarlo abierto o cerrado (si entra o no) y se toca un lado de la recta
// para pintar hacia dónde van las soluciones. El juego prueba en vivo un número del lado pintado en la desigualdad original.
// params = { rounds: [{ tex, f(x) → bool, lo, hi }] }   (la solución es un rayo con frontera entera)
// state = { rounds: [{ b, closed, dir }] }   (dir: −1 izquierda, 1 derecha, 0 sin pintar)
GAMES['intervalo-solucion'] = (() => {
  const need = r => { for (let b = r.lo; b <= r.hi; b++) { const L = r.f(b - 0.5), R = r.f(b + 0.5); if (L !== R) return { b, closed: !!r.f(b), dir: R ? 1 : -1 }; } return null; };
  const ok = (s, r) => { const n = need(r); return s.b === n.b && s.closed === n.closed && s.dir === n.dir; };
  const sym = s => (s.dir > 0 ? (s.closed ? '\\ge' : '>') : (s.closed ? '\\le' : '<'));
  const game = roundsGame({
    aspect: 1.05,
    init: r => ({ b: need(r).b === 0 ? 1 : 0, closed: false, dir: 0 }),
    answered: s => s.dir !== 0,
    ok,
    solution: r => { const n = need(r); return `$x ${sym(n)} ${n.b}$`; },
    prompt: r => `Pinta la solución de $${r.tex}$`,
    foot: () => 'Arrastra la frontera, toca el punto y toca el lado que va',
    layout(G) { G.ax = { x0: 24, x1: G.W - 24, y: 190 }; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? need(r) : G.s, good = ok(s, r), ax = G.ax, X = v => ax.x0 + (v - r.lo) / (r.hi - r.lo) * (ax.x1 - ax.x0);
      G.X = X;
      if (s.dir) { p.stroke(good ? C.ok : C.brand); p.strokeWeight(6); p.line(X(s.b), ax.y, s.dir > 0 ? ax.x1 : ax.x0, ax.y); }
      p.stroke(C.ink); p.strokeWeight(1.5); p.line(ax.x0, ax.y, ax.x1, ax.y);
      for (let v = r.lo; v <= r.hi; v++) { p.strokeWeight(1); p.line(X(v), ax.y - 4, X(v), ax.y + 4); TK.label(p, C, String(v), X(v), ax.y + 16, C.mute, 8, 20); }
      p.stroke(good ? C.ok : C.brand); p.strokeWeight(2.5); p.fill(s.closed ? (good ? C.ok : C.brand) : C.bg); p.circle(X(s.b), ax.y, 16);
      RK.knob(p, C, X(s.b), ax.y - 30, C.brand);
      if (s.dir) {
        const t = s.b + s.dir * 2, val = r.f(t);
        TK.label(p, C, `prueba con x = ${t}: ${val ? 'cumple' : 'no cumple'}`, G.W / 2, ax.y + 46, val ? C.ok : C.bad, 11, G.W - 30);
        const e = r.f(s.b); TK.label(p, C, `y con x = ${s.b}: ${e ? 'cumple' : 'no cumple'}`, G.W / 2, ax.y + 64, e === s.closed ? C.ok : C.bad, 11, G.W - 30);
      }
      RK.strip(p, C, G.fb, s.dir ? `$x ${sym(s)} ${s.b}$` : '$\\text{toca un lado de la recta}$', { col: G.locked || good ? C.ok : C.brand, size: 18 });
    },
    press(G, x, y) {
      const ax = G.ax, bx = G.X(G.s.b);
      if (Math.hypot(x - bx, y - (ax.y - 30)) < 18) { G.grab = true; return true; }
      if (Math.hypot(x - bx, y - ax.y) < 14) { G.s.closed = !G.s.closed; G.touch(); return true; }
      if (Math.abs(y - ax.y) < 26 && x > ax.x0 - 10 && x < ax.x1 + 10) { G.s.dir = x > bx ? 1 : -1; G.touch(); return true; }
      return false;
    },
    drag(G, x) { if (!G.grab) return false; const r = G.r, ax = G.ax, b = Math.max(r.lo, Math.min(r.hi, Math.round(r.lo + (x - ax.x0) / (ax.x1 - ax.x0) * (r.hi - r.lo)))); if (b !== G.s.b) { G.s.b = b; G.touch(); } return true; },
    release(G) { G.grab = false; },
    demo: G => { const bx = G.X ? G.X(G.s.b) : G.W / 2; return { from: { x: bx, y: G.ax.y - 30 }, to: { x: bx + 60, y: G.ax.y - 30 }, text: 'Arrastra la frontera', ty: G.ax.y - 60 }; },
    peek: G => ({ ax: G.ax }),
  });
  return Object.assign(game, { answer: need });
})();
