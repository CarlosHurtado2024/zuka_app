// La criba (Preuniversitario, pu-nu-1; spec 2026-11-18-preuda-razonamiento-completo): los números del 2 al N en una cuadrícula.
// Se toca un número que todavía esté libre y el juego tacha todos sus múltiplos (él queda en pie, encerrado: es primo). Tocar un
// número ya tachado no hace nada: era múltiplo de otro. Al final quedan en pie solo los primos.
// params = { rounds: [{ N }] }   state = { rounds: [{ sieved: [números usados para cribar] }] }
GAMES['criba-primos'] = (() => {
  const isP = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const crossed = (r, sv) => { const out = new Set(); sv.forEach(p => { for (let m = 2 * p; m <= r.N; m += p) out.add(m); }); return out; };
  const comps = r => Array.from({ length: r.N - 1 }, (_, i) => i + 2).filter(n => !isP(n));
  const ok = (s, r) => { const X = crossed(r, s.sieved); return comps(r).every(n => X.has(n)); };
  const answer = r => ({ sieved: Array.from({ length: r.N - 1 }, (_, i) => i + 2).filter(p => isP(p) && p * p <= r.N) });
  const game = roundsGame({
    aspect: 1.4,
    init: () => ({ sieved: [] }),
    answered: s => s.sieved.length > 0,
    ok,
    solution: r => `se criba con ${answer(r).sieved.join(', ')}; quedan los primos`,
    prompt: r => `Criba del 2 al ${r.N}: deja en pie solo los primos`,
    foot: () => 'Toca un número libre para tachar sus múltiplos',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? answer(r) : G.s, good = ok(s, r), X = crossed(r, s.sieved), cols = 8, cs = Math.min(36, (G.W - 24) / cols), x0 = (G.W - cols * cs) / 2, y0 = 96;
      G.cells = [];
      for (let n = 2; n <= r.N; n++) {
        const k = n - 2, x = x0 + (k % cols) * cs, y = y0 + Math.floor(k / cols) * cs, out = X.has(n), used = s.sieved.includes(n);
        p.stroke(RK.al(p, C.line, 140)); p.strokeWeight(1); p.fill(used ? RK.al(p, C.brand, 120) : RK.al(p, C.card, out ? 90 : 220)); p.rect(x + 1, y + 1, cs - 2, cs - 2, 5);
        TK.label(p, C, String(n), x + cs / 2, y + cs / 2, out ? C.mute : C.ink, 11, cs - 4);
        if (out) { p.stroke(C.bad); p.strokeWeight(1.5); p.line(x + 6, y + cs - 6, x + cs - 6, y + 6); }
        G.cells.push({ x, y, w: cs, h: cs, n });
      }
      const left = Array.from({ length: r.N - 1 }, (_, i) => i + 2).filter(n => !X.has(n)).length;
      RK.strip(p, C, G.fb, good ? `$\\text{quedan ${left} primos}$` : `$\\text{quedan ${left} en pie}$`, { kicker: s.sieved.length ? `cribado con ${s.sieved.join(', ')}` : '', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) {
      const c = (G.cells || []).find(b => hitBox(b, x, y)); if (!c) return false;
      if (!crossed(G.r, G.s.sieved).has(c.n) && !G.s.sieved.includes(c.n)) { G.s.sieved.push(c.n); G.touch(); }
      return true;
    },
    demo: G => { const c = G.cells?.[0]; return c ? { from: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, to: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, text: 'Toca el 2', ty: G.cells.at(-1).y + 50 } : null; },
    peek: G => ({ cells: G.cells }),
  });
  return Object.assign(game, { answer });
})();
