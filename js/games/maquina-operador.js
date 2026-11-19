// La máquina de dos entradas (Preuniversitario, pu-op-1 y pu-op-2; spec 2026-11-18-preuda-razonamiento-completo): un operador
// nuevo, como a ★ b = 2a − b, es una máquina con dos bocas. Se desliza el número de cada boca; la máquina muestra la regla con
// los números ya puestos en lugar de a y b, y su resultado. Hay que lograr el resultado pedido (si una boca viene fija, solo se
// mueve la otra).
// params = { rounds: [{ sym, tex, f(a, b), target, lo, hi, fix?: { a?, b? } }] }   state = { rounds: [{ a, b }] }
GAMES['maquina-operador'] = (() => {
  const ok = (s, r) => r.f(s.a, s.b) === r.target && (r.fix?.a === undefined || s.a === r.fix.a) && (r.fix?.b === undefined || s.b === r.fix.b);
  const sols = r => { const out = []; for (let a = r.lo; a <= r.hi; a++) for (let b = r.lo; b <= r.hi; b++) if (ok({ a, b }, r)) out.push({ a, b }); return out; };
  const sub = (r, a, b) => r.tex.replace(/(?<![\\a-zA-Z])a(?![a-zA-Z])/g, `(${a})`).replace(/(?<![\\a-zA-Z(])b(?![a-zA-Z])/g, `(${b})`).replace(/(\d)\(/g, '$1\\cdot(');
  const N = r => r.hi - r.lo + 1;
  const game = roundsGame({
    aspect: 1.25,
    init: r => { const s = { a: r.fix?.a ?? r.lo, b: r.fix?.b ?? r.lo }; if (ok(s, r)) s[r.fix?.b === undefined ? 'b' : 'a'] += 1; return s; },
    ok,
    solution: r => { const s = sols(r)[0]; return `$${s.a} ${r.sym} ${s.b} = ${r.target}$`; },
    prompt: r => `Con $a ${r.sym} b = ${r.tex}$, logra que salga ${r.target}`,
    foot: () => 'Desliza los números de las bocas',
    layout(G) { G.tA = G.H - 150; G.tB = G.H - 104; G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) { G.grab = null; },
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? sols(r)[0] : G.s, good = ok(s, r), v = r.f(s.a, s.b), mx = G.W / 2, my = 180;
      p.stroke(C.ink); p.strokeWeight(1.5); p.fill(RK.al(p, C.card, 220)); p.rect(mx - 110, my - 50, 220, 100, 14);
      [['a', s.a, mx - 60], ['b', s.b, mx + 60]].forEach(([k, val, x]) => { p.noStroke(); p.fill(RK.al(p, k === 'a' ? C.sky : C.coral, 140)); p.rect(x - 26, my - 80, 52, 34, 8); TK.label(p, C, `${k} = ${val}`, x, my - 63, C.ink, 12, 50); });
      TK.label(p, C, `$${sub(r, s.a, s.b)}$`, mx, my - 10, C.ink, 14, 200);
      TK.label(p, C, `$= ${v}$`, mx, my + 22, good ? C.ok : C.brand, 18, 200);
      const fa = r.fix?.a !== undefined, fbx = r.fix?.b !== undefined;
      G.XA = RK.track(p, C, 40, G.W - 30, G.tA, N(r), s.a - r.lo, k => ((r.lo + k) % 2 === 0 ? String(r.lo + k) : null), fa ? C.mute : C.sky);
      G.XB = RK.track(p, C, 40, G.W - 30, G.tB, N(r), s.b - r.lo, k => null, fbx ? C.mute : C.coral);
      TK.label(p, C, 'a', 20, G.tA, C.sky, 12, 20); TK.label(p, C, 'b', 20, G.tB, C.coral, 12, 20);
      RK.strip(p, C, G.fb, `$${s.a} ${r.sym} ${s.b} = ${v}$`, { kicker: good ? 'sale lo pedido' : `debe salir ${r.target}`, col: G.locked || good ? C.ok : C.brand, size: 17 });
    },
    press(G, x, y) { const r = G.r; if (Math.abs(y - G.tA) < 20 && r.fix?.a === undefined) G.grab = 'a'; else if (Math.abs(y - G.tB) < 20 && r.fix?.b === undefined) G.grab = 'b'; else return false; game.move(G, x); return true; },
    drag(G, x) { if (!G.grab) return false; game.move(G, x); return true; },
    release(G) { G.grab = null; },
    demo: G => { const k = G.r.fix?.a === undefined ? 'a' : 'b', y = k === 'a' ? G.tA : G.tB, X = k === 'a' ? G.XA : G.XB; return { from: { x: X(G.s[k] - G.r.lo), y }, to: { x: X(G.s[k] - G.r.lo) + 60, y }, text: 'Desliza el número', ty: G.tA - 30 }; },
    peek: G => ({ tA: G.tA, tB: G.tB }),
  });
  game.move = (G, x) => { const r = G.r, v = r.lo + RK.pick(x, 40, G.W - 30, N(r)); if (v !== G.s[G.grab] || !G.touched[G.cur]) { G.s[G.grab] = v; G.touch(); } };
  return Object.assign(game, { answer: r => sols(r)[0] });
})();
