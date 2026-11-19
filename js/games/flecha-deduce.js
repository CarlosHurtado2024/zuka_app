// ¿Qué se puede concluir? (Preuniversitario, pu-lo-3; spec 2026-11-18-preuda-razonamiento-completo): una regla «si p, entonces
// q» es una flecha entre dos focos. Un dato enciende o apaga uno de ellos; el otro foco se toca para ponerle «sí», «no» o «no se
// sabe». Modus ponens y tollens permiten concluir; afirmar el consecuente o negar el antecedente no.
// params = { rounds: [{ p, q, fact: ['p' | 'q', bool] }] }   state = { rounds: [{ v: null | 'si' | 'no' | 'nose' }] }
GAMES['flecha-deduce'] = (() => {
  const need = r => { const [k, b] = r.fact; return k === 'p' ? (b ? 'si' : 'nose') : (b ? 'nose' : 'no'); };
  const NAME = { si: 'sí', no: 'no', nose: 'no se sabe' };
  const ok = (s, r) => s.v === need(r);
  const game = roundsGame({
    aspect: 1.15,
    init: () => ({ v: null }),
    answered: s => s.v !== null,
    ok,
    solution: r => `${r.fact[0] === 'p' ? r.q : r.p}: ${NAME[need(r)]}`,
    prompt: r => `Regla: si ${r.p}, entonces ${r.q}`,
    foot: () => 'Toca el foco que no tiene dato: sí, no o no se sabe',
    layout(G) { G.fb = { x: 12, y: G.H - 66, w: G.W - 24, h: 44 }; },
    enter(G) {},
    draw(G) {
      const { p, C, r } = G, s = G.locked && !ok(G.s, r) ? { v: need(r) } : G.s, good = ok(s, r), y = 190, xs = [G.W * 0.24, G.W * 0.76], R = Math.min(42, G.W * 0.12);
      p.stroke(C.ink); p.strokeWeight(2.5); p.line(xs[0] + R + 6, y, xs[1] - R - 12, y); p.noStroke(); p.fill(C.ink); p.triangle(xs[1] - R - 4, y, xs[1] - R - 16, y - 7, xs[1] - R - 16, y + 7);
      G.lamps = ['p', 'q'].map((k, i) => {
        const isFact = r.fact[0] === k, st = isFact ? (r.fact[1] ? 'si' : 'no') : s.v, x = xs[i];
        if (st === 'si') { p.noStroke(); p.fill(RK.al(p, C.sun, 70)); p.circle(x, y, R * 2.8); }
        p.stroke(isFact ? C.ink : good ? C.ok : C.brand); p.strokeWeight(isFact ? 1.4 : 2.5);
        p.fill(st === 'si' ? C.sun : st === 'no' ? RK.al(p, C.line, 200) : RK.al(p, C.card, 200)); p.circle(x, y, R * 2);
        TK.label(p, C, st === null ? '?' : st === 'nose' ? '¿?' : NAME[st], x, y, st === 'si' ? inkOn(C.sun) : C.ink, 12, R * 1.8);
        TK.label(p, C, r[k], x, y + R + 18, C.ink, 10, G.W * 0.44);
        TK.label(p, C, isFact ? 'dato' : 'conclusión', x, y - R - 14, isFact ? C.mute : C.brand, 9, 90);
        return { x, y, R, isFact };
      });
      RK.strip(p, C, G.fb, s.v === null ? '$\\text{¿qué se concluye?}$' : `$\\text{${NAME[s.v]}}$`, { kicker: good ? (s.v === 'nose' ? 'el dato no alcanza' : 'se concluye') : '', col: G.locked || good ? C.ok : C.brand, size: 16 });
    },
    press(G, x, y) { const l = (G.lamps || []).find(o => !o.isFact && Math.hypot(x - o.x, y - o.y) < o.R + 10); if (!l) return false; const order = [null, 'si', 'no', 'nose']; G.s.v = order[(order.indexOf(G.s.v) + 1) % 4] || 'si'; G.touch(); return true; },
    demo: G => { const l = G.lamps?.find(o => !o.isFact); return l ? { from: l, to: l, text: 'Toca el foco', ty: l.y + l.R + 40 } : null; },
    peek: G => ({ lamps: G.lamps }),
  });
  return Object.assign(game, { answer: r => ({ v: need(r) }) });
})();
