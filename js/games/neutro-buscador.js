// El que no cambia nada (Preuniversitario, pu-op-1; spec 2026-11-18-preuda-razonamiento-completo): el elemento neutro e de un
// operador cumple a ∘ e = a para TODO a. Se desliza un candidato e y el juego opera con él varios números: cada a es una barra
// gris y a ∘ e una barra de color al lado. El neutro deja todas las parejas iguales.
// params = { rounds: [{ sym, tex, f(a, b), lo, hi, as: [números a probar] }] }   state = { rounds: [{ e }] }
GAMES['neutro-buscador'] = (() => {
  const good = (r, e) => r.as.every(a => r.f(a, e) === a);
  const need = r => { for (let e = r.lo; e <= r.hi; e++) if (good(r, e)) return e; return null; };
  const ok = (s, r) => good(r, s.e);
  const N = r => r.hi - r.lo + 1;
  const game = roundsGame({
    aspect: 1.2,
    init: r => ({ e: need(r) === r.lo ? r.lo + 1 : r.lo }),
    ok,
    solution: r => `e = ${need(r)}`,
    prompt: r => `Con $a ${r.sym} b = ${r.tex}$, busca $e$ con $a ${r.sym} e = a$ siempre`,
    foot: () => 'Desliza el candidato e',
    layout(G) { G.b = { x: 30, y: 104, w: G.W - 50, h: G.H - 270 }; G.tY = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = false; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { e: need(r) } : G.s, g = ok(s, r), b = G.b, vals = r.as.map(a => r.f(a, s.e));
      const top = Math.max(...r.as, ...vals, 1), bot = Math.min(0, ...vals), Y = v => b.y + b.h - (v - bot) / (top - bot) * b.h, w = b.w / r.as.length;
      p.stroke(C.line); p.strokeWeight(1); p.line(b.x, Y(0), b.x + b.w, Y(0));
      r.as.forEach((a, i) => {
        const x = b.x + i * w, v = vals[i], same = v === a;
        p.noStroke(); p.fill(RK.al(p, C.line, 200)); p.rect(x + w * 0.15, Math.min(Y(a), Y(0)), w * 0.3, Math.abs(Y(0) - Y(a)), 2);
        p.fill(same ? C.ok : C.coral); p.rect(x + w * 0.5, Math.min(Y(v), Y(0)), w * 0.3, Math.abs(Y(0) - Y(v)), 2);
        TK.label(p, C, `$${a} ${r.sym} ${s.e} = ${v}$`, x + w / 2, b.y + b.h + 14 + (i % 2) * 14, same ? C.ok : C.ink, 9, w * 1.6);
      });
      G.X = RK.track(p, C, 30, G.W - 30, G.tY, N(r), s.e - r.lo, k => ((r.lo + k) % 2 === 0 ? String(r.lo + k) : null), g ? C.ok : C.brand);
      RK.strip(p, C, G.fb, `$e = ${s.e}$`, { kicker: g ? 'no cambia a nadie: es el neutro' : `${r.as.filter((a, i) => vals[i] !== a).length} cambian`, col: G.locked || g ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { if (Math.abs(y - G.tY) > 28) return false; G.grab = true; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = false; },
    demo: G => ({ from: { x: G.X(G.s.e - G.r.lo), y: G.tY }, to: { x: G.X(G.s.e - G.r.lo) + 60, y: G.tY }, text: 'Desliza e', ty: G.b.y + 10 }),
    peek: G => ({ tY: G.tY }),
  });
  game.move = (G, x) => { const r = G.r, e = r.lo + RK.pick(x, 30, G.W - 30, N(r)); if (e !== G.s.e || !G.touched[G.cur]) { G.s.e = e; G.touch(); } };
  return Object.assign(game, { answer: r => ({ e: need(r) }) });
})();
